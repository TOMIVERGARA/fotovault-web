import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
    const { roll_id } = params;

    // Obtener el roll
    const { data: roll, error: rollError } = await locals.supabase
        .from('roll')
        .select('scan_detail')
        .eq('id', roll_id)
        .single();

    if (rollError || !roll) {
        console.error('Error fetching roll:', rollError);
        return new Response(JSON.stringify(null), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Si no tiene scan_detail asociado, devolver null
    if (!roll.scan_detail) {
        return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Obtener el scan_detail
    const { data: scanDetail, error: scanDetailError } = await locals.supabase
        .from('scan_detail')
        .select('*')
        .eq('id', roll.scan_detail)
        .single();

    if (scanDetailError || !scanDetail) {
        console.error('Error fetching scan_details:', scanDetailError);
        return new Response(JSON.stringify(null), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(scanDetail), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};