<!-- NOTE: the parent component/container must have the following clases for it to work properly. -->
<!-- class="relative flex-1 overflow-hidden" -->
<script lang="ts">
	import { CircleArrowDown } from 'lucide-svelte';

	// Props
	let {
		children,
		containerClass = '',
		bottomShadowPos = 'bottom-5',
		showScrollIndicator = true
	} = $props();

	let scrollableContainer: HTMLDivElement;
	let showScrollIcon = $state(false);
	let isHovered = $state(false);
	let isAtBottom = $state(false);

	$effect(() => {
		const checkScrollable = () => {
			if (!scrollableContainer) return;

			const scrollHeight = scrollableContainer.scrollHeight;
			const clientHeight = scrollableContainer.clientHeight;
			const scrollTop = scrollableContainer.scrollTop;

			// Precise bottom detection with small tolerance
			isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;

			// Check if content is scrollable
			const isScrollable = scrollHeight > clientHeight;

			// Show scroll icon only if scrollable, hovered, and not at bottom
			showScrollIcon = showScrollIndicator ? isScrollable && isHovered && !isAtBottom : false;
		};

		const handleScroll = () => {
			if (!scrollableContainer) return;

			const scrollHeight = scrollableContainer.scrollHeight;
			const clientHeight = scrollableContainer.clientHeight;
			const scrollTop = scrollableContainer.scrollTop;

			// Precise bottom detection with small tolerance
			isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;

			showScrollIcon = showScrollIndicator ? isHovered && !isAtBottom : false;
		};

		checkScrollable();
		scrollableContainer.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', checkScrollable);

		return () => {
			scrollableContainer.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkScrollable);
		};
	});
</script>

<div
	class="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent dark:from-zinc-950"
></div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="h-full overflow-y-auto {containerClass}"
	bind:this={scrollableContainer}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{@render children()}
</div>

<div
	class="absolute inset-x-0 {bottomShadowPos} z-10 h-8 bg-gradient-to-t from-white to-transparent dark:from-zinc-950"
></div>

{#if showScrollIcon && isHovered && !isAtBottom}
	<div
		class="drop-in absolute inset-x-0 bottom-0 z-20 mx-auto mb-5 flex w-fit justify-center rounded-full bg-black p-1 opacity-20 dark:bg-white"
	>
		<CircleArrowDown class="w-6 text-white dark:text-black" />
	</div>
{/if}

<style>
	@keyframes drop-in {
		0% {
			transform: translateY(100%) scale(0.2);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(0.8);
			opacity: 20%;
		}
	}

	.drop-in {
		animation: drop-in 0.1s ease-out forwards;
	}
</style>
