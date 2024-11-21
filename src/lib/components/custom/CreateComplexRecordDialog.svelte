<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { FormField, ActionData } from '../../types/component.types';

	export let open = false;
	export let actionUrl: string;
	export let title = 'Create record';
	export let description = 'Create a new record.';
	export let successMessage = 'Record created successfully 🎉';
	export let invalidateKey: string;
	export let fields: FormField[] = [];
	export let existingData: { [key: string]: any } | null = null;

	let loading = false;
	let actionData: ActionData = null;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<slot name="trigger"></slot>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action={actionUrl}
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						open = false;
						await invalidate(invalidateKey);
						toast.success(successMessage);
					} else if (result.type === 'failure') {
						actionData = result.data as ActionData;
					}
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>{description}</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-4 py-4">
				{#each fields as field}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for={field.id} class="text-right">{field.label}</Label>
						<div class="col-span-3">
							<Input
								id={field.id}
								name={field.id}
								type={field.type}
								required={field.required}
								placeholder={field.placeholder}
								min={field.min}
								max={field.max}
								pattern={field.pattern}
								class={'col-span-3' + (actionData?.error?.[field.id] ? ' border-red-500' : '')}
								value={actionData?.values?.[field.id] || existingData?.[field.id] || ''}
							/>
						</div>
						{#if actionData?.error?.[field.id]}
							<div class="col-span-4 w-full text-right">
								<p class="mt-0 text-xs text-red-500">{actionData.error[field.id]}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
