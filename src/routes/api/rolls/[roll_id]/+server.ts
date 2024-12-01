// src/routes/api/roll/[roll_id]/+server.ts
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
    const { roll_id } = params;

    const { data: roll, error: rollError } = await locals.supabase
        .from('roll_with_filmstock_details')
        .select('*')
        .eq('id', roll_id)
        .single();

    if (rollError) {
        console.error('Error fetching roll:', rollError);
        throw error(500, 'Failed to fetch roll details');
    }

    // Obtener lista de fotos en el folder del roll
    const { data: photos, error: photosError } = await locals.supabase
        .storage
        .from('rolls')
        .list(roll.storage_container_name, {
            sortBy: { column: 'name', order: 'asc' }
        });

    if (photosError) {
        console.error('Error fetching photos:', photosError);
        throw error(500, 'Failed to fetch roll photos');
    }

    // Filtrar archivos que no sean imágenes y el .keep
    const imageFiles = photos.filter(file =>
        file.name !== '.keep' &&
        /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );

    return new Response(JSON.stringify({ roll, photos: imageFiles }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};