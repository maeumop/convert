import { useState, useRef, useEffect, useMemo } from 'react';
import type { CSSProperties, FocusEvent, FormEvent } from 'react';
import type { TextFieldModel, TextFieldProps } from './types';
import { mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import './style.scss';
import { useController, useFormContext } from 'react-hook-form';

export const TextField = (props: TextFieldProps) => {
  const { register } = useFormContext();

  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const styleWidth = useMemo<CSSProperties>(() => {
    if (typeof props.width === 'number') {
      return { width: `${props.width}px` };
    } else if (typeof props.width === 'string') {
      return { width: props.width };
    }

    return {};
  }, [props.width]);
  const successful = useMemo<boolean>(() => isValidate && checkPass, [isValidate, checkPass]);
  const wrapperStyle = useMemo<string>(() => [
    'input-wrap ',
    props.label ? 'with-label ' : '',
    !isValidate ? 'error ' : '',
    successful ? 'success ' : '',
    props.block ? 'block ' : '',
  ].join('').trim(), [props.label, props.block, isValidate, successful]);

  const labelStyle = useMemo<string>(() => [
    'input-label ',
    isValidate ? 'error ' : '',
  ].join('').trim(), [isValidate]);

  const inputStyleClass = useMemo<string>(() => [
    message ? 'error ' : '',
    (props.icon && props.iconLeft) ? 'left-space ' : '',
    (props.icon && !props.iconLeft) ? 'right-space ' :  '',
  ].join('').trim(), [message, props.icon, props.iconLeft]);

  const clearButtonShow = useMemo<boolean>(
    () => props.clearable !== undefined && props.value !== '' && !props.disabled && !props.readonly
  , [props.clearable, props.value, props.disabled, props.readonly]);

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


  const resetValidate = (): void => {
    setIsValidate(true);

    if (!props.errorMessage) {
      setMessage('');
      setErrorTransition(false);
    }
  };

  const onBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

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

  useEffect(() => {
    if (props.autofocus) {
      if (props.multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, []);

  return (
    <div
      className={wrapperStyle}
      style={styleWidth}
    >
      {props.multiline ? (
        <textarea
          {...register(props.name)}
          name={props.name}
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
              {...register(props.name)}
              name={props.name}
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

            {clearButtonShow &&
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
          {(props.icon && props.onIconClick !== null) && (
            <a href="#" onClick={props.onIconClick}>
              <Icon
                size="24"
                className={props.iconLeft ? 'left' : undefined}
                path={props.icon}
                color={props.iconColor ?? "grey"}
              />
            </a>
          )}
          {(props.icon && props.onIconClick === null) && (
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

    </div>
  );
};

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
};