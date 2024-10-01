export const checkButtonColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const;

export const checkButtonType = {
  checkbox: 'checkbox',
  radio: 'radio',
} as const;

export type CheckButtonColors = (typeof checkButtonColors)[keyof typeof checkButtonColors];

export type CheckButtonType = (typeof checkButtonType)[keyof typeof checkButtonType];

export interface CheckButtonItem {
  text: string;
  value: string;
}

export interface CheckButtonProps {
  onChange: (v: string[]) => void;
  items: CheckButtonItem[];
  name: string;
  value: string[];
  type?: CheckButtonType;
  all?: boolean;
  maxLength?: number;
  rules?: object;
  button?: boolean;
  block?: boolean;
  color?: CheckButtonColors;
  disabled?: boolean;
  lineLimit?: number;
}
