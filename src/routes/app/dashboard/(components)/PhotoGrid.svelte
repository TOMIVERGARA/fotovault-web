<script>
	import RollCard from './RollCard.svelte';

	export let rolls;

	// Función para dividir el array en columnas
	function distributeRollsInColumns(rolls, numColumns) {
		const columns = Array.from({ length: numColumns }, () => []);
		rolls.forEach((roll, index) => {
			columns[index % numColumns].push(roll);
		});
		return columns;
	}

	$: columns = distributeRollsInColumns(rolls, 4);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
	{#each columns as column}
		<div class="grid gap-4">
			{#each column as roll}
				<RollCard {roll} />
			{/each}
		</div>
	{/each}
</div>
