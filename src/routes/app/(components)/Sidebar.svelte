<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
	import {
		Package2,
		House,
		ShoppingCart,
		Package,
		UsersRound,
		ChartLine,
		Settings
	} from 'lucide-svelte/icons';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="##"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">Acme Inc</span>
		</a>
		<!-- Aquí agregas los enlaces con Tooltips -->
	</nav>
</aside>
