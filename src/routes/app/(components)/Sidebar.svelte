<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { routes } from '$lib/config/routes.js';
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<!-- Logo -->
		<a
			href="/"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<img src="/img/iso-img.svg" alt="Logo" class="!bg-white dark:hidden" />
			<img src="/img/iso-white-img.svg" alt="Logo" class="hidden !bg-zinc-950 dark:block" />
		</a>

		<!-- Enlaces dinámicos -->
		{#each routes as { path, name, icon: Icon }}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href={path}
						class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
						use:builder.action
						{...builder}
					>
						<Icon class="h-5 w-5" />
						<span class="sr-only">{name}</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">{name}</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</nav>
</aside>
