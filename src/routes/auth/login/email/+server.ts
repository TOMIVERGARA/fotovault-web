import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
        return json({ error: 'Email is required' }, { status: 400 });
    }

    // Verificamos si el usuario ya existe
    const { data: { user } } = await supabase.auth.getUser();

    let isNewUser = false;
    if (!user) {
        // Verificamos si el email ya está registrado
        const { data: existingUsers } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        isNewUser = !existingUsers;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        }
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    return json({
        success: true,
        isNewUser
    });
};