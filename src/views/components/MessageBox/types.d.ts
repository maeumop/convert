import type { messageBoxType } from './const';

export interface MessageBoxOptions {
  type?: MessageBoxType
  message: string
  title?: string
  width?: number
  btnOkayText?: string
  btnCancelText?: string
  okay?: Function
  cancel?: Function
  asyncOkay?: Function
  destroy?: Function
  escCancel?: boolean
  enterOkay?: boolean
}

export interface MessageBoxModel {
  alert(params: MessageBoxOptions | string): void
  confirm(params: MessageBoxOptions | string): void
  destroy(): void
}

export type MessageBoxType = typeof messageBoxType[keyof typeof messageBoxType];
