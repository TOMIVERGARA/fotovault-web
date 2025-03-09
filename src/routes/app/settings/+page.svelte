<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { profileStore, type Profile } from '$lib/stores/profiles';
	import { Separator } from '$lib/components/ui/separator';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import CreateComplexRecordDialog from '$lib/components/custom/CreateComplexRecordDialog.svelte';
	import { onMount } from 'svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let userAvatarUrl: string | undefined = $state();
	let userDisplayName: string | null | undefined = $state();
	let userUsername: string | null | undefined = $state();
	let userEmail: string | null | undefined = $state();
	let isLoading = $state(true);

	onMount(() => {
		const unsubscribe = profileStore.subscribe((profile) => {
			if (profile) {
				userAvatarUrl = profile.avatar;
				userDisplayName = profile.display_name;
				userUsername = profile.username;
				userEmail = profile.email;
				isLoading = false;
			}
		});

		return () => unsubscribe(); // Limpiar suscripción al desmontar
	});

	function updateProfile(data: { display_name: any }) {
		if (data.display_name) {
			profileStore.update(
				(p) =>
					({
						...p,
						display_name: data.display_name
					}) as Profile
			);
		}
	}

	let isEditingEmail = $state(false);
	let isEditProfileDialogOpen = $state(false);
</script>

<svelte:head>
	<title>settings | fv</title>
</svelte:head>

<div class="flex justify-center">
	<Card.Root class="flex w-2/4 flex-col">
		<Card.Header>
			<Card.Title>Settings</Card.Title>
			<Card.Description
				>Customize your user expericence and configure your account.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="prose prose-neutral text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex w-full flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Personal info</h3>
						<div class="flex w-full items-center align-middle">
							{#if isLoading}
								<Skeleton class="h-24 w-full" />
							{:else}
								<div class="">
									<img src={userAvatarUrl} class="w-24" alt="" />
								</div>
								<div class="ml-6">
									<h2 class="mb-0 mt-0 text-primary">{userDisplayName}</h2>
									<span class="text-zinc-400">@{userUsername}</span>
								</div>

								<div class="ml-auto">
									<CreateComplexRecordDialog
										bind:open={isEditProfileDialogOpen}
										actionUrl="?/updateDisplayName"
										title="Update Profile"
										description="Update your personal information."
										successMessage="Profile updated successfully 🎉"
										invalidateKey="profile"
										onSuccess={updateProfile}
										existingData={{
											name: userDisplayName,
											username: userUsername,
											user_id: $profileStore?.user_id
										}}
										fields={[
											{
												id: 'display_name',
												label: 'Name',
												type: 'text',
												required: true,
												placeholder: 'peter parker'
											},
											{
												id: 'username',
												label: 'username',
												type: 'hidden',
												required: true
											},
											{
												id: 'user_id',
												label: 'user_id',
												type: 'hidden',
												required: true
											}
										]}
									>
										<Button slot="trigger" class="rounded-full">edit profile</Button>
									</CreateComplexRecordDialog>
								</div>
							{/if}
						</div>

						<Separator class="!mb-6" />
						<h3 class="!mb-3 text-primary">Account data</h3>
						<div class="grid grid-cols-2 gap-4">
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">main email</Label>
								<Input
									type="email"
									id="email"
									placeholder="email"
									bind:value={userEmail}
									disabled={!isEditingEmail}
								/>
							</div>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">recovery email</Label>
								<Input type="email" id="email" placeholder="email" disabled={!isEditingEmail} />
								<p class="mt-0 text-sm text-muted-foreground">
									you haven't set a recovery address.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div></Card.Content
		>
	</Card.Root>
</div>
