import { useState, useMemo, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import type { AnimationEvent } from 'react';
import type { CheckButtonItem, CheckButtonProps, CheckButtonModel } from './types';
import { checkButtonColors, checkButtonType } from './types';
import {
  mdiRadioboxMarked,
  mdiCircle,
  mdiRadioboxBlank,
  mdiCheckboxMarked,
  mdiCheckboxBlank,
  mdiCheckboxBlankOutline
} from '@mdi/js';
import uuid from 'react-uuid';
import Icon from '@mdi/react';
import './style.scss';

export const CheckButton = forwardRef<CheckButtonModel, CheckButtonProps>((props, ref) => {
  const elementId: string = uuid();
  const lineLimit: number = props.lineLimit !== undefined ? props.lineLimit : 0;

  const [list, setList] = useState<CheckButtonItem[]>([]);
  const [val, setVal] = useState<string[]>(['']);
  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const [transitionKey, setTransitionKey] = useState<boolean>(true);
  const inRef = useRef(null);
  const outRef = useRef(null);
  const nodeRef = transitionKey ? inRef : outRef;

  useEffect(() => {
    if (props.items.length) {
      setList([...props.items]);

      if (props.all) {
        setList([
          { text: '전체 선택', value: '' },
          ...props.items
        ]);
      }
    }
  }, [props.items]);

  useEffect(() => {
    // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
    if (props.errorMessage) {
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
    if (props.value) {
      setVal(props.value);
    }

    resetValidate();
  }, [props.value]);

  useEffect(() => {
    resetValidate();
  }, [val, props.validate]);

  useEffect(() => {
    if (props.disabled) {
      resetValidate();
    }
  }, [props.disabled]);

  const updateValue = (): void => {
    props.onChange(val);
    check();
  };

  const checkValue = (v: string): void => {
    if (props.type === 'checkbox') {
      if (v !== '') {
        if (props.maxLength && Array.isArray(val)) {
          setVal(val.splice(props.maxLength, 1));
        } else {
          if (val.indexOf('') > -1 && Array.isArray(val)) {
            setVal(val.splice(0, 1));
          }
        }
      }
    }

    updateValue();
  };

  /**
   * 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
   *
   * @return { Boolean }
  */
  const check = (silence: boolean = false): boolean => {
    // validate check
    if (!props.disabled) {
      if (!props.errorMessage && props.validate?.length) {
        for (let i = 0; i < props.validate.length; i++) {
          let result: string | boolean = (props.type === 'checkbox')
            ? props.validate[i](Array.from(val))
            : props.validate[i](val);

          if (typeof result !== 'boolean') {
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

      setMessage('');
      setIsValidate(true);
    }

    return true;
  };

  const resetValidate = (): void => {
    setIsValidate(true);

    if (!props.validate?.length) {
      setMessage('');
      setErrorTransition(false);
    }
  };

  const resetForm = (): void => {
    setVal(['']);
  };

  // if (props.items) {
  //   setList([...props.items]);
  // }

  // if (props.all) {
  //   setList([{ text: '전체 선택', value: '' }, ...list]);
  // }

  if (props.value) {
    setVal(props.value);
  }

  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    setErrorTransition(false);
  };

  const wrapClassName = useMemo<string>(() => {
    return ['check-button', props.button, message !== '' ? 'error' : ''].join(' ');
  }, [props.button, message]);

  const checkButtonGroupClassName = useMemo<string>(() => {
    return ['check-button-group', props.color, props.disabled ? 'disabled' : ''].join(' ');
  }, [props.color, props.disabled]);

  useImperativeHandle(ref, () => {
    return {
      element: document.getElementById(elementId),
      check,
      resetForm,
      resetValidate
    }
  });

  return (
    <div
      id={elementId}
      className={wrapClassName}
    >
      {props.label && (
        <div className="options-wrap">
          <label className="input-label">
            {props.label}
            {props.required && (<span className="required">*</span>)}
          </label>
        </div>
      )}

      {props.button && (
        <div className={checkButtonGroupClassName}>
          {list.map((item, i) => {
            return (
              <>
                <input
                  type="checkbox"
                  id={`${props.name}-${i}`}
                  key={`${props.name}-${i}`}
                  name={props.name}
                  disabled={props.disabled}
                  value={item.value}
                  onChange={() => checkValue(item.value)}
                />
                <label
                  key={`button-label-${i}`}
                  className={ list.length - 1 === i ? 'last' : '' }
                  htmlFor={`${props.name}-${i}`}
                >
                  { item.text }
                </label>
              </>
            );
          })}
        </div>
      )}
      {!props.button && (
        list.map((item, i) => {
          return (
            <>
              <div
                key={`${props.type}-${i}`}
                className={['origin-check-button', props.block ? 'block' : ''].join(' ')}
              >
                <label
                  className={props.color}
                  htmlFor={`${props.name}-${i}`}
                >
                  <input
                    type={props.type}
                    id={`${props.name}-${i}`}
                    name={props.name}
                    disabled={props.disabled}
                    value={item.value}
                    onChange={updateValue}
                  />

                  {props.type === 'radio' && !props.disabled ? (
                    <Icon path={props.value.includes(item.value) ? mdiRadioboxMarked : mdiCircle} />
                  ) : (
                    <Icon path={mdiRadioboxBlank} />
                  )}

                  {props.type === 'checkbox' && !props.disabled ? (
                    <Icon path={props.value?.includes(item.value) ? mdiCheckboxMarked : mdiCheckboxBlank} />
                  ) : (
                    <Icon path={mdiCheckboxBlankOutline} />
                  )}

                  {item.text}
                </label>
              </div>
              {(i + 1) % lineLimit === 0 && (<div className="line-break" />)}
            </>
          );
        })
      )}

      {message && (
        <div
          className={['description', errorTransition ? 'error' : ''].join(' ')}
          onAnimationEnd={onAnimationEnd}
        >
          { message }
        </div>
      )}
    </div>
  );
});

CheckButton.displayName = 'CheckButton';
CheckButton.defaultProps = {
  type: checkButtonType.checkbox,
  all: false,
  maxLength: 0,
  validate: [],
  errorMessage: undefined,
  button: false,
  block: true,
  color: checkButtonColors.primary,
  disabled: false,
  label: undefined,
  required: false,
  lineLimit: 0,
}

{/* <SwitchTransition mode="out-in">
  {props.type === 'radio' ? (
    <CSSTransition
      nameNames="check-scale"
      nodeRef={nodeRef}
      addEndListener={(node, done) => {
        node.addEventListener('transitionend', done, false);
      }}
    >
      {!props.disabled ? (
        <Icon ref={nodeRef} path={props.value.includes(item.value) ? mdiRadioboxMarked : mdiCircle} />
      ) : (
        <Icon ref={nodeRef} path={mdiRadioboxBlank} />
      )}
    </CSSTransition>
  ) : (
    <CSSTransition
      nameNames="check-scale"
      nodeRef={nodeRef}
      addEndListener={(node, done) => {
        node.addEventListener('transitionend', done, false);
      }}
    >
      {!props.disabled ? (
        <Icon ref={nodeRef} path={props.value?.includes(item.value) ? mdiCheckboxMarked : mdiCheckboxBlank}/>
      ) : (
        <Icon ref={nodeRef} path={mdiCheckboxBlankOutline} />
      )}
    </CSSTransition>
  )}
</SwitchTransition> */}