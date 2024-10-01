import { useState, useRef, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { ChangeEvent } from 'react';
import { switchButtonColors } from './types';
import type { SwitchButtonModel, SwitchButtonProps } from './types';
import { mdiCheckboxMarked, mdiCheckboxBlankOutline } from '@mdi/js';
import uuid from 'react-uuid';
import Icon from '@mdi/react';
import './style.scss';

export const SwitchButton = forwardRef<SwitchButtonModel, SwitchButtonProps>((props, ref) => {
  const elementId = uuid();

  const [onError, setOnError] = useState<boolean>(false);
  const [errorTransition, setErrorTransition] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isValidate, setIsValidate] = useState<boolean>(true);

  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetForm();
  }, [props.value]);

  useEffect(() => {
    if (errorTransition) {
      setTimeout(() => {
        setErrorTransition(false);
      }, 300);
    }
  }, [errorTransition]);

  const check = (silence: boolean = false): boolean => {
    // validate check
    if (props.validate) {
      if (props.value === props.trueValue) {
        resetForm();
        return true;
      } else {
        if (!silence) {
          const labelText = Array.isArray(props.label) ? props.label[0] : '';

          setMessage(
            typeof props.validate === 'string'
              ? props.validate
              : `${labelText}을(를) 선택해주세요.`
          );
          setOnError(true);
          setIsValidate(false);
          setErrorTransition(true);
        }

        return false;
      }
    }

    return true;
  };

  const resetForm = (): void => {
    resetValidate();
  };

  const resetValidate = (): void => {
    setMessage('');
    setOnError(false);
    setIsValidate(true);
    setErrorTransition(false);
  };

  const updateValue = (evt: ChangeEvent<HTMLInputElement>): void => {
    const e = evt.target;

    if (!props.readonly) {
      props.onChange(e.checked ? props.trueValue! : props.falseValue!)
    } else {
      // 상태가 변경 되지 않도록 처리
      e.checked = !e.checked;
    }
  };

  const onAnimationEnd = () => {
    setErrorTransition(false);
  }

  const wrapperClassName = useMemo<string>(() => [
    'switch-wrap ',
    props.color
  ].join(''), [props.color]);

  const labelClassName = useMemo<string>(() => [
    'switch ',
    props.small ? 'small ' : '',
    props.checkbox ? 'checkbox ' : '',
    onError ? 'error ' : '',
  ].join(''), [onError]);

  const errorTransitionClassName = useMemo<string>(() => [
    'feedback ',
    errorTransition ? 'error ' : '',
  ].join(''), [errorTransition]);

  useImperativeHandle(ref, () => ({
    element: document.getElementById(elementId),
    resetValidate,
    check,
    resetForm
  }));

  return (
    <div id={elementId} className={wrapperClassName}>
      <label className={labelClassName}>
        <input
          type="checkbox"
          disabled={props.disabled}
          readOnly={props.readonly}
          checked={props.value == props.trueValue}
          onChange={updateValue}
        />

        {props.checkbox ? (
          <Icon path={props.value == props.trueValue ? mdiCheckboxMarked : mdiCheckboxBlankOutline} />
        ) : (
          <span><i></i></span>
        )}

        <div className="label-text">
          {props.value === props.trueValue
              ? (props.label && props.label[1])
              : (props.label && props.label[0])
          }
        </div>
      </label>

      <div
        ref={feedbackRef}
        className={errorTransitionClassName}
        onAnimationEnd={onAnimationEnd}
        v-show="message"
      >
        { message }
      </div>
    </div>
  );
});

SwitchButton.displayName = 'SwitchButton';
SwitchButton.defaultProps = {
  label: ['미설정', '설정'],
  validate: [],
  trueValue: true,
  falseValue: false,
  color: switchButtonColors.primary,
}