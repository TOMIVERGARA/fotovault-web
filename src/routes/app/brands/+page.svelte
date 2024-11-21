<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import BrandsCardContent from './(components)/BrandsCardContent.svelte';
	import type { PageData } from './$types';
	import ScrollableContainer from '$lib/components/custom/ScrollableContainer.svelte';
	import { Plus } from 'lucide-svelte';

	// Importamos el nuevo componente reutilizable
	import CreateRecordDialog from '$lib/components/custom/CreateRecordDialog.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { Database } from '$lib/types/supabase.types';

	const { data } = $props<{ data: PageData }>();

	let isNewBrandDialogOpen = $state(false);
	let { brands } = $state(data);
	let scrollableContainer: HTMLDivElement;
	let showScrollIcon = $state(false);
	let isHovered = $state(false);
	let selectedBrand: Database['public']['Tables']['brand']['Row'] | null = $state(null);

	$effect(() => {
		brands = data.brands;

		const checkScrollable = () => {
			showScrollIcon = scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
		};

		const handleScroll = () => {
			const isAtBottom =
				scrollableContainer.scrollHeight - scrollableContainer.scrollTop ===
				scrollableContainer.clientHeight;
			showScrollIcon = !isAtBottom && isHovered;
		};

		checkScrollable();
		scrollableContainer.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', checkScrollable);

		return () => {
			scrollableContainer.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkScrollable);
		};
	});
</script>

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
			<ScrollableContainer containerClass="h-full">
				<BrandsCardContent {brands} bind:selectedBrand />
			</ScrollableContainer>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-2/3">
		<Card.Header>
			<Card.Title
				>Film Stocks
				{#if selectedBrand}
					from {selectedBrand.name}
				{/if}
			</Card.Title>
			<Card.Description>Organize your film catalog for a specific brand.</Card.Description>
		</Card.Header>
		<Card.Content></Card.Content>
	</Card.Root>
</div>

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
