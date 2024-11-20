<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import BrandsCardContent from './(components)/BrandsCardContent.svelte';
	import type { PageData } from './$types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { ActionData } from './$types';
	import { invalidate } from '$app/navigation';
	import { CircleArrowDown } from 'lucide-svelte';

	const { data } = $props<{ data: PageData }>();

	let loading = $state(false);
	let isNewBrandDialogOpen = $state(false);
	let actionData: ActionData = $state(null);
	let { brands } = $state(data);
	let showScrollIcon = $state(false);
	let isHovered = $state(false);
	let scrollableContainer: HTMLDivElement;

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

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Card.Root class="flex h-[88vh] flex-col">
		<Card.Header class="flex flex-row items-center justify-between space-y-0">
			<div class="flex flex-col space-y-1.5">
				<Card.Title>Brands</Card.Title>
				<Card.Description>These are the brands you can create film stocks from.</Card.Description>
			</div>
			<div>
				<Dialog.Root bind:open={isNewBrandDialogOpen}>
					<Dialog.Trigger
						class={buttonVariants({ variant: 'default', size: 'icon', class: 'rounded-full' })}
					>
						<Plus class="h-4 w-4" /></Dialog.Trigger
					>
					<Dialog.Content class="sm:max-w-[425px]">
						<form
							method="POST"
							action="?/createBrand"
							use:enhance={() => {
								loading = true;
								return async ({ result }) => {
									loading = false;
									if (result.type === 'success') {
										isNewBrandDialogOpen = false;
										await invalidate('brands');
										toast.success('Brand created successfully 🎉');
									} else if (result.type === 'failure') {
										actionData = result.data as ActionData; // Conversión explícita
										// Por ahora no me gusta la toast, es demasiado
										// if (actionData?.error) {
										// 	toast.error(actionData.error);
										// }
									}
								};
							}}
						>
							<Dialog.Header>
								<Dialog.Title>Create brand</Dialog.Title>
								<Dialog.Description>Create a new brand to organize your film.</Dialog.Description>
							</Dialog.Header>

							<div class="grid gap-4 py-4">
								<div class="grid grid-cols-4 items-center gap-4">
									<Label for="name" class="text-right">Name</Label>
									<div class="col-span-3">
										<Input
											id="name"
											name="name"
											required
											placeholder="Fujifilm"
											class={'col-span-3' + (actionData?.error ? ' border-red-500' : '')}
											value={actionData?.values?.name || ''}
										/>
									</div>
									{#if actionData?.error}
										<div class="col-span-4 w-full text-right">
											<p class="mt-0 text-xs text-red-500">{actionData.error}</p>
										</div>
									{/if}
								</div>
							</div>

							<Dialog.Footer>
								<Button type="submit" disabled={loading}>
									{loading ? 'Creating...' : 'Save'}
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Card.Header>
		<Card.Content class="relative flex-1 overflow-hidden">
			<div
				class="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent"
			></div>
			<div
				class="h-full overflow-y-auto"
				bind:this={scrollableContainer}
				on:mouseenter={() => (isHovered = true)}
				on:mouseleave={() => (isHovered = false)}
			>
				<BrandsCardContent {brands} />
			</div>
			<div
				class="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white to-transparent"
			></div>
			{#if showScrollIcon && isHovered}
				<div
					class="drop-in absolute inset-x-0 bottom-0 z-20 mx-auto mb-5 flex w-fit justify-center rounded-full bg-black p-1 opacity-20"
				>
					<CircleArrowDown class="w-6 text-white" />
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Film Stocks</Card.Title>
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
