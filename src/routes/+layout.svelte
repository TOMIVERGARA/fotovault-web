<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';

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

<ModeWatcher />
{@render children()}
