<script lang="ts">
	import RollCard from './RollCard.svelte';

	interface Roll {
		id: string;
		name: string;
		description: string;
		cover_img_url: string;
		created_at: string;
		filmstock: string;
	}

	export let rolls: Roll[];

	// Función para dividir el array en columnas
	function distributeRollsInColumns(rolls: Roll[], numColumns: number) {
		const columns: Roll[][] = Array.from({ length: numColumns }, () => []);
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
