import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';

export interface NumberFormatProps {
  value: number;
  name: string;
  onChange: (v: number) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rules?: object;
  disabled?: boolean;
  block?: boolean;
  width?: string;
  maxLength?: number;
  readOnly?: boolean;
  hideMessage?: boolean;
}

export interface NumberFormatModel {
  element: HTMLElement | null;
  check: () => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}
