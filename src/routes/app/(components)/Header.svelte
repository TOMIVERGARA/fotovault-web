<script lang="ts">
	import Breadcrumbs from './Breadcrumbs.svelte';
	import UserProfile from '$lib/components/custom/UserProfile.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<!-- Barra de navegación superior -->
	<Breadcrumbs />
	<div class="relative ml-auto flex-1 md:grow-0"></div>
	<UserProfile />
</header>
