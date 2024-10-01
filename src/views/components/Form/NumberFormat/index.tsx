import { useState, useMemo, useEffect } from 'react';
import type { FormEvent, FocusEvent, CSSProperties } from 'react';
import type { NumberFormatProps } from './types';
import './style.scss';
import { useFormContext } from 'react-hook-form';
import { ValidateMessage } from '../ValidateForm';

// TODO react-form-hooks 값을 반환하는 부분에서 콤마가 유지되는 현상 수정 필요
export const NumberFormat = (props: NumberFormatProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [commaValue, setCommaValue] = useState<string>('0');

  /**
   * 입력 폼이 focus, blur 됐을때 해당 값을 체크 하여 값을 비우거나 0으로 채워 준다.
   *
   * @param { Event } evt
   */
  const zeroCheck = (evt: FocusEvent<HTMLInputElement>) => {
    const el = evt.target;

    if (evt.type === 'focus' && el.value === '0') {
      setCommaValue('');
      props.onChange(0);
    } else if (evt.type === 'blur' && !el.value.length) {
      setCommaValue('0');
      props.onChange(0);
    }
  };

  /**
   * 전달된 값을 천단위로 콤마(,)를 생성하여 반환
   *
   * @param v
   * @return format number string
   */
  const format = (v: number | string): string =>
    v === '-' ? v : new Intl.NumberFormat().format(Number(v));

  const onChange = (evt: FormEvent<HTMLInputElement>): void => {
    if (props.disabled) {
      return;
    }

    const e = evt.currentTarget;

    let value: string = e.value
      .replace(/[^\d\-]/g, '')
      .replace(/\-{2,}/g, '-')
      .replace(/^$/, '');

    value =
      value.charAt(0) === '-'
        ? `-${value.replace(/[-]/g, '')}`
        : value.replace(/[-]/g, '');

    setCommaValue(format(value));
    props.onChange(isNaN(Number(value)) ? 0 : Number(value));
  };

  const wrapperWidth = useMemo<CSSProperties>(() => {
    if (props.width) {
      return { width: props.width };
    }

    return {};
  }, [props.width]);

  const wrapperStyle = useMemo<string>(
    () => ['numberformat-wrap ', props.block ? 'block ' : ''].join(' '),
    [props.block],
  );

  useEffect(() => {
    if (props.value) {
      setCommaValue(format(props.value));
    }
  }, []);

  return (
    <div
      className={`${errors[props.name]?.message ? 'error ' : ''}${wrapperStyle}`}
      style={wrapperWidth}
    >
      <input
        id={props.name}
        type="text"
        {...register(props.name, {
          ...props.rules,
          onChange,
          onBlur: zeroCheck,
        })}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        maxLength={props.maxLength}
        onFocus={zeroCheck}
        value={commaValue}
      />

      <ValidateMessage message={errors[props.name]?.message as string} />
    </div>
  );
};

NumberFormat.displayName = 'NumberFormat';
NumberFormat.defaultProps = {
  placeholder: '',
  disabled: false,
  block: true,
  readonly: false,
};
