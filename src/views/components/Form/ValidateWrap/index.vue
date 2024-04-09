<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { RuleFunc } from '../../types';

export interface ValidateWrapProps {
  checkValue: any
  validate?: RuleFunc[]
  errorMessage?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ValidateWrapProps>(), {
  validate: (): RuleFunc[] => [],
  errorMessage: '',
});

const emit = defineEmits<{
  (event: 'update:checkValue'): void
}>();

watch(() => [props.checkValue, props.validate, props.disabled], (a, b) => {
  if (a[0] !== b[0]) {
    emit('update:checkValue');
  }

  resetForm();
});

watch(() => props.errorMessage, (v) => {
  message.value = v;
});

let isValidate = ref<boolean>(true);
let checkPass = ref<boolean>(false);
let message = ref<string>('');
let errorTransition = ref<boolean>(false);

const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length) {
      for (let i = 0; i < props.validate.length; i++) {
        let result = props.validate[i](props.checkValue);


        if (typeof result === 'string') {
          if (!silence) {
            errorTransition.value = true;
            message.value = result;
            isValidate.value = false;
            checkPass.value = false;
          }

          return false;
        } else {
          message.value = '';
        }
      }
    }

    isValidate.value = true;
    checkPass.value = true;

    return true;
  }

  return false;
};

const resetForm = (): void => {
  isValidate.value = true;
  checkPass.value = false;
  message.value = '';
};

const resetValidate = (): void => {
  resetForm();
};

const childBlur = (): void => {
  check();
};

const feedback = ref<HTMLDivElement>();

onMounted(() => {
  feedback.value!.addEventListener('animationend', () => {
    errorTransition.value = false;
  });
});

defineExpose({
  check,
  resetForm,
  resetValidate
});
</script>

<template>
  <div class="validate-wrap">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
      <div class="add-option">
        <slot name="add-on"></slot>
      </div>
    </div>

    <div :class="['input-wrap', { error: message }]">
      <slot :on-blur="childBlur"></slot>
    </div>

    <div
      ref="feedback"
      :class="['feedback', { error: errorTransition }]"
      v-show="message"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './style.scss';
</style>
<script lang="ts">
export default { name: 'ValidateWrap' };
</script>