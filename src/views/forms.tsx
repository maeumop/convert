import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { TextField } from '@/views/components/Form/TextField';
import { NumberFormat } from './components/Form/NumberFormat';
import { ValidateForm } from './components/Form/ValidateForm';
import { StyledButton } from './components/StyledButton';
import { SwitchButton } from './components/Form/SwitchButton';
import { SelectBox } from './components/Form/SelectBox';
import {
  CheckButtonItem,
  checkButtonType,
} from './components/Form/CheckButton/types';
import { SelectBoxItem } from './components/Form/SelectBox/types';
import { CheckButton } from './components/Form/CheckButton';
import {
  MessageBox,
  MessageBoxProvider,
  useMessageBox,
} from './components/MessageBox';
import { DatePicker } from './components/Form/DatePicker';
import '@/assets/forms.scss';
import { Toast, useToastMessage } from './components/Toast';
import { ToastContextProvider } from './components/Toast/provider';

const rules = {
  email: {
    required: {
      value: true,
      message: '이메일을 입력해주세요.',
    },
  },
  userId: {
    required: {
      value: true,
      message: '아이디를 입력해주세요.',
    },
  },
  number: {
    validate: {
      check: (v: string) => {
        const value: number = Number(v.replace(/\,/g, ''));

        if (value <= 0) {
          return '0 이상의 값을 입력해주세요.';
        }

        if (value > 1000000) {
          return '최대 1,000,000 까지 입력 가능';
        }

        return null;
      },
    },
  },
  selector: {
    validate: {
      check: (v: string[]) => {
        if (!v.length) {
          return '그림을 선택해주세요.';
        }

        return null;
      },
    },
  },
  switch: {
    validate: {
      check: (v: boolean) => {
        if (!v) {
          return '설정으로 변경해주세요.';
        }

        return null;
      },
    },
  },
  multiSelector: {
    validate: {
      check: (v: string[]) => {
        if (!v.length) {
          return '언어를 선택해주세요.';
        } else if (v.length < 2) {
          return '두 가지 이상 선택해야 합니다.';
        }

        return null;
      },
    },
  },
  items: {
    validate: {
      check: (v: string[]) => {
        if (!v.length) {
          return 'test를 선택해주세요.';
        } else if (v.length < 2) {
          return '두 가지 이상 선택해야 합니다.';
        }

        return null;
      },
    },
  },
  date: {
    validate: {
      check: (v: string[]) => {
        console.log('date rules', v);
        if (!v[0]) {
          return '날짜를 선택해주세요.';
        }

        return null;
      },
    },
  },
  rangeDate: {
    validate: {
      check: (v: string[]) => {
        console.log('rangeDate rules', v);
        if (!v[0] || !v[1]) {
          return '기간을 설정 해주세요.';
        }

        return null;
      },
    },
  },
};

const FormChild = () => {
  const [userId, setUserId] = useState<string>('test');
  const [number, setNumber] = useState<number>(0);
  const [checked, setChecked] = useState<string[]>(['']);
  const [selectBox, setSelectBox] = useState<string[]>([]);
  const [multiBox, setMultiBox] = useState<string[]>([]);
  const [switchValue, setSwitchValue] = useState<string | boolean>(false);
  const [date, setDate] = useState<string[]>(['']);
  const [rangeDate, setRangeDate] = useState<string[]>(['', '']);

  const checkboxItems: CheckButtonItem[] = [
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

  const onTextChange = (v: string) => {
    setUserId(v);
  };

  const onNumberChange = (v: number) => {
    setNumber(v);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    console.log(event.code);
  };

  const onSelectChange = (event: string[]) => {
    console.log('onSelectChange', event);
    setSelectBox(event);
  };

  const onMultiChange = (event: string[]) => {
    console.log('onMultiChange', event);
    setMultiBox(event);
  };

  const onSwitchChange = (v: string | boolean) => {
    setSwitchValue(v);
  };

  const onDateChange = (v: string[]) => {
    console.log('onDateChange', v);
    setDate(v);
  };

  const onRangeDateChange = (v: string[]) => {
    console.log('onRangeDateChange', v);
    setRangeDate(v);
  };

  const messageBox = useMessageBox();

  const showAlert = () => {
    messageBox.open({
      message: 'test',
    });
  };

  const showConfirm = () => {
    messageBox.open({
      type: 'confirm',
      title: '확인 해주세요.',
      message:
        '어떤 선택을 하시겠습니까?<br>취소: 그냥 닫는다.<br>확인: 처리 한다.',
    });
  };

  const { toast } = useToastMessage();

  const showToast = () => {
    toast({ message: 'test - ', color: 'success' });
  };

  return (
    <>
      <div className="forms">
        <ValidateForm onSubmit={(data) => console.log(data)}>
          <ul>
            <li>
              <DatePicker
                name="date"
                rules={rules.date}
                value={date}
                onChange={onDateChange}
              />
            </li>
            <li>
              <DatePicker
                isRange
                name="rangeDate"
                placeholder={['시작일', '종료일']}
                rules={rules.rangeDate}
                value={rangeDate}
                onChange={onRangeDateChange}
              />
            </li>
            <li>
              <TextField
                clearable
                name="userId"
                value={userId}
                rules={rules.userId}
                placeholder="아이디 입력"
                onChange={onTextChange}
                onKeyDown={onKeyDown}
              />
            </li>
            <li>
              <NumberFormat
                name="number"
                placeholder="숫자 입력"
                value={number}
                rules={rules.number}
                onChange={onNumberChange}
              />
            </li>
            <li>
              <SelectBox
                searchable
                clearable
                name="selector"
                placeholder="선택하기"
                options={options}
                value={selectBox}
                onChange={onSelectChange}
                rules={rules.selector}
              />
            </li>
            <li>
              <SelectBox
                multiple
                clearable
                name="multiSelector"
                placeholder="클릭하여 선택하세요(2가지 이상)"
                options={options}
                value={multiBox}
                onChange={onMultiChange}
                rules={rules.multiSelector}
              />
            </li>
            <li>
              <CheckButton
                name="items"
                type={checkButtonType.checkbox}
                value={checked}
                items={checkboxItems}
                onChange={setChecked}
                rules={rules.items}
              />
            </li>
            <li>
              <SwitchButton
                name="switch"
                rules={rules.switch}
                onChange={onSwitchChange}
                value={switchValue}
              />
            </li>
            <li>
              <StyledButton type="submit">폼 검사 하기</StyledButton>
            </li>
          </ul>
        </ValidateForm>

        <ul>
          <li>
            <StyledButton onClick={showAlert}>alert</StyledButton>
          </li>
          <li>
            <StyledButton onClick={showConfirm}>confirm</StyledButton>
          </li>
          <li>
            <StyledButton onClick={showToast}>Toast</StyledButton>
          </li>
        </ul>
      </div>

      <MessageBox />
      <Toast />

      <div style={{ height: '1000px' }} />
    </>
  );
};

export const Forms = () => {
  return (
    <ToastContextProvider>
      <MessageBoxProvider>
        <FormChild />
      </MessageBoxProvider>
    </ToastContextProvider>
  );
};
