import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const token = formData.get('otp') as string;

    if (!email || !token) {
        return json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Verificar OTP
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }


    return json({
        success: true,
        session: data.session
    });
}