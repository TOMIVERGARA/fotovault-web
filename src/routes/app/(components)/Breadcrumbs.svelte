<script lang="ts">
	import { page } from '$app/stores';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { HomeIcon } from 'lucide-svelte';

	const MAX_VISIBLE_ITEMS = 3; // Número máximo de items visibles antes de usar el dropdown

	// Obtener segmentos de la ruta actual
	$: pathSegments = $page.url.pathname.split('/').filter((segment) => segment !== '');

	// Construir las rutas acumulativas
	$: breadcrumbs = pathSegments.map((segment, index) => {
		const path = '/' + pathSegments.slice(0, index + 1).join('/');
		return {
			label: segment.replace(/-/g, ' '),
			href: path
		};
	});

	// Determinar qué items mostrar en el dropdown y cuáles visibles
	$: showDropdown = breadcrumbs.length > MAX_VISIBLE_ITEMS;
	$: dropdownItems = showDropdown ? breadcrumbs.slice(1, -2) : [];
	$: visibleItems = showDropdown
		? [...breadcrumbs.slice(0, 1), ...breadcrumbs.slice(-2)]
		: breadcrumbs;
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<!-- Home siempre visible -->
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app">
				<HomeIcon class="h-4 w-4" />
				<span class="sr-only">Home</span>
			</Breadcrumb.Link>
		</Breadcrumb.Item>

		{#if breadcrumbs.length > 0}
			<Breadcrumb.Separator />
		{/if}

		<!-- Items visibles y dropdown si es necesario -->
		{#each visibleItems as item, i}
			{#if showDropdown && i === 1}
				<Breadcrumb.Item>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex items-center gap-1">
							<Breadcrumb.Ellipsis class="h-4 w-4" />
							<span class="sr-only">Toggle menu</span>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							{#each dropdownItems as dropItem}
								<DropdownMenu.Item>
									<a href={dropItem.href} class="w-full">
										{dropItem.label}
									</a>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
			{/if}

			<Breadcrumb.Item>
				{#if i === visibleItems.length - 1}
					<Breadcrumb.Page>{item.label}</Breadcrumb.Page>
				{:else}
					<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
				{/if}
			</Breadcrumb.Item>

			{#if i < visibleItems.length - 1}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
