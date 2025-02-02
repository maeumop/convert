# Form validation Components

validateForm Component와 호환 가능한 폼을 통해 간편히 유효성 검사를 실행하기 위해 만들어진 컴포넌트 모음입니다.<br>
CSS 변경시에는 컴포넌트 내부 CSS를 복사, 제거 후 형식에 맞춰서 작성하세요.

1. [CheckButton](#1-checkbutton)
2. [TextField](#2-textfield)
3. [NumberFormat](#3-numberformat)
4. [SelectBox](#4-selectbox)
5. [SwitchButton](#5-switchbutton)
6. [DatePicker](#6-datepicker)
7. [ValidateWrap](#7-validatewrap)
8. [ValidateForm](#8-validateform)
9. [공통 Types](#공통-types)

- [컴포넌트 Index로 돌아가기](../)

---

## 1. CheckButton

- <code>\<input type="checkbox" /></code>, <code>\<input type="radio" /></code> 버튼을 생성합니다.

### 1.1. 사용방법

- <code>all</code> 옵션을 설정해 주면 빈 값의 '전체' 버튼을 자동 생성해줍니다.
- checkbox, radio 버튼의 특성상 name 값을 필히 설정해줘야 합니다.
- checkbox model의 경우 <code>all</code> 설정이 되어 있으면 data 변수의 기본값을 <code>['']</code>로 해줘야 정상적으로 '전체'에 체크 됩니다.
- <code>button</code> 옵션을 설정해주면 버튼 디자인으로 항목이 나열 됩니다.

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

let checkbox1 = ref<any[]>([])
let checkbox2 = ref<string[]>([''])
let radio = ref<string>('')

const opt = reactive<OptionItem[]>({
  checkbox: [],
})

const rules: Rules = {
  checkbox: [v => !(v.length == 0) || '항목을 하나 이상 선택해주세요.'],
}

for (let value: number = 1; value <= 10; value++) {
  opt.checkbox.push({ text: `체크버튼${value}`, value })
}
</script>

<template>
  <p>
    <h5>버튼 형식 checkbox</h5>
    <CheckButton
      button
      name="check1"
      :max-check="3"
      :validate="rules.checkbox"
      :items="opt.checkbox"
      v-model="checkbox1"
    />
  </p>
  <p>
    <h5>일반 checkbox</h5>
    <CheckButton
      all
      name="check2"
      :items="opt.checkbox"
      v-model="checkbox2"
    />
  </p>
  <p>
    <h5>radio</h5>
    <CheckButton
      type="radio"
      name="check3"
      :validate="rules.radio"
      :items="opt.checkbox"
      v-model="radio"
    />
  </p>
</template>
```

### 1.2. Props

| Name          | Type                                                  | Default               | Description                                                    |
| ------------- | ----------------------------------------------------- | --------------------- | -------------------------------------------------------------- |
| modelValue?   | string, string[]                                      | <code>none</code>     | v-model                                                        |
| clickIndex?   | number                                                | <code>-1</code>       | v-model:clickIndex - 클릭된 button의 index                     |
| type?         | [CheckButtonType](#131-CheckButtonType)               | <code>checkbox</code> | checkbox 또는 radio 선택                                       |
| name          | string                                                | <code>''</code>       | input name 애드립뷰트 값을 설정                                |
| items         | [CheckButtonItem[]](#132-CheckButtonItem)             | <code>[]</code>       | 항목을 만들 배열 데이터                                        |
| all?          | boolean                                               | <code>false</code>    | '전체' 항목을 추가 해주는 옵션                                 |
| maxLength?    | number                                                | <code>0</code>        | 0이상의 값 부여시, 체크된 항목의 수량이 maxCheck 만큼으로 재한 |
| validate?     | Function[]                                            | <code>[]</code>       | 폼 유효성 검사에 필요한 callback 함수를 배열에 나열여 입력     |
| errorMessage? | string                                                | <code>''</code>       | 강제로 에러 메시지를 출력, 유효성 검사에서 통과 하지 못 함     |
| button?       | boolean                                               | <code>false</code>    | checkbox, radio 폼이 버튼 형식으로 디자인 변경                 |
| color?        | [CheckButtonColors](#133-checkbuttoncolors-with-enum) | <code>primary</code>  | checkbox, radio 색상                                           |
| disabled?     | boolean                                               | <code>false</code>    | 사용 불가 처리                                                 |
| label?        | string                                                | <code>''</code>       | 상단 라벨 표시                                                 |
| required?     | boolean                                               | <code>''</code>       | 필수 입력 표시                                                 |

### 1.3. Types

#### 1.3.1. CheckButtonType

```typescript
export const checkButtonType = {
  checkbox: 'checkbox',
  radio: 'radio',
} as const;

export type CheckButtonType = (typeof checkButtonType)[keyof typeof checkButtonType];
```

#### 1.3.2. CheckButtonItem

```typescript
export interface CheckButtonItem {
  text: string;
  value: string;
}
```

#### 1.3.3. CheckButtonColors with Enum

```typescript
export const checkButtonColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const;

export type CheckButtonColors = (typeof checkButtonColors)[keyof typeof checkButtonColors];
```

#### 1.3.4 CheckButtonModel

```typescript
export interface CheckButtonModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
```

:arrow_up: [목차](#form-validation-components)

---

## 2. TextField

- <code>\<input type="text" /></code>, <code>\<textarea>\</textarea></code> 입력 필드를 생성 합니다.

### 2.1. 사용방법

```vue
<script setup lang="ts">
import { ref } from 'vue'

let text = ref<string>('')
let area = ref<string>('')

const rule: RuleFunc[] = [v => !!v || '필수 입력 항목입니다.']
</script>

<template>
  <p>
    <h5>input field</h5>
    <TextField
      block
      placeholder="이곳에 입력해주세요"
      :validate="rule"
      v-model="text"
    />
  </p>
  <p>
    <h5>textarea</h5>
    <TextField
      block
      multiline
      placeholder="이곳에 입력해주세요"
      :rows="10"
      :validate="rule"
      v-model="area"
    />
  </p>
</template>
```

### 2.2. Props

| Name          | Type                                | Default                | Description                                                                                                                        |
| ------------- | ----------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| modelValue?   | string                              | <code>''</code>        | v-model                                                                                                                            |
| type          | [TextFieldType](#231-TextFieldType) | <code>text</code>      | text or password                                                                                                                   |
| multiline?    | boolean                             | <code>false</code>     | textarea 폼으로 변경                                                                                                               |
| block?        | boolean                             | <code>false</code>     | display: block 설정                                                                                                                |
| rows?         | number                              | <code>5</code>         | multiline 설정시 textarea 높이를 설정                                                                                              |
| width?        | string, number                      | <code>none</code>      | 넓이 설정 (block 보다 우선), 숫자 형태로 입력 할 경우 px단위로 적용                                                                |
| height?       | string, number                      | <code>none</code>      | multiline 설정시 textarea 높이를 설정 (rows 보다 우선)                                                                             |
| validate?     | [RuleFunc[]](#2-rulefunc)           | <code>[]</code>        | 폼 유효성 검사에 필요한 callback 함수를 배열에 나열 입력<br> pattern 옵션이 설정 되어 있는 경우 pattern 검수가 먼저 이루어 집니다. |
| blurValidate? | boolean                             | <code>false</code>     | 폼의 커서가 없어 질때 유효성 검사를 할 것인지 여부                                                                                 |
| maxLength?    | number                              | <code>0</code>         | 최대 입력 가능한 문자 수                                                                                                           |
| errorMessage? | string                              | <code>''</code>        | 강제로 오류 메시지를 표시                                                                                                          |
| disabled?     | boolean                             | <code>false</code>     | 폼 사용불가 처리                                                                                                                   |
| readonly?     | boolean                             | <code>false</code>     | 폼 입력 불가 처리                                                                                                                  |
| autofocus?    | boolean                             | <code>false</code>     | 화면 로드시 커서가 자동으로 들오 오도록 할 것인지                                                                                  |
| isCounting?   | number, string                      | <code>''</code>        | 입력된 텍스트의 카운팅 표시                                                                                                        |
| required?     | boolean                             | <code>false</code>     | 아스트로피(\*) 표시 (필수 여부 표시) validate 여부와 상관없이 표시 가능                                                            |
| disabled?     | boolean                             | <code>false</code>     | 사용 불가 처리                                                                                                                     |
| hideMessage?  | boolean                             | <code>false</code>     | 하단에 표시되는 메시지를 표시 안함                                                                                                 |
| icon?         | string                              | <code>none</code>      | 오른쪽에 아이콘 표시 Google Material Icon, multiline 적용 안됨                                                                     |
| iconLeft?     | boolean                             | <code>false</code>     | 아이콘의 위치를 왼쪽으로 변경, multiline 적용 안됨                                                                                 |
| iconAction?   | Function                            | <code>undefined</code> | 아이콘 클릭시 실행할 콜백 함수                                                                                                     |
| pattern?      | [RegExp, string?]                   | <code>[]</code>        | 패턴을 지정하여 유효성 검사를 진행 [정규식, 오류시 메시지] 형태로 전달, 메시지 미 입력시 기본 메시지 표시                          |
| clearable?    | boolean                             | <code>false</code>     | modelValue 값을 제거 (modelValue = '') readonly, disabled에서 작동 안함                                                            |

### 2.3. Types

#### 2.3.1. TextFieldType

```typescript
export const textFieldType = {
  TXT: 'text',
  PWD: 'password',
} as const;

export type TextFieldType = (typeof textFieldType)[keyof typeof textFieldType];
```

:arrow_up: [목차](#form-validation-components)

---

## 3. NumberFormat

- <code>\<input type="text" /></code> 폼에 숫자만 입력 가능한 필드를 생성합니다.
- 자동으로 1,000 단위로 콤마를 생성 해줍니다.
- model 변수에는 숫자(<code>number</code>)형으로 입력됩니다.(콤마가 모두 제거된 상태의 Number Casting)
- 필드 값이 없을 경우 자동으로 0을 표시 합니다.
- 소숫점 입력은 불가능합니다.

### 3.1. 사용방법

```vue
<script setup lang="ts">
import { ref } from 'vue'

let number = ref<number>(0)
const rule: RuleFunc[] = [v => !!v || '필수 입력 항목입니다.']
</script>

<template>
  <p>
    <h5>input field number</h5>
    <NumberFormat
      :validate="rule"
      v-model="number"
    />
  </p>
</template>
```

### 3.2. Props

| Name          | Type                      | Default            | Description                                                             |
| ------------- | ------------------------- | ------------------ | ----------------------------------------------------------------------- |
| modelValue?   | number                    | <code>0</code>     | v-model                                                                 |
| label?        | string                    | <code>''</code>    | 라벨 표시                                                               |
| placeholder?  | string                    | <code>''</code>    | placeholder 표시                                                        |
| validate?     | [RuleFunc[]](#2-rulefunc) | <code>[]</code>    | 폼 유효성 검사에 필요한 callback 함수를 배열에 나열 입력                |
| errorMessage? | string                    | <code>''</code>    | 강제로 오류 메시지를 표시                                               |
| block?        | boolean                   | <code>false</code> | display: block 설정                                                     |
| width?        | string, number            | <code>none</code>  | 넓이 설정 (block 보다 우선)                                             |
| autofocus?    | boolean                   | <code>false</code> | 화면 로드시 커서가 자동으로 들오 오도록 할 것인지                       |
| maxLength?    | string, number            | <code>none</code>  | 최대 입력 가능한 문자 수                                                |
| readonly?     | boolean                   | <code>false</code> | 폼 입력 불가 처리                                                       |
| disabled?     | boolean                   | <code>false</code> | 폼 사용불가 처리                                                        |
| required?     | boolean                   | <code>false</code> | 아스트로피(\*) 표시 (필수 여부 표시) validate 여부와 상관없이 표시 가능 |
| hideMessage?  | boolean                   | <code>false</code> | 하단 메시지 표시 안함                                                   |
| blurValidate? | boolean                   | <code>true</code>  | 옵션 창이 닫힐때 validate check 여부                                    |

:arrow_up: [목차](#form-validation-components)

### 3.3. types

#### 3.3.1 NumberFormatModel

```typescript
export interface NumberFormatModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
```

---

## 4. SelectBox

- <code>select</code>와 유사한 기능을 구현하는 폼을 생성한다.

### 4.1. 사용방법

```vue
<script setup lang="ts">
import { ref  } from 'vue'

let select = ref<string>('')

const opt = ref<SelectBoxItem[]>([])

const rule: RuleFunc[] = [v => !!v || '필수 선택 항목입니다.']

for (let value = 1; value <= 10; value++) {
  opt.push({ text: `선택 - ${value}`, value })
}
</script>

<template>
  <p>
    <h5>select box</h5>
    <SelectBox
      placeholder="한 가지 항목을 선택해주세요"
      :validate="rule"
      :options="opt"
      v-model="select"
    />
  </p>
</template>
```

### 4.2. Props

| Name          | Type                                  | Default               | Description                                                             |
| ------------- | ------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| modelValue    | [SelectBoxModel](#431-selectboxmodel) | <code>'' \| []</code> | v-model                                                                 |
| options       | [SelectBoxItem[]](#432-selectboxitem) | <code>[]</code>       | 선택 가능한 옵션 목록                                                   |
| label?        | string                                | <code>''</code>       | label 문자 표시                                                         |
| placeholder?  | string                                | <code>''</code>       | 폼의 placeholder 표시                                                   |
| block?        | boolean                               | <code>false</code>    | display: block 표시                                                     |
| validate?     | [RuleFunc[]](#2-rulefunc)             | <code>[]</code>       | 폼 유효성 검사에 필요한 callback 함수를 배열에 나열 입력                |
| errorMessage? | string                                | <code>''</code>       | 강제로 오류 메시지를 표시                                               |
| width?        | string, number                        | <code>none</code>     | 넓이 설정 (block 보다 우선)                                             |
| multiple?     | boolean                               | <code>none</code>     | 여러 옵션을 선택할 수 있고, 선택된 옵션이 표기됨                        |
| required?     | boolean                               | <code>false</code>    | 아스트로피(\*) 표시 (필수 여부 표시) validate 여부와 상관없이 표시 가능 |
| readonly?     | boolean                               | <code>false</code>    | 수정 불가 여부                                                          |
| disabled?     | boolean                               | <code>false</code>    | 사용 불가 여부 modelValue 값이 없어짐                                   |
| isShort?      | boolean                               | <code>false</code>    | multiple = true 선택된 옵션을 대표 1가지를 표시하고 나머지는 +n 처리    |
| btnAccept?    | boolean                               | <code>false</code>    | multiple 옵션 적용시 -> 버튼을 클릭해야 적용되도록 처리                 |
| maxLength?    | number                                | <code>0</code>        | multiple 옵션 적용시 -> 최대 선택 가능한 option 수량                    |
| searchable?   | boolean                               | <code>false</code>    | 옵션 검색 툴 표시                                                       |
| hideMessage?  | boolean                               | <code>false</code>    | 하단 메시지 표시 안함                                                   |
| clearable?    | boolean                               | <code>false</code>    | modelValue 값을 제거 (modelValue = '') readonly, disabled에서 작동 안함 |
| isLoading?    | boolean                               | <code>false</code>    | 해당 설정이 활성화 되면, 옵션 목록 마지막에 회전하는 아이콘이 표시      |

### 4.3. Types

#### 4.3.1. SelectBoxItem

```typescript
export interface SelectBoxItem {
  text: string;
  value: string;
}
```

#### 4.3.2. SelectBoxModel

```typescript
export interface SelectBoxModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
```

:arrow_up: [목차](#form-validation-components)

---

## 5. SwitchButton

- 스위치 형태의 버튼을 생성합니다.
- true(ON), false(OFF) 또는 이에 대칭하는 2개의 값을 설정 가능합니다.

### 5.1. 사용방법

```vue
<script setup lang="ts">
import { ref } from 'vue'

let bool = ref<boolean>(false)
let boolValue = ref<string>('T')
let label = ref<string[]>(['동의 안함', '동의'])
</script>

<template>
  <p>
    <h5>switch button</h5>
    <SwitchButton validate="설정으로 바꿔주세요." v-model="bool" />
  </p>
  <p>
    <h5>small size switch button</h5>
    <SwitchButton
      small
      validate
      true-value="T"
      false-value="F"
      color="success"
      :label="label"
      v-model="boolValue"
    />
  </p>
</template>
```

### 5.2. Props

| Name        | Type                                                    | Default              | Description                                                                                                                                                                       |
| ----------- | ------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue? | string                                                  | <code>''</code>      | v-model                                                                                                                                                                           |
| small?      | boolean                                                 | <code>false</code>   | 버튼의 크기를 작게 생성합니다                                                                                                                                                     |
| label?      | string[]                                                | <code>[]</code>      | 스위치에 사용자가 설정한 라벨을 표시 합니다, [false label, true label]                                                                                                            |
| validate?   | boolean, string                                         | <code>none</code>    | 유효성 검사 여부를 판단합니다.<br>문자열을 입력할 경우 해당 문자열을 오류 메시지로 보여줍니다.<br>문자열을 설정하지 않을 경우 ON 상태의 라벨을 기준으로 오류메시지를 표시 합니다. |
| trueValue?  | string                                                  | <code>''</code>      | 버튼을 ON 상태의 값을 지정합니다.                                                                                                                                                 |
| falseValue? | string                                                  | <code>''</code>      | 버튼을 OFF 상태의 값을 지정합니다.                                                                                                                                                |
| readonly?   | boolean                                                 | <code>false</code>   | 버튼 수정 불가 옵션                                                                                                                                                               |
| checkbox?   | boolean                                                 | <code>false</code>   | 스위치 버튼을 checkbox 형태로 변경한다                                                                                                                                            |
| color?      | [SwitchButtonColors](#631-swtichbuttoncolors-with-enum) | <code>primary</code> | 스위치 버튼을 색상                                                                                                                                                                |

### 6.3 Events

#### 6.3.1 update:after

- update:model-value 이벤트가 완료된 후(모델에 적용된 변수값 변이 이후) 발생 되는 이벤트

### 6.4. Types

#### 6.4.1. SwtichButtonColors with Enum

```typescript
export const switchButtonColors = {
  primary: 'primary',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  dark: 'dark',
} as const;

export type SwitchButtonColors = (typeof switchButtonColors)[keyof typeof switchButtonColors];
```

#### 6.4.2. SwitchButtonModel

```typescript
export interface SwitchButtonModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
```

:arrow_up: [목차](#form-validation-components)

---

## 6. DatePicker

- 날짜 선택 가능한 입력 필드를 생성합니다.

### 6.1. 사용방법

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

let date = ref<string>('')
let dateRange = ref<string[]>(['', ''])

const rules: Rules = {
  date: [v => !!v || '날짜를 선택해주세요.']
  dateRnage: [v => !!v || '기간을 선택해주세.']
}
</script>

<template>
  <p>
    <h5>date picker</h5>
    <DatePicker :validate="rules.date" v-model="date" />
  </p>
  <p>
    <h5>range date picker</h5>
    <DatePicker range :validate="rules.dateRange" v-model="dateRange" />
  </p>
</template>
```

### 6.2. Props

| Name          | Type                      | Default                     | Description                                                                      |
| ------------- | ------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| modelValue?   | string, string[]          | <code>none</code>           | v-model, option range 설정시 ['', ''] 설정 필요                                  |
| validate?     | [RuleFunc[]](#2-rulefunc) | <code>[]</code>             | 폼 유효성 검사에 필요한 callback 함수를 배열에 나열 입력                         |
| label?        | string, string[]          | <code>none</code>           | 라벨 표시                                                                        |
| placeholder?  | string, string[]          | <code>none</code>           | 입력 필드에 placeholder 표시<br>option range 설정시 [시작일, 종료일] 형태로 입력 |
| range?        | boolean                   | <code>false</code>          | 시작일과 종료일을 선택할 수 있도록 설정                                          |
| separator?    | string                    | <code>-</code>              | 년, 월, 일 사이 구분 문자 설정                                                   |
| minYear?      | number                    | <code>1900</code>           | 선택 가능한 최소 년도 설정                                                       |
| maxYear?      | number                    | <code>now Year + 100</code> | 선택 가능한 최대 년도 설정                                                       |
| block?        | boolean                   | <code>false</code>          | display: block 표시                                                              |
| required?     | boolean                   | <code>false</code>          | 아스트로피(\*) 표시 (필수 여부 표시) validate 여부와 상관없이 표시 가능          |
| hideMessage?  | boolean                   | <code>false</code>          | 하단 메시지 표시 안함                                                            |
| maxRange?     | number                    | <code>0</code>              | 최대 선택 가능한 날짜 기간 range 적용시에만                                      |
| readonly?     | boolean                   | <code>false</code>          | 데이터 수정 불가 처리                                                            |
| disabled?     | boolean                   | <code>false</code>          | 기능 정지                                                                        |
| blurValidate? | boolean                   | <code>true</code>           | 날짜 선택 창이 닫힐때 validaton 실행여부                                         |
| defaultDate?  | boolean                   | <code>false</code>          | 취소 버튼 클릭시 기존 값으로 반영 여부                                           |

### 6.3. types

#### 6.3.1. DatePickerModel

```typescript
export interface DatePickerModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
```

:arrow_up: [목차](#form-validation-components)

---

## 7. ValidateForm

- ValidateForm 하위 호환 가능한 개체에 대해 유효성 검사 가능한 컴포넌트
- ValidateForm 컴포넌트에 필히 <code>ref</code> 설정을 하고 <code>RefName.value?.validate()</code> 수행하여 유효성 검사를 진행합니다.

### 7.1. 사용방법

> ValidateForm 예제를 확인 하세요. [예제 보기](https://github.com/dream-insight/ts-vue3/blob/main/src/views/forms.vue)

### 7.2. Component API Method

#### <code>{RefName}.value?.validate(silence: boolean = false): boolean</code>

- 유효성 검사를 실행 합니다.
- <code>silence = true</code>일때 유효성 검사는 실행하지만 validation 오류 표시는 하지 않습니다.(message, color 변화 없음)

### 7.3. types

#### 7.3.1. ValidateFormModel

```typescript
export interface ValidateFormModel {
  formProtection(protect?: boolean): void;
  resetForm(): void;
  validate(silence?: boolean): boolean;
  resetValidate(): void;
}
```

:arrow_up: [목차](#form-validation-components)

---

# 공통 Types

## 1. KeyIndex

```typescript
export interface KeyIndex<T> {
  [index: string]: T;
}
```

## 2. OptionItem

```typescript
export interface OptionItem {
  text: string;
  value: string;
}
```

## .. OptionItemGroup

```typescript
export interface OptionItemGroup {
  [index: string]: OptionItem[];
}
```

:arrow_up: [목차](#form-validation-components)

---

# 기타 사항

- 해당 컴포넌트를 사용하기 위해서는 Material Design Icons이 필요합니다. [링크](https://pictogrammers.com/library/mdi/)

## 1.1. MDI 설치

```
npm install @/assets/svg/path @jamescoyle/vue-icon
```

## 1.2. MDI를 전역 설정

```typescript
import SvgIcon from '@jamescoyle/vue-icon';
```

## 1.3. Icon SVG는 필요 할때 마다 import

```vue
<script setup lang="ts">
import { mdiAccount } from '@/assets/svg/path';
</script>

<template>
  <SvgIcon size="15" type="mdi" :path="mdiACcount" />
</template>
```

:arrow_up: [목차](#form-validation-components)

---

### UPDATE HISTORY

- Vue 3 Components with Typescript : 2023.02.20 김종윤 수석매니저
- Type Section 추가 및 Option List Table 변경 : 2023.03.09 김종윤 수석매니저
- CheckButton
  - checkbox 디자인 변경 (icon)
  - hideMessage Props 추가
- DatePicker
  - 오류 수정
  - 아이콘 변경 (GMI)
  - hideMessage props 추가
  - required props 추가
- NumberFormat
  - hideMessage props 추가
- SelectBox
  - option 디자인 추가
  - option 검색 기능 추가
  - 다중 선택 checkbox icon 추가
  - 다중 선택 시 선택된 내용 텍스트 또는 라벨 형태로 보기 추가
  - 다중 선택 시 적용 버튼, 전체 선택 기능 추가
  - required props 추가
  - hideMessage props 추가
  - disabled props 추가
- TextField
  - required props 추가
  - hideMessage props 추가
  - text counting 기능 추가
  - disabled props 추가
- SwitchButton
  - checkbox props 추가
    <br>: 2023.04.24 김종윤 수석매니저
- DatePicker
  - maxRange 옵션 추가
  - range 옵션 설정시 시작, 종료일 이전, 이후 선택 불가 기능 추가
    <br>: 2023.05.04 김종윤 수석매니저
- TextField icon, iconLeft props 추가: 2023.05.09 김종윤 수석매니저
- CheckButton, SwitchButton color props 추가: 2023.05.11 김종윤 수석매니저
- Form Component update
  - TextField pattern props 변경
  - 모든 form component Ref method type 추가
    : 2023.05.18 김종윤 수석매니저
- SelectBox, DatePicker layer popup 닫힐때 validation 실행 기능 추가: 2023.05.19
- Form Components 수정
  - ValidateForm validate 메서드 silence 인자 추가 (체크시에 오류 메시지 and ui 표시 안함)
  - validate 가능한 폼 컴포넌트에 silence 옵션 추가
  - SelectBox, DatePicker 선택 창이 닫힐때 blur emit 발생 하도록 수정
  - SelectBox modelValue 적용시 validate 통과 하지 못하는 오류 수정
    : 2023.05.22 김종윤 수석매니저
- TextField iconAction props 추가: 2023.05.23 김종윤 수석 매니저
- 전체 아이콘 수정 (MDI SvgIcon) 및 README.md 기타 사항 추가: 2023.05.24 김종윤 수석매니저
- DatePicker 컴포넌트 업데이트
  - 데이터 구조 변경 (지역 스토어 생성)
  - 달력 표시 컴포넌트 분리
  - 사용되지 않는 type 제거
  - 독립 가능한 함수 helper 함수로 분리
    <br>: 2023.06.07 김종윤 수석매니저
- ValidateForm 폼 보호 기능 추가
- TextField, SelectBox, NumberFormat value clear 기능 추가
  <br>: 2023.06.30 김종윤 수석매니저
- SwitchButton @update:after event 추가: 2023.06.19 김종윤 수석매니저
- 각 Component Model 추가: 2023.09.14 김종윤 수석매니저
