import { useState, useRef, useMemo, useEffect } from 'react';
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { SelectBoxItem, SelectBoxProps } from './types';
import {
  mdiChevronDown,
  mdiMagnify,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiCloseCircle,
  mdiGoogleCirclesExtended,
} from '@mdi/js';
import Icon from '@mdi/react';
import { ValidateMessage } from '../ValidateForm';
import { useController, useFormContext } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import './style.scss';

type SelectedEvent =
  | ReactMouseEvent
  | MouseEvent
  | ReactKeyboardEvent
  | KeyboardEvent;

export const SelectBox = (props: SelectBoxProps) => {
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

  const [isShowOption, setIsShowOption] = useState<boolean>(false);
  const [showBottom, setShowBottom] = useState<boolean>(false);
  const [isSearchFilter, setIsSearchFilter] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [optionList, setOptionList] = useState<SelectBoxItem[]>([
    ...props.options,
  ]);
  const [searchValue, setSearchValue] = useState<string>('');

  const transitionRef = useRef<HTMLDivElement>(null);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const [layerPos, setLayerPos] = useState<CSSProperties>({
    top: '',
    left: '',
    bottom: '',
    width: '',
  });

  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  useEffect(() => {
    setOptionList([...props.options]);
  }, [props.options]);

  const isSelectAll = useMemo<boolean>(() => {
    if (props.multiple) {
      return optionList.length > 0
        ? optionList.every((item) => selectedValue.includes(item.value))
        : false;
    }

    return false;
  }, [selectedValue]);

  const styleWidth = useMemo<string>(() => {
    if (typeof props.width === 'string') {
      return props.width;
    } else if (typeof props.width === 'number') {
      return `${props.width}px`;
    }

    return '';
  }, [props.width]);

  const wrapperClassName = useMemo<string>(() => {
    return ['select-box ', props.block ? 'block ' : ''].join('');
  }, [props.block]);

  const arrowIconClassName = useMemo<string>(
    () => ['arrow ', isShowOption ? 'rotate ' : ''].join(''),
    [isShowOption],
  );

  const layerClassName = useMemo<string>(
    () => ['option-list ', showBottom ? 'show-bottom ' : 'show-top '].join(''),
    [showBottom],
  );

  const optionCheckAllClassName = useMemo<string>(
    () =>
      [
        'option-item ',
        selectedKeyIndex === 0 && !isSearchFilter ? 'key-selected ' : '',
      ].join(''),
    [selectedKeyIndex, isSearchFilter],
  );

  const optionCheckAllIconClassName = useMemo<string>(
    () => ['checkbox ', isSelectAll ? 'checked ' : ''].join(''),
    [isSelectAll],
  );

  const selectBoxClassName = useMemo<string>(
    () =>
      [
        'control-wrap ',
        props.disabled ? 'disabled ' : '',
        props.readOnly ? 'readonly ' : '',
        isShowOption ? 'active ' : '',
      ].join(''),
    [isShowOption],
  );

  const onChange = (v: string[], t: string[]): void => {
    setSelectedValue(v);
    setSelectedText(t);

    field.onChange(v);
  };

  /**
   * options 항목 선택 이벤트
   *
   * @param index
   */
  const selectOption = (event: SelectedEvent, v: string) => {
    event.stopPropagation();

    const [{ text }] = optionList.filter((item) => item.value === v);

    let copyValue: string[] = props.multiple ? [...selectedValue] : [v];
    let copyText: string[] = props.multiple ? [...selectedText] : [text];

    if (props.multiple) {
      const indexOf: number = copyValue.indexOf(v);

      if (indexOf > -1) {
        // 이미 선택된 값이라면 값 제거
        copyValue.splice(indexOf, 1);
        copyText.splice(indexOf, 1);
      } else {
        copyValue.push(v);
        copyText.push(text);
      }
    }

    if (!props.btnAccept) {
      onChange(copyValue, copyText);
    } else {
      setSelectedValue(copyValue);
      setSelectedText(copyText);
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
  const isOptionSelected = (v: any): boolean => selectedValue.includes(v);

  /**
   * 검색 유무에 따른 옵션 focus인지 판별
   * @param i
   */
  const isOptionFocused = (i: number): boolean => {
    let index: number = i;

    if (props.multiple) {
      index = !isSearchFilter ? i + 1 : i;
    }

    return selectedKeyIndex === index;
  };

  /**
   * 전체 선택
   */
  const selectAll = (event?: ReactMouseEvent): void => {
    event?.stopPropagation();

    if (props.multiple) {
      const newValue: string[] = [];
      const newText: string[] = [];

      if (!isSelectAll) {
        optionList.forEach(({ text, value }) => {
          newValue.push(value);
          newText.push(text);
        });
      }

      if (!props.btnAccept) {
        onChange(newValue, newText);
      }
    }
  };

  /**
   * 옵션 목록 표시
   */
  const toggleOption = (): void => {
    if (!props.disabled && !props.readOnly) {
      if (!isShowOption) {
        const windowHeight: number = window.innerHeight;
        const rect = selectBoxRef.current?.getBoundingClientRect() as DOMRect;

        setShowBottom(windowHeight / 2 < rect.top ? true : false);

        setLayerPos({
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          bottom: showBottom ? `${windowHeight - rect.top + 3}px` : '',
          top: !showBottom ? `${rect.top + 43}px` : '',
        });
      }

      setIsShowOption(!isShowOption);

      if (isShowOption) {
        if (props.searchable) {
          setSearchValue('');
          setIsSearchFilter(false);
        }

        setOptionList([...props.options]);

        const selected = ulRef.current?.querySelector('.selected');
        selected?.scrollIntoView();
      }
    }
  };

  let timeout: NodeJS.Timeout;

  /**
   * props.searchable 적용시
   * 입력된 키워드로 옵션을 filter링 하여 필요한 옵션만 보이도록 처리
   * @param evt
   */
  const searchKeyword = (evt: ReactKeyboardEvent | KeyboardEvent): void => {
    const key = evt.key.toLowerCase();

    if (key === 'enter') {
      evt.preventDefault();
    }

    clearTimeout(timeout);

    if (!['arrowup', 'arrowdown', 'enter'].includes(key)) {
      setSelectedKeyIndex(0);

      timeout = setTimeout(() => {
        const { value } = evt.target as HTMLInputElement;

        setIsSearchFilter(value ? true : false);

        if (value) {
          setOptionList(
            props.options.filter(
              ({ text }) =>
                text.toLowerCase().indexOf(value.toLowerCase()) > -1,
            ),
          );
        } else {
          setOptionList([...props.options]);
        }

        const li = ulRef.current?.querySelector<HTMLLIElement>('.option-item');
        li?.scrollIntoView({ block: 'center' });
      }, 300);
    }
  };

  // props.isAccept 적용시
  const accept = (event: ReactMouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsShowOption(false);
    onChange(selectedValue, selectedText);
  };

  /**
   * 적용 버튼 활성화시 적용 버튼을 클릭하지 않고 창을 닫을 경우
   * 값을 전으로 돌려 준다.
   */
  const noneAccept = (): void => {
    if (props.btnAccept) {
      const copyValue: string[] = [...props.value];
      const copyText: string[] = [];
      const len = props.options.length;

      for (let i = 0; i < len; i++) {
        const option = props.options[i];

        if (copyValue.includes(option.value)) {
          copyText.push(option.text);
        }

        if (copyText.length === copyValue.length) {
          break;
        }
      }

      onChange(copyValue, copyText);
    }
  };

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
    if (props.value.length) {
      return (
        props.clearable &&
        !props.disabled &&
        !props.readOnly &&
        props.value.length > 0
      );
    }

    return selectedValue.length > 0;
  }, [
    props.value,
    props.clearable,
    props.disabled,
    props.readOnly,
    selectedValue,
  ]);

  const clearValue = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    onChange([], []);
  };

  const onBlur = (): void => {
    onChange(selectedValue, selectedText);
  };

  /**
   * 키보드 화살표를 이용해 options 선택을 변경 하는 이벤트
   * @param event
   * @returns
   */
  const onKeyHandler = (event: ReactKeyboardEvent | KeyboardEvent): void => {
    event.stopPropagation();

    const code = event.code.toLowerCase();
    const keyCodes = ['arrowup', 'arrowdown', 'enter', 'tab', 'escape'];

    if (!keyCodes.includes(code)) {
      return;
    }

    if (isShowOption) {
      const li = ulRef.current?.querySelectorAll<HTMLLIElement>('.option-item');

      if (li) {
        const len = li.length;

        if (code === 'arrowdown' && selectedKeyIndex < len) {
          if (selectedKeyIndex + 1 >= len) {
            setSelectedKeyIndex(0);
          } else {
            setSelectedKeyIndex(selectedKeyIndex + 1);
          }

          len && li[selectedKeyIndex].scrollIntoView({ block: 'center' });
        } else if (code === 'arrowup' && selectedKeyIndex >= -1) {
          if (selectedKeyIndex - 1 === -1) {
            setSelectedKeyIndex(len - 1);
          } else {
            setSelectedKeyIndex(selectedKeyIndex - 1);
          }

          len && li[selectedKeyIndex].scrollIntoView({ block: 'center' });
        } else if (['numpadenter', 'enter'].includes(code)) {
          if (props.multiple && !isSearchFilter && selectedKeyIndex === 0) {
            selectAll();
          } else {
            const index =
              props.multiple && !isSearchFilter
                ? selectedKeyIndex - 1
                : selectedKeyIndex;
            if (index > -1 && index < optionList.length) {
              const value = optionList[index].value;
              selectOption(event, value);
            }
          }
        } else if (code === 'tab') {
          if (document.activeElement instanceof HTMLElement) {
            const parentElement =
              selectBoxRef.current?.parentElement || undefined;
            const isFocused: boolean = parentElement
              ? document.activeElement.contains(parentElement)
              : false;
            // 해당 SelectBox 포커스영역에서 포커스 이동시, 옵션 영역 활성화 해제 진행.
            !isFocused && toggleOption();
          }
        }
      }

      if (code === 'escape') {
        setIsShowOption(false);
        noneAccept();

        // eventPhase : 0 = none / 1 = capture / 2 = target / 3 = bubbling
        // 모달 내부의 SelectBox 키 이벤트와 동시에 Modal도 같이 이벤트 수행이 되기 때문에
        // SelectBox 이벤트만 수행 후, 이벤트 전파 중지.
        const eventPhase: number = event.eventPhase;

        (eventPhase === 1 || eventPhase === 2) && event.stopPropagation();
      }

      searchKeyword(event);
    }
  };

  /**
   * 본 객체 외의 부분을 클릭할 경우 옵션 목록 숨김
   *
   * @param evt
   */
  const onOutsideClickEvent = (evt: MouseEvent) => {
    const target = evt.target as HTMLBodyElement;

    if (isShowOption) {
      if (selectBoxRef.current && !selectBoxRef.current.contains(target)) {
        noneAccept();
        toggleOption();
      }
    }
  };

  useEffect(() => {
    if (isShowOption) {
      document.addEventListener('click', onOutsideClickEvent);
    }

    return () => {
      document.removeEventListener('click', onOutsideClickEvent);
    };
  }, [isShowOption]);

  useEffect(() => {
    if (mainRef.current) {
      setScrollEvent(mainRef.current);
    }

    return () => {
      document.removeEventListener('click', onOutsideClickEvent);

      if (eventParentElement) {
        eventParentElement.removeEventListener('scroll', parentScrollEvent);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={mainRef}
        tabIndex={0}
        style={{ width: styleWidth }}
        className={wrapperClassName}
        onKeyDown={onKeyHandler}
      >
        <div
          ref={selectBoxRef}
          className={selectBoxClassName}
          onClick={toggleOption}
        >
          {selectedText.length ? (
            <div className="text">
              {props.isShort ? (
                <>
                  {selectedText.join('')}
                  {selectedText.length > 1 && (
                    <>&nbsp;+ {selectedText.length - 1}</>
                  )}
                </>
              ) : (
                selectedText.join(', ')
              )}
            </div>
          ) : (
            <div className="text ph">{props.placeholder}</div>
          )}

          {clearButtonShow && (
            <a href="#" className="btn-clear" onClick={clearValue}>
              <Icon color="#888" size="20" path={mdiCloseCircle} />
            </a>
          )}

          <div className={arrowIconClassName}>
            <Icon size="16" path={mdiChevronDown} />
          </div>

          <CSSTransition
            unmountOnExit
            timeout={200}
            in={isShowOption}
            nodeRef={transitionRef}
            classNames={showBottom ? 'option-items-bottom' : 'option-items'}
            onExit={() => {
              onBlur();
              props.blurValidate;
            }}
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
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={searchKeyword}
                    />
                    <Icon color="#888" path={mdiMagnify} />
                  </div>
                </div>
              )}
              <ul ref={ulRef} className="scrollbar">
                {props.multiple && !props.maxLength && !isSearchFilter && (
                  <li className={optionCheckAllClassName} onClick={selectAll}>
                    <Icon
                      className={optionCheckAllIconClassName}
                      path={
                        isSelectAll
                          ? mdiCheckboxMarked
                          : mdiCheckboxBlankOutline
                      }
                    />
                    {isSelectAll ? '전체 해제' : '전체 선택'}
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
                          isOptionFocused(i) ? 'key-selected ' : '',
                        ].join('')}
                        onClick={(event) => selectOption(event, item.value)}
                      >
                        {props.multiple && (
                          <Icon
                            className="checkbox"
                            path={
                              isOptionSelected(item.value)
                                ? mdiCheckboxMarked
                                : mdiCheckboxBlankOutline
                            }
                          />
                        )}
                        {item.text}
                      </li>
                    ))}
                  </>
                ) : (
                  <li onClick={(event) => event.stopPropagation()}>
                    검색된 내용이 없습니다.
                  </li>
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
                <a href="#" className="btn-accept" onClick={accept}>
                  적용 + {selectedValue.length}
                </a>
              )}
            </div>
          </CSSTransition>
        </div>
      </div>

      <ValidateMessage message={errors[props.name]?.message as string} />
    </>
  );
};

SelectBox.displayName = 'SelectBox';
SelectBox.defaultProps = {
  options: [],
  block: true,
  errorMessage: '',
  multiple: false,
  readOnly: false,
  disabled: false,
  isShort: false,
  btnAccept: false,
  maxLength: 0,
  searchable: false,
  blurValidate: true,
  clearable: false,
  isLoading: false,
  inLabel: false,
  labelText: false,
};
