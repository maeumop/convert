import { useState, useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { CSSProperties } from 'react';
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
import './style.scss';
import uuid from 'react-uuid';

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

  const selectBoxRef = useRef<HTMLSelectElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const ul = useRef<HTMLUListElement>(null);

  const
    layerPositionStyle = useState<CSSProperties>({
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

  const wrapperStyle = useMemo<string>(() => {
    return [
      props.label ? 'with-label' : '',
      !isValidate ? 'error' : '',
      props.block ? 'block' : '',
    ].join(' ');
  }, [props.label, isValidate, props.block]);

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
  const selectOption = (v: any): void => {
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

  const removeSelected = (index: number): void => {
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
  const selectAll = (): void => {
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

  let [transitionStatus, setTransitionStatus] = useState<boolean>(false);

  /**
   * 옵션 목록 표시
   */
  const toggleOption = (event?: FocusEvent): void => {
    if (!props.disabled && !props.readonly && !transitionStatus) {
      if (!isShowOption) {
        const windowHeight: number = window.innerHeight;
        const rect = selectBoxRef.current?.getBoundingClientRect() as DOMRect;

        if (windowHeight / 2 < rect.top) {
          setShowBottom(true);
        } else {
          setShowBottom(false);
        }

        layerPositionStyle.top =  '';
        layerPositionStyle.bottom =  '';

        layerPositionStyle.left = `${rect.left}px`;
        layerPositionStyle.width = `${rect.width}px`;
        layerPositionStyle.bottom = showBottom ? `${(windowHeight - rect.top) + 3}px` : '';
        layerPositionStyle.top = !showBottom ? `${rect.top + 43}px` : '';
      }

      setIsShowOption(!isShowOption);

      if (isShowOption) {
        if (props.searchable) {
          searchInput.value!.value = '';
          isSearchFilter.value = false;
        }

        optionList.value = [...props.options];

        // nextTick(() => {
        //   const selected = ul.value?.querySelector('.selected');
        //   selected?.scrollIntoView();
        // });
      }
    }
  };

  let timeout: number = 0;

  // props.searchable 적용시
  const searchText = (evt: KeyboardEvent): void => {
    const key = evt.key.toLowerCase();

    clearTimeout(timeout);

    if (!['arrowup', 'arrowdown', 'enter'].includes(key)) {
      selectedKeyIndex.value = 0;
      timeout = setTimeout(() => {
        const { value } = evt.target as HTMLInputElement;
        isSearchFilter.value = value ? true : false;
        if (value) {
          optionList.value = props.options.filter(({ text }) => text.toLowerCase().indexOf(value.toLowerCase()) > -1);
        } else {
          optionList.value = [...props.options];
        }

        nextTick(() => {
          const li = ul.value?.querySelector<HTMLLIElement>('.option-item');
          li?.scrollIntoView({ block: 'center' });
        });
      }, 300);
    }
  };

  // props.isAccept 적용시
  const accept = (): void => {
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

  const feedback = useState<HTMLDivElement>();
  const main = useState<HTMLDivElement>();

  let eventParentElement: HTMLElement;

  const parentScrollEvent = (): void => {
    isShowOption.value = false;
  };

  /**
   * 컴포넌트 상위 element를 탐색(재귀)하며 scroll이 있는 Element에
   * scroll event를 추가 하여 scorll 발생시 layer 창을 닫아 준다.
   * @param el
   */
  const setScrollEvent = (el: HTMLElement): void => {
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

  const clearButtonShow = computed<boolean>(() => {
    if (props.modelValue) {
      return props.clearable && !props.disabled && !props.readonly && props.modelValue.length > 0;
    } else {
      return false;
    }
  });

  const clearValue = (): void => {
    updateValue(props.multiple ? [] : '');
  };

  const onBlur = (): void => {
    nextTick(() => {
      emit('blur', selectedValue.value);
    });
  };

  const onKeyHandler = (event: KeyboardEvent): void => {
    if (isShowOption.value) {
      const li = ul.value?.querySelectorAll<HTMLLIElement>('.option-item');

      if (li) {
        const len = li.length;
        const code = event.code.toLowerCase();

        if (code === 'arrowdown' && selectedKeyIndex.value < len) {
          selectedKeyIndex.value++;

          if (selectedKeyIndex.value >= len) {
            selectedKeyIndex.value = 0;
          }

          len && li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });

        } else if (code === 'arrowup' && selectedKeyIndex.value >= -1) {
          selectedKeyIndex.value--;

          if (selectedKeyIndex.value === -1) {
            selectedKeyIndex.value = len - 1;
          }

          len && li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });

        } else if (['numpadenter', 'enter'].includes(code)) {
          if (props.multiple && !isSearchFilter.value && selectedKeyIndex.value === 0) {
            selectAll();
          } else {
            const index = props.multiple && !isSearchFilter.value ? selectedKeyIndex.value - 1 : selectedKeyIndex.value;
            if (index > -1 && index < optionList.value.length) {
              const value = optionList.value[index].value;
              selectOption(value);
            }
          }
        } else if (code === 'tab') {
          if (document.activeElement instanceof HTMLElement) {
            const parentElement = SelectBox.value?.parentElement || undefined;
            const isFocused: boolean = parentElement ? document.activeElement.contains(parentElement) : false;
            // 해당 SelectBox 포커스영역에서 포커스 이동시, 옵션 영역 활성화 해제 진행.
            !isFocused && toggleOption();
          }
        }
      }
    }
  };

  const onEscapeKeyHandler = (event: KeyboardEvent): void => {
    const code = event.code.toLowerCase();
    if (isShowOption.value && code === 'escape') {
      isShowOption.value = false;
      noneAccept();

      // eventPhase : 0 = none / 1 = capture / 2 = target / 3 = bubbling
      // 모달 내부의 SelectBox 키 이벤트와 동시에 Modal도 같이 이벤트 수행이 되기 때문에
      // SelectBox 이벤트만 수행 후, 이벤트 전파 중지.
      const eventPhase: number = event.eventPhase;
      (eventPhase === 1 || eventPhase === 2) && event.stopPropagation();
    }
  };

  useEffect(isShowOption, (v) => {
    if (v) {
      document.addEventListener('keydown', onKeyHandler);
    } else {
      document.removeEventListener('keydown', onKeyHandler);
    }
  });

  onMounted(() => {
    setDefaultModelValue();

    setScrollEvent(main.value!);
    document.addEventListener('click', outSideClickEvent);

    // feedback message 트랜지션 초기화
    feedback.value!.addEventListener('animationend', () => {
      errorTransition.value = false;
    });
  });

  onUnmounted(() => {
    document.removeEventListener('click', outSideClickEvent);
    document.removeEventListener('keydown', onKeyHandler);

    if (eventParentElement) {
      eventParentElement.removeEventListener('scroll', parentScrollEvent);
    }
  });

  useImperativeHandle(ref, {
    element: document.getElementById(elementId),
    check,
    resetForm,
    resetValidate,
  });

  return (
    <>
      <div
        ref="main"
        tabindex="0"
        id={elementId}
        :style="{ width: styleWidth }"
        :class="['select-box', wrapperStyle]"
        @focus="!isShowOption && toggleOption($event)"
        @keydown.escape.capture="onEscapeKeyHandler"
      >
        <div
          class="options-wrap"
          v-if="!props.inLabel"
        >
          <label
            :class="['input-label', { error: !isValidate }]"
            v-if="props.label"
          >
            {{ props.label }}

            <span
              class="required"
              v-if="props.required"
            >
              *
            </span>
          </label>
        </div>

        <div
          ref="SelectBox"
          :class="['control-wrap', { disabled: props.disabled, readonly: props.readonly, error: message, active: isShowOption }]"
          @click="toggleOption"
        >
          <template v-if="props.multiple">
            <div
              class="text"
              v-if="getShowText.length"
            >
              <template v-if="props.labelText">
                <template v-if="!props.isShort">
                  <span
                    :key="`selectedItem${i}`"
                    class="item"
                    v-for="(txt, i) in getShowText"
                  >
                    {{ txt }}
                    <SvgIcon
                      type="mdi"
                      class="remove-icon"
                      size="13"
                      :path="mdiWindowClose"
                      @click.stop="removeSelected(i)"
                    />
                  </span>
                </template>
                <template v-else>
                  <span>{{ getShowText[0] }}</span>

                  <template v-if="getShowText.length > 1"> &nbsp; + {{ getShowText.length - 1 }} </template>
                </template>
              </template>
              <template v-else>
                <template v-if="!props.isShort">
                  <span
                    class="label"
                    v-if="props.inLabel"
                  >
                    {{ props.label }}:
                  </span>

                  {{ getShowText.join(', ') }}
                </template>
                <template v-else>
                  <span
                    class="label"
                    v-if="props.inLabel"
                  >
                    {{ props.label }}:
                  </span>

                  {{ getShowText[0] }}
                  <template v-if="getShowText.length > 1"> + {{ getShowText.length - 1 }} </template>
                </template>
              </template>
            </div>
            <div class="text ph" v-else>
              <span class="label" v-if="props.inLabel">
                {{ props.label }}:
              </span>

              {{ props.placeholder }}
            </div>
          </template>
          <template v-else>
            <div
              class="text"
              v-if="getShowText.length > 0"
            >
              <span
                class="label"
                v-if="props.inLabel"
              >
                {{ props.label }}:
              </span>

              {{ getShowText[0] }}
            </div>
            <div
              class="text ph"
              v-else
            >
              <span
                class="label"
                v-if="props.inLabel"
              >
                {{ props.label }}:
              </span>

              {{ props.placeholder }}
            </div>
          </template>

          <a
            href="#"
            class="btn-clear"
            @click.stop.prevent="clearValue"
            v-if="clearButtonShow"
          >
            <SvgIcon type="mdi" size="20" :path="mdiCloseCircle" />
          </a>

          <div :class="['arrow', { rotate: isShowOption }]">
            <SvgIcon type="mdi" size="16" :path="mdiChevronDown" />
          </div>

          <Transition
            :name="showBottom ? 'options-view-bottom' : 'options-view'"
            @leave="[onBlur(), props.blurValidate && check()]"
            @enter="transitionStatus = true"
            @after-enter="transitionStatus = false"
          >
            <div
              :style="layerPositionStyle"
              :class="['option-list', showBottom ? 'show-bottom' : 'show-top']"
              v-show="isShowOption"
            >
              <div
                class="search"
                @click.stop
                v-if="props.searchable"
              >
                <div class="search-wrap">
                  <input
                    ref="searchInput"
                    placeholder="검색어 입력"
                    type="text"
                    @keydown.up.prevent="onKeyHandler"
                    @keydown.down.prevent="onKeyHandler"
                    @keydown.enter.prevent="onKeyHandler"
                    @keydown.tab.prevent="onKeyHandler"
                    @keydown.stop="searchText"
                  />
                  <SvgIcon
                    type="mdi"
                    :path="mdiMagnify"
                  />
                </div>
              </div>
              <ul ref="ul" class="scrollbar">
                <li
                  :class="['option-item', selectedKeyIndex === 0 && !isSearchFilter && 'key-selected']"
                  @click.stop="selectAll"
                  v-if="props.multiple && !props.maxLength && !isSearchFilter"
                >
                  <SvgIcon
                    type="mdi"
                    :class="['checkbox', isSelectAll && 'checked']"
                    :path="isSelectAll ? mdiCheckboxMarked : mdiCheckboxBlankOutline"
                  />
                  {{ isSelectAll ? '전체 해제' : '전체 선택' }}
                </li>
                <template v-if="optionList.length">
                  <li
                    :key="`select-${item.value}`"
                    :class="['option-item', { selected: isOptionSelected(item.value), 'key-selected': isOptionFocused(i) }]"
                    @click.stop="selectOption(item.value)"
                    v-for="(item, i) in optionList"
                  >
                    <template v-if="props.multiple">
                      <SvgIcon
                        type="mdi"
                        class="checkbox"
                        :path="isOptionSelected(item.value) ? mdiCheckboxMarked : mdiCheckboxBlankOutline"
                      />
                    </template>
                    {{ item.text }}
                  </li>
                </template>
                <template v-else>
                  <li @click.stop>검색된 내용이 없습니다.</li>
                </template>
                <li class="items-loading" v-if="props.isLoading">
                  <SvgIcon
                    type="mdi"
                    class="loading"
                    size="24"
                    :path="mdiGoogleCirclesExtended"
                  />
                </li>
              </ul>
              <a
                href="#"
                class="btn-accept"
                @click.stop.prevent="accept"
                v-if="props.btnAccept"
              >
                적용 + {{ selectedValue.length }}
              </a>
            </div>
          </Transition>
        </div>

        <div
          ref="feedback"
          :class="['feedback', { error: errorTransition }]"
          v-show="message && !props.hideMessage"
        >
          {{ message }}
        </div>
      </div>
    </>
  );
});

SelectBox.displayName = 'SelectBox';
SelectBox.defaultProps = {
  options: [],
  inLabel: false,
  block: false,
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