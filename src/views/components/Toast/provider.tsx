import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastStateContextModel, ToastOption } from './types';

export const ToastContext = createContext<ToastStateContextModel>({
  toastList: [],
  setToastList: () => {},
});

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {
  const [toastList, setToastList] = useState<ToastOption[]>([]);

  return (
    <ToastContext.Provider value={{ toastList, setToastList }}>
      {children}
    </ToastContext.Provider>
  );
};
