import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
    const { roll_id } = params;

    // Obtener el roll
    const { data: roll, error: rollError } = await locals.supabase
        .from('roll')
        .select('dev_detail')
        .eq('id', roll_id)
        .single();

    if (rollError || !roll) {
        console.error('Error fetching roll:', rollError);
        return new Response(JSON.stringify(null), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Si no tiene dev_detail asociado, devolver null
    if (!roll.dev_detail) {
        return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Obtener el dev_detail
    const { data: devDetail, error: devDetailError } = await locals.supabase
        .from('dev_detail')
        .select(`
            *,
            lab:lab_id (*)  
        `)
        .eq('id', roll.dev_detail)
        .single();

    if (devDetailError || !devDetail) {
        console.error('Error fetching dev_details:', devDetailError);
        return new Response(JSON.stringify(null), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(devDetail), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};