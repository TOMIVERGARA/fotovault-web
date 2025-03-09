import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const username = url.searchParams.get('username');
    if (!username) return json({ error: "Username is required" }, { status: 400 });

    const { data, error } = await supabase
        .from('profile')
        .select('id')
        .eq('username', username)
        .single();

    if (error && error.code !== 'PGRST116') {
        return json({ error: "Error checking username", details: error }, { status: 500 });
    }

    return json({ available: !data });
}