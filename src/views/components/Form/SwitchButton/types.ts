export const switchButtonColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const;

export interface SwitchButtonProps {
  onChange: (v: string | boolean) => void;
  value: string | boolean;
  small?: boolean;
  label?: string[];     // [0 => false label, 1 => true label]
  validate?: string | boolean;
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  placeholder?: string;
  readonly?: boolean;
  checkbox?: boolean;
  color?: SwitchButtonColors;
  disabled?: boolean;
}

export type SwitchButtonColors = typeof switchButtonColors[keyof typeof switchButtonColors];

export interface SwitchButtonModel {
  element: HTMLElement | null;
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}