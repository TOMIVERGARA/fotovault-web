import type { Database } from '$lib/types/supabase.types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
    const active = url.searchParams.get('active');
    const brandId = url.searchParams.get('brandId');

    let query = supabase
        .from('filmstock_with_details')
        .select()
        .order('name');

    // Add filters if provided
    if (brandId) {
        query = query.eq('brand_id', brandId);
    }

    if (active === 'true') {
        query = query.eq('active', true);
    }

    const { data, error } = await query
        .returns<Database['public']['Views']['filmstock_with_details']['Row'][]>();

    if (error) {
        console.error('Error fetching filmstocks:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    return new Response(
        JSON.stringify(data),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
};