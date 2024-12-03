<script lang="ts">
	import { onMount } from 'svelte';
	import ImageWithLoader from './ImageWithLoader.svelte'; // Asegúrate de que la ruta sea correcta

	interface ImageData {
		name: string;
		url: string;
	}

	export let photoUrls: Record<string, string> = {};
	export let columnCount = 4;

	let columns: ImageData[][] = [];
	let containerWidth = 0;
	let containerRef: HTMLElement;

	// Convertir el objeto photoUrls a un array de ImageData
	$: images = Object.entries(photoUrls).map(([name, url]) => ({ name, url }));

	// Función para calcular la altura total de una columna
	function getColumnHeight(column: ImageData[]) {
		return column.length; // Simplificado ya que ImageWithLoader manejará el aspecto ratio
	}

	// Función para distribuir imágenes
	function distributeImages(imagesList: ImageData[]) {
		columns = Array.from({ length: columnCount }, () => []);

		imagesList.forEach((image) => {
			// Encontrar la columna con menor altura
			const columnHeights = columns.map(getColumnHeight);
			const minHeight = Math.min(...columnHeights);
			const targetColumnIndex = columnHeights.indexOf(minHeight);

			// Agregar imagen a la columna más corta
			columns[targetColumnIndex].push(image);
		});
	}

	// Observar cambios en el tamaño del contenedor
	function observeContainer() {
		const resizeObserver = new ResizeObserver((entries) => {
			containerWidth = entries[0].contentRect.width;
			if (containerWidth > 0) {
				distributeImages(images);
			}
		});

		resizeObserver.observe(containerRef);
		return () => resizeObserver.disconnect();
	}

	onMount(() => {
		distributeImages(images);
		return observeContainer();
	});

	// Reaccionar a cambios en photoUrls
	$: if (photoUrls) {
		distributeImages(images);
	}
</script>

<div
	bind:this={containerRef}
	class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
>
	{#each columns as column}
		<div class="grid gap-4">
			{#each column as image}
				<div class="overflow-hidden rounded-lg">
					<ImageWithLoader src={image.url} alt={image.name} />
				</div>
			{/each}
		</div>
	{/each}
</div>
