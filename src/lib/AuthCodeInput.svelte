<script lang="ts">
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
		name
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
			type: 'tel',
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
		if (onchange) {
			onchange(value);
		}
	};

	const handeOnInput = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		console.log(e);
		if (e.currentTarget.value.length > 1) {
			e.currentTarget.value = e.currentTarget.value.charAt(0);
			if (e.currentTarget.nextElementSibling !== null) {
				(e.currentTarget.nextElementSibling as HTMLInputElement).focus();
			}
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

	const handleOnFocus = (e: FocusEvent) => {
		(e.target as HTMLInputElement)?.select();
	};

	const handleOnPaste = (e: ClipboardEvent) => {
		const pastedValue = e.clipboardData?.getData('Text') || '';

		let currentInput = 0;

		for (let i = 0; i < pastedValue.length; i++) {
			const pastedCharacter = pastedValue.charAt(i);
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
		sendResult();

		e.preventDefault();
	};
</script>

<div class={containerClass}>
	{#each Array.from(Array(length).keys()) as i}
		{#key i}
			<input
				bind:this={inputsRef[i]}
				oninput={handeOnInput}
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
