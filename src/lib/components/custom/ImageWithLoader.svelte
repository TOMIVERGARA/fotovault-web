<script>
	export let src;
	export let alt = '';
	let isLoaded = false;

	const handleLoad = () => {
		isLoaded = true;
	};
</script>

<div class="relative">
	<!-- Skeleton loader -->
	<div
		class="absolute inset-0 animate-pulse bg-zinc-200 dark:!bg-secondary"
		class:hidden={isLoaded}
	></div>

	<!-- Imagen -->
	<img
		{src}
		{alt}
		class="h-auto w-full object-contain opacity-0 transition-opacity duration-500"
		on:load={handleLoad}
		class:opacity-100={isLoaded}
	/>
</div>
