<script lang="ts">
	import Sidebar from './(components)/Sidebar.svelte'; // Sidebar común
	import Header from './(components)/Header.svelte'; // Header común
	import { Toaster } from '$lib/components/ui/sonner';

	const { children, data } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Toaster />
	<Sidebar />
	<!-- Sidebar común para todas las páginas -->

	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header userAvatarUrl={data.session?.user.user_metadata.avatar_url} />
		<!-- Header común para todas las páginas -->
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			{@render children()}
			<!-- El contenido de cada página se inyecta aquí -->
		</main>
	</div>
</div>
