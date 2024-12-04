<script lang="ts">
	import type { Tables } from '$lib/types/supabase.types';
	import RollCard from './RollCard.svelte';
	import { signedUrlStore } from '$lib/stores/signedUrls';
	import { onMount } from 'svelte';

	export let rolls: Tables<'roll_with_filmstock_details'>[];

	let coverImageUrls: { [key: string]: string | null } = {};

	// Function to distribute rolls in columns
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

	async function fetchSignedUrls() {
		const paths = rolls
			.filter((roll) => roll.storage_container_name)
			.map((roll) => `${roll.storage_container_name}/previews/cover.webp`);
		console.log(paths);

		if (paths.length > 0) {
			coverImageUrls = await signedUrlStore.getBatchPreviews(paths);
			console.log(coverImageUrls);
		}
	}

	$: columns = distributeRollsInColumns(rolls, 4);

	onMount(() => {
		fetchSignedUrls();
		console.log(coverImageUrls);
	});
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
	{#each columns as column}
		<div class="grid gap-4">
			{#each column as roll}
				<RollCard
					{roll}
					coverImageUrl={coverImageUrls[`${roll.storage_container_name}/previews/cover.webp`]}
				/>
			{/each}
		</div>
	{/each}
</div>
