<script lang="ts">
	import { browser } from '$app/environment';
	import ShadEditor from '$lib/components/shad-editor/shad-editor.svelte';
	import { writable } from 'svelte/store';
	import { Label } from '../ui/label';
	import { Separator } from '../ui/separator';

	export let name: string;
	export let value: string = '';

	// Inicializar el store con el valor inicial
	let localStorageContent = '';
	if (browser) {
		localStorageContent = localStorage.getItem('content') || value;
	}
	const content = writable(localStorageContent);

	// Sincronizar el store con localStorage y la prop `value`
	content.subscribe((newValue) => {
		value = newValue; // Actualiza la prop `value`
		if (browser) {
			localStorage.setItem('content', newValue);
		}
	});
</script>

<!-- Input hidden para el formulario -->
<input type="hidden" {name} value={$content} />

<!-- Interfaz del editor -->
<div class="justify-left items-left mx-auto flex w-full flex-col">
	<Separator />
	<Label class="mb-3 mt-5 text-left text-lg">Notes</Label>
	<ShadEditor class="h-[10rem] w-full min-w-full" bind:content={$content} showToolbar={true} />
</div>
