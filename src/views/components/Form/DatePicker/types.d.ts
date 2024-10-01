import { dateCalcReturnType } from './const';
import { PickerHelperDatePart } from './types.d';
import { NumberFormatModel } from '../NumberFormat/types';

type PickerDateType = 'start' | 'end';

export interface DatePickerProps {
  onChange: (v: string[]) => void;
  name: string;
  value: string[];
  isRange: boolean;
  placeholder: string[];
  rules?: object;
  minYear: number;
  maxYear?: number;
  readOnly: boolean;
  disabled: boolean;
  maxRange: number;
}

export interface DatePickerCalendarProps {
  onChange: (v: string) => void;
  type: PickerDateType;
  isRange: boolean;
}

export interface CalendarCellData {
  day: number;
  today: boolean;
  selected: boolean;
  inSelected: boolean;
}

export interface ControllerButtons {
  text: string;
  value: number;
  active: boolean;
}

export interface DatePickerDateSelector {
  onChange: (v: number) => void;
  type: PickerDateType;
}

export interface DatePickerState {
  startDate: string;
  endDate: string;
  minYear: number;
  maxYear: number;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  message: string;
  buttons: ControllerButtons[];
  resetButtons: () => void;
  activeButton: (index: number) => void;
}

export interface DatePickerContextState {
  state: DatePickerState;
  dispatch: (state: DatePickerState) => void;
}

export interface HelperDatePart {
  year: number;
  month: number;
  day: number;
  week: number;
}

export type HelperDateCalcType =
  (typeof dateCalcReturnType)[keyof typeof dateCalcReturnType];

export type HelperDateCalc = string | HelperDatePart | Date;
