> This package is a Svelte port of Luis Guerrero's React Auth Code Input
(https://github.com/drac94/react-auth-code-input).

![image](https://jinathy.com/159784302-4bb83708-e993-4800-9bcf-091ecb709ef7.png)

# Svelte Auth Code Input

> One-time password (OTP) Svelte component, zero dependencies, fully tested.

[![NPM](https://img.shields.io/npm/v/svelte-auth-code-input.svg)](https://www.npmjs.com/package/svelte-auth-code-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/svelte-auth-code-input.svg)](https://www.npmjs.com/package/svelte-auth-code-input)
[![npm](https://img.shields.io/npm/dw/svelte-auth-code-input.svg)](https://www.npmjs.com/package/svelte-auth-code-input)
![GitHub actions state](https://img.shields.io/github/workflow/status/drac94/svelte-auth-code-input/CI)

## Demo

[Demo](https://jinathy.com/svelte-auth-code-input/)

## Install

```bash
npm install --save svelte-auth-code-input
```

or

```bash
pnpm add svelte-auth-code-input
```

or

```bash
yarn add svelte-auth-code-input
```

# Version 1+

## Basic Usage

```
<script lang="ts">
    import AuthCodeInput from 'svelte-auth-code-input';

    let result = $state<string>('');
    const handleOnChange = (res: string) => {
        result = res;
    };
</script>

<AuthCodeInput
onchange={handleOnChange}
/>
```

## Bound Input

```
<script lang="ts">
    import AuthCodeInput from 'svelte-auth-code-input';

    let result = $state<string>('');
</script>

<AuthCodeInput
  bind:value={result}
/>
```

## Mode

By default, you can type numbers and letters in the inputs as the `allowedCharacters` prop is defaulted to `alphanumeric` but you can also choose between allowing only letters or only numbers by setting the prop to `alpha` or `numeric` respectively.

```
<script lang="ts">
    import AuthCodeInput from 'svelte-auth-code-input';

    let result = $state<string>('');
    const handleOnChange = (res: string) => {
        result = res;
    };
</script>

<AuthCodeInput allowedCharacters='numeric'
onchange={handleOnChange}
/>
```

## Focus

By default the first input is focused when the component is mounted, you can opt out of this by setting the `autoFocus` prop to `false`, and then you can handle the focus manually by passing a reference.

```
<script lang="ts">
    import AuthCodeInput from 'svelte-auth-code-input';

    let AuthInputRef = $state<AuthCodeInput>();
    let result = $state<string>('');
    const handleOnChange = (res: string) => {
        result = res;
    };
</script>

<AuthCodeInput
autoFocus={false}
onchange={handleOnChange}
bind:this={AuthInputRef}
/>
<button onClick={() => AuthInputRef?.focus()}>Focus</button>
```

## Clear

You can clear all the inputs by passing a reference and then calling the `clear` method.

```
<script lang="ts">
    import AuthCodeInput from 'svelte-auth-code-input';

    let AuthInputRef = $state<AuthCodeInput>();
    let result = $state<string>('');
    const handleOnChange = (res: string) => {
        result = res;
    };
</script>

<AuthCodeInput
autoFocus={false}
onchange={handleOnChange}
bind:this={AuthInputRef}
/>
<button onClick={() => AuthInputRef?.clear()}>Clear</button>
```

## SMS Autofill

This component supports autofill from SMS' received, tested on Safari and Chrome in iOS.

## Props

| Prop                 | Type                    | Description                                                 | Default Value  | Observations                                     |
| :------------------- | :---------------------- | :---------------------------------------------------------- | :------------- | :----------------------------------------------- |
| `allowedCharacters`  | String                  | Type of allowed characters for your code.                   | `alphanumeric` | Valid values: `alpha`, `alphanumeric`, `numeric` |
| `ariaLabel`          | String                  | Accessibility.                                              |                |                                                  |
| `autoFocus`          | Boolean                 | Whether the first input is focused on mount or not..         | true           |                             |
| `length`             | Number                  | The number of inputs to display.                            | 6              |                                                  |
| `containerClass` | String                  | The styles to be applied to the container.                  |                |                                                  |
| `inputClass`     | String                  | The styles to be applied to each input.                     |                |                                                  |
| `onchange`           | Function(value: String) | Callback function called every time an input value changes. |                | Required                                         |
| `isPassword`         | Boolean                 | Whether to display the inputs as passwords or not.          | false          |                                                  |
| `disabled`           | Boolean                 | Makes all the inputs disabled if true.                      | false          |            |
| `placeholder`        | String                  | Displays a placeholder in all the inputs.                   |                |                               |
| `value`        | String                  | Bindable value (one way; component -> parent)                  |                |                               |
| `name`        | String                  | Copies the result to a hidden input with this name for use in forms.                   |                |                               |

## Changelog

### 1.0.0

Added this README

## License

Licensed under the MIT License, Copyright © 2024-present Jin Chan [jinbe](https://github.com/jinbe).

See [LICENSE](./LICENSE) for more information.