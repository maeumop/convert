import type { ReactElement } from 'react';

export interface ValidateFormProps {
  name?: string;
  children: ReactElement;
  cover?: boolean;
  onSubmit: (data: any) => void;
}
