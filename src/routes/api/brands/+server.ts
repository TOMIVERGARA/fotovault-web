import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { supabase } = locals;
    const activeFilter = url.searchParams.get('active');

    let query = supabase
        .from('brand')
        .select('*');

    // Si se especifica active=true, filtramos solo los activos
    if (activeFilter === 'true') {
        query = query.eq('active', true);
    }

    const { data: brands, error } = await query
        .order('name', { ascending: true })
        .returns<Tables<'brand'>>();

    if (error) {
        console.error('Error fetching brands:', error);
        return new Response('Error fetching brands', { status: 500 });
    }

    return json(brands);
};