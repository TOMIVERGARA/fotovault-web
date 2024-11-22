import type { Database } from '$lib/types/supabase.types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
    const brandId = url.searchParams.get('brandId');

    const { data, error } = await supabase
        .from('filmstock_with_details')
        .select()
        .eq('brand_id', brandId)
        .order('active', { ascending: true })
        .returns<Database['public']['Views']['filmstock_with_details']['Row'][]>();

    if (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
};