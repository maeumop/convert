import { Fragment, useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { CheckButtonItem, CheckButtonProps } from './types';
import { checkButtonColors, checkButtonType } from './types';
import {
  mdiRadioboxMarked,
  mdiCircle,
  mdiRadioboxBlank,
  mdiCheckboxMarked,
  mdiCheckboxBlank,
  mdiCheckboxBlankOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useController, useFormContext } from 'react-hook-form';
import { ValidateMessage } from '../ValidateForm';
import './style.scss';

export const CheckButton = (props: CheckButtonProps) => {
  const { control } = useFormContext();
  const {
    field,
    formState: { errors },
  } = useController({
    defaultValue: [],
    name: props.name,
    control,
    rules: props.rules,
  });

  const lineLimit: number = props.lineLimit !== undefined ? props.lineLimit : 0;

  const [list, setList] = useState<CheckButtonItem[]>([]);
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (props.items.length) {
      setList([...props.items]);

      if (props.all) {
        setList([{ text: '전체 선택', value: '' }, ...props.items]);
      }
    }
  }, [props.items]);

  const wrapClassName = useMemo<string>(() => {
    return ['check-button', props.button, props.color].join(' ');
  }, [props.button]);

  const checkButtonGroupClassName = useMemo<string>(() => {
    return [
      'check-button-group',
      props.color,
      props.disabled ? 'disabled' : '',
    ].join(' ');
  }, [props.color, props.disabled]);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const v = evt.target.value;
    const copyValue = [...value];
    const indexOf = copyValue.indexOf(v);

    if (indexOf > -1) {
      copyValue.splice(indexOf, 1);
    } else {
      copyValue.push(v);
    }

    setValue(copyValue);
    field.onChange(copyValue);
  };

  const iconType = (v: string) => {
    if (props.type === checkButtonType.radio) {
      if (props.disabled) {
        return mdiRadioboxBlank;
      } else {
        return value.includes(v) ? mdiRadioboxMarked : mdiCircle;
      }
    } else {
      if (props.disabled) {
        return mdiCheckboxBlank;
      } else {
        return value.includes(v) ? mdiCheckboxMarked : mdiCheckboxBlankOutline;
      }
    }
  };

  return (
    <div className={wrapClassName}>
      {props.button ? (
        <div className={checkButtonGroupClassName}>
          {list.map((item, i) => {
            return (
              <label
                key={item.value}
                className={list.length - 1 === i ? 'last' : ''}
                htmlFor={`${props.name}-${item.value}`}
              >
                <input
                  id={`${props.name}-${item.value}`}
                  type={props.type}
                  name={props.name}
                  disabled={props.disabled}
                  checked={value.includes(item.value)}
                  value={item.value}
                  onChange={onChange}
                />

                {item.text}
              </label>
            );
          })}
        </div>
      ) : (
        list.map((item, i) => {
          return (
            <Fragment key={item.value}>
              <div
                className={[
                  'origin-check-button',
                  props.block ? 'block' : '',
                ].join(' ')}
              >
                <label htmlFor={`${props.name}-${item.value}`}>
                  <input
                    type={props.type}
                    id={`${props.name}-${item.value}`}
                    name={props.name}
                    disabled={props.disabled}
                    checked={value.includes(item.value)}
                    value={item.value}
                    onChange={onChange}
                  />

                  <Icon path={iconType(item.value)} />

                  {item.text}
                </label>
              </div>
              {(i + 1) % lineLimit === 0 && (
                <div key={'line-break-' + item.value} className="line-break" />
              )}
            </Fragment>
          );
        })
      )}

      <ValidateMessage message={errors[props.name]?.message as string} />
    </div>
  );
};

CheckButton.displayName = 'CheckButton';
CheckButton.defaultProps = {
  type: checkButtonType.checkbox,
  all: false,
  maxLength: 0,
  validate: [],
  button: false,
  block: true,
  color: checkButtonColors.primary,
  disabled: false,
  lineLimit: 0,
};
