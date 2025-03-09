import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { error } from 'console';

export const GET: RequestHandler = async ({ request, locals: { supabase } }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', user.user?.id)
        .single();

    if (error) {
        console.error('Error fetching brands:', error);
        return new Response('Error fetching brands', { status: 500 });
    }

    return json(profile);
}

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    // Obtener el usuario autenticado
    const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const user_id = user.user.id;

    try {
        const { name, username } = await request.json();

        if (!name || !username) {
            return json({ error: 'Missing fields' }, { status: 400 });
        }

        // Verificar si el username ya está en uso por otro usuario
        const { data: existingUser, error: usernameError } = await supabase
            .from('profile')
            .select('id')
            .eq('username', username)
            .neq('user_id', user_id) // Excluir el propio usuario
            .single();

        if (usernameError && usernameError.code !== 'PGRST116') {
            console.log(usernameError)
            return json({ error: 'Error checking username', details: usernameError }, { status: 500 });
        }

        if (existingUser) {
            return json({ error: 'Username already taken' }, { status: 409 });
        }

        // Actualizar perfil en la base de datos
        const { error: updateError } = await supabase
            .from('profile')
            .update({ display_name: name, username: username })
            .eq('user_id', user_id);

        if (updateError) {
            console.log(updateError)
            return json({ error: 'Failed to update profile', details: updateError }, { status: 500 });
        }

        return json({ message: 'Profile updated successfully' });
    } catch (error) {
        return json({ error: 'Invalid request' }, { status: 400 });
    }
};