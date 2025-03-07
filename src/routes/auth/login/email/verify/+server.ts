import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    console.log(JSON.stringify(Object.fromEntries(formData.entries())));
    const email = formData.get('email') as string;
    const token = formData.get('otp') as string;
    const name = formData.get('name') as string | null;

    // Si tenemos nombre pero no token, estamos en el flujo de actualización de perfil
    // después de que la sesión ya se ha iniciado
    console.log('ADENTRO', name, token);
    if (name && !token) {
        console.log('Updating user profile:', name);
        // Obtener la sesión actual
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return json({ error: 'No active session' }, { status: 401 });
        }

        // Actualizar el perfil del usuario
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                display_name: name
            }
        });

        if (updateError) {
            console.error('Error updating user profile:', updateError);
            return json({ error: updateError.message }, { status: 400 });
        }

        return json({
            success: true
        });
    }

    // Verificación de OTP (flujo original)
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

    // Ahora que estamos autenticados, verificamos si el usuario tiene nombre
    if (data.user) {
        // Verificar si el usuario tiene un nombre en user_metadata
        const hasName = !!data.user.user_metadata?.display_name;
        const needsName = !hasName;

        // Si se proporcionó un nombre y es necesario, lo actualizamos
        if (name && needsName) {
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
            session: data.session,
            needsName: needsName && !name,
            user: {
                id: data.user.id,
                email: data.user.email
            }
        });
    }

    return json({
        success: true,
        session: data.session
    });
}