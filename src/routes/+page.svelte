<script lang="ts">
	import AuthCodeInput from '$lib/AuthCodeInput.svelte';
	import '../app.css';

	let AuthInputRef = $state<AuthCodeInput>();
	let result = $state<string>('');
	let boundResult = $state<string>('');

	let isPassword = $state<boolean>(false);
	let disabled = $state<boolean>(false);
	let autoSubmit = $state<boolean>(false);

	let allowedCharacters = $state<'alpha' | 'numeric' | 'alphanumeric'>('alphanumeric');

	const handleOnChange = (res: string) => {
		result = res;
	};

	const handleAllowedCharactersChange = (
		e: Event & { currentTarget: EventTarget & HTMLInputElement }
	) => {
		const { id } = e.currentTarget;
		// @ts-ignore
		allowedCharacters = id;
		result = '';
	};
</script>

<div class="main">
	<h1>Svelte Auth Code Input</h1>
	<p>One-time password (OTP) Svelte component.</p>
	<div class="badges">
		<img alt="" src="https://img.shields.io/npm/v/svelte-auth-code-input.svg" />
		<img
			alt="code style standard"
			src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"
		/>
		<img alt="license MIT" src="https://img.shields.io/badge/license-MIT-brightgreen.svg" />
		<img alt="" src="https://img.shields.io/npm/dt/svelte-auth-code-input.svg" />
		<img alt="" src="https://img.shields.io/npm/dw/svelte-auth-code-input.svg" />
	</div>
	<p>
		<a href="https://github.com/drac94/react-auth-code-input"> View documentation on GitHub </a>
	</p>
	<div>
		<div>
			<h1>
				Two-Factor
				<br /> Authentication
			</h1>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					const dataJson = JSON.stringify(Object.fromEntries(formData));
					alert(dataJson);
				}}
			>
				<AuthCodeInput
					bind:this={AuthInputRef}
					bind:value={boundResult}
					{allowedCharacters}
					onchange={handleOnChange}
					containerClass="container"
					inputClass="input"
					{isPassword}
					{disabled}
					{autoSubmit}
					name="authCode"
				/>
				<button type="submit">Submit</button>
			</form>
			<p>
				A message with a verification code has been sent to <br />
				your devices. Enter the code to continue.
			</p>
			<p>Code: {result}</p>
			<p>Bound Code: {boundResult}</p>
			<div class="props">
				<div class="options">
					<div>
						<input type="checkbox" name="isPassword" bind:checked={isPassword} />
						<label for="isPassword">Password</label>
					</div>
					<div>
						<input type="checkbox" name="disabled" bind:checked={disabled} />
						<label for="disabled">Disabled</label>
					</div>
					<div>
						<input type="checkbox" name="autosubmit" bind:checked={autoSubmit} />
						<label for="autosubmit">Auto-Submit</label>
					</div>
					<button onclick={() => AuthInputRef?.focus()}> Focus </button>
					<button onclick={() => AuthInputRef?.clear()}> Clear </button>
				</div>
				<div class="allowed-characters">
					{#each ['alpha', 'numeric', 'alphanumeric'] as aC}
						{#key aC}
							<div>
								<input
									type="radio"
									id={aC}
									name="allowedRadio"
									onchange={handleAllowedCharactersChange}
									checked={allowedCharacters === aC}
								/>
								<label for={aC}>{aC}</label>
							</div>
						{/key}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
