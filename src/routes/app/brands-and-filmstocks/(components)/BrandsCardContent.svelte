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
			class=" mb-3 flex items-center space-x-4 rounded-xl border p-4 hover:bg-secondary"
			class:bg-secondary={selectedBrand && selectedBrand.id === brand.id}
			onclick={(selectedBrand = brand)}
		>
			<div class="flex-1 space-y-1">
				<p class="text-sm font-medium leading-none">{brand.name}</p>
				<p class="text-sm text-muted-foreground">
					{brand.filmstock_amount} filmstock{brand.filmstock_amount > 1 ||
					brand.filmstock_amount == 0
						? 's'
						: ''}
				</p>
			</div>
			<ChevronRight />
		</div>
	{/each}
</div>
