import { useEffect, useImperativeHandle, useState, useRef, useMemo, forwardRef } from 'react';
import { ValidateWrapModel, ValidateWrapProps } from './types';
import uuid from 'react-uuid';
import './style.scss';

export const ValidateWrap = forwardRef<ValidateWrapModel, ValidateWrapProps>((props, ref) => {
  const elementId = uuid();

  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const feedbackRef = useRef<HTMLDivElement>(null);

  const check = (silence: boolean = false): boolean => {
    if (props.disabled) {
      return true;
    }

    // 임의로 지정된 에러가 없는 경우
    if (props.errorMessage === '') {
      // validate check
      if (props.validate?.length) {
        for (let i = 0; i < props.validate.length; i++) {
          let result = props.validate[i](props.checkValue);


          if (typeof result === 'string') {
            if (!silence) {
              setErrorTransition(true);
              setMessage(result);
              setIsValidate(false);
              setCheckPass(false);
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

    return false;
  };

  const resetForm = (): void => {
    setIsValidate(true);
    setCheckPass(false);
    setMessage('');
  };

  const resetValidate = (): void => {
    resetForm();
  };

  const childBlur = (): void => {
    check();
  };

    const onAnimationEnd = () => {
    setErrorTransition(false);
  }

  useEffect(() => {
    resetForm();
  }, [props.checkValue, props.validate, props.disabled]);

  useEffect(() => {
    if (props.errorMessage) {
      setMessage(props.errorMessage);
    }
  }, [props.errorMessage]);

  const childrenClassName = useMemo<string>(() => [
    'input-wrap ',
    message ? 'error ' : '',
  ].join(''), []);

  const feedbackClassName = useMemo<string>(() => [
    'feedback ',
    errorTransition ? 'error ' : '',
  ].join(''), []);

  useImperativeHandle(ref, () => ({
    element: document.getElementById(elementId),
    check,
    resetForm,
    resetValidate
  }));

  return (
    <div className="validate-wrap">
      {props.label && (
        <div className="options-wrap">
          {props.label && (
            <label className="input-label">
              { props.label }
              {props.required && (<span className="required">*</span>)}
            </label>
          )}
          <div className="add-option">
            { props.addOn }
          </div>
        </div>
      )}

      <div className={childrenClassName}>
        { props.children }
      </div>

      {message && (
        <div
          ref={feedbackRef}
          className={feedbackClassName}
          onAnimationEnd={onAnimationEnd}
        >
          { message }
        </div>
      )}
    </div>
  );
});

ValidateWrap.displayName = 'ValidateWrapper';
ValidateWrap.defaultProps = {
  validate: [],
  errorMessage: '',
}