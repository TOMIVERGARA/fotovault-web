<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { rollFormSchema, type RollFormSchema } from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ImagePlus, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import FilmstockCombobox from './FilmstockCombobox.svelte';

	type Props = {
		data: SuperValidated<Infer<RollFormSchema>>;
		filmstocks: Array<{
			id: string;
			name: string;
			brand_name: string; // Cambiado de brand.name a brand_name
			iso: number;
			active: boolean;
			format_name: string;
		}>;
	};

	let { data, filmstocks = [] }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(rollFormSchema),
		onSubmit: async (data) => {
			console.log('Data being sent:', data.formData); // Asegúrate de que `filmstockId` esté presente aquí.
			return true; // Permite continuar con el envío.
		},
		onResult: async ({ result }) => {
			console.log('Form data being submitted:', $formData); // Verifica el contenido aquí

			if (result.type === 'success') {
				toast.success('new roll created successfully 🤩');
				await goto('/app/dashboard');
			} else if (result.type === 'error') {
				toast.error(result.error?.message || 'failed to create roll ❌');
			}
		},
		resetForm: true,
		taintedMessage: null
	});

	const { form: formData, enhance, submitting, errors } = form;

	let imagePreview: string | null = $state(null);

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			$formData.coverImage = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	$inspect($formData);
</script>

<form method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
	<fieldset disabled={$submitting} class="space-y-6">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>roll name</Form.Label>
				<Input {...attrs} placeholder="Summer 2024" bind:value={$formData.name} />
			</Form.Control>
			<Form.Description class="text-xs">give your roll a memorable name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="description">
			<Form.Control let:attrs>
				<Form.Label
					>description <span class="font-normal text-zinc-500">(optional)</span></Form.Label
				>
				<Textarea
					{...attrs}
					placeholder="Write some notes about this roll..."
					bind:value={$formData.description}
				/>
			</Form.Control>
			<Form.Description class="text-xs"
				>add some notes or description for this roll.</Form.Description
			>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="filmstockId">
			<Form.Control let:attrs>
				<Form.Label>filmstock</Form.Label>
				<FilmstockCombobox
					{filmstocks}
					{formData}
					{...attrs}
					bind:value={$formData.filmstockId}
					error={!!$errors.filmstockId}
				/>
			</Form.Control>
			<Form.Description class="text-xs">select the filmstock used for this roll.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="coverImage">
			<Form.Control let:attrs>
				<Form.Label
					>cover image <span class="font-normal text-zinc-500">(optional)</span></Form.Label
				>
				<div class="flex items-center gap-4">
					<label
						class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
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
							required
							onchange={handleImageChange}
						/>
					</label>
				</div>
			</Form.Control>
			<Form.Description class="text-xs">
				upload a cover image for your roll. This image will also be added to your roll's photos.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<div class="flex w-full">
			<Form.Button class="ml-auto" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Creating...
				{:else}
					Create roll
				{/if}
			</Form.Button>
		</div>
	</fieldset>
</form>
