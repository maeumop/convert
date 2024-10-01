import { useState } from 'react';
import type { ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import './style.scss';

export const ValidateForm = <T extends FieldValues>(props: { children: ReactNode }) => {
  const methods = useForm<T>();
  const [isCover, setIsCover] = useState<boolean>(false);

  const onSubmit = () => {

  }

  return (
    <FormProvider {...methods}>
      <form
        className={isCover ? 'validate-form' : ''}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {props.children}
        {isCover && (
          <div className="form-cover" />
        )}
      </form>
    </FormProvider>
  );
};