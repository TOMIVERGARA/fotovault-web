import type { PageServerLoad, Actions } from "./$types";
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        const [rollResponse, labsResponse] = await Promise.all([
            fetch(`/api/rolls/${params.roll_id}`),
            fetch('/api/labs?active=true')
        ]);

        // Mantener el manejo original de errores del endpoint de rolls
        if (!rollResponse.ok) {
            throw error(rollResponse.status, 'Failed to load roll details');
        }

        // Cargar labs solo si es necesario
        if (!labsResponse.ok) {
            console.error('Error loading labs, using empty array');
        }

        // Mantener la estructura original del endpoint de rolls
        const rollData = await rollResponse.json();
        const labsData = await labsResponse.json().catch(() => []);

        // Preservar compatibilidad con el frontend existente
        return {
            roll: rollData.roll || rollData, // Compatibilidad con ambas estructuras
            photos: rollData.photos || [],
            labs: labsData || []
        };

    } catch (err) {
        console.error('Loader error:', err);
        throw error(500, 'Internal server error');
    }
};

export const actions = {
    createDevDetail: async ({ request, locals, params }) => {
        const formData = await request.formData();

        // Obtener los valores del formulario
        const lab_id = formData.get('lab_id');
        const score = parseFloat(formData.get('score') as string); // Convertir a número
        const notes = formData.get('notes');
        const roll_id = params.roll_id; // Obtener el roll_id de los parámetros de la ruta

        // Validar los datos
        if (!lab_id || !notes || isNaN(score)) {
            return fail(400, {
                error: 'Missing or invalid values',
                values: { lab_id, score, notes }
            });
        }

        try {
            // 1. Insertar el nuevo dev_detail
            const { data: newDevDetail, error: insertError } = await locals.supabase
                .from('dev_detail')
                .insert({
                    lab_id,
                    score,
                    notes
                })
                .select('id') // Devolver el ID del nuevo registro
                .single(); // Esperar un solo registro

            if (insertError || !newDevDetail) {
                console.error('Supabase error (insert dev_detail):', insertError);
                return fail(500, {
                    error: 'Failed to create development details. Please try again.',
                    values: { lab_id, score, notes }
                });
            }

            // 2. Actualizar el roll para que apunte al nuevo dev_detail
            const { error: updateError } = await locals.supabase
                .from('roll')
                .update({ dev_detail: newDevDetail.id })
                .eq('id', roll_id);

            if (updateError) {
                console.error('Supabase error (update roll):', updateError);
                return fail(500, {
                    error: 'Failed to link development details to roll. Please try again.',
                    values: { lab_id, score, notes }
                });
            }

            // Éxito
            return { success: true };
        } catch (err) {
            console.error('Unexpected error:', err);
            return fail(500, {
                error: 'An unexpected error occurred. Please try again.',
                values: { lab_id, score, notes }
            });
        }
    }
} satisfies Actions;