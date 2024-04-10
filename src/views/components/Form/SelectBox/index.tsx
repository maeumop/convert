import { useState, useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  AnimationEvent,
} from 'react';
import type { SelectBoxItem, SelectBoxModel, SelectBoxProps } from './types';
import {
  mdiWindowClose,
  mdiChevronDown,
  mdiMagnify,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiCloseCircle,
  mdiGoogleCirclesExtended,
} from '@mdi/js';
import uuid from 'react-uuid';
import { TimeoutId } from 'node_modules/@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import Icon from '@mdi/react';
import './style.scss';
import { CSSTransition } from 'react-transition-group';

export const SelectBox = forwardRef<SelectBoxModel, SelectBoxProps>((props, ref) => {
  const elementId = uuid();

  const [isValidate, setIsValidate] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);
  const [isShowOption, setIsShowOption] = useState<boolean>(false);
  const [showBottom, setShowBottom] = useState<boolean>(false);
  const [isSearchFilter, setIsSearchFilter] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string | string[]>(props.multiple ? [] : '');
  const [selectedValue, setSelectedValue] = useState<string | string[]>(props.multiple ? [] : '');
  const [optionList, setOptionList] = useState<SelectBoxItem[]>([...props.options]);
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const transitionRef = useRef<HTMLDivElement>(null);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const [layerPos, setLayerPos] = useState<CSSProperties>({
    top: '',
    left: '',
    bottom: '',
    width: '',
  });

  let [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  useEffect(() => {
    if (props.errorMessage) {
      setIsValidate(false);
      setMessage(props.errorMessage);
    }
  }, [props.errorMessage]);

  useEffect(() => {
    resetValidate();
  }, [props.validate]);

  useEffect(() => {
    setDefaultModelValue();
  }, [props.value]);

  useEffect(() => {
    setOptionList([...props.options]);
    setDefaultModelValue();
  }, [props.options]);

  useEffect(() => {
    if (props.disabled) {
      resetValidate();
    }
  }, [props.disabled]);

  const isSelectAll = useMemo<boolean>(() => {
    if (props.multiple) {
      return optionList.length > 0 ?
        optionList.every(item => (selectedValue as string[]).includes(item.value))
        : false;
    }

    return false;
  }, [props.multiple]);

  const styleWidth = useMemo<string>(() => {
    if (typeof props.width === 'string') {
      return props.width;
    } else if (typeof props.width === 'number') {
      return `${props.width}px`;
    }

    return '';
  }, [props.width]);

  const wrapperClassName = useMemo<string>(() => {
    return [
      'select-box ',
      props.label ? 'with-label ' : '',
      !isValidate ? 'error ' : '',
      props.block ? 'block ' : '',
    ].join('');
  }, [props.label, isValidate, props.block]);

  const labelClassName = useMemo<string>(() => [
    'input-label ',
    !isValidate ? 'error ' : ''
  ].join(''), [isValidate]);

  const arrowIconClassName = useMemo<string>(() => [
    'arrow ',
    isShowOption ? 'rotate ' : ''
  ].join(''), [isShowOption]);

  const layerClassName = useMemo<string>(() => [
    'option-list ',
    showBottom ? 'show-bottom ' : 'show-top '
  ].join(''), [showBottom]);

  const optionCheckAllClassName = useMemo<string>(() => [
    'option-item ',
    selectedKeyIndex === 0 && !isSearchFilter ? 'key-selected ' : ''
  ].join(''), [selectedKeyIndex, isSearchFilter]);

  const optionCheckAllIconClassName = useMemo<string>(() => [
    'checkbox ',
    isSelectAll ? 'checked ' : '',
  ].join(''), [isSelectAll]);

  const getShowText = useMemo<string[]>(() => {
    if (props.btnAccept) {
      return Array.isArray(selectedText) ? selectedText : [selectedText];
    }

    let values: string[] = Array.isArray(props.value) ? props.value : [props.value];

    return props.options.filter(option => values.includes(option.value)).map(({ text }) => text);
  }, [props.btnAccept, props.value]);

  /**
   * 초기 modelValue 바로 대입할시 selectedValue의 값이 modelValue 메모리를 참조
   * 다중선택(btnAccept) 적용 버튼을 만족 시키기 위해 구조분해 할당 적용
   */
  const setDefaultModelValue = () => {
    if (Array.isArray(props.value)) {
      setSelectedValue([...props.value]);
    }

    if (props.multiple) {
      setSelectedText([]);
    } else {
      setSelectedText('');
      setSelectedValue('');
    }

    props.options.forEach(item => {
      if (props.multiple && Array.isArray(props.value)) {
        if (props.value.includes(item.value as never)) {
          setSelectedText([
            ...selectedText,
            item.text
          ]);

          return;
        }
      } else {
        if (props.value === item.value) {
          setSelectedText(item.text);
          setSelectedValue(item.value);
          return;
        }
      }
    });
  };

  const updateValue = (v: string | string[], index: number = -1): void => {
    props.onChange(v);
    // emit('update:selectedIndex', index);
    check();
  };

  /**
   * 유효성 검사
   */
  const check = (silence: boolean = false): boolean => {
    if (!props.disabled) {
      // 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
      // validate check
      if (!props.errorMessage && props.validate?.length) {
        for (let i: number = 0; i < props.validate.length; i++) {
          let result: string | boolean = props.validate[i](selectedValue);

          if (typeof result === 'string') {
            if (!silence) {
              setMessage(result);
              setIsValidate(false);
              setErrorTransition(true);
            }

            return false;
          }
        }
      }

      setMessage('');
      setIsValidate(true);
    }

    return true;
  };

  /**
   * 폼 value 초기화
   */
  const resetForm = (): void => {
    if (props.multiple) {
      setSelectedText([]);
      setSelectedValue([]);

      props.onChange([]);
    } else {
      setSelectedText('');
      setSelectedValue('');

      props.onChange('');
    }
  };

  /**
   * 유효성 검사 초기화
   */
  const resetValidate = (): void => {
    setMessage('');
    setIsValidate(true);
    setErrorTransition(false);
  };

  /**
   * options 항목 선택 이벤트
   *
   * @param index
   */
  const selectOption = (event: ReactMouseEvent | MouseEvent | ReactKeyboardEvent | KeyboardEvent, v: any): void => {
    event.stopPropagation();

    let index = -1;

    const [{ text }] = optionList.filter((item, i) => {
      if (item.value === v) {
        index = i;
        return true;
      }
    });

    if (props.multiple) {
      const indexOf: number = selectedValue.indexOf(v);

      if (indexOf > -1) {
        // 이미 선택된 값이라면 값 제거
        setSelectedValue((selectedValue as string[]).splice(indexOf, 1));
        setSelectedText((selectedText as string[]).splice(indexOf, 1));
      } else {
        setSelectedValue(v);
        setSelectedText(text);
      }
    } else {
      setSelectedValue(v);
      setSelectedText(text);
    }

    if (!props.btnAccept) {
      updateValue(selectedValue, index);
    }

    if (!props.multiple) {
      toggleOption();
    }
  };

  /**
   * 이미 선택된 옵션인지 판별
   *
   * @param index
   */
  const isOptionSelected = (v: any): boolean => {
    if (props.multiple) {
      return selectedValue.includes(v);
    }

    return props.value === v;
  };

  const removeSelected = (event: ReactMouseEvent, index: number): void => {
    event.stopPropagation();

    if (props.multiple) {
      setSelectedText((selectedText as string[]).splice(index, 1));
      setSelectedValue((selectedValue as string[]).splice(index, 1));
    }

    if (!props.btnAccept) {
      updateValue(selectedValue);
    }
  };

  /**
   * 검색 유무에 따른 옵션 focus인지 판별
   * @param i
   */
  const isOptionFocused = (i: number): boolean => {
    let index: number = i;

    if (props.multiple) {
      index = (!isSearchFilter ? i + 1 : i);
    }

    return selectedKeyIndex === index;
  };

  /**
   * 전체 선택
   */
  const selectAll = (event?: ReactMouseEvent): void => {
    event?.stopPropagation();

    if (props.multiple) {
      const value: boolean = isSelectAll;

      setSelectedText([]);
      setSelectedValue([]);

      if (!value) {
        optionList.forEach(({ text, value }) => {
          setSelectedText([...selectedText, text]);
          setSelectedValue([...selectedValue, value]);
        });
      }

      if (!props.btnAccept) {
        updateValue([...selectedValue]);
      }
    }
  };

  /**
   * 옵션 목록 표시
   */
  const toggleOption = (): void => {
    if (!props.disabled && !props.readonly) {
      if (!isShowOption) {
        const windowHeight: number = window.innerHeight;
        const rect = selectBoxRef.current?.getBoundingClientRect() as DOMRect;

        if (windowHeight / 2 < rect.top) {
          setShowBottom(true);
        } else {
          setShowBottom(false);
        }

        setLayerPos({
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          bottom: showBottom ? `${(windowHeight - rect.top) + 3}px` : '',
          top: !showBottom ? `${rect.top + 43}px` : '',
        });
      }

      setIsShowOption(!isShowOption);

      if (isShowOption) {
        if (props.searchable) {
          setSearchInputValue('');
          setIsSearchFilter(false);
        }

        setOptionList([...props.options]);

        // nextTick(() => {
        //   const selected = ul.value?.querySelector('.selected');
        //   selected?.scrollIntoView();
        // });
      }
    }
  };

  let timeout: TimeoutId;

  // props.searchable 적용시
  const searchText = (evt: ReactKeyboardEvent | KeyboardEvent): void => {
    const key = evt.key.toLowerCase();

    clearTimeout(timeout);

    if (!['arrowup', 'arrowdown', 'enter'].includes(key)) {
      setSelectedKeyIndex(0);

      timeout = setTimeout(() => {
        const { value } = evt.target as HTMLInputElement;

        setIsSearchFilter(value ? true : false);

        if (value) {
          setOptionList(props.options.filter(({ text }) => text.toLowerCase().indexOf(value.toLowerCase()) > -1));
        } else {
          setOptionList([...props.options]);
        }

        // nextTick(() => {
        //   const li = ul.value?.querySelector<HTMLLIElement>('.option-item');
        //   li?.scrollIntoView({ block: 'center' });
        // });
      }, 300);
    }
  };

  // props.isAccept 적용시
  const accept = (event: ReactMouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsShowOption(false);
    updateValue(selectedValue);
  };

  /**
   * 적용 버튼 활성화시 적용 버튼을 클릭하지 않고 창을 닫을 경우
   * 값을 전으로 돌려 준다.
   */
  const noneAccept = (): void => {
    if (props.btnAccept) {
      setSelectedText([]);
      setSelectedValue([]);

      setSelectedValue([...props.value]);
      for (let index = 0; index < props.options.length; index++) {
        const option = props.options[index];
        if (selectedValue.includes(option.value)) {
          setSelectedText([
            ...selectedText,
            option.text
          ]);
        }
        if (selectedText.length === selectedValue.length) {
          break;
        }
      }

      updateValue([...selectedValue]);
    }
  };

  /**
   * 본 객체 외의 부분을 클릭할 경우 옵션 목록 숨김
   *
   * @param evt
   */
  const outSideClickEvent = (evt: MouseEvent): void => {
    const target = evt.target as HTMLBodyElement;

    if (isShowOption) {
      if (!selectBoxRef.current?.contains(target)) {
        noneAccept();
        toggleOption();
      }
    }
  };

  const feedbackRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  let eventParentElement: HTMLElement;

  const parentScrollEvent = () => {
    setIsShowOption(false);
  };

  /**
   * 컴포넌트 상위 element를 탐색(재귀)하며 scroll이 있는 Element에
   * scroll event를 추가 하여 scorll 발생시 layer 창을 닫아 준다.
   * @param el
   */
  const setScrollEvent = (el: HTMLElement) => {
    const parent = el.parentElement as HTMLElement;

    if (parent) {
      if (parent.tagName.toLowerCase() === 'html') {
        return;
      }

      if (parent.scrollHeight > parent.clientHeight) {
        eventParentElement = parent;
        eventParentElement.addEventListener('scroll', parentScrollEvent);

        return;
      }

      setScrollEvent(parent);
    }
  };

  const clearButtonShow = useMemo<boolean>(() => {
    if (props.value) {
      return (
        props.clearable !== undefined
        && !props.disabled
        && !props.readonly
        && props.value.length > 0
      );
    }

    return false;
  }, [props.value, props.clearable, props.disabled, props.readonly]);

  const clearValue = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    updateValue(props.multiple ? [] : '');
  };

  const onBlur = (): void => {
    props.onChange(selectedValue);
  };

  const onKeyHandler = (event: ChangeEvent | ReactKeyboardEvent | KeyboardEvent): void => {
    event.stopPropagation();

    const code = event.code.toLowerCase();
    const keyCodes = ['arrowup', 'arrowdown', 'enter', 'tab']

    if (!keyCodes.includes(code)) {
      return;
    }

    if (isShowOption) {
      const li = ulRef.current?.querySelectorAll<HTMLLIElement>('.option-item');

      if (li) {
        const len = li.length;
        const code = event.code.toLowerCase();

        if (code === 'arrowdown' && selectedKeyIndex < len) {
          setSelectedKeyIndex(selectedKeyIndex + 1);

          if (selectedKeyIndex >= len) {
            setSelectedKeyIndex(0);
          }

          len && li[selectedKeyIndex].scrollIntoView({ block: 'center' });

        } else if (code === 'arrowup' && selectedKeyIndex >= -1) {
          setSelectedKeyIndex(selectedKeyIndex - 1);

          if (selectedKeyIndex === -1) {
            setSelectedKeyIndex(len - 1);
          }

          len && li[selectedKeyIndex].scrollIntoView({ block: 'center' });

        } else if (['numpadenter', 'enter'].includes(code)) {
          if (props.multiple && !isSearchFilter && selectedKeyIndex === 0) {
            selectAll();
          } else {
            const index = props.multiple && !isSearchFilter ? selectedKeyIndex - 1 : selectedKeyIndex;
            if (index > -1 && index < optionList.length) {
              const value = optionList[index].value;
              selectOption(event, value);
            }
          }
        } else if (code === 'tab') {
          if (document.activeElement instanceof HTMLElement) {
            const parentElement = selectBoxRef.current?.parentElement || undefined;
            const isFocused: boolean = parentElement ? document.activeElement.contains(parentElement) : false;
            // 해당 SelectBox 포커스영역에서 포커스 이동시, 옵션 영역 활성화 해제 진행.
            !isFocused && toggleOption();
          }
        }
      }

      searchText(event);
    }
  };

  const onEscapeKeyHandler = (event: ReactKeyboardEvent): void => {
    const code = event.code.toLowerCase();

    if (isShowOption && code === 'escape') {
      setIsShowOption(false);
      noneAccept();

      // eventPhase : 0 = none / 1 = capture / 2 = target / 3 = bubbling
      // 모달 내부의 SelectBox 키 이벤트와 동시에 Modal도 같이 이벤트 수행이 되기 때문에
      // SelectBox 이벤트만 수행 후, 이벤트 전파 중지.
      const eventPhase: number = event.eventPhase;

      (eventPhase === 1 || eventPhase === 2) && event.stopPropagation();
    }
  };

  useEffect(() => {
    if (isShowOption) {
      document.addEventListener('keydown', onKeyHandler);
    }

    return () => {
      document.removeEventListener('keydown', onKeyHandler);
    }
  }, [isShowOption]);

  const onAnimationEnd = (event: AnimationEvent) => {
    setErrorTransition(false);
  };

  useEffect(() => {
    setDefaultModelValue();

    if (mainRef.current) {
      setScrollEvent(mainRef.current);
    }

    document.addEventListener('click', outSideClickEvent);

    return () => {
      document.removeEventListener('click', outSideClickEvent);
      document.removeEventListener('keydown', onKeyHandler);

      if (eventParentElement) {
        eventParentElement.removeEventListener('scroll', parentScrollEvent);
      }
    }
  }, []);

  const selectBoxClassName = useMemo<string>(() => [
    'control-wrap',
    props.disabled ? 'disabled' : '',
    props.readonly ? 'readonly' : '',
    message ? 'error' : '',
    isShowOption ? 'active': '',
  ].join(' '), []);

  useImperativeHandle(ref, () => {
    return {
      element: document.getElementById(elementId),
      check,
      resetForm,
      resetValidate,
    }
  });

  return (
    <>
      <div
        ref={mainRef}
        tabIndex={0}
        id={elementId}
        style={{ width: styleWidth }}
        className={wrapperClassName}
        onKeyDown={onEscapeKeyHandler}
      >
        {!props.inLabel && (
          <div className="options-wrap">
            <>
            {props.label && (
              <label className={labelClassName}>
                { props.label }
                {props.required && (<span className="required">*</span>)}
              </label>
            )}
            </>
          </div>
        )}

        <div
          ref={selectBoxRef}
          className={selectBoxClassName}
          onClick={toggleOption}
        >
          {props.multiple ? (
            <>
              {getShowText.length ? (
                <div className="text">
                  {props.labelText ? (
                    <>
                      {!props.isShort ? (
                        <>
                          {getShowText.map((txt, i) => (
                            <span
                              className="item"
                              key={`selectedItem${i}`}
                              onClick={(event) => removeSelected(event, i)}
                            >
                              {txt}
                              <Icon
                                className="remove-icon"
                                size="13"
                                path={mdiWindowClose}
                              />
                            </span>
                          ))}
                        </>
                      ) : (
                        <>
                          <span>{getShowText[0]}</span>
                          {getShowText.length > 1 && (<>&nbsp;+ {getShowText.length - 1}</>)}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!props.isShort ? (
                        <>
                          {props.inLabel && (
                            <span className="label">
                              {props.label}:
                            </span>
                          )}

                          {getShowText.join(', ')}
                        </>
                      ) : (
                        <>
                          {props.inLabel && (
                            <span className="label">
                              {props.label}:
                            </span>
                          )}

                          {getShowText[0]}
                          {getShowText.length > 1 && (<>&nbsp;+ {getShowText.length - 1}</>)}
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text ph">
                  {props.inLabel && (
                    <span className="label">
                      {props.label}:
                    </span>
                  )}

                  {props.placeholder}
                </div>
              )}
            </>
          ) : (
            <>
              {getShowText.length > 0 ? (
                <div className="text">
                  {props.inLabel && (
                    <span className="label">
                      { props.label }:
                    </span>
                  )}

                  { getShowText[0] }
                </div>
              ) : (
                <div className="text ph">
                  {props.inLabel && (
                    <span className="label">
                      { props.label }:
                    </span>
                  )}

                  { props.placeholder }
                </div>
              )}
            </>
          )}

          {clearButtonShow && (
            <a
              href="#"
              className="btn-clear"
              onClick={clearValue}
            >
              <Icon size="20" path={mdiCloseCircle} />
            </a>
          )}

          <div className={arrowIconClassName}>
            <Icon size="16" path={mdiChevronDown} />
          </div>

            {/* @leave="[onBlur(), props.blurValidate && check()]"
            @enter="transitionStatus = true"
            @after-enter="transitionStatus = false" */}
          <CSSTransition
            unmountOnExit
            timeout={200}
            in={isShowOption}
            nodeRef={transitionRef}
            classNames={showBottom ? 'option-items-bottom' : 'option-items'}
          >
            <div
              ref={transitionRef}
              style={layerPos}
              className={layerClassName}
            >
              {props.searchable && (
                <div
                  className="search"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="search-wrap">
                    <input
                      type="text"
                      placeholder="검색어 입력"
                      value={searchInputValue}
                      onChange={(event) => setSearchInputValue(event.target.value)}
                      onKeyDown={onKeyHandler}
                    />
                    <Icon color="#888" path={mdiMagnify} />
                  </div>
                </div>
              )}
              <ul ref={ulRef} className="scrollbar">
                {(props.multiple && !props.maxLength && !isSearchFilter) && (
                  <li
                    className={optionCheckAllClassName}
                    onClick={selectAll}
                  >
                    <Icon
                      className={optionCheckAllIconClassName}
                      path={isSelectAll ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
                    />
                    { isSelectAll ? '전체 해제' : '전체 선택' }
                  </li>
                )}
                {optionList.length ? (
                  <>
                  {optionList.map((item, i) => (
                    <li
                      key={`select-${item.value}`}
                      className={[
                        'option-item ',
                        isOptionSelected(item.value) ? 'selected ' : '',
                        isOptionFocused(i) ? 'key-selected ' : ''
                      ].join('')}
                      onClick={(event) => selectOption(event, item.value)}
                    >
                      <template v-if="props.multiple">
                        <Icon
                          className="checkbox"
                          path={isOptionSelected(item.value) ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
                        />
                      </template>
                      { item.text }
                    </li>
                  ))}
                  </>
                ) : (
                  <li onClick={(event) => event.stopPropagation()}>검색된 내용이 없습니다.</li>
                )}
                {props.isLoading && (
                  <li className="items-loading">
                    <Icon
                      className="loading"
                      size="24"
                      path={mdiGoogleCirclesExtended}
                    />
                  </li>
                )}
              </ul>
              {props.btnAccept && (
                <a
                  href="#"
                  className="btn-accept"
                  onClick={accept}
                >
                  적용 + { selectedValue.length }
                </a>
              )}
            </div>
          </CSSTransition>
        </div>

        {(message && !props.hideMessage) && (
          <div
            ref={feedbackRef}
            className={['feedbackRef', errorTransition ? 'error' : ''].join(' ')}
            onAnimationEnd={onAnimationEnd}
          >
            { message }
          </div>
        )}
      </div>
    </>
  );
});

SelectBox.displayName = 'SelectBox';
SelectBox.defaultProps = {
  options: [],
  inLabel: false,
  block: true,
  validate: [],
  errorMessage: '',
  multiple: false,
  readonly: false,
  disabled: false,
  required: false,
  isShort: false,
  btnAccept: false,
  labelText: false,
  maxLength: 0,
  searchable: false,
  hideMessage: false,
  blurValidate: true,
  clearable: false,
  isLoading: false,
};