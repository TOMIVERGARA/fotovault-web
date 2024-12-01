import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const response = await fetch(`/api/rolls/${params.roll_id}`);

    if (!response.ok) {
        throw error(response.status, 'Failed to load roll details');
    }

    return response.json();
};