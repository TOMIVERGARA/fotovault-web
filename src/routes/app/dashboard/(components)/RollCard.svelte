<script lang="ts">
	interface Roll {
		id: string;
		name: string;
		description: string;
		cover_img_url: string;
		created_at: string;
		filmstock: string;
	}

	export let roll: Roll;

	// Formatear la fecha para mostrarla de manera amigable
	$: formattedDate = new Date(roll.created_at).toLocaleDateString();
</script>

<div class="group relative">
	<a href="/roll/{roll.id}" class="block">
		<img
			src={roll.cover_img_url}
			alt={roll.name}
			class="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
			loading="lazy"
		/>
		<div
			class="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		>
			<h3 class="text-lg font-medium text-white">{roll.name}</h3>
			{#if roll.filmstock}
				<p class="text-sm text-white/80">{roll.filmstock}</p>
			{/if}
			<p class="text-xs text-white/60">{formattedDate}</p>
		</div>
	</a>
</div>
