import { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { switchButtonColors } from './types';
import type { SwitchButtonProps } from './types';
import { mdiCheckboxMarked, mdiCheckboxBlankOutline } from '@mdi/js';
import Icon from '@mdi/react';
import './style.scss';
import { useController, useFormContext } from 'react-hook-form';
import { ValidateMessage } from '../ValidateForm';

export const SwitchButton = (props: SwitchButtonProps) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: props.name,
    rules: props.rules,
  });

  const onChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const e = evt.target;

    if (props.readOnly) {
      // 상태가 변경 되지 않도록 처리
      e.checked = !e.checked;
    } else {
      field.onChange(e.checked ? props.trueValue : props.falseValue);
      props.onChange(e.checked ? props.trueValue : props.falseValue);
    }
  };

  const wrapperClassName = useMemo<string>(
    () => ['switch-wrap ', props.color].join(''),
    [props.color],
  );

  const labelClassName = useMemo<string>(
    () =>
      [
        'switch ',
        props.small ? 'small ' : '',
        props.checkbox ? 'checkbox ' : '',
      ].join(''),
    [props.small, props.checkbox],
  );

  return (
    <div className={wrapperClassName}>
      <label className={labelClassName}>
        <input
          type="checkbox"
          disabled={props.disabled}
          readOnly={props.readOnly}
          checked={props.value == props.trueValue}
          onChange={onChange}
        />

        {props.checkbox ? (
          <Icon
            path={
              props.value == props.trueValue
                ? mdiCheckboxMarked
                : mdiCheckboxBlankOutline
            }
          />
        ) : (
          <span>
            <i></i>
          </span>
        )}

        <div className="label-text">
          {props.value === props.trueValue ? props.trueLabel : props.falseLabel}
        </div>
      </label>

      <ValidateMessage message={error?.message as string} />
    </div>
  );
};

SwitchButton.displayName = 'SwitchButton';
SwitchButton.defaultProps = {
  validate: false,
  trueValue: true,
  falseValue: false,
  trueLabel: '설정',
  falseLabel: '미설정',
  color: switchButtonColors.primary,
};
