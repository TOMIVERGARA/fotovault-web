import type { PageServerLoad } from './$types';
import type { Tables } from "$lib/types/supabase.types"
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';


export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('brands');
    const { supabase } = locals;

    const { data: brands, error } = await supabase
        .from('brand')
        .select('*')
        .returns<Tables<"brand">>();

    if (error) {
        console.error('Error:', error);
        return {
            brands: []
        };
    }

    return {
        brands
    };
};

export const actions = {
    createBrand: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');

        if (!name) {
            return fail(400, { error: 'Name is required', values: { name } });
        }

        const { error } = await locals.supabase
            .from('brand')
            .insert({ name });

        if (error) {
            if (error.code === '23505') { // Código típico para violación de unicidad
                return fail(400, { error: 'This brand already exists! Brands are unique.', values: { name } });
            }
            return fail(500, { error: 'Something went wrong. Please try again.', values: { name } });
        }

        return { success: true };
    }
} satisfies Actions;