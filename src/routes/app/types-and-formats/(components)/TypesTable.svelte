<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Tables } from '$lib/types/supabase.types';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { invalidate } from '$app/navigation';

	let { filmtypes = [] } = $props<{
		filmtypes: Tables<'filmtype'>;
	}>();
</script>

<Table.Root>
	<Table.Caption>
		{#if !filmtypes?.length}
			no film types available
		{:else}
			film types list - showing {filmtypes.length} of {filmtypes.length}
		{/if}
	</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>name</Table.Head>
			<Table.Head>status</Table.Head>
			<Table.Head>actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each filmtypes as filmtype}
			<Table.Row>
				<Table.Cell class="font-medium">{filmtype.name}</Table.Cell>
				<Table.Cell>
					<Badge variant="outline">{filmtype.active ? 'active' : 'inactive'}</Badge>
				</Table.Cell>
				<Table.Cell class="flex">
					<form
						method="POST"
						action="?/toggleFilmtype"
						use:enhance={() => {
							const action = filmtype.active ? 'Inactivating' : 'Activating';
							toast.loading(`${action} filmtype...`);
							return async ({ result }) => {
								if (result.type === 'success') {
									await invalidate('filmtypes');
									toast.success(
										`Filmtype ${filmtype.active ? 'inactivated' : 'activated'} successfully 🎉`
									);
								} else if (result.type === 'failure') {
									console.log(result.data);
									toast.error(
										`An error occurred while trying to ${filmtype.active ? 'inactivate' : 'activate'} the filmtype.`
									);
								}
							};
						}}
					>
						<input type="hidden" name="id" value={filmtype.id} />
						{#if filmtype.active}
							<Button class="text-red-500" variant="link" type="submit">deactivate</Button>
						{:else}
							<Button class="text-green-500" variant="link" type="submit">activate</Button>
						{/if}
					</form>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
