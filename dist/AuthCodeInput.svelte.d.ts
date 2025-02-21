declare const AuthCodeInput: import("svelte").Component<{
    allowedCharacters?: "alpha" | "numeric" | "alphanumeric";
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
}, {
    focus: () => void;
    clear: () => void;
}, "value">;
type AuthCodeInput = ReturnType<typeof AuthCodeInput>;
export default AuthCodeInput;
