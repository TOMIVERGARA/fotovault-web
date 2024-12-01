<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types.js';
	import NewFilmStockForm from './(components)/NewFilmStockForm.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>new filmstock | fv</title>
</svelte:head>

<div class="flex justify-center">
	<Card.Root class="w-2/5">
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
