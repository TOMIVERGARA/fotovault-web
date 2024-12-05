<script>
	import { Button } from '$lib/components/ui/button';
	import { LayoutDashboard, User } from 'lucide-svelte';

	import { page } from '$app/stores';
</script>

<div class="relative isolate overflow-hidden">
	<div class="mx-auto max-w-7xl px-6 pb-24 pt-0 sm:pb-32 lg:flex lg:px-8 lg:py-10 lg:pt-10">
		<div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:pt-8">
			<div class="mt-16">
				<a href="https://github.com/TOMIVERGARA/fotovault-web" class="inline-flex space-x-6">
					<span
						class="rounded-full px-3 py-0 text-xs font-semibold leading-6 ring-1 ring-inset ring-indigo-500/20 lg:py-1 lg:text-sm"
						>check what's new</span
					>
					<!-- {#if releaseVersion !== null}
						<span class="inline-flex items-center space-x-2 text-sm font-medium leading-6">
							<span>Just shipped</span>
							{#if releaseVersion === undefined}
								<div class="animate-spin">
									<Loader2 />
								</div>
							{:else}
								<span>{releaseVersion}</span>
							{/if}
							<ChevronRight class="h-5 w-5 text-gray-500" />
						</span>
					{/if} -->
				</a>
			</div>
			<h1 class="mt-3 text-pretty text-4xl font-semibold tracking-tight lg:mt-10 lg:text-8xl">
				every shot, every roll, every note. <br /> all in one place.
			</h1>
			<p class="mt-5 text-pretty text-sm text-muted-foreground lg:mt-8 lg:text-lg">
				track your film photography journey with ease — your photos, development notes and more in
				one place.
			</p>
			<div class="mt-5 flex items-center gap-x-6">
				{#if $page.data.session}
					<Button href="/app/dashboard" class="flex items-center space-x-2"
						><LayoutDashboard /> <span>go to dashboard</span></Button
					>
				{:else}
					<Button class="flex items-center space-x-2" href="/auth/login"
						><User /> <span>login to an account</span></Button
					>
				{/if}
			</div>
		</div>
		<div
			class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
		>
			<div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
				<img
					src="/img/hero-black-img.png"
					alt="App screenshot"
					width="2432"
					height="1442"
					class="w-[76rem]"
				/>
			</div>
		</div>
	</div>
</div>
