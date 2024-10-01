import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm, useController } from 'react-hook-form';
import type { FieldError, UseControllerProps } from 'react-hook-form';
import '@/assets/index.scss';
import '@/assets/validate.scss';

// control props에 발생하는 오류를 막기위해 모든 interface를 optional 처리
interface Inputs {
  userId?: string;
  password?: string;
  language?: string[];
}

interface InputFieldProps {
  placeholder: string;
}

const validation = {
  userId: {
    required: {
      value: true,
      message: '아이디를 입력해주세요.',
    },
  },
  password: {
    required: {
      value: true,
      message: '비밀번호를 입력해주세요.',
    },
    minLength: {
      value: 8,
      message: '최소 8자리 이상 입력해야 합니다.',
    },
  },
  language: {
    validate: {
      noChecked: (v: Array<string>) => !(v.length < 1) || '언어를 선택해주세요.',
      singleChecked: (v: Array<string>) => !(v.length < 2) || '두 가지 이상 선택해야 합니다.',
    },
  },
};

const validate = (field?: FieldError | undefined) => {
  if (field !== undefined) {
    const { message } = field;
    return message && <p className="alert">{message}</p>;
  }

  return null;
};

const MyLanguageCheck = (props: UseControllerProps) => {
  const { field, fieldState } = useController(props);

  const options = [
    { value: 'php', text: 'PHP' },
    { value: 'dart', text: 'Dart' },
    { value: 'java', text: 'Java' },
    { value: 'js', text: 'Javascript' },
  ];

  const [value, setValue] = useState<string[]>([]);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const v = evt.target.value;
    const copyValue = [...value];
    const indexOf = copyValue.indexOf(v);

    if (indexOf > -1) {
      copyValue.splice(indexOf, 1);
    } else {
      copyValue.push(v);
    }

    setValue(copyValue);
    field.onChange(copyValue);
  };

  return (
    <>
      {options.map((item) => (
        <label key={`checkbox-${item.value}`}>
          <input
            type="checkbox"
            name={field.name}
            checked={value.includes(item.value)}
            value={item.value}
            onChange={onChange}
          />
          {item.text}
        </label>
      ))}
      {validate(fieldState.error)}
    </>
  );
};

const InputField = (props: UseControllerProps & InputFieldProps) => {
  const { field, fieldState } = useController(props);

  return (
    <>
      <input placeholder={props.placeholder} {...field} />
      {validate(fieldState.error)}
    </>
  );
};

export const FormValidate = () => {
  const { handleSubmit, control } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <form name="frm" className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        placeholder="아이디 입력(email)"
        name="userId"
        defaultValue=""
        control={control}
        rules={validation.userId}
      />

      <InputField
        placeholder="비밀번호 입력"
        name="password"
        defaultValue=""
        control={control}
        rules={validation.password}
      />

      <MyLanguageCheck
        name="language"
        defaultValue={[]}
        control={control}
        rules={validation.language}
      />

      <button type="submit" className="button">
        보내기!
      </button>
    </form>
  );
};
