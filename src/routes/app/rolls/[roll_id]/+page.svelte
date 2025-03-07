<!-- src/routes/roll/[roll_id]/+page.svelte -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { ActionData, PageData } from './$types';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import PhotoUploadZone from './(components)/PhotoUploadZone.svelte';
	import { invalidate } from '$app/navigation';
	import FilmstockDetails from './(components)/FilmstockDetails.svelte';
	import DevDetails from './(components)/DevDetails.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	const { data } = $props<{ data: PageData }>();
	let { roll, photos, labs, devDetail, scanDetail } = $state(data);

	let isEditingDescription = $state(false);
	let loading = $state(false);
	let newDescription = $state(roll?.description || '');

	$inspect(isEditingDescription);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Función para manejar el evento keydown en el textarea

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			const textarea = event.currentTarget as HTMLTextAreaElement;
			const form = textarea.form; // Accedemos al formulario desde el textarea
			form?.requestSubmit();
			roll.description = newDescription;
			isEditingDescription = false;
		}
	}
</script>

<svelte:head>
	<title>{roll?.name?.toLowerCase() || 'Untitled roll'} | fv</title>
</svelte:head>

<div class="flex gap-4">
	<!-- Card de Detalles del Roll -->
	<Card.Root class="flex min-h-[88vh] w-1/4 flex-col">
		<Card.Header class="flex flex-row items-center justify-between space-y-0">
			<div class="flex w-full flex-col space-y-1.5">
				<Card.Title>{roll?.name || 'Loading...'}</Card.Title>
				{#if isEditingDescription}
					<form
						method="POST"
						action="?/updateDescription"
						use:enhance={() => {
							loading = true;
							return async ({ result }) => {
								loading = false;
								if (result.type === 'success') {
									await invalidate('description');
									toast.success('descrition updated succesfully');
								} else if (result.type === 'failure') {
									toast.error('error updating description...');
								}
							};
						}}
					>
						<textarea
							class="w-full text-sm text-muted-foreground placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground"
							bind:value={newDescription}
							placeholder="type your new description here, when you are done press enter."
							rows="3"
							onkeydown={handleKeydown}
							name="description"
						></textarea>
						<input type="hidden" name="roll_id" value={roll.id} />
					</form>
				{:else}
					<Card.Description on:click={() => (isEditingDescription = true)} class="w-full">
						<Tooltip.Root openDelay={10}>
							<Tooltip.Trigger>
								<span onclick={() => (isEditingDescription = true)} class="w-full">
									{roll?.description || 'this roll does not have a description. click to edit.'}
								</span>
							</Tooltip.Trigger>
							<Tooltip.Content side="right" sideOffset={10}>
								<p class="text-xs">click to edit</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Card.Description>
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="relative flex flex-1 flex-col">
			<div class="mb-10 space-y-4">
				<Accordion.Root class="w-full">
					<Accordion.Item value="item-1">
						<Accordion.Trigger>filmstock information</Accordion.Trigger>
						<Accordion.Content>
							<FilmstockDetails {roll} />
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-2">
						<Accordion.Trigger>dev details</Accordion.Trigger>
						<Accordion.Content>
							<DevDetails {labs} {devDetail} />
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-3">
						<Accordion.Trigger>scan details</Accordion.Trigger>
						<Accordion.Content>this feature is yet to be implemented 🚧</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</div>
			<div class="mt-auto text-xs">
				<h3 class="font-semibold">created</h3>
				<p>{formatDate(roll.created_at)}</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Card de Fotos -->
	<PhotoUploadZone
		supabase={data.supabase}
		rollId={roll?.id}
		containerName={roll?.storage_container_name}
		existingPhotos={photos}
		on:photoUploaded={() => {
			invalidate(`/api/rolls/${roll?.id}`);
		}}
	/>
</div>
