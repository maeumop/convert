import { useState, createContext } from 'react';
import type { ReactNode } from 'react';
import type { DatePickerState, DatePickerContextState } from './types';

const nowDate = new Date();
const defaultValue: DatePickerState = {
  minYear: 1900,
  maxYear: nowDate.getFullYear(),
  startDate: '',
  endDate: '',
  startYear: nowDate.getFullYear(),
  startMonth: nowDate.getMonth() + 1,
  startDay: nowDate.getDate(),
  endYear: nowDate.getFullYear(),
  endMonth: nowDate.getMonth() + 1,
  endDay: nowDate.getDate(),
  message: '',
  buttons: [
    { text: '오늘', value: 0, active: false },
    { text: '어제', value: -1, active: false },
    { text: '7일', value: -6, active: false },
    { text: '15일', value: -14, active: false },
    { text: '30일', value: -29, active: false },
  ],
  resetButtons: () => {
    defaultValue.buttons = defaultValue.buttons.map((item) => {
      item.active = false;
      return item;
    });
  },
  activeButton: (index: number) => {
    defaultValue.resetButtons();
    defaultValue.buttons[index].active = true;
  },
};

export const DatePickerContext = createContext<DatePickerContextState>({
  state: defaultValue,
  dispatch: () => {},
});

export const DatePickerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useState<DatePickerState>(defaultValue);

  return (
    <DatePickerContext.Provider value={{ state, dispatch }}>
      {children}
    </DatePickerContext.Provider>
  );
};
