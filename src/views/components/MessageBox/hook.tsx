import { useCallback, useContext } from 'react';
import { MessageBoxContext, MessageBoxStateContext } from './provider';

export const useMessageBoxState = () => useContext(MessageBoxStateContext);

export const useMessageBox = () => {
  const context = useContext(MessageBoxContext);

  if (!context) {
    throw new Error('useMessageBox must be used within a MessageBoxProvider');
  }

  return context;
};

export const useScrollLock = () => {
  const scrollLock = useCallback(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%
    `;
  }, []);

  const scrollRelease = useCallback(() => {
    const scrollY = parseInt(document.body.style.top, 10) * -1;
    document.body.style.cssText = '';
    window.scrollTo(0, scrollY);
  }, []);

  return { scrollLock, scrollRelease };
};
