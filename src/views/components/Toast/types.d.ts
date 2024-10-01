import type { toastColorCase, toastIconCase } from './const';
import type { Dispatch, RefObject, SetStateAction } from 'react';

export interface ToastOption {
  key?: string;
  message: string;
  icon?: string;
  color?: string;
}

export interface ToastProps {
  toast: ToastOption[];
  delay: number;
  timeout: NodeJS.Timeout[];
}

export interface ToastStateContextModel {
  toastList: ToastOption[];
  setToastList: Dispatch<SetStateAction<ToastOption[]>>;
}

export interface ToastHooksModel extends ToastStateContextModel {
  toast: (option: ToastOption | string) => void;
}

export type ToastType = (typeof toastType)[keyof typeof toastType];

export type ToastIcon = (typeof toastIcon)[keyof typeof toastIcon];

export interface ToastOptions {
  maxShowMessage?: number;
  delay?: number;
  destroy: Function;
}
