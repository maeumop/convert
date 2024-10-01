import { useState } from 'react';
import type { ValidateFormProps } from './types';
import { FormProvider, useForm } from 'react-hook-form';
import './style.scss';

export const ValidateMessage = ({ message }: { message: string }) => {
  return message ? <p className="validate-msg">{message}</p> : null;
};

export const ValidateForm = (props: ValidateFormProps) => {
  const methods = useForm();

  const [isCover, setIsCover] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    if (props.cover) {
      setIsCover(true);
    }

    props.onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        name={props.name}
        className={isCover ? 'validate-form' : ''}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {props.children}
        {isCover && <div className="form-cover" />}
      </form>
    </FormProvider>
  );
};

ValidateForm.displayName = 'ValidateForm';
ValidateForm.defaultProps = {
  cover: false,
};
