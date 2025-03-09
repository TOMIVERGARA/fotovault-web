<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { resetMode, setMode, mode } from 'mode-watcher';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Computer from 'lucide-svelte/icons/computer';

	import { profileStore } from '$lib/stores/profiles';

	const userAvatarUrl = $profileStore?.avatar_url;
	const userDisplayName = $profileStore?.display_name;
	const userUsername = $profileStore?.username;

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
				<Avatar.Image
					src={userAvatarUrl || `https://avatars.jakerunzer.com/${userDisplayName}`}
					alt="@shadcn"
				/>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-44" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{userDisplayName?.toLowerCase()}</p>
				<p class="text-xs leading-none text-muted-foreground">@{userUsername?.toLowerCase()}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
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
			<DropdownMenu.Item href="/app/settings">profile settings</DropdownMenu.Item>
			<DropdownMenu.Item>support</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleLogout}>logout</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
