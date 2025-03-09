import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const cf_turnstile_response = formData.get('cf-turnstile-response') as string;

    if (!email) {
        return json({ error: 'Email is required' }, { status: 400 });
    }


    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            captchaToken: cf_turnstile_response
        }
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    return json({
        success: true
    });
}