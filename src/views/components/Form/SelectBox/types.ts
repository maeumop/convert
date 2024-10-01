export interface SelectBoxProps {
  name: string;
  onChange: (v: string[]) => void;
  value: string[];
  options: SelectBoxItem[];
  placeholder?: string;
  block?: boolean;
  rules?: object;
  width?: string | number;
  multiple: boolean;
  readOnly: boolean;
  disabled: boolean;
  isShort?: boolean;
  btnAccept?: boolean;
  maxLength?: number;
  searchable: boolean;
  blurValidate?: boolean;
  clearable: boolean;
  isLoading?: boolean;
  label?: string;
}

export interface SelectBoxItem {
  text: string;
  value: string;
}

export interface SelectBoxModel {
  element: HTMLElement | null;
  check: (silence?: boolean) => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}
