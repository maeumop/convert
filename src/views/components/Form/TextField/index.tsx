import { useMemo } from 'react';
import type { MouseEvent, CSSProperties, FocusEvent, FormEvent } from 'react';
import type { TextFieldProps } from './types';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import { useFormContext } from 'react-hook-form';
import { ValidateMessage } from '../ValidateForm';
import './style.scss';

export const TextField = (props: TextFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const styleWidth = useMemo<CSSProperties>(() => {
    if (typeof props.width === 'number') {
      return { width: `${props.width}px` };
    } else if (typeof props.width === 'string') {
      return { width: props.width };
    }

    return {};
  }, [props.width]);

  const wrapperStyle = useMemo<string>(
    () => ['input-wrap ', props.block ? 'block ' : ''].join(' '),
    [props.block],
  );

  const inputStyleClass = useMemo<string>(
    () =>
      [
        props.icon && props.iconLeft ? 'left-space ' : '',
        props.icon && !props.iconLeft ? 'right-space ' : '',
      ].join(''),
    [errors, props.icon, props.iconLeft],
  );

  const clearButtonShow = useMemo<boolean>(
    () =>
      props.clearable !== undefined &&
      props.value !== '' &&
      !props.disabled &&
      !props.readOnly,
    [props.clearable, props.value, props.disabled, props.readOnly],
  );

  const onChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!props.disabled) {
      const target = event.currentTarget;

      // textarea maxlength 기능이 없기 때문에 코드로 구현
      if (
        props.isCounting &&
        props.maxLength &&
        target.value.length > props.maxLength
      ) {
        const cut = target.value.substring(0, props.maxLength);
        target.value = cut;
      }

      props.onChange(target.value);
    }
  };

  const clearValue = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    const el = document.getElementById(props.name) as
      | HTMLInputElement
      | HTMLTextAreaElement;
    el.value = '';
    props.onChange('');
  };

  const onBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  return (
    <div className={wrapperStyle} style={styleWidth}>
      {props.multiline ? (
        <textarea
          id={props.name}
          className={`${errors[props.name]?.message ? 'error ' : ''}${inputStyleClass}`}
          placeholder={props.placeholder}
          defaultValue={props.value}
          style={{ height: props.height && `${props.height}px` }}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          {...register(props.name, {
            onChange,
            onBlur,
            disabled: props.disabled,
            ...props.rules,
          })}
        ></textarea>
      ) : (
        <div className="with-slot">
          <div className="input-relative">
            <input
              id={props.name}
              className={`${errors[props.name]?.message ? 'error ' : ''}${inputStyleClass}`}
              placeholder={props.placeholder}
              defaultValue={props.value}
              readOnly={props.readOnly}
              maxLength={props.maxLength}
              {...register(props.name, {
                onChange,
                onBlur,
                disabled: props.disabled,
                ...props.rules,
              })}
            />

            {clearButtonShow && (
              <a href="#" onClick={clearValue}>
                <Icon size="20" path={mdiCloseCircle} color={props.iconColor} />
              </a>
            )}
          </div>
          {props.icon && props.onIconClick !== null && (
            <a href="#" onClick={props.onIconClick}>
              <Icon
                size="24"
                className={props.iconLeft ? 'left' : undefined}
                path={props.icon}
                color={props.iconColor ?? 'grey'}
              />
            </a>
          )}
          {props.icon && props.onIconClick === null && (
            <a href="#">
              <Icon
                size="24"
                className={props.iconLeft ? 'left' : undefined}
                path={props.icon}
                color={props.iconColor ?? 'grey'}
              />
            </a>
          )}
          <slot></slot>
        </div>
      )}

      <ValidateMessage message={errors[props.name]?.message as string} />
    </div>
  );
};

TextField.displayName = 'TextField';
TextField.defaultProps = {
  rows: 5,
  type: 'text',
  placeholder: '',
  rules: {},
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
