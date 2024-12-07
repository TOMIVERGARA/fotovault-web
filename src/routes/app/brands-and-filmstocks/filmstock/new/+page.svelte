<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types.js';
	import NewFilmStockForm from './(components)/NewFilmStockForm.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>new filmstock | fv</title>
</svelte:head>

<div class="flex flex-col justify-center">
	{#if !data.formats.length || !data.filmTypes.length}
		<Alert.Root variant="default" class="mx-auto mb-3 w-2/5">
			<CircleAlert class="h-4 w-4 stroke-red-500" />
			<Alert.Title class="text-red-500">No Formats or Film Types</Alert.Title>
			<Alert.Description>
				to create a filmstock you must have at least one film format and a film type to associate to
				the new stock. <a href="/app/types-and-formats" class="underline underline-offset-2"
					>click to create formats and filmtypes</a
				>
			</Alert.Description>
		</Alert.Root>
	{:else if !data.formats.length}
		<Alert.Root variant="default" class="mx-auto mb-3 w-2/5">
			<CircleAlert class="h-4 w-4 stroke-red-500" />
			<Alert.Title class="text-red-500">No Brands</Alert.Title>
			<Alert.Description>
				to create a filmstock you must have at least one brand to associate to the new stock. <a
					href="/app/brands-and-filmstock"
					class="underline underline-offset-2">click to create a brand</a
				>
			</Alert.Description>
		</Alert.Root>
	{/if}
	<Card.Root
		class="mx-auto w-2/5 {!data.formats.length || !data.filmTypes.length || !data.brands.length
			? 'text-zinc-400'
			: ''}"
	>
		<Card.Header>
			<Card.Title>Add a new filmstock</Card.Title>
			<Card.Description>
				Create a new filmstock with a format and film type for a specific brand.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<NewFilmStockForm
				data={data.form}
				brands={data.brands}
				formats={data.formats}
				filmTypes={data.filmTypes}
			/>
		</Card.Content>
	</Card.Root>
</div>
