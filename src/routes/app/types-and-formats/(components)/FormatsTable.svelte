<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Tables } from '$lib/types/supabase.types';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { invalidate } from '$app/navigation';

	let { formats: formats = [] } = $props<{
		formats: Tables<'format'>;
	}>();
</script>

<Table.Root>
	<Table.Caption>
		{#if !formats?.length}
			no film formats available
		{:else}
			film formats list - showing {formats.length} of {formats.length}
		{/if}
	</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>name</Table.Head>
			<Table.Head>width</Table.Head>
			<Table.Head>height</Table.Head>
			<Table.Head>status</Table.Head>
			<Table.Head>actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each formats as format}
			<Table.Row>
				<Table.Cell class="font-medium">{format.name}</Table.Cell>
				<Table.Cell class="font-medium">{format.width}</Table.Cell>
				<Table.Cell class="font-medium">{format.height}</Table.Cell>
				<Table.Cell>
					<Badge variant="outline">{format.active ? 'active' : 'inactive'}</Badge>
				</Table.Cell>
				<Table.Cell class="flex">
					<form
						method="POST"
						action="?/toggleFormat"
						use:enhance={() => {
							const action = format.active ? 'Inactivating' : 'Activating';
							toast.loading(`${action} format...`);
							return async ({ result }) => {
								if (result.type === 'success') {
									await invalidate('filmtypes');
									toast.success(
										`Format ${format.active ? 'inactivated' : 'activated'} successfully 🎉`
									);
								} else if (result.type === 'failure') {
									console.log(result.data);
									toast.error(
										`An error occurred while trying to ${format.active ? 'inactivate' : 'activate'} the format.`
									);
								}
							};
						}}
					>
						<input type="hidden" name="id" value={format.id} />
						{#if format.active}
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
