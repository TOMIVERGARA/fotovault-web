<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { invalidate } from '$app/navigation';

	type Column = {
		key: string;
		header: string;
		type?: 'text' | 'badge' | 'number' | 'html'; // Agregamos 'html' como tipo
		class?: string;
		format?: (item: any) => string; // Función para formatear el contenido
	};

	type ActionConfig = {
		action: string;
		invalidateKey: string;
		getSuccessMessage: (item: any) => string;
		getLoadingMessage: (item: any) => string;
		getErrorMessage: (item: any) => string;
	};

	export interface TableProps {
		data: any[];
		columns: Column[];
		actions?: ActionConfig[];
		showStatus?: boolean;
		caption?: string;
	}

	let {
		data = [],
		columns = [],
		actions = [],
		showStatus = true,
		caption
	} = $props<{
		data: any[];
		columns: Column[];
		actions?: ActionConfig[];
		showStatus?: boolean;
		caption?: string;
	}>();

	const handleSubmit = (item: any, actionConfig: ActionConfig) => {
		toast.loading(actionConfig.getLoadingMessage(item));

		return async ({ result }: { result: { type: string; data?: any } }) => {
			if (result.type === 'success') {
				await invalidate(actionConfig.invalidateKey);
				toast.success(actionConfig.getSuccessMessage(item));
			} else if (result.type === 'failure') {
				console.log(result.data);
				toast.error(actionConfig.getErrorMessage(item));
			}
		};
	};
</script>

<Table.Root>
	<Table.Caption>
		{#if !data?.length}
			{caption || 'No items available'}
		{:else}
			{caption || `Showing ${data.length} of ${data.length} items`}
		{/if}
	</Table.Caption>

	<Table.Header>
		<Table.Row>
			{#each columns as column}
				<Table.Head>{column.header}</Table.Head>
			{/each}
			{#if actions?.length}
				<Table.Head>actions</Table.Head>
			{/if}
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data as item}
			<Table.Row>
				{#each columns as column}
					<Table.Cell class={column.class || 'font-medium'}>
						{#if column.type === 'badge'}
							<Badge variant="outline">{item[column.key] ? 'active' : 'inactive'}</Badge>
						{:else if column.type === 'html' && column.format}
							{@html column.format(item)} <!-- Renderizar HTML personalizado -->
						{:else}
							{item[column.key]}
						{/if}
					</Table.Cell>
				{/each}

				{#if actions?.length}
					<Table.Cell class="flex">
						{#each actions as actionConfig}
							<form
								method="POST"
								action={actionConfig.action}
								use:enhance={() => handleSubmit(item, actionConfig)}
							>
								<input type="hidden" name="id" value={item.id} />
								{#if item.active}
									<Button class="text-red-500" variant="link" type="submit">deactivate</Button>
								{:else}
									<Button class="text-green-500" variant="link" type="submit">activate</Button>
								{/if}
							</form>
						{/each}
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
