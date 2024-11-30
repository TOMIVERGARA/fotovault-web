<script lang="ts">
	import { onMount } from 'svelte';
	import { signedUrlStore } from '$lib/stores/signedUrls';
	import type { Tables } from '$lib/types/supabase.types';

	export let roll: Tables<'roll_with_filmstock_details'>;

	let coverImageUrl: string | null = null;
	let refreshTimer: NodeJS.Timeout;

	async function updateSignedUrl() {
		if (!roll.storage_container_name) return;

		const path = `${roll.storage_container_name}/cover.jpg`;
		coverImageUrl = await signedUrlStore.get(path);

		// Programar próxima actualización
		refreshTimer = setTimeout(updateSignedUrl, 45 * 60 * 1000); // 45 minutos
	}

	onMount(() => {
		updateSignedUrl();
		return () => {
			if (refreshTimer) clearTimeout(refreshTimer);
		};
	});
</script>

<div class="group relative h-min">
	<a href="/roll/{roll.id}" class="block">
		{#if coverImageUrl}
			<img
				src={coverImageUrl}
				alt={roll.name}
				class="h-auto max-w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
				loading="lazy"
			/>
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
