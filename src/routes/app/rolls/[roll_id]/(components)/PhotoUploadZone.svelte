<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Progress } from '$lib/components/ui/progress';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Upload, X, Check } from 'lucide-svelte';
	import { signedUrlStore } from '$lib/stores/signedUrls';
	import ImageWithLoader from '$lib/components/custom/ImageWithLoader.svelte';
	import { toast } from 'svelte-sonner';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/types/supabase.types';
	import RadialProgress from '$lib/components/custom/RadialProgress.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import Spinner from '$lib/components/custom/Spinner.svelte';
	import MasonryGallery from '$lib/components/custom/MasonryGallery.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	const dispatch = createEventDispatcher();

	const {
		supabase,
		rollId,
		containerName,
		existingPhotos = []
	} = $props<{
		supabase: SupabaseClient<Database>;
		rollId: string;
		containerName: string;
		existingPhotos: {
			name: string;
			file_name: string;
			preview_name?: string;
		}[];
	}>();

	// Estados
	let dragActive = $state(false);
	let uploads = $state<
		{
			file: File;
			progress: { original: number; preview: number };
			status: 'pending' | 'uploading_preview' | 'uploading_original' | 'completed' | 'error';
			error?: string;
		}[]
	>([]);
	let photoUrls = $state<{ [key: string]: string }>({});

	// Función para generar preview en WebP
	async function generatePreview(file: File): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				// Target width for preview (thumbnail size)
				const TARGET_SIZE = 600; // Tamaño máximo en cualquier dimensión

				// Calculamos dimensiones manteniendo aspect ratio original
				let width = img.width;
				let height = img.height;

				// Escalamos la dimensión más grande a TARGET_SIZE
				if (width > height) {
					height = Math.round((height * TARGET_SIZE) / width);
					width = TARGET_SIZE;
				} else {
					width = Math.round((width * TARGET_SIZE) / height);
					height = TARGET_SIZE;
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');
				if (!ctx) return reject(new Error('Could not get canvas context'));

				// Aplicamos un pequeño suavizado para reducir artefactos
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'medium';

				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						if (blob) resolve(blob);
						else reject(new Error('Could not generate preview'));
					},
					'image/webp',
					0.75 // calidad reducida para menor tamaño
				);
			};
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});
	}

	// Cargar URLs firmadas para fotos existentes
	async function loadExistingPhotoUrls() {
		const previewPaths = existingPhotos.map((photo: { preview_name: any; name: string }) => {
			const previewName = photo.preview_name || photo.name.replace(/\.[^/.]+$/, '.webp');
			return `${containerName}/previews/${previewName}`;
		});

		try {
			const urls = await signedUrlStore.getBatchPreviews(previewPaths);
			photoUrls = Object.fromEntries(
				Object.entries(urls)
					.filter(([_, url]) => url !== null)
					.map(([path, url]) => {
						const fileName = path.split('/').pop()?.replace('.webp', '') || '';
						return [fileName, url as string];
					})
			);
		} catch (error) {
			console.error('Error loading preview URLs:', error);
		}
	}

	$effect(() => {
		loadExistingPhotoUrls();
	});

	// Manejadores de eventos del dropzone
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;

		if (e.dataTransfer?.files) {
			handleFiles(Array.from(e.dataTransfer.files));
		}
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			handleFiles(Array.from(input.files));
		}
	}

	// Procesar archivos
	function handleFiles(files: File[]) {
		const imageFiles = files.filter((file) => file.type.startsWith('image/'));

		if (imageFiles.length === 0) {
			toast.error('Please select only image files');
			return;
		}

		uploads = [
			...uploads,
			...imageFiles.map((file) => ({
				file,
				progress: { original: 0, preview: 0 },
				status: 'pending' as const
			}))
		];

		toast.success(`Started uploading ${imageFiles.length} images`);

		// Comenzar uploads
		uploads.forEach((upload, index) => {
			if (upload.status === 'pending') {
				uploadFile(index);
			}
		});
	}

	async function uploadWithProgress(
		file: Blob,
		path: string,
		onProgress: (progress: number) => void
	): Promise<void> {
		const {
			data: { signedUrl }
		} = await supabase.storage.from('rolls').createSignedUploadUrl(path);

		if (!signedUrl) throw new Error('Failed to get upload URL');

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					onProgress((event.loaded / event.total) * 100);
				}
			};

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve();
				} else {
					reject(new Error(`Upload failed with status ${xhr.status}`));
				}
			};

			xhr.onerror = () => reject(new Error('Upload failed'));
			xhr.open('PUT', signedUrl);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.send(file);
		});
	}

	async function uploadFile(index: number) {
		const upload = uploads[index];
		const fileName = `${Date.now()}-${upload.file.name}`;
		const previewName = fileName.replace(/\.[^/.]+$/, '.webp');

		const originalPath = `${containerName}/${fileName}`;
		const previewPath = `${containerName}/previews/${previewName}`;

		try {
			// Generar y subir preview
			uploads[index].status = 'uploading_preview';
			uploads[index].progress = { original: 0, preview: 0 }; // Reseteamos el progreso

			const previewBlob = await generatePreview(upload.file);
			await uploadWithProgress(previewBlob, previewPath, (progress) => {
				uploads[index].progress.preview = progress;
			});

			// Subir original
			uploads[index].status = 'uploading_original';
			uploads[index].progress = { original: 0, preview: 100 }; // Reseteamos el progreso del original
			await uploadWithProgress(upload.file, originalPath, (progress) => {
				uploads[index].progress.original = progress;
			});

			// Registrar en la base de datos
			const { error: dbError } = await supabase.from('photo').insert([
				{
					roll: rollId,
					name: fileName,
					file_name: upload.file.name,
					file_size: upload.file.size,
					file_type: upload.file.type,
					preview_name: previewName
				}
			]);

			if (dbError) throw dbError;

			uploads[index].status = 'completed';
			dispatch('photoUploaded', { fileName, previewName });

			// Obtener y almacenar URLs firmadas
			const previewUrl = await signedUrlStore.getBatchPreviews([previewPath]);
			if (previewUrl[previewPath]) {
				photoUrls[fileName] = previewUrl[previewPath];
			}

			toast.success(`Successfully uploaded ${upload.file.name}`);
		} catch (error: any) {
			uploads[index].status = 'error';
			uploads[index].error = error.message;
			toast.error(`Failed to upload ${upload.file.name}: ${error.message}`);
		}
	}

	// Eliminar upload de la lista
	function removeUpload(index: number) {
		const upload = uploads[index];
		if (upload.status === 'uploading_preview' || upload.status === 'uploading_original') {
			toast.error("Can't remove an active upload");
			return;
		}
		uploads = uploads.filter((_, i) => i !== index);
		toast.success(`Removed ${upload.file.name} from the list`);
	}
