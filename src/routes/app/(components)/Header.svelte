<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	const { userAvatarUrl, userDisplayName } = $props();

	async function handleLogout() {
		const response = await fetch('/api/logout', {
			method: 'POST'
		});

		const result = await response.json();

		if (result.success) {
			// Redirigir al usuario después de cerrar sesión
			window.location.href = '/';
		} else {
			console.error('Error:', result.error);
			alert('Error al cerrar sesión');
		}
	}
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<!-- Barra de navegación superior -->
	<Breadcrumbs />
	<div class="relative ml-auto flex-1 md:grow-0"></div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
				<Avatar.Root>
					<Avatar.Image src={userAvatarUrl} alt="@shadcn" />
					{#if !userAvatarUrl}
						<Avatar.Fallback
							>{userDisplayName
								.trim()
								.split(/\s+/)
								.slice(0, 2)
								.map((name: string) => name[0].toUpperCase())
								.join('')}</Avatar.Fallback
						>
					{/if}
				</Avatar.Root>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
			<DropdownMenu.Item>Support</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleLogout}>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
