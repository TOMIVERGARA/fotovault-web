import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const token = formData.get('otp') as string;
    const name = formData.get('name') as string | null;

    if (!email || !token) {
        return json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    // Si se proporcionó un nombre y es un nuevo usuario, actualizamos el perfil
    if (name && data.user) {
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                display_name: name
            }
        });

        if (updateError) {
            console.error('Error updating user profile:', updateError);
        }
    }

    return json({
        success: true,
        session: data.session
    });
};