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
  name: string;
  onChange: (v: string | boolean) => void;
  value: string | boolean;
  small?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  rules?: object;
  trueValue: string | boolean;
  falseValue: string | boolean;
  placeholder?: string;
  readOnly?: boolean;
  checkbox?: boolean;
  color?: SwitchButtonColors;
  disabled?: boolean;
}

export type SwitchButtonColors = (typeof switchButtonColors)[keyof typeof switchButtonColors];
