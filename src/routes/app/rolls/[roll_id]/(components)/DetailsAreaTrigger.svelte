<script>
	import { PlusIcon } from 'lucide-svelte';
</script>

<div
	class="group relative flex h-20 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-400 text-center text-zinc-500 transition-all duration-300 ease-in-out"
>
	<!-- Texto inicial -->
	<div
		class="flex h-full w-full flex-col items-center justify-center transition-all duration-300 ease-in-out group-hover:scale-95 group-hover:opacity-0"
	>
		<span class="w-3/4">this roll doesnt have development information yet...</span>
		<span class="underline-offset-3 mt-1 w-3/4 text-xs underline">click to add</span>
	</div>

	<!-- Ícono Plus -->
	<div
		class="absolute flex h-full w-full scale-90 flex-col items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100"
	>
		<PlusIcon class="h-10 w-10" />
	</div>
</div>
