<script lang="ts">
	import PhotoGrid from './(components)/PhotoGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto px-4 py-8">
	<PhotoGrid rolls={data.rolls} />
</div>
