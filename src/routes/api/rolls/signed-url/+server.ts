// src/routes/api/signed-url/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const path = url.searchParams.get('path');

    if (!path) {
        throw error(400, 'Path parameter is required');
    }

    const { data, error: signError } = await locals.supabase
        .storage
        .from('rolls')
        .createSignedUrl(path, 3600, {
            transform: {
                quality: 30,
            }
        }); // 1 hora

    if (signError) {
        console.error('Error creating signed URL:', signError);
        throw error(500, 'Failed to create signed URL');
    }

    return new Response(JSON.stringify({ url: data.signedUrl }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};