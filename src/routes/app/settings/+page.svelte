<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { profileStore } from '$lib/stores/profiles';
	import { Separator } from '$lib/components/ui/separator';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	const userAvatarUrl = $profileStore?.avatar;
	const userDisplayName = $profileStore?.display_name;
	const userUsername = $profileStore?.username;

	let userEmail = $state($profileStore?.email);
	let isEditingEmail = $state(false);
</script>

<svelte:head>
	<title>settings | fv</title>
</svelte:head>

<div class="flex justify-center">
	<Card.Root class="flex w-2/4 flex-col">
		<Card.Header>
			<Card.Title>Settings</Card.Title>
			<Card.Description
				>Customize your user expericence and configure your account..</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="prose prose-neutral text-primary">
				<div class="flex flex-row items-center justify-between space-y-0">
					<div class="flex w-full flex-col space-y-1.5">
						<h3 class="m-0 text-primary">Personal info</h3>
						<div class="flex w-full items-center align-middle">
							<div class="">
								<img src={userAvatarUrl} class="w-24" alt="" />
							</div>
							<div class="ml-6">
								<h2 class="mb-0 mt-0 text-primary">{userDisplayName}</h2>
								<span class="text-zinc-400">@{userUsername}</span>
							</div>
							<div class="ml-auto">
								<Button class="rounded-full">edit profile</Button>
							</div>
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
