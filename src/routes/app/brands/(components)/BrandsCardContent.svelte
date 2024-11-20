<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import type { Tables } from '$lib/types/supabase.types';

	const { brands } = $props();
</script>

<div>
	{#each brands as brand}
		<div class=" mb-3 flex items-center space-x-4 rounded-md border p-4 hover:bg-zinc-100">
			<div class="flex-1 space-y-1">
				<p class="text-sm font-medium leading-none">{brand.name}</p>
				<p class="text-sm text-muted-foreground">0 filmstocks.</p>
			</div>
			<ChevronRight />
		</div>
	{/each}
</div>
