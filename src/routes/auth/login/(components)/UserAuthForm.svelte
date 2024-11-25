<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import Google from '$lib/icons/Google.svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	let isOtpSent = false;
	let email = '';
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
				body: formData
			});

			const data = await response.json();

			if (response.ok) {
				isOtpSent = true;
				startResendTimer();
				toast.success('login code sent to your email 📧');
			} else {
				toast.error(data.error || 'failed to send login code. please try again 🤷‍♂️');
			}
		} catch (error) {
			toast.error('an unexpected error occurred. please try again 🤷‍♂️');
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
				toast.success('Login successful');
				window.location.href = '/app';
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
		otpAttempts = 0;
		canResendOtp = false;
		resendTimer = 30;
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	{#if !isOtpSent}
		<form on:submit|preventDefault={handleEmailSubmit}>
			<div class="grid gap-2">
				<div class="grid gap-1">
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
				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<span class="mr-2">Loading...</span>
					{/if}
					Send Login Code
				</Button>
			</div>
		</form>
	{:else}
		<form on:submit|preventDefault={handleOtpSubmit}>
			<div class="grid gap-2">
				<p class="text-center text-sm text-muted-foreground">
					We've sent a login code to <strong>{email}</strong>
				</p>
				<div class="grid gap-1">
					<Label class="sr-only" for="otp">Enter Code</Label>
					<Input
						id="otp"
						name="otp"
						placeholder="Enter the code sent to your email"
						type="text"
						inputmode="numeric"
						pattern="[0-9]*"
						maxlength={6}
						disabled={isLoading}
						required
					/>
				</div>
				<Button type="submit" disabled={isLoading || (otpAttempts >= 3 && !canResendOtp)}>
					{#if isLoading}
						<span class="mr-2">Loading...</span>
					{/if}
					Verify Code
				</Button>

				<div class="flex flex-col gap-2 text-center">
					{#if !canResendOtp && resendTimer > 0}
						<p class="text-sm text-muted-foreground">
							You can request a new code in {resendTimer} seconds
						</p>
					{:else if otpAttempts > 0}
						<Button
							type="button"
							variant="ghost"
							class="text-sm"
							on:click={handleResendOtp}
							disabled={isLoading || !canResendOtp}
						>
							Request new code
						</Button>
					{/if}
					<Button type="button" variant="outline" class="mt-2" on:click={resetForm}>
						Use Different Email
					</Button>
				</div>
			</div>
		</form>
	{/if}

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
</div>
