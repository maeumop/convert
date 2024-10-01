import { useCallback, useContext, useEffect } from 'react';
import { ToastContext } from './provider';
import type { ToastHooksModel, ToastOption } from './types';
import uuidv4 from 'react-uuid';

const TOAST_SHOW_TIME = 3000;

export const useToastMessage = (): ToastHooksModel => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToastMessage must be used within a ToastMessageProvider',
    );
  }

  const { toastList, setToastList } = context;

  const toast = useCallback(
    (opt: ToastOption | string) => {
      const key = uuidv4();
      const option =
        typeof opt === 'string'
          ? { message: opt as string, key }
          : { ...opt, key };

      setToastList([...toastList, option]);
    },
    [toastList],
  );

  useEffect(() => {
    setTimeout(() => {
      const copyValue = [...toastList];
      copyValue.splice(0, 1);

      setToastList(copyValue);
    }, TOAST_SHOW_TIME);
  }, [toastList]);

  return { ...context, toast };
};
