import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, locals: { supabase } }) => {
    const { active } = await request.json();

    const { data, error } = await supabase
        .from('filmstock')
        .update({ active })
        .eq('id', params.filmstock_id)
        .select()
        .single();

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }
    return json(data);
};