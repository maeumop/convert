import { useState } from 'react';
import { TextField } from '@/views/components/Form/TextField';
import { NumberFormat } from './components/Form/NumberFormat';
import { ValidateForm } from './components/Form/ValidateForm';
import { StyledButton } from './components/StyledButton';
import { SwitchButton } from './components/Form/SwitchButton';
import { CheckButtonItem } from './components/Form/CheckButton/types';
import { SelectBoxItem } from './components/Form/SelectBox/types';
import { SelectBox } from './components/Form/SelectBox';
import '@/assets/forms.scss';

interface FormEx {
  userId: string;
  number: string;
  selector: string;
}


export const Forms = () => {
  const [userId, setUserId] = useState<string>('');
  const [number, setNumber] = useState<number>(0);
  const [checked, setChecked] = useState<string[]>(['']);
  const [selectBox, setSelectBox] = useState<string | string[]>('');
  const [switchValue, setSwitchValue] = useState<string | boolean>(false);

  const checkedItems: CheckButtonItem[] = [
    { text: 'test1', value: '1' },
    { text: 'test2', value: '2' },
    { text: 'test3', value: '3' },
    { text: 'test4', value: '4' },
    { text: 'test5', value: '5' },
  ];
  const options: SelectBoxItem[] = [
    { text: '그림1', value: '1' },
    { text: '그림2', value: '2' },
    { text: '그림3', value: '3' },
    { text: '그림4', value: '4' },
    { text: '그림5', value: '5' },
  ];


  return (
    <div className="forms">
      <ValidateForm>
        <ul>
          <li>
            <TextField
              name="test"
              required
              clearable
              label="text field"
              placeholder="아이디 입력"
              value={userId}
              onChange={() => null}
            />
          </li>
          <li>
            <NumberFormat
              required
              label="number format"
              placeholder="숫자 입력"
              value={number}
              onChange={() => null}
            />
          </li>
          <li>
            <SelectBox
              searchable
              placeholder="선택하기"
              options={options}
              value={selectBox}
              onChange={() => null}
            />
          </li>
          <li>
            <SwitchButton
              value={switchValue}
              onChange={() => null}
            />
          </li>
          <li>
            <StyledButton onClick={() => submit()}>Test</StyledButton>
          </li>
        </ul>
      </ValidateForm>
    </div>
  );
}
