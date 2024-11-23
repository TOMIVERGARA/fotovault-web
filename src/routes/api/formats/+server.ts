import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { supabase } = locals;
    const activeFilter = url.searchParams.get('active');

    let query = supabase
        .from('format')
        .select('*');

    if (activeFilter === 'true') {
        query = query.eq('active', true);
    }

    const { data: formats, error } = await query
        .order('name', { ascending: true })
        .returns<Tables<'format'>>();

    if (error) {
        console.error('Error fetching formats:', error);
        return new Response('Error fetching formats', { status: 500 });
    }

    return json(formats);
};