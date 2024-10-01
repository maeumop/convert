import React, { useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import type {
  ControllerButtons,
  DatePickerDateSelector,
  PickerDateType,
} from './types';
import { DatePickerContext } from './provider';
import { useDatePickerHelper } from './helper';
import { dateCalcReturnType } from './const';

const helper = useDatePickerHelper();

const YearSelector = React.memo((props: DatePickerDateSelector) => {
  const { state } = useContext(DatePickerContext);
  const nodes: ReactNode[] = [];

  for (let i = state.minYear; i <= state.maxYear; i++) {
    nodes.push(
      <option key={`${props.type}-${i}`} value={i}>
        {i}년
      </option>,
    );
  }

  const onChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    props.onChange(Number(evt.target.value));
  };

  const selected = useMemo(
    () => state[`${props.type}Year`],
    [state.startYear, state.endYear],
  );

  return (
    <select value={selected} onChange={onChange}>
      {nodes}
    </select>
  );
});

const MonthSelector = React.memo((props: DatePickerDateSelector) => {
  const { state } = useContext(DatePickerContext);
  const nodes: ReactNode[] = [];

  for (let i = 1; i <= 12; i++) {
    nodes.push(
      <option key={`${props.type}-month-${i}`} value={i}>
        {i}월
      </option>,
    );
  }

  const onChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    props.onChange(Number(evt.target.value));
  };

  const selected = useMemo<number>(
    () => state[`${props.type}Month`],
    [state.startMonth, state.endMonth],
  );

  return (
    <select value={selected} onChange={onChange}>
      {nodes}
    </select>
  );
});

export const DateController = ({ type }: { type: PickerDateType }) => {
  const { state, dispatch } = useContext(DatePickerContext);

  const onChangeMonth = (event: MouseEvent, month: number) => {
    event.preventDefault();

    let changeYear = state[`${type}Year`];
    let changeMonth =
      (type === 'start' ? state.startMonth : state.endMonth) + month;

    if (month === -1 && changeMonth === 0) {
      changeYear--;
      changeMonth = 12;

      if (changeYear < state.minYear) {
        return;
      }
    } else if (month === 1 && changeMonth === 13) {
      changeYear++;
      changeMonth = 1;

      if (changeYear > state.maxYear) {
        return;
      }
    }

    dispatch({
      ...state,
      [`${type}Year`]: changeYear,
      [`${type}Month`]: changeMonth,
    });
  };

  const onYearChange = (v: number) => {
    dispatch({
      ...state,
      [`${type}Year`]: v,
    });
  };

  const onMonthChange = (v: number) => {
    dispatch({
      ...state,
      [`${type}Month`]: v,
    });
  };

  return (
    <div className="date-controller">
      <a href="#" onClick={(e) => onChangeMonth(e, -1)}>
        <Icon size="1.5em" color="#979797" path={mdiChevronLeft} />
      </a>

      <div className="year-month">
        <YearSelector type={type} onChange={onYearChange} />
        <MonthSelector type={type} onChange={onMonthChange} />
      </div>

      <a href="#" onClick={(e) => onChangeMonth(e, 1)}>
        <Icon size="1.5em" color="#979797" path={mdiChevronRight} />
      </a>
    </div>
  );
};

const btn = () => {
  const { state, dispatch } = useContext(DatePickerContext);

  const setDateRange = (interval: number) => {
    const start: Date = helper.dateCalc(
      new Date(),
      interval,
      dateCalcReturnType.date,
    ) as Date;
    const end: Date = helper.nowDate;
    const {
      year: startYear,
      month: startMonth,
      day: startDay,
    } = helper.getDatePart(start);
    const {
      year: endYear,
      month: endMonth,
      day: endDay,
    } = helper.getDatePart(end);

    dispatch({
      ...state,
      startDate: helper.getDateFormat(start),
      endDate: helper.getDateFormat(end),
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
    });
  };

  const onClickButton = (index: number) => {
    setDateRange(state.buttons[index].value);
    state.activeButton(index);
  };

  return state.buttons.map<ReactNode>((item: ControllerButtons, i: number) => (
    <a
      href="#"
      key={`tool-buttons-${i}`}
      className={`${item.active && 'active'}`}
      onClick={() => onClickButton(i)}
    >
      {item.text}
    </a>
  ));
};

btn.displayName = 'DateControllerButton';

export const DateControllerButton = React.memo(btn);
