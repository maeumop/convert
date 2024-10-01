import type { FocusEvent, KeyboardEvent, MouseEvent, MouseEventHandler } from 'react';
import type { ValidationRule } from '../../types';
import { type CaseReducer, type PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';

export interface TextFieldProps extends FieldValues {
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: TextFieldType;
  rows?: number;
  label?: string;
  placeholder?: string;
  height?: string | number;
  width?: string | number;
  block?: boolean;
  rules?: object;
  blurValidate?: boolean;
  pattern?: [RegExp, string?];
  errorMessage?: string;
  maxLength?: number;
  multiline?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  isCounting?: boolean;
  required?: boolean;
  hideMessage?: boolean;
  icon?: string;
  iconLeft?: boolean;
  iconColor?: string;
  onIconClick?: MouseEventHandler<HTMLAnchorElement>;
  clearable?: boolean;
}

export interface TextFieldModel {
  element: HTMLElement | null;
  check: (silence: boolean) => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}

export const textFieldType = {
  TXT: 'text',
  NUM: 'number',
  TEL: 'tel',
  PWD: 'password'
} as const;

export type TextFieldType = typeof textFieldType[keyof typeof textFieldType];

export interface TextFieldState {
  isValidate: boolean;
  checkPass: boolean;
  message: string;
  errorTransition: boolean;
}

export type TextFieldReducer = {
  setIsValidate: CaseReducer<TextFieldState, PayloadAction<boolean>>;
  setCheckPass: CaseReducer<TextFieldState, PayloadAction<boolean>>;
  setMessage: CaseReducer<TextFieldState, PayloadAction<string>>;
  setErrorTransition: CaseReducer<TextFieldState, PayloadAction<boolean>>;
}