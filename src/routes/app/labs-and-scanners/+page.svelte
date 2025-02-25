<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import ScrollableContainer from '$lib/components/custom/ScrollableContainer.svelte';
	import CreateComplexRecordDialog from '$lib/components/custom/CreateComplexRecordDialog.svelte';
	import SimpleDataTable from '$lib/components/custom/SimpleDataTable.svelte';

	const { data } = $props<{ data: PageData }>();
	let { labs, scanners, filmtypes } = $state(data); // Añadir filmtypes

	let isNewLabDialogOpen = $state(false);
	let isNewScannerDialogOpen = $state(false);

	$effect(() => {
		labs = data.labs;
		scanners = data.scanners;
	});
</script>

<svelte:head>
	<title>types & formats | fv</title>
</svelte:head>

<div class="flex justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Labs and Scanners</Card.Title>
			<Card.Description
				>Create and manage labs and scanners to associate them to a dev detail for a roll later.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="prose text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Labs</h3>
					</div>
					<CreateComplexRecordDialog
						bind:open={isNewLabDialogOpen}
						actionUrl="?/createLab"
						title="Create Lab"
						description="Create a new film processing lab."
						successMessage="Lab created successfully 🎉"
						invalidateKey="labs"
						fields={[
							{
								id: 'name',
								label: 'Name',
								type: 'text',
								required: true,
								placeholder: 'ColorLab Pro'
							},
							{
								id: 'filmtypes[]',
								label: 'Film Types',
								type: 'select',
								multiple: true,
								options: filmtypes.map((ft: { id: any; name: any }) => ({
									value: ft.id,
									label: ft.name
								})),
								required: true
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
						<SimpleDataTable
							data={labs}
							columns={[
								{ key: 'name', header: 'Name', type: 'text' },
								{
									key: 'filmtypes',
									header: 'Film Types',
									type: 'html',
									format: (item) => {
										if (!item.filmtypes || item.filmtypes.length === 0) {
											return '<span class="text-zinc-400 text-xs">no film types assigned...</span>';
										}
										return `
                    <div>
                        ${item.filmtypes
													.map(
														(ft: { id: any; name: any }) => `
                            <span>
                                <a href="/filmtypes/${ft.id}" class="no-underline text-primary">
                                    ${ft.name}
                                </a>
                            </span>
                        `
													)
													.join('<span>/</span>')}
                    </div>
                `;
									}
								},
								{ key: 'active', header: 'Status', type: 'badge' }
							]}
							actions={[
								{
									action: '?/toggleLab',
									invalidateKey: 'labs',
									getSuccessMessage: (item) =>
										`Lab ${item.active ? 'inactivated' : 'activated'} successfully 🎉`,
									getLoadingMessage: (item) =>
										`${item.active ? 'Inactivating' : 'Activating'} lab...`,
									getErrorMessage: (item) =>
										`An error occurred while trying to ${item.active ? 'inactivate' : 'activate'} the lab.`
								}
							]}
						/>
					</ScrollableContainer>
				</div>
				<p class="mt-0 text-sm italic text-gray-400">
					Labs are the places where you can send your film to be developed and scanned. The usually
					process specific "<a href="/app/types-and-formats" class="text-gray-400">Film Types</a>".
					You can assign multiple film types to a lab. Later on, you can asing a lab to a dev detail
					for a roll.
				</p>
			</div>
			<hr class="divider mb-5 mt-5" />
			<div class="prose text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Scanners</h3>
					</div>
					<CreateComplexRecordDialog
						bind:open={isNewScannerDialogOpen}
						actionUrl="?/createScanner"
						title="Create Scanner"
						description="Create a new scanning device."
						successMessage="Scanner created successfully 🎉"
						invalidateKey="scanners"
						fields={[
							{
								id: 'name',
								label: 'Name',
								type: 'text',
								required: true,
								placeholder: 'Epson V600'
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
						<SimpleDataTable
							data={scanners}
							columns={[
								{ key: 'name', header: 'Name', type: 'text' },
								{ key: 'active', header: 'Status', type: 'badge' }
							]}
							actions={[
								{
									action: '?/toggleScanner',
									invalidateKey: 'scanners',
									getSuccessMessage: (item) =>
										`Scanner ${item.active ? 'inactivated' : 'activated'} successfully 🎉`,
									getLoadingMessage: (item) =>
										`${item.active ? 'Inactivating' : 'Activating'} scanner...`,
									getErrorMessage: (item) =>
										`An error occurred while trying to ${item.active ? 'inactivate' : 'activate'} the scanner.`
								}
							]}
						/>
					</ScrollableContainer>
				</div>
				<p class="mt-0 text-sm italic text-gray-400">
					Scanner devices are the machines that will scan your developed film. You can assign a
					scanner to a scan detail for a roll.
				</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>
