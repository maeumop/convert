import { useCallback, useContext, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type {
  DatePickerContextState,
  DatePickerProps,
  PickerDateType,
} from './types';
import Icon from '@mdi/react';
import { mdiCalendar, mdiCalendarExpandHorizontal } from '@mdi/js';
import { useController, useFormContext } from 'react-hook-form';
import { ValidateMessage } from '../ValidateForm';
import { Calendar } from './Calendar';
import { DateController, DateControllerButton } from './DateController';
import { DatePickerContext, DatePickerProvider } from './provider';
import { CSSTransition } from 'react-transition-group';
import { useOutSideClick } from './hooks';
import './style.scss';
import React from 'react';

const BaseDatePicker = (props: DatePickerProps) => {
  const { control, clearErrors } = useFormContext();
  const {
    field,
    formState: { errors },
  } = useController({
    control,
    name: props.name,
    defaultValue: [],
    rules: props.rules,
    disabled: props.disabled,
  });

  const { state, dispatch } =
    useContext<DatePickerContextState>(DatePickerContext);

  const [isShow, setIsShow] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const onChange = useCallback((v: string[]) => {
    clearErrors(props.name);
    props.onChange(v);
    field.onChange(v);
  }, [clearErrors, props.name, field.onChange, props.onChange]);

  const onDateChange = useCallback((v: string) => {
    onChange([v]);
    dispatch({
      ...state,
      startDate: v,
    });
    setIsShow(false);
  }, [onChange, dispatch, state]);

  /**
   * props.isRange 설정이 되었을 경우 날짜 선택 처리
   * @param v
   * @param type
   */
  const onRangeDateChange = useCallback((v: string, type: PickerDateType) => {
    dispatch({
      ...state,
      [`${type}Date`]: v,
      message: '',
    });
  }, [dispatch, state]);

  const acceptDate = useCallback((evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    // 선택된 날짜가 정상인지 검수
    if (state.startDate && state.endDate) {
      const start = new Date(state.startDate).getTime();
      const end = new Date(state.endDate).getTime();

      if (start > end) {
        dispatch({
          ...state,
          message: '시작일 종료일 보다 늦을 수 없습니다.',
        });

        return;
      }
    }

    onChange([state.startDate, state.endDate]);
    setIsShow(false);
  }, [onChange, dispatch, state]);

  const cancelRange = useCallback((evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    dispatch({
      ...state,
      startDate: '',
      endDate: '',
      message: '',
    });

    setIsShow(false);
  }, [dispatch, state]);

  const baseRef = useOutSideClick(() => {
    setIsShow(false);
  });

  return (
    <div ref={baseRef} className="date-picker-wrapper">
      <div className="date-picker" onClick={() => setIsShow(!isShow)}>
        <input
          readOnly
          type="text"
          value={state.startDate}
          placeholder={props.placeholder[0]}
        />
        {props.isRange && (
          <>
            <div>&nbsp; ~ &nbsp;</div>
            <input
              readOnly
              type="text"
              value={state.endDate}
              placeholder={props.placeholder[1]}
            />
          </>
        )}
        <Icon
          size="1.5em"
          color="#a0a0a0"
          path={props.isRange ? mdiCalendarExpandHorizontal : mdiCalendar}
        />
      </div>

      <ValidateMessage message={errors[props.name]?.message as string} />

      <CSSTransition
        unmountOnExit
        classNames="fade-scale"
        in={isShow}
        timeout={200}
        nodeRef={pickerRef}
      >
        <div ref={pickerRef} className="calendar-wrapper">
          {props.isRange && (
            <div className="button-tools">
              <DateControllerButton />
            </div>
          )}
          <div className="calendar">
            <div className="start-calendar">
              <DateController type="start" />
              <Calendar
                isRange={props.isRange}
                type="start"
                onChange={(v) => {
                  if (props.isRange) {
                    onRangeDateChange(v, 'start');
                  } else {
                    onDateChange(v);
                  }
                }}
              />
            </div>
            {props.isRange && (
              <>
                <div className="separater" />
                <div className="end-calendar">
                  <DateController type="end" />
                  <Calendar
                    type="end"
                    isRange
                    onChange={(v) => onRangeDateChange(v, 'end')}
                  />
                </div>
              </>
            )}
          </div>
          {props.isRange && (
            <div className="button-area">
              <div className="error-message">{state.message}</div>
              <div className="buttons">
                <a href="#" onClick={cancelRange}>
                  취소
                </a>
                <a href="#" onClick={acceptDate}>
                  확인
                </a>
              </div>
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

export const DatePicker = React.memo(({
  isRange = false,
  placeholder = ['날짜 선택', '날짜 선택'],
  value = ['', ''],
  minYear = 1900,
  readOnly = false,
  disabled = false,
  maxRange = 0,
  ...props
}: DatePickerProps) => {
  return (
    <DatePickerProvider>
      <BaseDatePicker
        isRange={isRange}
        placeholder={placeholder}
        value={value}
        minYear={minYear}
        readOnly={readOnly}
        disabled={disabled}
        maxRange={maxRange}
        {...props}
      />
    </DatePickerProvider>
  );
});

DatePicker.displayName = 'DatePicker';
