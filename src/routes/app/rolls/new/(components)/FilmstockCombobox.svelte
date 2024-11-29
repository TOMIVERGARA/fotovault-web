<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { Loader2 } from 'lucide-svelte';
	import { tick, onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as Form from '$lib/components/ui/form';
	import type { SuperFormData } from 'sveltekit-superforms/client';

	export let filmstocks: {
		id: string;
		name: string;
		brand_name: string;
		iso: number;
		active: boolean;
		format_name: string;
	}[] = [];

	export let value: string = '';
	export let error: boolean = false;
	export let formData: SuperFormData<{
		name: string;
		filmstockId: string;
		description?: string | null | undefined;
		coverImage?: File | undefined;
	}>;

	let open = false;
	let mounted = false;
	let loading = true;

	onMount(() => {
		mounted = true;
		loading = false;
	});

	$: validFilmstocks =
		mounted && Array.isArray(filmstocks)
			? filmstocks.filter((f) => f && f.id && f.name && f.brand_name)
			: [];

	$: options = validFilmstocks.map((f) => ({
		value: f.id,
		label: `${f.brand_name} ${f.name} ${f.iso}ISO (${f.format_name})`
	}));

	$: selectedValue =
		value && options.length > 0
			? (options.find((f) => f.value === value)?.label ?? 'Select a filmstock...')
			: 'Select a filmstock...';

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Form.Control let:attrs>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class={cn('w-full justify-between', error && 'border-destructive', 'text-left font-normal')}
				disabled={loading}
			>
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Loading filmstocks...
				{:else}
					{selectedValue}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				{/if}
			</Button>
		</Popover.Trigger>
		<input hidden value={$formData.filmstockId} name={attrs.name} />
	</Form.Control>
	{#if open}
		<Popover.Content class="w-[--width-of-trigger] p-0">
			<Command.Root>
				<Command.Input placeholder="Search filmstock..." />
				{#if loading}
					<div class="p-4 text-center text-sm text-muted-foreground">
						<Loader2 class="mr-2 inline h-4 w-4 animate-spin" />
						Loading...
					</div>
				{:else if options.length === 0}
					<Command.Empty>No filmstock found.</Command.Empty>
				{:else}
					<Command.Group>
						{#each options as option}
							<Command.Item
								bind:value={option.value}
								onSelect={(currentValue) => {
									value = currentValue;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								<Check class={cn('mr-2 h-4 w-4', value !== option.value && 'text-transparent')} />
								{option.label}
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.Root>
		</Popover.Content>
	{/if}
</Popover.Root>
