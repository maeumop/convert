export interface KeyIndex<T> {
  [index: string]: T;
}

// selectbox, checkbox 사용 옵션
export interface OptionItem {
  text: string;
  value: string;
  add?: string;
  code?: string;
}

export interface OptionItemGroup {
  [index: string]: OptionItem[];
}

export type MdiSvgIcon = string;
