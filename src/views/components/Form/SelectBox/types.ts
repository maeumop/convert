import { ValidationRule } from "../../types"

export interface SelectBoxProps {
  onChange: (v: string | string[]) => void;
  value: string | string[];
  options: SelectBoxItem[];
  label?: string;
  inLabel?: boolean;
  placeholder?: string;
  block?: boolean;
  validate?: ValidationRule[];
  errorMessage?: string;
  width?: string | number;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  isShort?: boolean;
  btnAccept?: boolean;
  labelText?: boolean;
  maxLength?: number;
  searchable?: boolean;
  hideMessage?: boolean;
  blurValidate?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
}

export interface SelectBoxItem {
  text: string
  value: string
}

export interface SelectBoxModel {
  element: HTMLDivElement;
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}