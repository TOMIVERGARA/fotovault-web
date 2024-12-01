<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types.js';
	import NewRollForm from './(components)/NewRollForm.svelte';
	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>new roll | fv</title>
</svelte:head>

<div class="flex justify-center">
	<Card.Root class="w-2/5">
		<Card.Header>
			<Card.Title>Create a new roll</Card.Title>
			<Card.Description>Create a new roll and optionally add a cover image.</Card.Description>
		</Card.Header>
		<Card.Content>
			<NewRollForm data={data.form} filmstocks={data.filmstocks} />
		</Card.Content>
	</Card.Root>
</div>
