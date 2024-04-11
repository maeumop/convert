import { ReactNode } from "react"
import { ValidationRule } from "../../types"

export interface ValidateWrapProps {
  children: ReactNode;
  checkValue: any;
  validate?: ValidationRule[];
  errorMessage?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  addOn?: ReactNode;
}

export interface ValidateWrapModel {
  check(silence?: boolean): void
  resetForm(): void
  resetValidate(): void
}