<script lang="ts">
	import PhotoGrid from './(components)/PhotoGrid.svelte';
	import FilterAccordion from './(components)/FilterAccordion.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { Filter, Plus } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { filterStore } from '$lib/stores/filters';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	export let data: PageData;

	$: filteredRolls = data.rolls.filter((roll) => {
		const matchesSearch =
			roll.name?.toLowerCase().includes($filterStore.search.toLowerCase()) ||
			(roll.description?.toLowerCase() || '').includes($filterStore.search.toLowerCase());

		const matchesBrand =
			$filterStore.brandIds.size === 0 || $filterStore.brandIds.has(roll.brand_id || '');

		const matchesFormat =
			$filterStore.formatIds.size === 0 || $filterStore.formatIds.has(roll.format_id || '');

		const matchesFilmType =
			$filterStore.filmTypeIds.size === 0 || $filterStore.filmTypeIds.has(roll.filmtype_id || '');

		return matchesSearch && matchesBrand && matchesFormat && matchesFilmType;
	});

	$: totalFilters =
		$filterStore.brandIds.size + $filterStore.formatIds.size + $filterStore.filmTypeIds.size;
</script>

<svelte:head>
	<title>dashboard | fv</title>
</svelte:head>

<div class="container mx-auto px-4">
	<div
		class="mb-7 flex h-min w-full items-center rounded-xl border bg-white p-3 px-3 shadow-sm dark:bg-zinc-950"
	>
		<Input class="w-64 rounded-xl" placeholder="search" bind:value={$filterStore.search} />
		<Popover.Root>
			<Popover.Trigger>
				<Button class="ml-2 rounded-xl" variant="outline">
					<Filter class="mr-2 h-4 w-4" />filter
				</Button>
			</Popover.Trigger>
			<Popover.Content class="mt-5  w-48 py-2">
				<FilterAccordion />
			</Popover.Content>
		</Popover.Root>
		{#if totalFilters > 0}
			<Badge class="ml-2 font-normal italic text-muted-foreground" variant="outline" size="sm">
				{totalFilters}
				{totalFilters > 1 ? 'filters' : 'filter'} applied
			</Badge>
		{/if}

		<Button on:click={() => goto('/app/rolls/new')} class="ml-auto rounded-full">
			<Plus class="mr-2 h-4 w-4" />new roll
		</Button>
	</div>
	<PhotoGrid rolls={filteredRolls} />
</div>
