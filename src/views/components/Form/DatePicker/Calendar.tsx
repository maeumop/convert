import React, { useContext } from 'react';
import type {
  CalendarCellData,
  DatePickerCalendarProps,
  PickerDateType,
} from './types';
import './style.scss';
import { DatePickerContext } from './provider';
import { useDatePickerHelper } from './helper';

const helper = useDatePickerHelper();

/**
 * 요일별 색상 값을 결정하는 class 명을 반환
 * @param num
 * @returns
 */
const getWeekColor = (num: number): string => {
  let weekClassName = '';

  if ((num + 1) % 7 === 1) {
    weekClassName = 'sun';
  } else if ((num + 1) % 7 === 0) {
    weekClassName = 'sat';
  }

  return weekClassName;
};

const Weeks = React.memo(({ type }: { type: 'start' | 'end' }) =>
  ['일', '월', '화', '수', '목', '금', '토'].map((item, i) => (
    <li key={`${type}-${item}`} className={['week', getWeekColor(i)].join(' ')}>
      {item}
    </li>
  )),
);

/**
 * 달력의 날짜를 표시할 배열을 생성
 * @param type
 * @param isRange
 * @returns
 */
const makeCalendarCell = (
  type: PickerDateType,
  isRange: boolean = false,
): CalendarCellData[] => {
  const { state } = useContext(DatePickerContext);

  // 빈 라인 6개 생성 (해당 라인 마다 7개씩의 배열을 추가로 생성)
  let cells = new Array(6 * 7).fill({});

  const year = state[`${type}Year`];
  const month = state[`${type}Month`];
  const lastDay = new Date(year, month, 0).getDate();
  const startWeek = new Date(year, month - 1, 1).getDay();

  let isStart = false;
  let isEnd = false;
  let day: number = 0;

  const calednar = cells.map<CalendarCellData>((_, i) => {
    if (day >= lastDay) {
      isEnd = true;
    }

    if (startWeek === i && !isStart) {
      isStart = true;
    }

    if (isStart && day < lastDay && !isEnd) {
      day++;
    }

    day = isEnd ? 0 : day;

    const date = helper.getDateFormat(
      helper.intlFormat.format(new Date(year, month - 1, day)),
    );

    const isToday = helper.today === day && date === helper.todayDate;

    let selected = false;
    let inSelected = false;

    // 선택 된 날짜 표시
    if (isRange) {
      selected = date === state[`${type}Date`];

      if (state.startDate && state.endDate) {
        const start = new Date(state.startDate).getTime();
        const end = new Date(state.endDate).getTime();
        const now = new Date(date).getTime();

        if (start <= now && end >= now) {
          inSelected = true;
        }
      }
    } else {
      selected = date === state.startDate;
    }

    return {
      day: day,
      today: isToday,
      selected,
      inSelected,
    };
  });

  return calednar;
};

export const Calendar = React.memo(({ isRange = false, ...props }: DatePickerCalendarProps) => {
  const { state } = useContext(DatePickerContext);
  const cells = makeCalendarCell(props.type, isRange);

  // 마지막 줄이 비어 있는 경우 제거
  if (cells[41 - 6].day === 0) {
    cells.splice(41 - 7, 7);
  }

  const onClickDate = (day: number) => {
    const date = new Date(
      state[`${props.type}Year`],
      state[`${props.type}Month`] - 1,
      day,
    );
    state.resetButtons();
    const format = helper.getDateFormat(helper.intlFormat.format(date));
    props.onChange(format);
  };

  return (
    <ul>
      <Weeks type={props.type} />

      {cells.map((item, i) => {
        return item.day === 0 ? (
          <li key={`${props.type}-empty-${i}`}>&nbsp;</li>
        ) : (
          <li
            key={`${props.type}-day-${i}`}
            className={[
              getWeekColor(i),
              item.today && 'today',
              item.selected && 'selected',
              (!item.selected && item.inSelected) && 'in-selected',
            ].join(' ')}
            onClick={() => onClickDate(item.day)}
          >
            {item.day}
          </li>
        );
      })}
    </ul>
  );
});

Calendar.displayName = 'Calendar';
