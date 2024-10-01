import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import type { ValidationRule } from '../../types';

export interface NumberFormatProps {
  value: number;
  onChange: (v: number) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  validate?: ValidationRule[];
  errorMessage?: string;
  disabled?: boolean;
  block?: boolean;
  width?: string;
  autofocus?: boolean;
  maxLength?: number;
  readonly?: boolean;
  required?: boolean;
  hideMessage?: boolean;
}

export interface NumberFormatModel {
  element: HTMLElement | null;
  check: () => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}

