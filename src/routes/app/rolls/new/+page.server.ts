import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { rollFormSchema } from "./schema.js";
import { randomUUID } from 'crypto';
import { zod } from "sveltekit-superforms/adapters";

function createSafeStorageName(rollName: string, uuid: string): string {
    // Tomar solo los primeros 20 caracteres del nombre normalizado
    const safeName = rollName.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9-]/g, '-') // Solo permitir letras, números y guiones
        .replace(/-+/g, '-') // Evitar guiones múltiples
        .slice(0, 20)
        .trim();

    // Usar solo los primeros 8 caracteres del UUID
    const shortUuid = uuid.slice(0, 8);

    return `${safeName}-${shortUuid}`;
}

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
        const form = await superValidate(request, zod(rollFormSchema));
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

        // Create a UUID for the roll
        const rollId = randomUUID();

        // Create a unique folder name for the roll usando la nueva función
        const rollFolderName = createSafeStorageName(form.data.name, rollId);

        const { coverPreview, coverImage, ...formDataWithoutImage } = form.data;

        // Always create the folder for the roll
        const { error: folderError } = await locals.supabase.storage
            .from('rolls')
            .upload(`${rollFolderName}/.keep`, new Blob([''])); // Empty file to create the folder

        if (folderError) {
            console.log('Error creating roll folder:', folderError);
            return fail(500, {
                form: { ...form, data: formDataWithoutImage },
                error: {
                    message: 'Failed to create roll folder'
                }
            });
        }

        // Si hay una imagen de cover, súbela primero
        if (coverImage instanceof File) {
            const fileExt = coverImage.name.split('.').pop();
            const fileName = `${rollFolderName}/cover.${fileExt}`;

            const { error: uploadError } = await locals.supabase.storage
                .from('rolls')
                .upload(fileName, coverImage, {
                    upsert: true,
                    cacheControl: '3600'
                });

            if (uploadError) {
                console.error('Error uploading cover image:', uploadError);
                return fail(500, {
                    form: { ...form, data: formDataWithoutImage },
                    error: {
                        message: 'Failed to upload cover image'
                    }
                });
            }
        }

        if (coverPreview instanceof Blob) {
            const previewFileName = `${rollFolderName}/previews/cover.webp`;
            const { error: previewUploadError } = await locals.supabase.storage
                .from('rolls')
                .upload(previewFileName, coverPreview, {
                    upsert: true,
                    contentType: 'image/webp'
                });

            if (previewUploadError) {
                console.error('Error uploading cover image:', previewUploadError);
                return fail(500, {
                    form: { ...form, data: formDataWithoutImage },
                    error: {
                        message: 'Failed to upload cover preview'
                    }
                });
            }
        }

        // Start a transaction to ensure all operations are atomic
        const supabase = locals.supabase;
        const { error: transactionError } = await supabase.rpc('create_roll_with_cover', {
            p_roll_id: rollId,
            p_roll_name: formDataWithoutImage.name,
            p_description: formDataWithoutImage.description,
            p_filmstock_id: formDataWithoutImage.filmstockId,
            p_storage_container_name: rollFolderName,
            p_cover_image: coverImage instanceof File ? {
                name: coverImage.name,
                type: coverImage.type,
                size: coverImage.size,
                lastModified: coverImage.lastModified
            } : null,
            p_preview_name: "cover.webp"
        });

        if (transactionError) {
            console.log('Error creating roll with cover:', transactionError);
            return fail(500, {
                form: { ...form, data: formDataWithoutImage },
                error: {
                    message: 'Failed to create roll and cover image'
                }
            });
        }

        form.data = formDataWithoutImage;
        return {
            form,
            rollId,
            success: true
        };
    }
};