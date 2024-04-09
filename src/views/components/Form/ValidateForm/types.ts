import type { ReactNode } from 'react';

export interface ValidateFormProps {
  children: ReactNode;
}

export interface ValidateFormModel {
  formProtection(protect?: boolean): void
  resetForm(): void,
  validate(silence?: boolean): boolean
  resetValidate(): void
}
