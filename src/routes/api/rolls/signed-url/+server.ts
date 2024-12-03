import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const { paths } = await request.json();

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
        throw error(400, 'Paths array is required');
    }

    const { data, error: signError } = await locals.supabase
        .storage
        .from('rolls')
        .createSignedUrls(paths, 3600);

    if (signError) {
        console.error('Error creating signed URLs:', signError);
        throw error(500, 'Failed to create signed URLs');
    }

    return json({ urls: data });
};