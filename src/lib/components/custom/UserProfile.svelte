<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { resetMode, setMode, mode } from 'mode-watcher';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Computer from 'lucide-svelte/icons/computer';

	import { page } from '$app/stores';

	const userAvatarUrl = $page.data.session?.user.user_metadata.avatar_url;
	const userDisplayName = $page.data.session?.user.user_metadata.display_name;

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

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" size="icon" class="overflow-hidden rounded-full" builders={[builder]}>
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
		<DropdownMenu.Group>
			<DropdownMenu.Label>Theme</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<ToggleGroup.Root type="single" value={$mode} class="flex w-full justify-between px-1">
				<ToggleGroup.Item onclick={() => setMode('light')} class="h-min w-full p-1" value="light"
					><Sun class="w-4" /></ToggleGroup.Item
				>
				<ToggleGroup.Item onclick={() => setMode('dark')} class="h-min w-full p-1" value="dark"
					><Moon class="w-4" /></ToggleGroup.Item
				>
				<ToggleGroup.Item onclick={() => resetMode()} class="h-min w-full p-1" value="undefined"
					><Computer class="w-4" /></ToggleGroup.Item
				>
			</ToggleGroup.Root>
			<DropdownMenu.Separator />
		</DropdownMenu.Group>
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
			<DropdownMenu.Item>Support</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleLogout}>Logout</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
