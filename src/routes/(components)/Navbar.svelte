<script>
	import LightDarkMode from './LightDarkMode.svelte';
	import { mode } from 'mode-watcher';
	import { page } from '$app/stores';
	import UserProfile from '$lib/components/custom/UserProfile.svelte';
</script>

<header class="sticky top-0 z-10 items-center border-b bg-background">
	<div class="container flex h-16 items-center justify-between gap-4">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base"
				><img
					src="/img/fvlogo-black-img.svg"
					class="h-7 w-auto"
					alt="Logo en negro"
					class:hidden={$mode == 'dark'}
				/>

				<!-- Logo para modo oscuro -->
				<img
					src="/img/fvlogo-white-img.svg"
					alt="Logo en blanco"
					class="h-7 w-auto"
					class:hidden={$mode == 'light'}
				/></a
			>
		</nav>
		<div class="flex w-auto items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			{#if $page.data.session}
				<UserProfile />
			{:else}
				<LightDarkMode />
			{/if}
		</div>
	</div>
</header>
