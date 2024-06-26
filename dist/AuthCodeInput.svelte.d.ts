interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports;
    z_$$bindings?: Bindings;
}
declare const AuthCodeInput: $$__sveltets_2_IsomorphicComponent<{
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
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    focus: () => void;
    clear: () => void;
}, "value">;
type AuthCodeInput = InstanceType<typeof AuthCodeInput>;
export default AuthCodeInput;
