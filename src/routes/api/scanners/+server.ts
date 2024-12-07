import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { supabase } = locals;
    const activeFilter = url.searchParams.get('active');

    let query = supabase
        .from('scanner')
        .select('*');

    if (activeFilter === 'true') {
        query = query.eq('active', true);
    }

    const { data: scanners, error } = await query
        .order('name', { ascending: true })
        .returns<Tables<'scanner'>>();

    if (error) {
        console.error('Error fetching scanners', error);
        return new Response('Error fetching scanners', { status: 500 });
    }

    return json(scanners);
};