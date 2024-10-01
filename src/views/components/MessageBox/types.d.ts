import { Dispatch, SetStateAction } from 'react';
import type { messageBoxType } from './const';

export type MessageBoxType =
  (typeof messageBoxType)[keyof typeof messageBoxType];

export interface MessageBoxProps {
  isShow?: boolean;
  type?: MessageBoxType;
  message?: string;
  title?: string;
  okayHandler?: () => void;
  cancelHandler?: () => void;
}

export type MessageBoxConfig = Partial<MessageBoxProps> & {
  message: Required<MessageBoxProps['message']>;
};

export interface MessageBoxContextModel {
  open: (config: MessageBoxConfig) => void;
  close: () => void;
}

export interface MessageBoxStateContextModel {
  state: MessageBoxProps;
  setModalState: Dispatch<SetStateAction<MessageBoxProps>>;
}
