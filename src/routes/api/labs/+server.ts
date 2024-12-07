import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { supabase } = locals;
    const activeFilter = url.searchParams.get('active');

    let query = supabase
        .from('lab')
        .select('*');

    if (activeFilter === 'true') {
        query = query.eq('active', true);
    }

    const { data: labs, error } = await query
        .order('name', { ascending: true })
        .returns<Tables<'lab'>>();

    if (error) {
        console.error('Error fetching labs', error);
        return new Response('Error fetching labs', { status: 500 });
    }

    return json(labs);
};