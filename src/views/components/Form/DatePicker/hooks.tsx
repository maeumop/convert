import { useEffect, useRef } from 'react';

export const useOutSideClick = (callback: Function) => {
  const ref = useRef<HTMLDivElement>(null);

  const onOutsideClick = (evt: MouseEvent) => {
    const el = evt.target as HTMLElement;

    if (ref.current && !ref.current?.contains(el)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', onOutsideClick);

    return () => {
      document.removeEventListener('click', onOutsideClick);
    };
  }, []);

  return ref;
};
