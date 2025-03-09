<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { FormField, ActionData } from '../../types/component.types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let actionUrl: string;
	export let title = 'Create record';
	export let description = 'Create a new record.';
	export let successMessage = 'Record created successfully 🎉';
	export let invalidateKey: string;
	export let fields: any[] = [];
	export let width: string = 'sm:max-w-[425px]';
	export let existingData: { [key: string]: any } | null = null;

	export let onSuccess: ((data: any) => void) | null = null;

	let loading = false;
	let actionData: ActionData = null;

	function getInitialValue(field: FormField) {
		if (field.type === 'select' && field.multiple) {
			return existingData?.[field.id] || [];
		}
		return existingData?.[field.id] || '';
	}

	function handleCustomFieldUpdate(fieldId: string, value: any) {
		dispatch('fieldupdate', { fieldId, value });
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<slot name="trigger" />
	</Dialog.Trigger>
	<Dialog.Content class={width}>
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

						if (onSuccess) {
							onSuccess(result.data);
						}
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
						{#if field.type === 'select'}
							<Label for={field.id} class="text-right">{field.label}</Label>
							<div class="col-span-3">
								<select
									id={field.id}
									name={field.id}
									class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									required={field.required}
									multiple={field.multiple}
									value={actionData?.values?.[field.id] ||
										existingData?.[field.id] ||
										(field.multiple ? [] : '')}
								>
									{#if field.placeholder}
										<option value="" disabled>{field.placeholder}</option>
									{/if}
									{#each field.options || [] as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</div>
						{:else if field.type === 'custom'}
							<div class="col-span-4 w-full">
								<svelte:component
									this={field.component}
									id={field.id}
									name={field.id}
									value={actionData?.values?.[field.id] || existingData?.[field.id] || ''}
									on:update={(e: { detail: any }) => {
										handleCustomFieldUpdate(field.id, e.detail);
										if (field.onSave) field.onSave(e.detail);
									}}
								/>
							</div>
						{:else}
							{#if field.type != 'hidden'}
								<Label for={field.id} class="text-right">{field.label}</Label>
							{/if}
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
									checked={field.type === 'checkbox'
										? actionData?.values?.[field.id] || existingData?.[field.id]
										: undefined}
									value={field.type !== 'checkbox'
										? actionData?.values?.[field.id] || existingData?.[field.id] || ''
										: undefined}
								/>
							</div>
						{/if}

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
