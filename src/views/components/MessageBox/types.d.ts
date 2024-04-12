import type { messageBoxType } from './const';

export interface MessageBoxProps {
  message: string;
  modalStyleClass?: string;
  noScrollStyleClass?: string;
  title?: string;
  width?: number;
  btnOkayText?: string;
  btnCancelText?: string;
  okay?: Function;
  cancel?: Function;
  asyncOkay?: Function;
  destroy?: Function;
  escCancel?: boolean;
  enterOkay?: boolean;
  isConfirm?: boolean;
}

export interface MessageBoxModel {
  alert(params: MessageBoxOptions | string): void;
  confirm(params: MessageBoxOptions | string): void;
  destroy(): void;
}

export type MessageBoxType = typeof messageBoxType[keyof typeof messageBoxType];
