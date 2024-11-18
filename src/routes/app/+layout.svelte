<script lang="ts">
	import Sidebar from './(components)/Sidebar.svelte'; // Sidebar común
	import Header from './(components)/Header.svelte'; // Header común

	const { children, data } = $props();
	$inspect(data.session);
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Sidebar />
	<!-- Sidebar común para todas las páginas -->

	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header userAvatarUrl={data.session?.user.user_metadata.avatar_url} />
		<!-- Header común para todas las páginas -->
		<main>
			{@render children()}
			<!-- El contenido de cada página se inyecta aquí -->
		</main>
	</div>
</div>
