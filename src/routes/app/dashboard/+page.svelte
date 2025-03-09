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
	import { buttonVariants } from '$lib/components/ui/button';

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

<div class="container mx-auto h-full px-4">
	{#if data.rolls.length === 0}
		<div class="flex h-[80vh] w-full flex-col items-center justify-center">
			<img
				class="hidden w-1/4 select-none dark:block"
				src="/img/illustrations/add-white-img.png"
				alt=""
				srcset=""
			/>
			<img
				class="w-1/4 select-none dark:hidden"
				src="/img/illustrations/add-black-img.png"
				alt=""
				srcset=""
			/>
			<p class="text-center">you haven't created any rolls yet.</p>
			<button
				onclick={() => goto('/app/rolls/new')}
				class={buttonVariants({ variant: 'default', size: 'sm', class: 'mt-3 rounded-xl' })}
			>
				<Plus class="mr-2 h-4 w-4" /> add new roll
			</button>
		</div>
	{:else}
		<div
			class="mb-7 flex h-min w-full items-center rounded-xl border bg-white p-3 px-3 shadow-sm dark:bg-zinc-950"
		>
			<Input
				class="w-64 rounded-xl"
				placeholder="search"
				bind:value={$filterStore.search}
				disabled={data.rolls.length === 0}
			/>
			<Popover.Root>
				<Popover.Trigger disabled={data.rolls.length === 0}>
					<Button class="ml-2 rounded-xl" variant="outline" disabled={data.rolls.length === 0}>
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

		{#if filteredRolls.length === 0}
			<div class="flex h-full w-full flex-col items-center justify-center">
				<img
					class="hidden w-1/4 select-none dark:block"
					src="/img/illustrations/searching-white-img.png"
					alt=""
					srcset=""
				/>
				<img
					class="w-1/4 select-none dark:hidden"
					src="/img/illustrations/searching-black-img.png"
					alt=""
					srcset=""
				/>
				<p class="text-center">no rolls match the filters.</p>
			</div>
		{:else}
			<PhotoGrid rolls={filteredRolls} />
		{/if}
	{/if}
</div>
