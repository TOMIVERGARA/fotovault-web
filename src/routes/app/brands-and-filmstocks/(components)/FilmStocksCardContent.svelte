<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { ListRestart, Pen, Trash } from 'lucide-svelte';
	import type { Database } from '$lib/types/supabase.types';
	import { toast } from 'svelte-sonner';
	let { selectedBrand = $bindable() } = $props();

	let filmstocks: Database['public']['Views']['filmstock_with_details']['Row'][] = $state([]);

	const fetchFilmstocks = async () => {
		const response = await fetch(`/api/filmstocks?brandId=${selectedBrand.id}`);
		const data =
			(await response.json()) as Database['public']['Views']['filmstock_with_details']['Row'][];
		filmstocks = data;
	};

	const toggleFilmstockActive = async (
		filmstockId: string | null,
		currentActive: boolean | null
	) => {
		if (!filmstockId) {
			console.error('No filmstock_id provided');
			return;
		}

		try {
			// Si es null, lo tratamos como false para el toggle
			const newActiveState = !(currentActive ?? false);

			const response = await fetch(`/api/filmstocks/${filmstockId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					active: newActiveState
				})
			});

			if (response.ok) {
				await fetchFilmstocks();
				toast.success(`filmstock ${newActiveState ? 'activated' : 'deactivated'} successfully 🥳`);
			} else {
				toast.error('error updating filmstock 😢');
				console.error('error updating filmstock');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	$effect(() => {
		if (selectedBrand.id) {
			console.log('fetching filmstocks');
			fetchFilmstocks();
		}
	});
</script>

{#if filmstocks.length === 0}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<img
			class="hidden w-2/5 select-none dark:block"
			src="/img/illustrations/add-white-img.png"
			alt=""
			srcset=""
		/>
		<img
			class="w-2/5 select-none dark:hidden"
			src="/img/illustrations/add-black-img.png"
			alt=""
			srcset=""
		/>
		<p class="text-center">
			this brand doesnt own any filmstock. <br /><a
				class="font-medium underline underline-offset-2"
				href={`/app/brands-and-filmstocks/filmstock/new${selectedBrand ? `?brand_id=${selectedBrand.id}` : ''}`}
				>create the first one</a
			>
		</p>
	</div>
{:else}
	<div class="grid grid-flow-row-dense grid-cols-3">
		{#each filmstocks as filmstock}
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<div class="card relative m-2 rounded-md border p-4">
						{#if !(filmstock.active ?? false)}
							<div
								class="absolute inset-0 z-10 rounded-md bg-gray-200/60 dark:bg-gray-700/60"
							></div>
						{/if}
						<img
							src={filmstock.logo_url}
							alt="{filmstock.name} logo -"
							class="mx-auto mb-4 w-3/4 select-none"
							class:opacity-50={!(filmstock.active ?? false)}
							class:grayscale={!(filmstock.active ?? false)}
						/>
						<div class="flex">
							<h2
								class="text-lg font-bold"
								class:text-gray-500={!(filmstock.active ?? false)}
								class:dark:text-gray-400={!(filmstock.active ?? false)}
							>
								{filmstock.name}
							</h2>
							<Badge
								variant="secondary"
								class="ml-2 border border-zinc-400 {!(filmstock.active ?? false)
									? 'opacity-50'
									: ''}"
							>
								{filmstock.iso} iso
							</Badge>
						</div>

						<div
							class="text-sm"
							class:text-gray-500={!(filmstock.active ?? false)}
							class:dark:text-gray-400={!(filmstock.active ?? false)}
						>
							<p>
								type:
								<a href="" class="font-medium underline underline-offset-2"
									>{filmstock.filmtype_name}</a
								>
							</p>
							<p>
								format: <a href="" class="font-medium underline underline-offset-2"
									>{filmstock.format_name}</a
								>
							</p>
							<p>brand: {filmstock.brand_name}</p>
						</div>
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					{#if !(filmstock.active ?? false)}
						<ContextMenu.Item
							on:click={() => toggleFilmstockActive(filmstock.id, filmstock.active)}
							class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							<div class="flex items-center text-green-500">
								<ListRestart class="mr-2 size-5" />
								activate
							</div>
						</ContextMenu.Item>
					{:else}
						<ContextMenu.Item
							class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							<div class="flex items-center">
								<Pen class="mr-2 size-5" />
								edit
							</div>
						</ContextMenu.Item>
						<ContextMenu.Item
							on:click={() => toggleFilmstockActive(filmstock.id, filmstock.active)}
							class="rounded-button flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium outline-none !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							<div class="flex items-center text-red-500">
								<Trash class="mr-2 size-5" />
								deactivate
							</div>
						</ContextMenu.Item>
					{/if}
				</ContextMenu.Content>
			</ContextMenu.Root>
		{/each}
	</div>
{/if}
