<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Upload, X, Check } from 'lucide-svelte';
	import { signedUrlStore } from '$lib/stores/signedUrls';
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
	let showCompleted = $state(false);

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

	// Manejadores de eventos del dropzone
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		// Solo desactivamos si salimos del contenedor principal
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;

		if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
			dragActive = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;

		if (e.dataTransfer?.files) {
			handleFiles(Array.from(e.dataTransfer.files));
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = true;
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			handleFiles(Array.from(input.files));
		}
	}

	// Modificamos la función handleFiles para iniciar la cola
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

		// Iniciamos la cola de procesamiento
		processUploadQueue();
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

	async function processUploadQueue() {
		if (!uploads.length || uploads.every((u) => u.status === 'completed' || u.status === 'error')) {
			if (uploads.length > 0 && uploads.every((u) => u.status === 'completed')) {
				showCompleted = true;
				setTimeout(() => {
					showCompleted = false;
					uploads = [];
				}, 5000);
			}
			return;
		}

		const index = uploads.findIndex((u) => u.status === 'pending');
		if (index === -1) return;

		await uploadFile(index);
		processUploadQueue();
	}

	async function uploadFile(index: number) {
		const upload = uploads[index];
		const fileName = `${Date.now()}-${upload.file.name}`;
		const previewName = fileName.replace(/\.[^/.]+$/, '.webp');

		const originalPath = `${containerName}/${fileName}`;
		const previewPath = `${containerName}/previews/${previewName}`;

		try {
			// Primero subimos el original
			uploads[index].status = 'uploading_original';
			uploads[index].progress = { original: 0, preview: 0 };

			await uploadWithProgress(upload.file, originalPath, (progress) => {
				uploads[index].progress.original = progress;
			});

			// Después generamos y subimos el preview
			uploads[index].status = 'uploading_preview';
			uploads[index].progress = { original: 100, preview: 0 };

			const previewBlob = await generatePreview(upload.file);
			await uploadWithProgress(previewBlob, previewPath, (progress) => {
				uploads[index].progress.preview = progress;
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

	function removeUpload(index: number) {
		const upload = uploads[index];
		if (upload.status === 'uploading_preview' || upload.status === 'uploading_original') {
			toast.error("Can't remove an active upload");
			return;
		}
		uploads = uploads.filter((_, i) => i !== index);
		toast.success(`Removed ${upload.file.name} from the list`);
	}

	function truncateFileName(fileName: string, maxLength: number = 10): string {
		if (fileName.length <= maxLength) return fileName;
		const extension = fileName.split('.').pop();
		const name = fileName.substring(0, maxLength);
		return `${name}...${extension ? `${extension}` : ''}`;
	}

	$effect(() => {
		loadExistingPhotoUrls();
	});
</script>

<Card.Root
	class="relative w-3/4"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
>
	{#if dragActive}
		<div
			class="pointer-events-none absolute inset-0 z-50 rounded-lg border-2 border-dashed border-primary bg-primary/25"
		>
			<div class="flex h-full w-full flex-col space-y-1 text-center">
				<div class="mx-auto mt-6 flex items-center">
					<Upload class="mr-2 h-8 w-8" />
					<div class="flex flex-col text-left">
						<span class="text-sm font-medium"> drop your photos here to start the upload... </span>
						<span class="text-xs italic"> supported formats: .jpg/.png/.webp - max 10MB. </span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Card.Header y Card.Content existentes sin cambios -->
	<Card.Header class="flex flex-row items-center justify-between space-y-0">
		<div class="flex flex-col space-y-1.5 {!dragActive || 'opacity-0'}">
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
							{#if showCompleted}
								<Check class="mr-1 h-5 w-5 text-green-500" />
								<span class="mt-0.5 animate-pulse text-sm text-green-500">done</span>
							{:else}
								<Spinner />
								<span class="mt-0.5 animate-pulse text-sm">uploading</span>
							{/if}
						</div>
					</HoverCard.Trigger>
					<HoverCard.Content class="max-h-96 w-96 overflow-y-auto">
						<div class="space-y-3">
							{#each uploads as upload, i}
								<div class="flex items-center gap-3 rounded-lg border p-3" transition:fade>
									{#if upload.status !== 'completed'}
										<RadialProgress
											value={upload.status === 'uploading_preview'
												? upload.progress.preview
												: upload.progress.original}
										/>
									{:else}
										<Check class="h-5 w-5 animate-pulse text-green-500" />
									{/if}

									<div class="flex-1">
										<div class="flex items-center justify-between">
											<span class="flex items-center gap-2 text-sm font-medium">
												{truncateFileName(upload.file.name)}
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
		<Button
			on:click={() => document.getElementById('file-upload')?.click()}
			class="rounded-full {!dragActive || 'opacity-0'}"
			><Upload class="mr-2 h-4 w-4" /> upload photos</Button
		>
	</Card.Header>
	<Card.Content class="h-auto">
		<div class="h-full space-y-4">
			<input
				type="file"
				id="file-upload"
				multiple
				accept="image/*"
				class="hidden"
				onchange={handleFileInput}
			/>

			<!-- Photo Grid -->
			{#if Object.keys(photoUrls).length > 0}
				<MasonryGallery {photoUrls} />
			{:else}
				<Skeleton class="h-[70vh] w-full transition-opacity duration-500" />
			{/if}
		</div>
	</Card.Content>
</Card.Root>
