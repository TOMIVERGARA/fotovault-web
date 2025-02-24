import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Tables } from '$lib/types/supabase.types';

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('labs', 'scanners', 'filmtypes');

    const fetchLabs = async () => {
        const { data, error } = await locals.supabase
            .from('lab')
            .select('*, lab_filmtype(filmtype_id, filmtype(name))');

        return data?.map(lab => ({
            ...lab,
            filmtypes: lab.lab_filmtype?.map((lft: { filmtype: any; }) => (lft.filmtype))
        })) || [];
    };

    const fetchScanners = async () => {
        const { data } = await locals.supabase.from('scanner').select('*');
        return data || [];
    };

    const fetchFilmtypes = async () => {
        const { data } = await locals.supabase.from('filmtype').select('*');
        return data || [];
    };

    try {
        const [labs, scanners, filmtypes] = await Promise.all([
            fetchLabs(),
            fetchScanners(),
            fetchFilmtypes()
        ]);

        return { labs, scanners, filmtypes };
    } catch (error) {
        console.error('Error fetching data:', error);
        return fail(500, { error: 'Database error' });
    }
};

export const actions = {
    createLab: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const filmtypes = formData.getAll('filmtypes[]'); // Usar 'filmtypes[]' para obtener el array

        if (!name || filmtypes.length === 0) {
            return fail(400, {
                error: 'Name and at least one film type are required',
                values: { name, filmtypes }
            });
        }

        // Insertar el laboratorio
        const { data: lab, error: labError } = await locals.supabase
            .from('lab')
            .insert({ name })
            .select()
            .single();

        if (labError) {
            console.error('Error creating lab:', labError);
            // Verificar si es violación de unique
            if (labError.code === '23505') {
                return fail(400, {
                    error: { name: 'This lab already exists! Names are unique.' },
                    values: { name, filmtypes }
                });
            }
            return fail(500, { error: labError.message });
        }

        // Preparar los datos para lab_filmtype
        const labFilmtypeData = filmtypes.map(ft => ({
            lab_id: lab.id,
            filmtype_id: ft.toString()
        }));

        // Insertar las relaciones lab_filmtype
        const { error: relationError } = await locals.supabase
            .from('lab_filmtype')
            .insert(labFilmtypeData);

        if (relationError) {
            console.error('Error creating lab_filmtype relations:', relationError);

            // Si falla, eliminar el laboratorio creado para mantener la consistencia
            await locals.supabase
                .from('lab')
                .delete()
                .eq('id', lab.id);

            return fail(500, { error: relationError.message });
        }

        return { success: true };
    },

    toggleLab: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        const { data: lab, error: fetchError } = await locals.supabase
            .from('lab')
            .select('active')
            .eq('id', id)
            .single();

        if (fetchError || !lab) return fail(404, { error: 'Lab not found' });

        const { error } = await locals.supabase
            .from('lab')
            .update({ active: !lab.active })
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    deleteLab: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        // Delete related filmtypes first
        await locals.supabase
            .from('lab_filmtype')
            .delete()
            .eq('lab_id', id);

        const { error } = await locals.supabase
            .from('lab')
            .delete()
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    createScanner: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');

        if (!name) return fail(400, { error: 'Name is required' });

        const { error: scannerError } = await locals.supabase
            .from('scanner')
            .insert({ name });

        if (scannerError) {
            console.error('Error creating scanner:', scannerError);
            // Verificar si es violación de unique
            if (scannerError.code === '23505') {
                return fail(400, {
                    error: { name: 'This scanner already exists! Names are unique.' },
                    values: { name }
                });
            }
            return fail(500, { error: scannerError.message });
        }

        return { success: true };
    },

    toggleScanner: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        const { data: scanner, error: fetchError } = await locals.supabase
            .from('scanner')
            .select('active')
            .eq('id', id)
            .single();

        if (fetchError || !scanner) return fail(404, { error: 'Scanner not found' });

        const { error } = await locals.supabase
            .from('scanner')
            .update({ active: !scanner.active })
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    deleteScanner: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        const { error } = await locals.supabase
            .from('scanner')
            .delete()
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    createFilmtype: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name');

        if (!name) return fail(400, { error: 'Name is required' });

        const { error } = await locals.supabase
            .from('filmtype')
            .insert({ name });

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    toggleFilmtype: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        const { data: filmtype, error: fetchError } = await locals.supabase
            .from('filmtype')
            .select('active')
            .eq('id', id)
            .single();

        if (fetchError || !filmtype) return fail(404, { error: 'Filmtype not found' });

        const { error } = await locals.supabase
            .from('filmtype')
            .update({ active: !filmtype.active })
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    },

    deleteFilmtype: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { error: 'ID is required' });

        // Delete related lab associations first
        await locals.supabase
            .from('lab_filmtype')
            .delete()
            .eq('filmtype_id', id);

        const { error } = await locals.supabase
            .from('filmtype')
            .delete()
            .eq('id', id);

        if (error) return fail(500, { error: error.message });

        return { success: true };
    }
} satisfies Actions;