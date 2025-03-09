import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    updateDisplayName: async ({ request, locals: { supabase } }) => {
        try {
            const formData = await request.formData();
            const display_nameRaw = formData.get('display_name');
            const user_idRaw = formData.get('user_id');

            // Asegurarse de que sean strings
            if (typeof display_nameRaw !== 'string' || typeof user_idRaw !== 'string') {
                return fail(400, { error: 'Display name and user_id are required' });
            }

            const display_name = display_nameRaw.trim();
            const user_id = user_idRaw.trim();

            const { error } = await supabase
                .from('profile')
                .update({ display_name })
                .eq('user_id', user_id);

            if (error) {
                console.error(error);
                return fail(500, { error: 'Failed to update display name' });
            }

            return { success: true, display_name };
        } catch (err) {
            console.error(err);
            return fail(400, { error: 'Invalid request' });
        }
    }
};
