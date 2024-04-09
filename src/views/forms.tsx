import { useState, useRef, useEffect } from 'react';
import { TextField } from '@/views/components/Form/TextField';
import { NumberFormat } from './components/Form/NumberFormat';
import { ValidateForm } from './components/Form/ValidateForm';
import { StyledButton } from './components/StyledButton';
import { TextFieldModel } from './components/Form/TextField/types';
import { NumberFormatModel } from './components/Form/NumberFormat/types';
import { CheckButton } from './components/Form/CheckButton';
import type { ValidationRule } from '@/views/components/types';
import type { ValidateFormModel } from './components/Form/ValidateForm/types';
import '@/assets/forms.scss';
import { CheckButtonItem } from './components/Form/CheckButton/types';

export const Forms = () => {
  console.log('build');
  const [userId, setUserId] = useState<string>('');
  const [number, setNumber] = useState<number>(0);
  const [checked, setChecked] = useState<string[]>(['']);
  const checkedItems: CheckButtonItem[] = [
    { text: 'test1', value: '1' },
    { text: 'test2', value: '2' },
    { text: 'test3', value: '3' },
    { text: 'test4', value: '4' },
    { text: 'test5', value: '5' },
  ];

  const formRef = useRef<ValidateFormModel>(null);
  const textRef = useRef<TextFieldModel>(null);
  const numberRef = useRef<NumberFormatModel>(null);

  const rules: ValidationRule[] = [v => !!v || '필수 입력사항입니다.'];

  const onTextChange = (v: string) => {
    setUserId(v);
  }

  const onNumberChange = (v: number) => {
    setNumber(v);
  }

  const onClick = () => {
    console.log(formRef.current?.validate());
  }

  return (
    <div className="forms">
      <ValidateForm ref={ formRef }>
        <ul>
          <li>
            <TextField
              label="test"
              placeholder="아이디 입력"
              ref={textRef}
              required={true}
              onChange={onTextChange}
              value={userId}
              validate={rules}
              clearable
            />
          </li>
          <li>
            <NumberFormat
              label="test"
              placeholder="숫자 입력"
              ref={numberRef}
              required={true}
              onChange={onNumberChange}
              value={number}
              validate={rules}
            />
          </li>
          <li>
            <StyledButton onClick={onClick}>Test</StyledButton>
          </li>
        </ul>
      </ValidateForm>
    </div>
  );
}