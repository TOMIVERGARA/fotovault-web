import type { Tables } from "$lib/types/supabase.types";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, depends }) => {
    depends('filmtypes');

    try {
        // Fetch data from both endpoints in parallel
        const [filmTypesRes, formatsRes] = await Promise.all([
            fetch('/api/filmtypes'),
            fetch('/api/formats')
        ]);

        // Check if responses are ok
        if (!filmTypesRes.ok || !formatsRes.ok) {
            const errorMessage = !filmTypesRes.ok
                ? 'Error fetching film types.'
                : 'Error fetching formats.';

            return {
                filmtypes: [],
                formats: [],
                error: errorMessage
            };
        }

        // Parse JSON responses
        const filmtypes = await filmTypesRes.json();
        const formats = await formatsRes.json();

        return {
            filmtypes,
            formats
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            filmtypes: [],
            formats: [],
            error: 'Error fetching data'
        };
    }
};

export const actions = {
    createFilmtype: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');

        if (!name) {
            console.log('Missing values');
            return fail(400, { error: 'Name is required', values: { name } });
        }

        const { error } = await locals.supabase
            .from('filmtype')
            .insert({ name });

        if (error) {
            if (error.code === '23505') { // Código típico para violación de unicidad
                return fail(400, { error: 'This film type already exists! Names are unique.', values: { name } });
            }
            return fail(500, { error: 'Something went wrong. Please try again.', values: { name } });
        }

        return { success: true };
    },
    createFormat: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const width = formData.get('width');
        const height = formData.get('height');
        console.log({ name, width, height });

        if (!name || !width || !height) {
            console.log('Missing values');
            return fail(400, { error: 'Name, width and height are required', values: { name, width, height } });
        }

        const { error } = await locals.supabase
            .from('format')
            .insert({ name, width, height });

        if (error) {
            console.log(error)
            if (error.code === '23505') {
                return fail(400, {
                    error: { name: 'This format already exists! Names are unique.' },
                    values: { name, width, height }
                });
            }
            return fail(500, { error: 'Something went wrong. Please try again.', values: { name } });
        }

        return { success: true };
    },
    toggleFilmtype: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        // Fetch current status first
        const { data: currentFilmtype, error: fetchError } = await locals.supabase
            .from('filmtype')
            .select('active')
            .eq('id', id)
            .single();

        if (fetchError || !currentFilmtype) {
            return fail(404, { error: 'Film type not found.' });
        }

        // Toggle the active status
        const newActiveStatus = currentFilmtype.active ? "false" : "true";

        const { data, error } = await locals.supabase
            .from('filmtype')
            .update({ active: newActiveStatus })
            .eq('id', id)
            .select();

        if (error) {
            return fail(500, { error: 'Failed to toggle the film type status. Please try again.' });
        }

        if (!data) {
            return fail(404, { error: 'Film type not found.' });
        }

        return { success: true };
    },
    toggleFormat: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        // Fetch current status first
        const { data: currentFormat, error: fetchError } = await locals.supabase
            .from('format')
            .select('active')
            .eq('id', id)
            .single();

        if (fetchError || !currentFormat) {
            return fail(404, { error: 'Film format not found.' });
        }

        // Toggle the active status
        const newActiveStatus = currentFormat.active ? "false" : "true";

        const { data, error } = await locals.supabase
            .from('format')
            .update({ active: newActiveStatus })
            .eq('id', id)
            .select();

        if (error) {
            return fail(500, { error: 'Failed to toggle the film format status. Please try again.' });
        }

        if (!data) {
            return fail(404, { error: 'Film format not found.' });
        }

        return { success: true };
    },
} satisfies Actions;