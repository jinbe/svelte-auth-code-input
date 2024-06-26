<script lang="ts">const allowedCharactersValues = ["alpha", "numeric", "alphanumeric"];
let {
  allowedCharacters = "alphanumeric",
  ariaLabel,
  autoFocus = true,
  containerClass,
  disabled,
  inputClass,
  isPassword = false,
  length = 6,
  placeholder,
  onchange,
  value = $bindable(void 0),
  name
} = $props();
if (isNaN(length) || length < 1) {
  throw new Error("Length should be a number and greater than 0");
}
if (!allowedCharactersValues.some((value2) => value2 === allowedCharacters)) {
  throw new Error("Invalid value for allowedCharacters. Use alpha, numeric, or alphanumeric");
}
let inputsRef = $state([]);
export const focus = () => {
  inputsRef[0]?.focus();
};
export const clear = () => {
  for (const ref of inputsRef) {
    ref.value = "";
  }
  inputsRef[0]?.focus();
  sendResult();
};
const propsMap = {
  alpha: {
    type: "text",
    inputMode: "text",
    pattern: "[a-zA-Z]{1}"
  },
  alphanumeric: {
    type: "text",
    inputMode: "text",
    pattern: "[a-zA-Z0-9]{1}"
  },
  numeric: {
    type: "tel",
    inputMode: "numeric",
    pattern: "[0-9]{1}",
    min: "0",
    max: "9"
  }
};
const inputProps = $derived(propsMap[allowedCharacters]);
$effect(() => {
  if (autoFocus) {
    inputsRef[0]?.focus();
  }
});
const sendResult = () => {
  value = inputsRef.map((input) => input.value).join("");
  if (onchange) {
    onchange(value);
  }
};
const handeOnInput = (e) => {
  console.log(e);
  if (e.currentTarget.value.length > 1) {
    e.currentTarget.value = e.currentTarget.value.charAt(0);
    if (e.currentTarget.nextElementSibling !== null) {
      e.currentTarget.nextElementSibling.focus();
    }
  } else {
    if (e.currentTarget.value.match(inputProps.pattern)) {
      if (e.currentTarget.nextElementSibling !== null) {
        e.currentTarget.nextElementSibling.focus();
      }
    } else {
      e.currentTarget.value = "";
    }
  }
  sendResult();
};
const handleOnKeyDown = (e) => {
  const { key } = e;
  const target = e.target;
  if (key === "Backspace") {
    if (target.value === "") {
      if (target.previousElementSibling !== null) {
        const t = target.previousElementSibling;
        t.value = "";
        t.focus();
        e.preventDefault();
      }
    } else {
      target.value = "";
    }
    sendResult();
  }
};
const handleOnFocus = (e) => {
  e.target?.select();
};
const handleOnPaste = (e) => {
  const pastedValue = e.clipboardData?.getData("Text") || "";
  let currentInput = 0;
  for (let i = 0; i < pastedValue.length; i++) {
    const pastedCharacter = pastedValue.charAt(i);
    const currentValue = inputsRef[currentInput]?.value;
    if (pastedCharacter.match(inputProps.pattern)) {
      if (!currentValue) {
        if (inputsRef[currentInput]) {
          inputsRef[currentInput].value = pastedCharacter;
          if (inputsRef[currentInput].nextElementSibling !== null) {
            inputsRef[currentInput].nextElementSibling.focus();
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
