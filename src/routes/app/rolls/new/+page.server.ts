import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { rollFormSchema } from "./schema.js";
import { randomUUID } from 'crypto';
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const filmstocksResponse = await fetch('/api/filmstocks?active=true');
        if (!filmstocksResponse.ok) {
            console.error('Failed to fetch filmstocks:', await filmstocksResponse.text());
            return {
                form: await superValidate(zod(rollFormSchema)),
                filmstocks: []
            };
        }
        const filmstocks = await filmstocksResponse.json();
        return {
            form: await superValidate(zod(rollFormSchema)),
            filmstocks: Array.isArray(filmstocks) ? filmstocks : []
        };
    } catch (error) {
        console.error('Error loading filmstocks:', error);
        return {
            form: await superValidate(zod(rollFormSchema)),
            filmstocks: []
        };
    }
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        console.log(request)
        const form = await superValidate(request, zod(rollFormSchema));
        console.log(form)
        if (!form.valid) {

            const { coverImage, ...rest } = form.data;
            form.data = rest;
            return fail(400, {
                form,
                error: {
                    message: 'Please check the form for errors'
                }
            });
        }

        // Crear un UUID para el roll
        const rollId = randomUUID();
        // Crear un nombre único para la carpeta del roll
        const rollFolderName = `${form.data.name.toLowerCase().replace(/\s+/g, '-')}-${rollId}`;

        let coverImageUrl = null;
        const { coverImage, ...formDataWithoutImage } = form.data;

        // Siempre crear la carpeta para el roll
        const { error: folderError } = await locals.supabase.storage
            .from('rolls')
            .upload(`${rollFolderName}/.keep`, new Blob([''])); // Archivo vacío para crear la carpeta

        if (folderError) {
            console.log('Error creating roll folder:', folderError);
            return fail(500, {
                form: { ...form, data: formDataWithoutImage },
                error: {
                    message: 'Failed to create roll folder'
                }
            });
        }

        // Si hay una imagen de cover, subirla
        if (coverImage instanceof File) {
            const fileExt = coverImage.name.split('.').pop();
            const fileName = `${rollFolderName}/cover.${fileExt}`;

            const { data: uploadData, error: uploadError } = await locals.supabase.storage
                .from('rolls')
                .upload(fileName, coverImage, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.log('Error uploading cover image:', uploadError);
                return fail(500, {
                    form: { ...form, data: formDataWithoutImage },
                    error: {
                        message: 'Failed to upload cover image'
                    }
                });
            }

            const { data: { publicUrl } } = locals.supabase.storage
                .from('rolls')
                .getPublicUrl(fileName);

            coverImageUrl = publicUrl;
        }

        // Iniciar una transacción para crear el roll y la foto de cover
        const { data: roll, error: rollError } = await locals.supabase
            .from('roll')
            .insert([
                {
                    id: rollId,
                    name: formDataWithoutImage.name,
                    description: formDataWithoutImage.description,
                    filmstock: formDataWithoutImage.filmstockId,
                    cover_img_url: coverImageUrl
                }
            ])
            .select()
            .single();

        if (rollError) {
            console.log('Error creating roll:', rollError);
            return fail(500, {
                form: { ...form, data: formDataWithoutImage },
                error: {
                    message: 'Failed to create roll'
                }
            });
        }

        // Si hay una imagen de cover, crear la entrada en la tabla photo
        if (coverImageUrl) {
            const { error: photoError } = await locals.supabase
                .from('photo')
                .insert([
                    {
                        name: 'Cover photo',
                        roll: rollId,
                        is_cover_img: true
                    }
                ]);

            if (photoError) {
                console.log('Error creating cover photo entry:', photoError);
                // No fallamos aquí porque el roll ya se creó exitosamente
            }
        }

        form.data = formDataWithoutImage;
        return {
            form,
            success: true
        };
    }
};
