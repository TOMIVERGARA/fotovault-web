<script lang="ts">
	let { rating, dateCreated } = $props();

	const date = new Date(dateCreated); // Obtiene la fecha actual
	const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
</script>

<div class="flex items-center">
	<svg
		class="me-1 h-4 w-4 text-yellow-300"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 22 20"
	>
		<path
			d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
		/>
	</svg>
	<p class="ms-2 text-sm font-bold text-gray-900 dark:text-white">{rating}/5</p>
	<span class="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
	<span class="text-sm font-medium text-gray-900 dark:text-white">{formattedDate}</span>
</div>
