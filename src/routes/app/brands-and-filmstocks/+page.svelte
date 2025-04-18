<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import BrandsCardContent from './(components)/BrandsCardContent.svelte';
	import type { PageData } from './$types';
	import ScrollableContainer from '$lib/components/custom/ScrollableContainer.svelte';
	import { Info, Plus } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';

	import CreateRecordDialog from '$lib/components/custom/CreateRecordDialog.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import type { Database } from '$lib/types/supabase.types';
	import FilmStocksCardContent from './(components)/FilmStocksCardContent.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props<{ data: PageData }>();

	let { brands } = $state(data);
	let isNewBrandDialogOpen = $state(false);
	let selectedBrand: Database['public']['Tables']['brand']['Row'] | null = $state(null);

	$effect(() => {
		brands = data.brands;
	});
</script>

<svelte:head>
	<title>brands & filmstocks | fv</title>
</svelte:head>

{#if brands.length > 0}
	<div class="flex gap-4">
		<Card.Root class="flex h-[88vh] w-1/3 flex-col">
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="flex flex-col space-y-1.5">
					<Card.Title>Brands</Card.Title>
					<Card.Description>These are the brands you can create film stocks from.</Card.Description>
				</div>
				<div>
					<CreateRecordDialog
						bind:open={isNewBrandDialogOpen}
						actionUrl="?/createBrand"
						title="Create brand"
						description="Create a new brand to organize your film."
						placeholder="Fujifilm"
						successMessage="Brand created successfully 🎉"
						invalidateKey="brands"
					>
						<button
							slot="trigger"
							class={buttonVariants({ variant: 'default', size: 'icon', class: 'rounded-full' })}
						>
							<Plus class="h-4 w-4" />
						</button>
					</CreateRecordDialog>
				</div>
			</Card.Header>
			<Card.Content class="relative flex-1 overflow-hidden">
				<ScrollableContainer containerClass="h-full" bottomShadowPos={'bottom-6'}>
					<BrandsCardContent {brands} bind:selectedBrand />
				</ScrollableContainer>
			</Card.Content>
		</Card.Root>
		<Card.Root class="flex h-[88vh] w-2/3 flex-col">
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="flex flex-col space-y-1.5">
					<Card.Title
						>Film Stocks
						{#if selectedBrand}
							from {selectedBrand.name}
						{/if}
					</Card.Title>
					<Card.Description>Organize your film catalog for a specific brand.</Card.Description>
				</div>
				<div>
					<Button
						onclick={async () =>
							goto(
								`/app/brands-and-filmstocks/filmstock/new${selectedBrand ? `?brand_id=${selectedBrand.id}` : ''}`
							)}
						class="rounded-3xl"><Plus class="mr-2 h-4 w-4" />create new filmstock</Button
					>
				</div>
			</Card.Header>
			<Card.Content class="flex min-h-0 flex-1 flex-col">
				{#if selectedBrand}
					<FilmStocksCardContent {selectedBrand} />
					<Alert.Root class="m-2 mt-auto">
						<Info class="h-4 w-4" />
						<Alert.Title>right click to edit filmstocks</Alert.Title>
						<Alert.Description
							>you can right click any filmstock to see advanced options</Alert.Description
						>
					</Alert.Root>
				{:else}
					<div class="flex h-full w-full flex-col items-center justify-center">
						<img
							class="hidden w-2/5 select-none dark:block"
							src="/img/illustrations/loading-white-img.png"
							alt=""
							srcset=""
						/>
						<img
							class="w-2/5 select-none dark:hidden"
							src="/img/illustrations/loading-black-img.png"
							alt=""
							srcset=""
						/>
						<p class="">select a brand to see its associated filmstocks.</p>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<div class="flex h-[80vh] w-full flex-col items-center justify-center">
		<img
			class="hidden w-1/4 select-none dark:block"
			src="/img/illustrations/loading-white-img.png"
			alt=""
			srcset=""
		/>
		<img
			class="w-1/4 select-none dark:hidden"
			src="/img/illustrations/loading-black-img.png"
			alt=""
			srcset=""
		/>
		<p class="">you don't have any brands yet.</p>
		<CreateRecordDialog
			bind:open={isNewBrandDialogOpen}
			actionUrl="?/createBrand"
			title="Create brand"
			description="Create a new brand to organize your film."
			placeholder="Fujifilm"
			successMessage="Brand created successfully 🎉"
			invalidateKey="brands"
		>
			<button
				slot="trigger"
				class={buttonVariants({ variant: 'default', size: 'sm', class: 'mt-3 rounded-xl' })}
			>
				<Plus class="mr-2 h-4 w-4" /> add new brand
			</button>
		</CreateRecordDialog>
	</div>
{/if}

<style>
	@keyframes drop-in {
		0% {
			transform: translateY(100%) scale(0.2);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(0.8);
			opacity: 20%;
		}
	}

	.drop-in {
		animation: drop-in 0.1s ease-out forwards;
	}
</style>
