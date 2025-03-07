import type { PageServerLoad, Actions } from "./$types";
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        // Hacer todas las solicitudes en paralelo
        const [rollResponse, labsResponse, devDetailResponse, scanDetailResponse] = await Promise.all([
            fetch(`/api/rolls/${params.roll_id}`), // Obtener el roll
            fetch('/api/labs?active=true'), // Obtener los labs activos
            fetch(`/api/rolls/${params.roll_id}/dev-detail`), // Obtener dev_detail si existe
            fetch(`/api/rolls/${params.roll_id}/scan-detail`) // Obtener scan_detail si existe
        ]);

        // Manejar errores en la respuesta del roll
        if (!rollResponse.ok) {
            throw error(rollResponse.status, 'Failed to load roll details');
        }

        // Manejar errores en la respuesta de labs
        if (!labsResponse.ok) {
            console.error('Error loading labs, using empty array');
        }

        // Obtener los datos de las respuestas
        const rollData = await rollResponse.json();
        const labsData = await labsResponse.json().catch(() => []);
        const devDetailData = await devDetailResponse.json().catch(() => null); // null si no existe
        const scanDetailData = await scanDetailResponse.json().catch(() => null); // null si no existe

        // Retornar los datos
        return {
            roll: rollData.roll || rollData, // Compatibilidad con ambas estructuras
            photos: rollData.photos || [],
            labs: labsData || [],
            devDetail: devDetailData, // Datos de dev_detail (puede ser null)
            scanDetail: scanDetailData // Datos de scan_detail (puede ser null)
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
    },
    updateDescription: async ({ request, locals, params }) => {
        console.log("HOLA ARRANCO")
        // Obtener el formulario enviado
        const formData = await request.formData();
        const newDescription = formData.get('description') as string;

        // Validar que el campo no esté vacío
        if (!newDescription) {
            return fail(400, {
                error: 'La descripción no puede estar vacía',
                values: { description: newDescription }
            });
        }

        try {
            // Actualizar la descripción en Supabase
            const { error: supabaseError } = await locals.supabase
                .from('roll') // Nombre de la tabla en Supabase
                .update({ description: newDescription })
                .eq('id', params.roll_id); // Filtra por el ID del roll

            // Manejar errores de Supabase
            if (supabaseError) {
                console.error('Error updating description in Supabase:', supabaseError);
                return fail(500, {
                    error: 'Error al actualizar la descripción en la base de datos',
                    values: { description: newDescription }
                });
            }

            // Éxito
            return { success: true };
        } catch (err) {
            console.error('Unexpected error:', err);
            return fail(500, {
                error: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
                values: { description: newDescription }
            });
        }
    }
} satisfies Actions;