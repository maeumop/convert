import { useState, useEffect, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiGoogleCirclesExtended } from '@mdi/js';
import './style.scss';
import type { MessageBoxProps } from './types';

export const MessageBox = (props: MessageBoxProps) => {
  let [isShow, setIsShow] = useState<boolean>(true);
  let [spinnerShow, setSpinnerShow] = useState<boolean>(false);
  let btnOkayRef = useRef<HTMLAnchorElement>(null);

  const hide = (): void => {
    let box: NodeList = document.body.querySelectorAll('.msg-box-bg');

    if (box.length) {
      document.body.classList.remove('hide-scroll');
    }

    setIsShow(false);
  };

  const close = (): void => {
    if (props.destroy instanceof Function) {
      document.removeEventListener('keyup', onKeyupEvent);
      props.destroy();
    }
  };

  const clickOkay = (): void => {
    if (props.okay instanceof Function) {
      props.okay();
    }

    hide();
  };

  const asyncClickOkay = async (): Promise<void> => {
    if (spinnerShow) {
      return;
    }

    setSpinnerShow(true);

    if (props.asyncOkay instanceof Function) {
      await props.asyncOkay();
    }

    hide();
  };

  const onOkayClick = () => {
    (props.asyncOkay instanceof Function)
      ? asyncClickOkay()
      : clickOkay()
  }

  const onCancelClick = (): void => {
    if (!spinnerShow) {
      if (props.cancel instanceof Function) {
        props.cancel();
      }

      hide();
    }
  };

  const onKeyupEvent = (evt: KeyboardEvent): void => {
    // Enter 키를 눌렀을 때 okay 실행
    if (evt.key === 'Enter') {
      if (props.enterOkay) {
        clickOkay();
      }
    }

    // ESC 키를 눌렀을때 창을 닫아 줌(cancel과 동일)
    if (evt.key === 'Escape') {
      if (props.escCancel) {
        onCancelClick();
      }
    }
  };

  useEffect(() => {
    document.body.classList.add('hide-scroll');

    btnOkayRef.current?.focus();
    btnOkayRef.current?.blur();

    // document.addEventListener('keyup', onKeyupEvent);
  }, []);

  return (
    <div className="msg-box-bg" tabIndex={0}>
      <div
        className="msg-box"
        style={{ width: `${props.width}px` }}
      >
        <h5 className="title">
          { props.title }
        </h5>
        <div className="contents" dangerouslySetInnerHTML={{ __html: props.message }}></div>
        <div className="actions">
          <a
            ref={btnOkayRef}
            href="#"
            className="btn-okay"
            onClick={onOkayClick}
          >
            {spinnerShow
              ? (<Icon className="loading" path={mdiGoogleCirclesExtended} />)
              : (props.btnOkayText )
            }
          </a>
          {props.isConfirm && (
            <a
              href="#"
              className="btn-cancel"
              onClick={onCancelClick}
            >
              { props.btnCancelText }
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

MessageBox.displayName = 'MessageBox';
MessageBox.defaultProps = {
  width: 320,
  btnOkayText: '확인',
  btnCancelText: '취소',
  escCancel: true,
  enterOkay: true,
  isConfirm: false,
}