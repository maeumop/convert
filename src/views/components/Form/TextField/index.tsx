import { useState, useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { CSSProperties, FocusEvent, FormEvent } from 'react';
import type { TextFieldModel, TextFieldProps } from './types';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import uuid from 'react-uuid';
import './style.scss';

export const TextField = forwardRef<TextFieldModel, TextFieldProps>((props, ref) => {
  const elementId = uuid();

  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
    if (props.errorMessage !== undefined) {
      setMessage(props.errorMessage);
      setIsValidate(false);
      setCheckPass(false);
      setErrorTransition(true);
    } else {
      setMessage('');
      setIsValidate(true);
      setCheckPass(true);
      setErrorTransition(false);
    }
  }, [props.errorMessage]);

  useEffect(() => {
    resetValidate();
  }, [props.validate]);

  useEffect(() => {
    if (props.value || props.disabled) {
      resetValidate();
    }
  }, [props.value, props.disabled]);

  const successful = useMemo<boolean>(() => isValidate && checkPass, [isValidate, checkPass]);
  const styleWidth = useMemo<CSSProperties>(() => {
    if (typeof props.width === 'number') {
      return { width: `${props.width}px` };
    } else if (typeof props.width === 'string') {
      return { width: props.width };
    }

    return {};
  }, [props.width]);

  const wrapperStyle = useMemo<string>(() => {
    return ['input-wrap', props.label && 'with-label',
      !isValidate && 'error', successful && 'success',
      props.block && 'block'
    ].join(' ');
  }, [props.label, isValidate, successful]);

  const labelStyle = useMemo<string>(() => {
    return ['input-label', isValidate && 'error'].join(' ');
  }, [isValidate]);

  const inputStyleClass = useMemo<string>(() => [
    message && 'error',
    (props.icon && props.iconLeft) && 'left-space',
    (props.icon && !props.iconLeft) && 'right-space',
  ].join(' '), [message, props.icon, props.iconLeft]);

  const updateValue = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!props.disabled) {
      const target = event.currentTarget;

      // textarea maxlength 기능이 없기 때문에 코드로 구현
      if (props.isCounting && props.maxLength && (target.value.length > props.maxLength)) {
        const cut = target.value.substring(0, props.maxLength);
        target.value = cut;
      }

      props.onChange(target.value);
    }
  };

  const clearValue = (): void => {
    props.onChange('');
  };

  const clearButtonShow = useMemo<boolean>(
    () => props.clearable !== undefined && props.value !== '' && !props.disabled && !props.readonly
    , [props.clearable, props.value, props.disabled, props.readonly]);

  const check = (silence?: boolean): boolean => {
    if (props.disabled) {
      return true;
    }

    // 임의로 지정된 에러가 없는 경우
    if (props.errorMessage === '') {

      // trim 되지 않은 value 값
      const checkValue: string = (props.multiline
        ? textareaRef.current?.value
        : inputRef.current?.value
      ) || '';

      // pattern check
      if (Array.isArray(props.pattern)) {
        const [regExp, errMsg] = props.pattern;

        if (regExp) {
          if (regExp.test(checkValue)) {
            setMessage('');
          } else {
            if (!silence) {
              setMessage(errMsg ? errMsg : '형식이 일치 하지 않습니다.');
              setIsValidate(false);
              setCheckPass(false);
              setErrorTransition(true);
            }

            return false;
          }
        }
      }

      // validate check
      if (props.validate?.length) {
        for (let i = 0; i < props.validate.length; i++) {
          const result: string | boolean = props.validate[i](checkValue);

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
    props.onChange('');
  };

  const resetValidate = (): void => {
    setIsValidate(true);

    if (!props.errorMessage) {
      setMessage('');
      setErrorTransition(false);
    }
  };

  const feedbackRef = useRef<HTMLDivElement>(null);

  const onBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props.blurValidate) {
      check();
    }

    if (props.onBlur) {
      props.onBlur(event);
    }
  }

  const onAminationEnd = () => {
    setErrorTransition(false);
  }

  const feedbackMemo = useMemo<string>(() => `feedback ${errorTransition && 'error'}`, [errorTransition]);

  useEffect(() => {
    if (props.autofocus) {
      if (props.multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    element: document.getElementById(elementId),
    check,
    resetForm,
    resetValidate,
  }));

  return (
    <div
      id={elementId}
      className={wrapperStyle}
      style={styleWidth}
    >
      <div className="options-wrap">
        {
          props.label !== null && (
          <label className={labelStyle}>
            {props.label}
            {props.required && (<span className="required">*</span>)}
          </label>
        )}

        {
          props.isCounting && props.maxLength && (
          <div className="counting">
            {props.value.length}
            / {props.maxLength}
          </div>
        )}
      </div>

      {
        props.multiline ? (
        <textarea
          ref={textareaRef}
          className={inputStyleClass}
          style={{ height: props.height && `${props.height}px` }}
          rows={props.rows}
          placeholder={props.placeholder}
          value={props.value}
          readOnly={props.readonly}
          disabled={props.disabled}
          onInput={updateValue}
          onBlur={onBlur}
          onFocus={props.onFocus}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
          onClick={props.onClick}
        >
        </textarea>
      ) : (
        <div className="with-slot">
          <div className="input-relative">
            <input
              ref={inputRef}
              type={props.type}
              className={inputStyleClass}
              placeholder={props.placeholder}
              value={props.value}
              disabled={props.disabled}
              readOnly={props.readonly}
              maxLength={props.maxLength}
              autoComplete={props.type === 'password' ? 'off' : 'on'}
              onInput={updateValue}
              onBlur={onBlur}
              onFocus={props.onFocus}
              onKeyDown={props.onKeyDown}
              onKeyUp={props.onKeyUp}
              onClick={props.onClick}
            />

            {
              clearButtonShow &&
              <a
                href="#"
                onClick={clearValue}
              >
                <Icon
                  size="20"
                  path={mdiCloseCircle}
                  color={props.iconColor}
                />
              </a>
            }
          </div>
          {
            (props.icon && props.onIconClick !== null) && (
            <a href="#" onClick={props.onIconClick}>
              <Icon
                size="24"
                className={props.iconLeft ? 'left' : undefined}
                path={props.icon}
                color={props.iconColor ?? "grey"}
              />
            </a>
          )}
          {
            (props.icon && props.onIconClick === null) && (
            <Icon
              size="24"
              className={props.iconLeft ? 'left' : undefined}
              path={props.icon}
              color={props.iconColor ?? "grey"}
            />
          )}
          <slot></slot>
        </div>
      )}

      {
        (message && !props.hideMessage) && (
        <div
          ref={feedbackRef}
          className={feedbackMemo}
          onAnimationEnd={onAminationEnd}
        >
          {message}
        </div>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';
TextField.defaultProps = {
  rows: 5,
  type: 'text',
  placeholder: '',
  validate: [],
  blurValidate: true,
  errorMessage: '',
  clearable: false,
  disabled: false,
  readonly: false,
  required: false,
  isCounting: false,
  autofocus: false,
  multiline: false,
  iconLeft: false,
  hideMessage: false,
  block: true,
  iconColor: 'grey',
}