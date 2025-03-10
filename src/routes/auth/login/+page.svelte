<script lang="ts">
	import UserAuthForm from './(components)/UserAuthForm.svelte';
	import { mode } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import { Smartphone, Laptop, ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>login | fv</title>
</svelte:head>

<div>
	<Toaster />
</div>
<div
	class="prose flex h-full w-full items-center justify-center p-5 text-center align-middle !text-primary md:hidden"
>
	<div class="flex w-full flex-col items-center justify-center text-center align-middle">
		<a href="/" class="flex items-center text-lg font-semibold md:text-base"
			><img
				src="/img/fvlogo-black-img.svg"
				class=" h-9 w-auto"
				alt="Logo en negro"
				class:hidden={$mode == 'dark'}
			/>

			<!-- Logo para modo oscuro -->
			<img
				src="/img/fvlogo-white-img.svg"
				alt="Logo en blanco"
				class="h-9 w-auto"
				class:hidden={$mode == 'light'}
			/></a
		>
		<div class="mb-2 flex items-center align-middle text-zinc-400">
			<Smartphone size="34" />
			<ArrowRight class="mx-2" />
			<Laptop size="34" />
		</div>
		<h3 class="mt-0 w-2/3 text-primary">this app is optimized for larger displays!</h3>
		<p class="text-zinc-400">
			fotovault is designed to help you explore your photos effortlessly and beautifully.
			<br /><i>
				for the full experience and all features, please use a larger device like a PC or tablet.</i
			>
		</p>
	</div>
</div>
<div
	class="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover bg-center bg-no-repeat"
			style="
				background-image:
					url(/img/auth-login-img.jpg);"
		></div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<a class="mx-auto" href="/"
					><img src="/img/fvlogo-black-img.svg" class="w-32 dark:hidden" alt="" /><img
						src="/img/fvlogo-white-img.svg"
						class="hidden w-32 dark:block"
						alt=""
					/></a
				>
				<h1 class="text-2xl font-semibold tracking-tight">login to your account</h1>
			</div>
			<UserAuthForm />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/privacy-policy" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy-policy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
