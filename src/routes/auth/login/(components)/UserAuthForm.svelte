<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import Google from '$lib/icons/Google.svelte';
	import { toast } from 'svelte-sonner';
	import { Turnstile } from 'svelte-turnstile';
	import { mode } from 'mode-watcher';
	import { PUBLIC_CF_TURNSTILE_SITE_KEY } from '$env/static/public';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	let isOtpSent = false;
	let needsName = false;
	let email = '';
	let name = '';
	let turnstileToken = '';
	let otpAttempts = 0;
	let canResendOtp = false;
	let resendTimer = 30;

	async function handleEmailSubmit(event: SubmitEvent) {
		isLoading = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch('/auth/login/email', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			const data = await response.json();

			if (response.ok) {
				isOtpSent = true;
				startResendTimer();
				toast.success('login code sent to your email 📧');
			} else {
				toast.error(data.error || 'failed to send login code. Please try again 🤷‍♂️');
			}
		} catch (error) {
			console.log(error);
			toast.error('an unexpected error occurred. Please try again 🤷‍♂️');
		} finally {
			isLoading = false;
		}
	}

	async function handleOtpSubmit(event: SubmitEvent) {
		isLoading = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.append('email', email);

		try {
			const response = await fetch('/auth/login/email/verify', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok) {
				// Si el servidor nos indica que el usuario necesita proporcionar su nombre
				if (data.needsName) {
					needsName = false; // ESTA ASI PARA FORZAR QUE NO SE PREGUNTE EL NOMBRE.
					toast.info('please provide your name to complete registration 📝');
				} else {
					// Si todo está completo, redirigimos al usuario
					toast.success('login successful ✅');
					window.location.href = '/app';
				}
			} else {
				otpAttempts++;

				if (otpAttempts >= 3) {
					toast.error('too many failed attempts. please request a new code 🤬');
					canResendOtp = true;
				} else {
					toast.error(data.error || 'invalid code. please try again 🫠');
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('an unexpected error occurred. please try again 🤷‍♂️');
		} finally {
			isLoading = false;
		}
	}

	async function handleNameSubmit(event: SubmitEvent) {
		isLoading = true;

		// Crear un nuevo FormData que solo contiene el nombre
		const formData = new FormData();
		formData.append('name', name);

		try {
			console.log('TRYING');
			const response = await fetch('/api/authmanager/complete-registration', {
				method: 'POST',
				body: formData
			});
			console.log(JSON.stringify(response));

			if (response.ok) {
				toast.success('registration completed successfully ✅');
				//window.location.href = '/app';
			} else {
				const data = await response.json();
				toast.error(data.error || 'failed to update profile. please try again 🫠');
			}
		} catch (error) {
			console.log(error);
			toast.error('an unexpected error occurred. please try again 🤷‍♂️');
		} finally {
			isLoading = false;
		}
	}

	function startResendTimer() {
		canResendOtp = false;
		resendTimer = 30;

		const interval = setInterval(() => {
			resendTimer--;
			if (resendTimer <= 0) {
				clearInterval(interval);
				canResendOtp = true;
			}
		}, 1000);
	}

	function handleResendOtp() {
		otpAttempts = 0;
		handleEmailSubmit(new SubmitEvent('submit'));
	}

	function resetForm() {
		isOtpSent = false;
		needsName = false;
		email = '';
		name = '';
		otpAttempts = 0;
		canResendOtp = false;
		resendTimer = 30;
	}
</script>

<!-- El resto del componente sigue igual -->
<div class={cn('grid gap-6', className)} {...$$restProps}>
	{#if !isOtpSent}
		<!-- Formulario para ingresar email -->
		<form on:submit|preventDefault={handleEmailSubmit}>
			<div class="grid gap-2">
				<div class="grid gap-1">
					<p class="text-sm text-muted-foreground">enter your email</p>
					<Label class="sr-only" for="email">Email</Label>
					<Input
						id="email"
						name="email"
						bind:value={email}
						placeholder="name@example.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
						required
					/>
				</div>
				<Turnstile siteKey={PUBLIC_CF_TURNSTILE_SITE_KEY} theme={$mode} size="flexible" />
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<span class="mr-2">Loading...</span>
					{/if}
					send login code
				</Button>
				<p class="text-xs text-muted-foreground">
					* if you don't have an account yet a new one will be created.
				</p>
			</div>
		</form>
	{:else if isOtpSent && !needsName}
		{#key 'otpForm'}
			<!-- Formulario para ingresar OTP -->
			<form on:submit|preventDefault={handleOtpSubmit}>
				<div class="grid gap-2">
					<p class="text-center text-sm text-muted-foreground">
						We've sent a login code to <strong>{email}</strong>
					</p>
					<div class="grid gap-1">
						<Label class="sr-only" for="otp">enter code</Label>
						<Input
							id="otp"
							name="otp"
							placeholder="enter the code sent to your email"
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength={6}
							disabled={isLoading}
							required
						/>
					</div>
					{#if !canResendOtp && resendTimer > 0}
						<p class="mb-2 text-xs italic text-muted-foreground">
							you can request a new code in {resendTimer} seconds
						</p>
					{/if}

					<div class="flex w-full gap-2">
						{#if otpAttempts > 0}
							<Button
								type="submit"
								class="w-1/2"
								disabled={isLoading || (otpAttempts >= 3 && !canResendOtp)}
							>
								{#if isLoading}
									<span class="mr-2">loading...</span>
								{/if}
								verify code
							</Button>

							<Button
								type="button"
								variant="outline"
								class="w-1/2 text-sm"
								on:click={handleResendOtp}
								disabled={isLoading || !canResendOtp}
							>
								request new code
							</Button>
						{:else}
							<Button
								type="submit"
								class="w-full"
								disabled={isLoading || (otpAttempts >= 3 && !canResendOtp)}
							>
								{#if isLoading}
									<span class="mr-2">loading...</span>
								{/if}
								verify code
							</Button>
						{/if}
					</div>
					<div class="relative mt-4">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t" />
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-background px-2 text-muted-foreground"> Or</span>
						</div>
					</div>

					<div class="flex flex-col gap-2 text-center">
						<Button type="button" variant="link" class="" on:click={resetForm}>
							use a different email
						</Button>
					</div>
				</div>
			</form>
		{/key}
	{:else if needsName}
		<!-- Formulario para ingresar nombre (solo para nuevos usuarios) -->
		{#key needsName}
			<form on:submit|preventDefault={handleNameSubmit}>
				<div class="grid gap-2">
					<p class="text-center text-sm text-muted-foreground">
						You're almost done! Please enter your name to complete registration
					</p>
					<div class="grid gap-1">
						<Label class="sr-only" for="name">name</Label>
						<Input
							id="name"
							name="name"
							bind:value={name}
							placeholder="enter your name"
							type="text"
							disabled={isLoading}
							required
						/>
					</div>
					<Button type="submit" disabled={isLoading}>
						{#if isLoading}
							<span class="mr-2">loading...</span>
						{/if}
						complete registration
					</Button>
				</div>
			</form>
		{/key}
	{/if}
	{#if !isOtpSent}
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t" />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
			</div>
		</div>
		<Button variant="outline" class="w-full" href="/auth/login/google">
			<Google class="mr-2 w-3" />
			Google
		</Button>
	{/if}
</div>
