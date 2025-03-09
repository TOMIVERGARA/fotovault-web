import type { LayoutServerLoad } from '../$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, fetch, cookies }) => {
    const { session } = await safeGetSession();

    // Hacer fetch correctamente en el servidor
    const response = await fetch('/api/authmanager/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    let profile = null;
    if (response.ok) {
        profile = await response.json();
    } else {
        console.error('Error al cargar perfil:', response);
    }

    return {
        session,
        profile, // Pasamos el perfil a `+layout.svelte`
        cookies: cookies.getAll(),
    };
};