</script>

<Card.Root class="w-3/4">
	<Card.Header class="flex flex-row items-center justify-between space-y-0">
		<div class="flex flex-col space-y-1.5">
			<Card.Title>Photos</Card.Title>
			<Card.Description>
				{existingPhotos.length} photos in this roll
			</Card.Description>
		</div>
		{#if uploads.length > 0}
			<div class="ml-auto mr-4">
				<HoverCard.Root>
					<HoverCard.Trigger class="text-zinc-500">
						<div class="flex items-center justify-center">
							<Spinner />
							<span class="mt-0.5 animate-pulse text-sm">uploading</span>
						</div>
					</HoverCard.Trigger>
					<HoverCard.Content class="max-h-96 w-96 overflow-y-auto">
						<div class="space-y-3">
							{#each uploads as upload, i}
								<div class="flex items-center gap-3 rounded-lg border p-3" transition:fade>
									<!-- Progreso radial -->
									{#if upload.status !== 'completed'}
										<RadialProgress
											value={upload.status === 'uploading_preview'
												? upload.progress.preview
												: upload.progress.original}
										/>
									{:else}
										<Check class="h-5 w-5 text-green-500" />
									{/if}

									<div class="flex-1">
										<div class="flex items-center justify-between">
											<span class="flex items-center gap-2 text-sm font-medium">
												{upload.file.name}
												{#if upload.status === 'completed'}
													<div class="flex items-center gap-1 text-xs text-green-500">
														<span>upload complete</span>
													</div>
												{:else if upload.status === 'uploading_preview'}
													<div class="text-xs text-zinc-500">
														upl. preview ({upload.progress.preview.toFixed(0)}%)
													</div>
												{:else if upload.status === 'uploading_original'}
													<div class="text-xs text-zinc-500">
														upl. original ({upload.progress.original.toFixed(0)}%)
													</div>
												{/if}
											</span>
											<Button
												variant="ghost"
												on:click={() => removeUpload(i)}
												class="rounded-full p-1"
												disabled={upload.status === 'uploading_preview' ||
													upload.status === 'uploading_original'}
											>
												<X class="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</div>
		{/if}
		<Button>upload photos</Button>
	</Card.Header>
	<Card.Content class="h-auto">
		<div class="h-full space-y-4">
			<!-- Dropzone -->
			<div
				class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-all
				{dragActive ? 'border-primary bg-primary/5' : ''}"
				on:dragenter={handleDragEnter}
				on:dragleave={handleDragLeave}
				on:dragover|preventDefault
				on:drop={handleDrop}
			>
				<input
					type="file"
					id="file-upload"
					multiple
					accept="image/*"
					class="hidden"
					on:change={handleFileInput}
				/>

				<label
					for="file-upload"
					class="flex cursor-pointer flex-col items-center justify-center gap-2"
				>
					<Upload class="h-10 w-10 text-gray-400" />
					<span class="text-sm text-gray-600">Drag and drop images or click to upload</span>
				</label>
			</div>

			<!-- Photo Grid -->
			{#if Object.keys(photoUrls).length > 0}
				<MasonryGallery {photoUrls} />
			{:else}
				<Skeleton class="h-[55vh] w-full transition-opacity duration-500" />
			{/if}
		</div>
	</Card.Content>
</Card.Root>
