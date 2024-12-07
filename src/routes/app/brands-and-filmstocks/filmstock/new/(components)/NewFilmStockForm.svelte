<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { formSchema, type FormSchema } from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ImagePlus, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	type Props = {
		data: SuperValidated<Infer<FormSchema>>;
		brands: Array<{ id: string; name: string }>;
		formats: Array<{ id: string; name: string }>;
		filmTypes: Array<{ id: string; name: string }>;
	};

	let { data, brands = [], formats = [], filmTypes = [] }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onResult: async ({ result }) => {
			// Manejar el resultado
			if (result.type === 'success') {
				toast.success('Filmstock created successfully');
				await goto('/app/brands-and-filmstocks');
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'Failed to create filmstock');
			}
		},
		resetForm: true,
		taintedMessage: null
	});

	const { form: formData, enhance, submitting } = form;

	// Define tipos correctos que coincidan con Selected de bits-ui
	type SelectionValue = string;
	type Selection =
		| {
				label: string;
				value: SelectionValue;
		  }
		| undefined;

	let selectedBrand: Selection = $state(undefined);
	let selectedFormat: Selection = $state(undefined);
	let selectedFilmType: Selection = $state(undefined);

	let imagePreview: string | null = $state(null);

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			$formData.image = file;
			// Crear preview
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	$effect(() => {
		selectedBrand = $formData.brandId
			? {
					label: brands.find((b) => b.id === $formData.brandId)?.name || '',
					value: $formData.brandId
				}
			: undefined;

		selectedFormat = $formData.formatId
			? {
					label: formats.find((f) => f.id === $formData.formatId)?.name || '',
					value: $formData.formatId
				}
			: undefined;

		selectedFilmType = $formData.filmTypeId
			? {
					label: filmTypes.find((ft) => ft.id === $formData.filmTypeId)?.name || '',
					value: $formData.filmTypeId
				}
			: undefined;
	});
</script>

<form method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
	<fieldset
		disabled={$submitting || !formats.length || !filmTypes.length || !brands.length}
		class="space-y-6"
	>
		<div class="flex gap-4">
			<Form.Field {form} name="name" class="w-3/4">
				<Form.Control let:attrs>
					<Form.Label>filmstock name</Form.Label>
					<Input {...attrs} placeholder="Portra" bind:value={$formData.name} />
				</Form.Control>
				<Form.Description class="text-xs">enter the name of the film stock.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="iso" class="">
				<Form.Control let:attrs>
					<Form.Label>iso</Form.Label>
					<Input {...attrs} type="number" placeholder="160" bind:value={$formData.iso} />
				</Form.Control>
				<Form.Description class="text-xs">enter the iso value.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="brandId">
			<Form.Control let:attrs>
				<Form.Label>brand</Form.Label>
				<Select.Root
					selected={selectedBrand}
					onSelectedChange={(s) => {
						if (s) {
							$formData.brandId = s.value;
						}
					}}
				>
					<Select.Input name={attrs.name} />
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="select a brand" />
					</Select.Trigger>
					<Select.Content>
						{#each brands as brand}
							<Select.Item value={brand.id} label={brand.name} />
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.Description class="text-xs">select the brand of the film stock.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<div class="grid grid-cols-2 gap-4">
			<Form.Field {form} name="formatId">
				<Form.Control let:attrs>
					<Form.Label>format</Form.Label>
					<Select.Root
						selected={selectedFormat}
						onSelectedChange={(s) => {
							if (s) {
								$formData.formatId = s.value;
							}
						}}
					>
						<Select.Input name={attrs.name} />
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="select a format" />
						</Select.Trigger>
						<Select.Content>
							{#each formats as format}
								<Select.Item value={format.id} label={format.name} />
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.Description class="text-xs">select the format of the film stock.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="filmTypeId">
				<Form.Control let:attrs>
					<Form.Label>film type</Form.Label>
					<Select.Root
						selected={selectedFilmType}
						onSelectedChange={(s) => {
							if (s) {
								$formData.filmTypeId = s.value;
							}
						}}
					>
						<Select.Input name={attrs.name} />
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="select a film type" />
						</Select.Trigger>
						<Select.Content>
							{#each filmTypes as filmType}
								<Select.Item value={filmType.id} label={filmType.name} />
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.Description class="text-xs">select the type of film.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Field {form} name="image">
			<Form.Control let:attrs>
				<Form.Label
					>film box/cartridge logo <span class="font-normal text-zinc-500">(optional)</span
					></Form.Label
				>
				<div class="flex items-center gap-4">
					<label
						class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						{#if imagePreview}
							<img
								src={imagePreview}
								alt="Preview"
								class="h-full w-full rounded-lg object-contain p-2"
							/>
						{:else}
							<div class="flex flex-col items-center justify-center pb-6 pt-5">
								<ImagePlus class="mb-2 h-8 w-8 text-gray-500" />
								<p class="text-xs text-gray-500 dark:text-gray-400">click to upload</p>
							</div>
						{/if}
						<input
							{...attrs}
							type="file"
							accept="image/*"
							class="hidden"
							onchange={handleImageChange}
						/>
					</label>
				</div>
			</Form.Control>
			<Form.Description class="text-xs"
				>Upload a logo for the film stock: <i
					>you can pick a box or a cartridge image to help you more easily recognize the film.</i
				> You should try to use PNGs with a transparent background for best results. If you don't upload
				an image, a generic film logo will be used.</Form.Description
			>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex w-full">
			<Form.Button class="ml-auto" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Creating...
				{:else}
					Create filmstock
				{/if}
			</Form.Button>
		</div>
	</fieldset>
</form>
