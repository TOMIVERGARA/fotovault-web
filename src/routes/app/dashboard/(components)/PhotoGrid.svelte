<script lang="ts">
	import type { Tables } from '$lib/types/supabase.types';
	import RollCard from './RollCard.svelte';

	export let rolls: Tables<'roll_with_filmstock_details'>[];

	// Función para dividir el array en columnas
	function distributeRollsInColumns(
		rolls: Tables<'roll_with_filmstock_details'>[],
		numColumns: number
	): Tables<'roll_with_filmstock_details'>[][] {
		const columns: Tables<'roll_with_filmstock_details'>[][] = Array.from(
			{ length: numColumns },
			() => []
		);
		rolls.forEach((roll, index) => {
			columns[index % numColumns].push(roll);
		});
		return columns;
	}

	$: columns = distributeRollsInColumns(rolls, 4);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
	{#each columns as column}
		<div class="grid gap-4">
			{#each column as roll}
				<RollCard {roll} />
			{/each}
		</div>
	{/each}
</div>
