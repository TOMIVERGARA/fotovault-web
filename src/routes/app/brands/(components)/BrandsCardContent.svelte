<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import type { Tables } from '$lib/types/supabase.types';

	let { brands, selectedBrand = $bindable() } = $props();
</script>

<div>
	{#each brands as brand}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class=" mb-3 flex items-center space-x-4 rounded-md border p-4 hover:bg-zinc-100 {selectedBrand?.id ===
			brand.id
				? 'bg-zinc-100'
				: ''}"
			onclick={(selectedBrand = brand)}
		>
			<div class="flex-1 space-y-1">
				<p class="text-sm font-medium leading-none">{brand.name}</p>
				<p class="text-sm text-muted-foreground">0 filmstocks.</p>
			</div>
			<ChevronRight />
		</div>
	{/each}
</div>
