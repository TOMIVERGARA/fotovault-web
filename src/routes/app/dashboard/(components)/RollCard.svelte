<script lang="ts">
	import type { Tables } from '$lib/types/supabase.types';
	import ImageWithLoader from '$lib/components/custom/ImageWithLoader.svelte';

	export let roll: Tables<'roll_with_filmstock_details'>;
	export let coverImageUrl: string | null = null;
</script>

<div class="group relative h-min">
	<a href="/app/rolls/{roll.id}" class="block">
		{#if coverImageUrl}
			<div
				class="h-auto max-w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
			>
				<ImageWithLoader src={coverImageUrl} alt={roll.name || 'No name'} />
			</div>
		{/if}
		<div
			class="absolute -bottom-1 left-0 right-0 scale-[1.02] rounded-b-xl bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		>
			<h3 class="text-lg font-medium text-white">{roll.name}</h3>
			<p class="text-xs text-white/60">
				{new Date(roll.created_at || '01/01/0001').toLocaleDateString()}
			</p>
		</div>
	</a>
</div>
