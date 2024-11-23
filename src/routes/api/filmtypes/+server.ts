import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { supabase } = locals;
    const activeFilter = url.searchParams.get('active');

    let query = supabase
        .from('filmtype')
        .select('*');

    if (activeFilter === 'true') {
        query = query.eq('active', true);
    }

    const { data: filmtypes, error } = await query
        .order('name', { ascending: true })
        .returns<Tables<'filmtype'>>();

    if (error) {
        console.error('Error fetching film types:', error);
        return new Response('Error fetching film types', { status: 500 });
    }

    return json(filmtypes);
};