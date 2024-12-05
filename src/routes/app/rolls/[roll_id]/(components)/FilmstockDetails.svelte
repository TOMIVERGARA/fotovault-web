<script>
	import { Badge } from '$lib/components/ui/badge';

	export let roll;
</script>

<div class="text-md mb-3 flex">
	{roll.brand_name}
	{roll.filmstock_name}
	{#if roll.iso}
		<Badge
			variant="outline"
			class="ml-2  {roll.iso < 250
				? 'border-blue-600 bg-blue-200 text-blue-600'
				: roll.iso < 450
					? 'border-orange-600 bg-orange-200 text-orange-600'
					: roll.is < 1650
						? 'border-purple-600 bg-purple-200 text-purple-600'
						: 'border-rose-600 bg-rose-200 text-rose-600'}">{roll.iso}iso</Badge
		>
	{/if}
</div>
<hr />
<div class="mt-3 flex">
	<div class="w-1/2">
		<h3 class="font-semibold">format</h3>
		<p>{roll.format_name}</p>
	</div>
	<div class="w-1/2">
		<h3 class="font-semibold">filmtype</h3>
		<p>{roll.filmtype_name}</p>
	</div>
</div>
