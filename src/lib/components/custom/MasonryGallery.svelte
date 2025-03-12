<script lang="ts">
	import { onMount } from 'svelte';
	import ImageWithLoader from './ImageWithLoader.svelte';

	interface ImageData {
		name: string;
		url: string;
	}

	export let photoUrls: Record<string, string> = {};
	export let columnCount = 4;

	let columns: ImageData[][] = [];
	let containerWidth = 0;
	let containerRef: HTMLElement;

	$: images = Object.entries(photoUrls).map(([name, url]) => ({ name, url }));

	function getColumnHeight(column: ImageData[]) {
		return column.length;
	}

	function distributeImages(imagesList: ImageData[]) {
		columns = Array.from({ length: columnCount }, () => []);

		imagesList.forEach((image) => {
			const columnHeights = columns.map(getColumnHeight);
			const minHeight = Math.min(...columnHeights);
			const targetColumnIndex = columnHeights.indexOf(minHeight);
			columns[targetColumnIndex].push(image);
		});
	}

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

	$: if (photoUrls) {
		distributeImages(images);
	}
</script>

<div
	bind:this={containerRef}
	class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
>
	{#each columns as column}
		<div class="grid auto-rows-min gap-4">
			{#each column as image}
				<div class="w-full overflow-hidden rounded-lg">
					<ImageWithLoader src={image.url} alt={image.name} />
				</div>
			{/each}
		</div>
	{/each}
</div>
