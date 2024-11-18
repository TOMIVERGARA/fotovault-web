<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';

	const { data: propsData, children } = $props();
	const { supabase, session } = propsData;

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
