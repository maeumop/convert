import type { MouseEvent, ReactNode } from 'react';

export const btnColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
  'gray-800': 'gray-800'
} as const;

export type BtnColors = typeof btnColors[keyof typeof btnColors];

export interface StyledButtonProps {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactElement;
  color?: BtnColors;
  class?: string;
  href?: string;
  target?: string;
  text?: boolean;
  icon?: mdiSimpleIcons;
  iconRight?: boolean;
  onlyIcon?: boolean;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  xSmall?: boolean;
  small?: boolean;
  large?: boolean;
  outline?: boolean;
  dropMenuToggle?: boolean;
}

