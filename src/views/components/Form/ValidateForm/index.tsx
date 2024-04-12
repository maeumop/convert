import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import type { ReactElement, RefObject } from 'react';
import type { ValidateFormModel, ValidateFormProps } from './types';
import './style.scss';

/**
 * ValidateForm 사용을 위해서는 내부에 validation 객체에 ref설정을 필히 해줘야 한다.
 */
export const ValidateForm = forwardRef<ValidateFormModel, ValidateFormProps>((props, ref) => {
  const [isCover, setIsCover] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  let checkState: boolean;
  let firstEl: HTMLElement | null = null;
  let isSilence: boolean = false;

  const validate = (silence: boolean = false): boolean => {
    isSilence = silence;
    checkState = true;
    firstEl = null;

    explore(props.children);

    if (!checkState) {
      // 검수에 통과하지 못한 가장 첫번째 폼에 포커스
      if (firstEl !== null) {
        (firstEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return checkState;
  };

  const resetForm = (): void => {
    if (formRef.current) {
      explore(formRef.current.props.children, 'reset');
    }
  };

  const resetValidate = (): void => {
    if (formRef.current) {
      explore(formRef.current.prosp.children, 'resetValidate');
    }
  };

  const componentTypeCheck = (el: any): boolean => {
    if (el.ref === null) {
      return false;
    }

    const names = [
      'TextField',
      'NumberFormat',
      'SelectBox',
      'SwitchButton',
      'CheckButton',
      'DatePicker',
      'ValidateWrap'
    ];

    if (el.ref !== null && el.ref.current !== null) {
      let name: string = el.type.displayName;

      if (names.includes(name)) {
        return true;
      }
    }

    return false;
  };

  const validateCheck = (el: { ref: RefObject<any> }, flag: string): void => {
    if (el.ref.current) {
      if (flag === 'reset') {
        el.ref.current.resetForm();
      } else if (flag === 'resetValidate') {
        el.ref.current.resetValidate();
      } else {
        if (!el.ref.current.check(isSilence) && checkState) {
          checkState = false;

          // 가장 처음 검수에 통과 하지 못한 폼 저장 (라인 포커스)
          if (!firstEl) {
            firstEl = el.ref.current.element;
          }
        }
      }
    }
  };

  const explore = (el: ReactElement, flag: string = 'dom'): void => {
    if (Array.isArray(el.props.children)) {
      const len: number = el.props.children.length;

      if (len > 0) {
        const nodes: ReactElement[] = el.props.children;

        // vue node 전체(chilren)을 탐색 하여 chidren이 또 있는 경우 재귀한다.
        for (let i = 0; i < len; i++) {
          if (nodes[i].props.children) {
            explore(nodes[i], flag);
          }

          if (componentTypeCheck(nodes[i])) {
            validateCheck(nodes[i].props.children, flag);
          }
        }
      }
    } else if (componentTypeCheck(el.props.children)) {
      validateCheck(el.props.children, flag);
    }
  };

  const formProtection = (protect: boolean = true): void => {
    setIsCover(protect);
  };

  useImperativeHandle(ref, () => ({
    formProtection,
    resetValidate,
    resetForm,
    validate
  }));

  return (
    <form
      ref={formRef}
      className={isCover ? 'validate-form' : ''}
      onSubmit={(event) => event.preventDefault()}
    >
      { props.children }
      {isCover && (
        <div className="form-cover" />
      )}
    </form>
  );
});