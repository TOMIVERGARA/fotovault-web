import { json } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
    const { error } = await locals.supabase.auth.signOut();

    if (error) {
        console.error('Error al cerrar sesión:', error.message);
        return json({ success: false, error: error.message });
    }

    return json({ success: true });
};
