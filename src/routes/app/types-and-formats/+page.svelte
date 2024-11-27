<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import TypesTable from './(components)/TypesTable.svelte';
	import type { PageData } from './$types';
	import CreateRecordDialog from '$lib/components/custom/CreateRecordDialog.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import ScrollableContainer from '$lib/components/custom/ScrollableContainer.svelte';
	import FormatsTable from './(components)/FormatsTable.svelte';
	import CreateComplexRecordDialog from '$lib/components/custom/CreateComplexRecordDialog.svelte';

	const { data } = $props<{ data: PageData }>();
	let { filmtypes, formats } = $state(data);

	let isNewFilmtypeDialogOpen = $state(false);
	let isNewFormatDialogOpen = $state(false);

	$effect(() => {
		filmtypes = data.filmtypes;
		formats = data.formats;
	});
</script>

<div class="flex justify-center">
	<Card.Root class="w-2/5">
		<Card.Header>
			<Card.Title>Film Types and Formats</Card.Title>
			<Card.Description
				>Organize your film types and supported formats so that you can use them later when creating
				new filmstocks.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="prose text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Types</h3>
					</div>
					<CreateRecordDialog
						bind:open={isNewFilmtypeDialogOpen}
						actionUrl="?/createFilmtype"
						title="Create Film Type"
						description="Create a new film type to be asociated to a given filmstock."
						placeholder="Color - c41"
						successMessage="Filmtype created successfully 🎉"
						invalidateKey="filmtypes"
					>
						<button
							slot="trigger"
							class={buttonVariants({
								variant: 'default',
								size: 'icon',
								class: 'h-7 w-7 rounded-full'
							})}
						>
							<Plus class="h-4 w-4" />
						</button>
					</CreateRecordDialog>
				</div>
				<div class="relative flex-1 overflow-hidden">
					<ScrollableContainer containerClass="max-h-80" bottomShadowPos={'bottom-0'}>
						<TypesTable {filmtypes} />
					</ScrollableContainer>
				</div>
				<p class="mt-0 text-sm italic text-gray-400">
					Film types are "groups" that allow you to organize your filmstocks and consequently the
					rolls you shoot by a technical characteristic like color film, slide film, or black and
					white.
				</p>
			</div>
			<hr class="divider mb-5 mt-5" />
			<div class="prose text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Formats</h3>
					</div>
					<CreateComplexRecordDialog
						bind:open={isNewFormatDialogOpen}
						actionUrl="?/createFormat"
						title="Create Format"
						description="Create a new film format to be asociated to a given filmstock."
						successMessage="Format created successfully 🎉"
						invalidateKey="filmtypes"
						fields={[
							{
								id: 'name',
								label: 'Name',
								type: 'text',
								required: true,
								placeholder: '35mm'
							},
							{
								id: 'width',
								label: 'Width(mm)',
								type: 'number',
								required: true,
								placeholder: '36',
								min: 1
							},
							{
								id: 'height',
								label: 'Height(mm)',
								type: 'number',
								required: true,
								placeholder: '24',
								min: 1
							}
						]}
					>
						<button
							slot="trigger"
							class={buttonVariants({
								variant: 'default',
								size: 'icon',
								class: 'h-7 w-7 rounded-full'
							})}
						>
							<Plus class="h-4 w-4" />
						</button>
					</CreateComplexRecordDialog>
				</div>
				<div class="relative flex-1 overflow-hidden">
					<ScrollableContainer containerClass="max-h-80" bottomShadowPos={'bottom-0'}>
						<FormatsTable {formats} />
					</ScrollableContainer>
				</div>
				<p class="mt-0 text-sm italic text-gray-400">
					Film formats are the physical sizes of the film you can use to shoot. They are usually
					named by the film size in mm or the aspect ratio of the final photo.
				</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>
