import type { switchButtonColors } from './const';

export type SwitchButtonColors = typeof switchButtonColors[keyof typeof switchButtonColors];

export interface SwitchButtonModel {
  check(silence?: boolean): void
  resetForm(): void
  resetValidate(): void
}