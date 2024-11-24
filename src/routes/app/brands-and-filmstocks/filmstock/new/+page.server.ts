import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { randomUUID } from 'crypto';
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ fetch, url }) => {
    const brandId = url.searchParams.get('brand_id');
    const [brandsResponse, formatsResponse, filmTypesResponse] = await Promise.all([
        fetch('/api/brands?active=true'),
        fetch('/api/formats?active=true'),
        fetch('/api/filmtypes?active=true')
    ]);

    const [brands, formats, filmTypes] = await Promise.all([
        brandsResponse.json(),
        formatsResponse.json(),
        filmTypesResponse.json()
    ]);

    const initialData = brandId ? { brandId } : {};

    // Pasar initialData pero no validar todavía
    const form = await superValidate(zod(formSchema), { defaults: initialData });

    return {
        form,
        brands,
        formats,
        filmTypes
    };
};


export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(formSchema));
        if (!form.valid) {
            // Remover el campo image antes de devolver el error
            const { image, ...rest } = form.data;
            form.data = rest;
            return fail(400, {
                form,
                error: {
                    message: 'Please check the form for errors'
                }
            });
        }

        let imageUrl = null;
        const { image, ...formDataWithoutImage } = form.data;

        // Si hay una imagen, subirla a Supabase Storage
        if (image instanceof File) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${randomUUID()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await locals.supabase.storage
                .from('filmstock_icons')
                .upload(fileName, image, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.log('Error uploading image:', uploadError);
                return fail(500, {
                    form: { ...form, data: formDataWithoutImage },
                    error: {
                        message: 'Failed to upload image'
                    }
                });
            }

            // Obtener la URL pública de la imagen
            const { data: { publicUrl } } = locals.supabase.storage
                .from('filmstock_icons')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        // Guardar el filmstock en la base de datos
        const { data, error } = await locals.supabase
            .from('filmstock')
            .insert([
                {
                    brand: formDataWithoutImage.brandId,
                    format: formDataWithoutImage.formatId,
                    filmtype: formDataWithoutImage.filmTypeId,
                    name: formDataWithoutImage.name,
                    iso: formDataWithoutImage.iso,
                    logo_url: imageUrl
                },
            ])
            .select()
            .single();

        if (error) {
            console.log('Error inserting filmstock:', error);
            // Si la imagen se subió pero falló la inserción en la DB, deberíamos limpiarla
            if (imageUrl) {
                const fileName = imageUrl.split('/').pop() || '';
                await locals.supabase.storage
                    .from('filmstock_icons')
                    .remove([fileName]);
            }

            if (error.code === '23505') {
                return fail(400, {
                    form: { ...form, data: formDataWithoutImage },
                    error: {
                        message: 'A filmstock with this name already exists for this brand!'
                    }
                });
            }
            return fail(500, {
                form: { ...form, data: formDataWithoutImage },
                error: {
                    message: 'Something went wrong. Please try again.'
                }
            });
        }

        // Devolver la respuesta sin el campo image
        form.data = formDataWithoutImage;
        return {
            form,
            success: true
        };
    },
};