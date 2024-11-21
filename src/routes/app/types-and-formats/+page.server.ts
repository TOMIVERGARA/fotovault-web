import type { Tables } from "$lib/types/supabase.types";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('filmtypes');
    const { supabase } = locals;

    // Fetch film types
    const { data: filmtypes, error: filmtypesError } = await supabase
        .from('filmtype')
        .select('*')
        .returns<Tables<'filmtype'>>();

    // Fetch formats
    const { data: formats, error: formatsError } = await supabase
        .from('format')
        .select('*')
        .returns<Tables<'format'>>()
        .order('active', { ascending: true }) // Active types first
        .order('name', { ascending: true }); // Then alphabetically

    // Handle errors
    if (filmtypesError || formatsError) {
        const errorMessage = filmtypesError ? 'Error fetching film types.' : 'Error fetching formats.';
        console.error(errorMessage, filmtypesError || formatsError);
        return {
            filmtypes: [],
            formats: [],
            error: errorMessage
        };
    }

    // Return data
    return {
        filmtypes,
        formats
    };
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
            if (error.code === '23505') { // Código típico para violación de unicidad
                return fail(400, { error: 'This format already exists! Names are unique.', values: { name } });
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