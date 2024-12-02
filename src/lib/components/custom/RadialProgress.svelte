<script>
	export let value = 0; // Progreso en porcentaje (0-100)
</script>

<div class="relative flex h-6 w-6 items-center justify-center">
	<svg class="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
		<!-- Fondo del progreso -->
		<circle
			cx="18"
			cy="18"
			r="16"
			fill="transparent"
			stroke="currentColor"
			stroke-opacity="0.2"
			stroke-width="4"
		/>
		<!-- Barra de progreso -->
		<circle
			cx="18"
			cy="18"
			r="16"
			fill="transparent"
			stroke="currentColor"
			stroke-width="4"
			stroke-dasharray="100"
			stroke-dashoffset={100 - value}
			class={`${
				value === 100 ? 'stroke-green-500' : 'stroke-primary'
			} transition-all duration-1000 ease-in-out`}
		/>
	</svg>
	<!-- Texto de porcentaje -->
	<!-- {#if value < 100}
		<span class="absolute text-xs font-medium text-gray-700">
			{value}%
		</span>
	{/if} -->
</div>
