import { useState, useMemo, createContext } from 'react';
import type { ReactNode } from 'react';
import type {
  MessageBoxContextModel,
  MessageBoxStateContextModel,
  MessageBoxProps,
  MessageBoxConfig,
} from './types';
import { messageBoxType } from './const';

export const MessageBoxStateContext =
  createContext<MessageBoxStateContextModel>({
    state: {},
    setModalState: () => {},
  });

export const MessageBoxContext = createContext<MessageBoxContextModel>({
  open: () => {},
  close: () => {},
});

export const MessageBoxProvider = ({ children }: { children: ReactNode }) => {
  const [state, setModalState] = useState<MessageBoxProps>({
    isShow: false,
    type: messageBoxType.alert,
  });

  const open = (config: MessageBoxConfig) => {
    if (!config.message) {
      throw new Error(
        'message 내용이 없을 경우 MessageBox를 표시 할 수 없습니다.',
      );
    }

    setModalState({
      isShow: true,
      type: config.type,
      title: config.title,
      message: config.message,
      okayHandler: config.okayHandler,
      cancelHandler: config.cancelHandler,
    });
  };

  const close = () => {
    setModalState({
      ...state,
      isShow: false,
    });
  };

  const stateDispatch = useMemo(() => ({ state, setModalState }), [state]);
  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <MessageBoxStateContext.Provider value={stateDispatch}>
      <MessageBoxContext.Provider value={dispatch}>
        {children}
      </MessageBoxContext.Provider>
    </MessageBoxStateContext.Provider>
  );
};
