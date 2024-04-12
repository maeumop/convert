import type { ReactNode, ReactElement } from 'react';

export interface ValidateFormProps {
  children: ReactElement;
}

export interface ValidateFormModel {
  formProtection(protect?: boolean): void
  resetForm(): void,
  validate(silence?: boolean): boolean
  resetValidate(): void
}
