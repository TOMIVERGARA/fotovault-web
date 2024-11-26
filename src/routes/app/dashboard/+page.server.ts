// src/routes/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const { data: rolls, error: supabaseError } = await locals.supabase
            .from('roll')
            .select(`
                id,
                name,
                description,
                cover_img_url,
                created_at,
                filmstock
            `)
            .order('created_at', { ascending: false });

        if (supabaseError) {
            throw error(500, supabaseError.message);
        }

        return {
            rolls
        };
    } catch (err) {
        throw error(500, 'Error fetching rolls');
    }
};