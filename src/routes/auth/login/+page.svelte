<script lang="ts">
	import UserAuthForm from './(components)/UserAuthForm.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from 'svelte-sonner';
</script>

<div>
	<Toaster />
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
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me deliver stunning
					designs to my clients faster than ever before. Highly recommended!&rdquo;
				</p>
				<footer class="text-sm">Sofia Davis</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<a class="mx-auto" href="/"><img src="/img/fvlogo-black-img.svg" class="w-32" alt="" /></a>
				<h1 class="text-2xl font-semibold tracking-tight">login to your account</h1>
			</div>
			<UserAuthForm />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
