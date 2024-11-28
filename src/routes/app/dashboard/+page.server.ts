import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const { data: rolls, error: supabaseError } = await locals.supabase
            .from('roll_with_filmstock_details')
            .select('*')
            .order('created_at', { ascending: false })
            .returns<Tables<'roll_with_filmstock_details'>[]>();

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