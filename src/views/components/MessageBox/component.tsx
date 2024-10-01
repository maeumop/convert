import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { messageBoxType } from './const';
import { useMessageBoxState, useScrollLock } from './hook';
import { CSSTransition } from 'react-transition-group';
import './style.scss';

export const MessageBox = () => {
  const { state, setModalState } = useMessageBoxState();

  const onCancelClick = (event: MouseEvent) => {
    event.preventDefault();

    if (state.okayHandler) {
      state.okayHandler();
    }

    setModalState({
      ...state,
      isShow: false,
    });
  };

  const onOkayClick = (event: MouseEvent) => {
    event.preventDefault();

    if (state.cancelHandler) {
      state.cancelHandler();
    }

    setModalState({
      ...state,
      isShow: false,
    });
  };

  const { scrollLock, scrollRelease } = useScrollLock();

  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.isShow) {
      scrollLock();
    }

    return () => {
      if (state.isShow) {
        scrollRelease();
      }
    };
  }, [state.isShow]);

  return (
    <CSSTransition
      unmountOnExit
      timeout={200}
      in={state.isShow}
      nodeRef={transitionRef}
      classNames="msg-box"
    >
      <div className="msg-box-bg" tabIndex={0}>
        <div ref={transitionRef} className="msg-box">
          {state.title && <h5 className="title">{state.title}</h5>}
          <div
            className="contents"
            dangerouslySetInnerHTML={{ __html: state.message ?? '' }}
          />
          <div className="actions">
            {state.type === messageBoxType.confirm && (
              <a href="#" className="btn-cancel" onClick={onCancelClick}>
                취소
              </a>
            )}

            <a href="#" className="btn-okay" onClick={onOkayClick}>
              확인
            </a>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
