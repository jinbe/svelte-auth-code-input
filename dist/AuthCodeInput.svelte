<script lang="ts">
	import { onMount } from 'svelte';

	let ac = $state.raw<AbortController | null>(null);

	const allowedCharactersValues = ['alpha', 'numeric', 'alphanumeric'] as const;
	type AllowedCharacters = (typeof allowedCharactersValues)[number];

	type AuthCodeProps = {
		allowedCharacters?: AllowedCharacters;
		ariaLabel?: string;
		autoFocus?: boolean;
		containerClass?: string;
		disabled?: boolean;
		inputClass?: string;
		isPassword?: boolean;
		length?: number;
		placeholder?: string;
		onchange?: (res: string) => void;
		value?: string;
		name?: string;
		autoSubmit?: boolean;
		webOTP?: boolean;
		webOTPTimeoutSeconds?: number;
	};

	type InputMode = 'text' | 'numeric';

	type InputType = 'text' | 'tel' | 'password';

	type InputProps = {
		type: InputType;
		inputMode: InputMode;
		pattern: string;
		min?: string;
		max?: string;
	};

	let {
		allowedCharacters = 'alphanumeric',
		ariaLabel,
		autoFocus = true,
		containerClass,
		disabled,
		inputClass,
		isPassword = false,
		length = 6,
		placeholder,
		onchange,
		value = $bindable(undefined),
		name,
		autoSubmit = false,
		webOTP = false,
		webOTPTimeoutSeconds = 60
	}: AuthCodeProps = $props();

	if (isNaN(length) || length < 1) {
		throw new Error('Length should be a number and greater than 0');
	}

	if (!allowedCharactersValues.some((value) => value === allowedCharacters)) {
		throw new Error('Invalid value for allowedCharacters. Use alpha, numeric, or alphanumeric');
	}

	let inputsRef = $state<Array<HTMLInputElement>>([]);

	export const focus = () => {
		inputsRef[0]?.focus();
	};

	export const clear = () => {
		for (const ref of inputsRef) {
			ref.value = '';
		}
		inputsRef[0]?.focus();
		sendResult();
	};

	const propsMap = {
		alpha: {
			type: 'text',
			inputMode: 'text',
			pattern: '[a-zA-Z]{1}'
		} as InputProps,
		alphanumeric: {
			type: 'text',
			inputMode: 'text',
			pattern: '[a-zA-Z0-9]{1}'
		} as InputProps,
		numeric: {
			type: 'text',
			inputMode: 'numeric',
			pattern: '[0-9]{1}',
			min: '0',
			max: '9'
		} as InputProps
	} as const;

	const inputProps = $derived(propsMap[allowedCharacters]);

	$effect(() => {
		if (autoFocus) {
			inputsRef[0]?.focus();
		}
	});

	const sendResult = () => {
		value = inputsRef.map((input) => input.value).join('');
		onchange?.(value);
		if (autoSubmit && value.length === length) {
			// get parent form
			const form = inputsRef[0].closest('form');
			form?.requestSubmit();
		}
	};

	const handleOnKeyDown = (e: KeyboardEvent) => {
		const { key } = e;
		const target = e.target as HTMLInputElement;
		if (key === 'Backspace') {
			if (target.value === '') {
				if (target.previousElementSibling !== null) {
					const t = target.previousElementSibling as HTMLInputElement;
					t.value = '';
					t.focus();
					e.preventDefault();
				}
			} else {
				target.value = '';
			}
			sendResult();
		}
	};

	const handleOnInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.value.length > 1) {
			// if more than one char is entered then get a copy of the string
			// set the input to empty
			const copy = `${e.currentTarget.value}`;
			e.currentTarget.value = '';

			// run the paste input handler
			inputValue(copy);

			// prevent the default behaviour
			e.preventDefault();
		} else {
			if (e.currentTarget.value.match(inputProps.pattern)) {
				if (e.currentTarget.nextElementSibling !== null) {
					(e.currentTarget.nextElementSibling as HTMLInputElement).focus();
				}
			} else {
				e.currentTarget.value = '';
			}
		}
		sendResult();
	};

	const handleOnFocus = (e: FocusEvent) => {
		(e.target as HTMLInputElement)?.select();
	};

	const inputValue = (value: string) => {
		let currentInput = 0;

		for (let i = 0; i < value.length; i++) {
			const pastedCharacter = value.charAt(i);
			const currentValue = inputsRef[currentInput]?.value;
			if (pastedCharacter.match(inputProps.pattern)) {
				if (!currentValue) {
					if (inputsRef[currentInput]) {
						inputsRef[currentInput]!.value = pastedCharacter;
						if (inputsRef[currentInput]!.nextElementSibling !== null) {
							(inputsRef[currentInput]!.nextElementSibling as HTMLInputElement).focus();
							currentInput++;
						}
					}
				}
			}
		}
	};

	const handleOnPaste = (e: ClipboardEvent) => {
		const pastedValue = e.clipboardData?.getData('Text') || '';

		inputValue(pastedValue);

		sendResult();

		e.preventDefault();
	};

	onMount(() => {
		if (webOTP) {
			if ('OTPCredential' in window) {
				const input = document.querySelector('input[autocomplete="one-time-code"]');
				if (!input) return;
				// Set up an AbortController to use with the OTP request
				ac = new AbortController();
				const form = input.closest('form');
				if (form) {
					// Abort the OTP request if the user attempts to submit the form manually
					form.addEventListener('submit', (e) => {
						ac?.abort();
					});
				}
				// Request the OTP via get()
				navigator.credentials
					.get({
						// @ts-expect-error
						otp: { transport: ['sms'] },
						signal: ac.signal
					})
					.then((otp) => {
						// @ts-expect-error
						inputValue(otp.code);

						sendResult();
					})
					.catch((err) => {
						console.error(err);
					});
			}

			setTimeout(() => {
				ac?.abort();
			}, webOTPTimeoutSeconds * 1000);
		}
	});
</script>

<div class={containerClass}>
	{#each Array.from(Array(length).keys()) as i}
		{#key i}
			<input
				bind:this={inputsRef[i]}
				oninput={handleOnInput}
				onkeydown={handleOnKeyDown}
				onfocus={handleOnFocus}
				onpaste={handleOnPaste}
				{...inputProps}
				type={isPassword ? 'password' : inputProps.type}
				maxLength={1}
				class={inputClass}
				autoComplete={i === 0 ? 'one-time-code' : 'off'}
				aria-label={ariaLabel ? `${ariaLabel}. Character ${i + 1}.` : `Character ${i + 1}.`}
				{disabled}
				{placeholder}
			/>
		{/key}
	{/each}
	{#if name}
		<input type="hidden" {name} {value} />
	{/if}
</div>
