<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { filterStore } from '$lib/stores/filters';
	import { onMount } from 'svelte';
	import type { Tables } from '$lib/types/supabase.types';

	let brands: Tables<'brand'>[] = [];
	let formats: Tables<'format'>[] = [];
	let filmTypes: Tables<'filmtype'>[] = [];

	onMount(async () => {
		const [brandsRes, formatsRes, filmTypesRes] = await Promise.all([
			fetch('/api/brands?active=true'),
			fetch('/api/formats?active=true'),
			fetch('/api/filmtypes?active=true')
		]);

		brands = await brandsRes.json();
		formats = await formatsRes.json();
		filmTypes = await filmTypesRes.json();
	});

	function toggleFilter(type: 'brandIds' | 'formatIds' | 'filmTypeIds', id: string) {
		$filterStore[type] = $filterStore[type].has(id)
			? new Set([...$filterStore[type]].filter((x) => x !== id))
			: new Set([...$filterStore[type], id]);
	}

	function resetFilters() {
		$filterStore = {
			...$filterStore,
			brandIds: new Set(),
			formatIds: new Set(),
			filmTypeIds: new Set()
		};
	}

	$: selectedBrandsCount = $filterStore.brandIds.size;
	$: selectedFormatsCount = $filterStore.formatIds.size;
	$: selectedFilmTypesCount = $filterStore.filmTypeIds.size;
</script>

<div class="w-full">
	<Accordion.Root>
		<Accordion.Item value="brands">
			<Accordion.Trigger class="flex w-full justify-between text-sm">
				<span>brands</span>
				{#if selectedBrandsCount > 0}
					<span class="text-xs text-muted-foreground">
						{selectedBrandsCount} selected
					</span>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content class="pb-3">
				<div class="space-y-2">
					{#each brands as brand}
						<div class="flex items-center space-x-2">
							<Checkbox
								checked={$filterStore.brandIds.has(brand.id)}
								onCheckedChange={() => toggleFilter('brandIds', brand.id)}
							/>
							<label class="text-sm">{brand.name}</label>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value="formats">
			<Accordion.Trigger class="flex w-full justify-between text-sm">
				<span>formats</span>
				{#if selectedFormatsCount > 0}
					<span class="text-xs text-muted-foreground">
						{selectedFormatsCount} selected
					</span>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content class="pb-3">
				<div class="space-y-2">
					{#each formats as format}
						<div class="flex items-center space-x-2">
							<Checkbox
								checked={$filterStore.formatIds.has(format.id)}
								onCheckedChange={() => toggleFilter('formatIds', format.id)}
							/>
							<label class="text-sm">{format.name}</label>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value="filmTypes">
			<Accordion.Trigger class="flex w-full justify-between text-sm">
				<span>film types</span>
				{#if selectedFilmTypesCount > 0}
					<span class="text-xs text-muted-foreground">
						{selectedFilmTypesCount} selected
					</span>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content class=" pb-3">
				<div class="space-y-2">
					{#each filmTypes as type}
						<div class="flex items-center space-x-2">
							<Checkbox
								checked={$filterStore.filmTypeIds.has(type.id)}
								onCheckedChange={() => toggleFilter('filmTypeIds', type.id)}
							/>
							<label class="text-sm">{type.name}</label>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>

	{#if selectedBrandsCount > 0 || selectedFormatsCount > 0 || selectedFilmTypesCount > 0}
		<div class="mt-4">
			<Button variant="outline" class="mb-1 w-full p-0" on:click={resetFilters}
				>reset filters</Button
			>
		</div>
	{/if}
</div>
