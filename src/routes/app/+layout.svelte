<script lang="ts">
	import Sidebar from './(components)/Sidebar.svelte'; // Sidebar común
	import Header from './(components)/Header.svelte'; // Header común
	import { Toaster } from '$lib/components/ui/sonner';
	import { profileStore } from '$lib/stores/profiles';
	import * as Dialog from '$lib/components/ui/dialog/';
	import { mode } from 'mode-watcher';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	const { children, data } = $props();

	let isLoading = $state(true);
	let showModal = $state(false);

	onMount(async () => {
		// Primero, actualizamos el store con los datos de data.profile
		profileStore.set(data.profile);

		// Luego, esperamos a que el store se cargue
		await new Promise((resolve) => {
			const unsubscribe = profileStore.subscribe((profile) => {
				if (profile) {
					resolve(profile);
					unsubscribe();
				}
			});
		});

		// Finalmente, actualizamos el estado del modal
		showModal = !$profileStore?.username;
		isLoading = false;
	});

	$effect(() => {
		showModal = !$profileStore?.username;
	});

	let name = $state('');
	let username = $state('');
	let isUsernameValid: boolean | null = $state(null); // null = no verificado, true = válido, false = ya existe
	let isSubmitting = $state(false); // Para deshabilitar el botón mientras se guarda
	let isChecking = $state(false);

	const updateProfile = async () => {
		if (!username.trim() || !name.trim()) return alert('Please fill out all fields!');

		isSubmitting = true;
		try {
			const res = await fetch('/api/authmanager/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, name })
			});

			if (!res.ok) throw new Error('Failed to update profile');

			const updatedProfile = await res.json();
			profileStore.set(updatedProfile); // Actualizar store con los nuevos datos
			toast.success('registration completed!');
		} catch (err) {
			console.error(err);
			toast.error('failed to update profile.');
		} finally {
			isSubmitting = false;
		}
	};

	// Función para verificar si el username ya existe
	const checkUsernameAvailability = async () => {
		isChecking = true;
		if (!username.trim()) {
			isChecking = false;
			isUsernameValid = null;
			return;
		}

		try {
			const res = await fetch(`/api/authmanager/check-username?username=${username}`);
			const { available } = await res.json();
			isUsernameValid = available;
			isChecking = false;
		} catch (err) {
			console.error('Error checking username', err);
			isUsernameValid = null;
			isChecking = false;
		}
	};
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<!-- Complete registration dialog -->
	<Dialog.Root open={showModal} closeOnEscape={false} closeOnOutsideClick={false}>
		<Dialog.Content>
			<img
				src="/img/fvlogo-black-img.svg#svgView(viewBox(42, 45, 1370, 248))"
				class="h-6 w-auto lg:h-7"
				alt="Logo en negro"
				class:hidden={$mode == 'dark'}
			/>

			<!-- Logo para modo oscuro -->
			<img
				src="/img/fvlogo-white-img.svg#svgView(viewBox(42, 45, 1370, 248))"
				alt="Logo en blanco"
				class="h-6 w-auto lg:h-7"
				class:hidden={$mode == 'light'}
			/>
			<Dialog.Title>Finish setting up your account!</Dialog.Title>
			<Dialog.Description>
				<p>You're almost done! Pick a username and set your name.</p>
				<div class="grid gap-4 py-4">
					<!-- Input Name -->
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">name</Label>
						<Input id="name" bind:value={name} placeholder="Pedro Duarte" class="col-span-3" />
					</div>

					<!-- Input Username -->
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="username" class="text-right">Username</Label>
						<div class="col-span-3">
							<Input
								id="username"
								bind:value={username}
								placeholder="@peduarte"
								class="w-full {isUsernameValid === false
									? 'border-red-500'
									: isUsernameValid === true
										? 'border-green-500'
										: ''}"
								on:blur={checkUsernameAvailability}
							/>
							{#if isUsernameValid === false}
								<p class="mt-1 text-sm text-red-500">Username already taken!</p>
							{:else if isUsernameValid === true}
								<p class="mt-1 text-sm text-green-500">Username available ✅</p>
							{/if}
						</div>
					</div>

					<!-- Mensaje de validación de username -->
				</div>
			</Dialog.Description>
			<Dialog.Footer>
				<Button
					type="button"
					on:click={updateProfile}
					disabled={isSubmitting || isUsernameValid === false || isChecking}
				>
					{isSubmitting || isChecking ? 'loading...' : 'done!'}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Toaster />
	<Sidebar />
	<!-- Sidebar común para todas las páginas -->

	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header />
		<!-- Header común para todas las páginas -->
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			{@render children()}
			<!-- El contenido de cada página se inyecta aquí -->
		</main>
	</div>
</div>
