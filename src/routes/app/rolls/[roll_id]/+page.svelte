<!-- src/routes/roll/[roll_id]/+page.svelte -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { signedUrlStore } from '$lib/stores/signedUrls';
	import type { PageData } from './$types';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import PhotoUploadZone from './(components)/PhotoUploadZone.svelte';
	import { invalidate } from '$app/navigation';
	import { Upload } from 'lucide-svelte';

	const { data } = $props<{ data: PageData }>();
	let { roll, photos } = $state(data);

	interface Photo {
		name: string;
		preview_name?: string;
		file_name: string;
		// Añade aquí otras propiedades que tenga tu objeto photo
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{roll.name.toLowerCase()} | fv</title>
</svelte:head>

<div class="flex gap-4">
	<!-- Card de Detalles del Roll -->
	<Card.Root class="flex h-[88vh] w-1/4 flex-col">
		<Card.Header class="flex flex-row items-center justify-between space-y-0">
			<div class="flex flex-col space-y-1.5">
				<Card.Title>{roll.name}</Card.Title>
				<Card.Description>{roll.description}</Card.Description>
			</div>
		</Card.Header>
		<Card.Content class="relative flex flex-1 flex-col">
			<div class="space-y-4">
				<Accordion.Root class="w-full">
					<Accordion.Item value="item-1">
						<Accordion.Trigger>filmstock information</Accordion.Trigger>
						<Accordion.Content>
							<div class="text-md mb-3 flex">
								{roll.brand_name}
								{roll.filmstock_name}
								{#if roll.iso}
									<Badge
										variant="outline"
										class="ml-2  {roll.iso < 250
											? 'border-blue-600 bg-blue-200 text-blue-600'
											: roll.iso < 450
												? 'border-orange-600 bg-orange-200 text-orange-600'
												: roll.is < 1650
													? 'border-purple-600 bg-purple-200 text-purple-600'
													: 'border-rose-600 bg-rose-200 text-rose-600'}">{roll.iso}iso</Badge
									>
								{/if}
							</div>
							<hr />
							<div class="mt-3 flex">
								<div class="w-1/2">
									<h3 class="font-semibold">format</h3>
									<p>{roll.format_name}</p>
								</div>
								<div class="w-1/2">
									<h3 class="font-semibold">filmtype</h3>
									<p>{roll.filmtype_name}</p>
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-2">
						<Accordion.Trigger>dev details</Accordion.Trigger>
						<Accordion.Content>
							Yes. It comes with default styles that matches the other components' aesthetic.
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-3">
						<Accordion.Trigger>scan details</Accordion.Trigger>
						<Accordion.Content>
							Yes. It's animated by default, but you can disable it if you prefer.
						</Accordion.Content>
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
		rollId={roll.id}
		containerName={roll.storage_container_name}
		existingPhotos={photos}
		on:photoUploaded={() => {
			invalidate(`/api/rolls/${roll.id}`);
		}}
	/>
</div>
