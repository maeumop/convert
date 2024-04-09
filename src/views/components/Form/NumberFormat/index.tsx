import { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { FormEvent, FocusEvent, CSSProperties } from 'react';
import type { NumberFormatProps, NumberFormatModel } from './types';
import uuid from 'react-uuid';
import './style.scss';

export const NumberFormat = forwardRef<NumberFormatModel, NumberFormatProps>((props, ref) => {
  const elementId: string = uuid();

  const [commaValue, setCommaValue] = useState <string>('0');
  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 임의로 지정된 에러가 있는 경우 에러 표기
    if (props.errorMessage) {
      setMessage(props.errorMessage);
      setIsValidate(false);
      setErrorTransition(true);
    } else {
      resetValidate();
    }

    if (!props.disabled) {
      // 외부에서 model이 업데이트 되도 유효성 검사
      if (props.value) {
        resetValidate();

        if (inputRef.current?.value) {
          setCommaValue(format(props.value));
        }
      }
    }
  }, [props.errorMessage, props.value]);

  useEffect(() => {
    if (props.disabled) {
      resetValidate();
    }
  }, [props.disabled]);

  const successful = useMemo<boolean>(() => isValidate && checkPass, [isValidate, checkPass]);
  const wrapperStyle = useMemo<string>(() => [
    'numberformat-wrap',
    props.label && 'with-label',
    !isValidate && 'error',
    successful && 'success',
    props.block && 'block'
  ].join(' '), [props.label, isValidate, successful, props.block]);

  /**
   * 입력 폼이 focus, blur 됐을때 해당 값을 체크 하여 값을 비우거나 0으로 채워 준다.
   *
   * @param { Event } evt
   */
  const zeroCheck = (evt: FocusEvent<HTMLInputElement>) => {
    if (evt.type === 'focus' && inputRef.current?.value === '0') {
      setCommaValue('');
      props.onChange(0);
    } else if (evt.type === 'blur' && !inputRef.current?.value.length) {
      setCommaValue('0');
      props.onChange(0);

      if (!props.onBlur) {
        check();
      }
    }
  };

  /**
   * 전달된 값을 천단위로 콤마(,)를 생성하여 반환
   *
   * @param v
   * @return format number string
   */
  const format = (v: number | string): string => (v === '-') ? v : new Intl.NumberFormat().format(Number(v));

  const updateValue = (evt: FormEvent<HTMLInputElement>): void => {
    if (props.disabled) {
      return;
    }

    const e = evt.currentTarget;

    let value: string = e.value
      .replace(/[^\d\-]/g, '')
      .replace(/\-{2,}/g, '-')
      .replace(/^$/, '');

    value = (value.charAt(0) === '-')
      ? '-'.concat(value.replace(/[-]/g, ''))
      : value.replace(/[-]/g, '');

    if (value) {
      setCommaValue(format(value));
      props.onChange(isNaN(Number(value)) ? 0 : Number(value));
    }
  };

  const check = (silence: boolean = false): boolean => {
    if (props.disabled) {
      return true;
    }

    // 임의로 지정된 에러가 없는 경우
    if (!props.errorMessage) {
      // validate check
      if (props.validate.length) {
        for (let i: number = 0; i < props.validate.length; i++) {
          let result: string | boolean = props.validate[i](props.value);

          if (typeof result === 'string') {
            if (!silence) {
              setMessage(result);
              setIsValidate(false);
              setCheckPass(false);
              setErrorTransition(true);
            }

            return false;
          } else {
            setMessage('');
          }
        }
      }

      setIsValidate(true);
      setCheckPass(true);

      return true;
    }

    setErrorTransition(true);

    return false;
  };

  const resetForm = (): void => {
    setCommaValue('0');
    props.onChange(0)
  };

  const resetValidate = (): void => {
    setMessage('');
    setIsValidate(true);
    setErrorTransition(false);
  };

  const wrapperWidth = useMemo<CSSProperties>(() => {
    if (props.width) {
      return { width: props.width };
    }

    return {};
  }, [props.width]);

  const labelClassMemo = useMemo<string>(() => [
    'input-label',
    !isValidate && 'error'
  ].join(' '), [isValidate])

  const feedbackMemo = useMemo<string>(() => [
    'feedback',
    errorTransition && 'error'
  ].join(' '), [errorTransition]);

  const feedback = useRef<HTMLDivElement>(null);

  const onAnimationEnd = () => {
    console.log('here!');
    setErrorTransition(false);
  }

  useEffect(() => {
    if (props.autofocus && inputRef.current?.value) {
      inputRef.current.focus();
    }

    if (props.value && inputRef.current?.value) {
      setCommaValue(format(props.value));
    }
  }, []);

  useImperativeHandle(ref, () => {
    return {
      element: document.getElementById(elementId),
      check,
      resetForm,
      resetValidate,
    }
  });

  return (
    <div
      id={elementId}
      className={ wrapperStyle }
      style={ wrapperWidth }
    >

      <div className="options-wrap">
        {props.label && (
          <label className={labelClassMemo}>
            { props.label }
            <span className="required" v-if="props.required">*</span>
          </label>
        )}
      </div>

      <input
        type="text"
        ref={ inputRef }
        placeholder={ props.placeholder }
        disabled={ props.disabled }
        readOnly={ props.readonly }
        maxLength={ props.maxLength }
        onInput={ updateValue }
        onFocus={ zeroCheck }
        onBlur={ zeroCheck }
        value={ commaValue }
      />

      {message && !props.hideMessage && (
        <div
          ref={ feedback }
          className={feedbackMemo}
          onAnimationEnd={ onAnimationEnd }
        >
          { message }
        </div>
      )}
    </div>
  );
});

NumberFormat.displayName = 'NumberFormat';
NumberFormat.defaultProps = {
  label: undefined,
  placeholder: undefined,
  validate: [],
  errorMessage: undefined,
  disabled: false,
  block: true,
  autofocus: false,
  readonly: false,
  required: false,
  hideMessage: false,
  onBlur: undefined,
  onFocus: undefined,
  onKeyDown: undefined,
  onKeyUp: undefined,
  onClick: undefined,
  width: undefined,
  maxLength: undefined,
}