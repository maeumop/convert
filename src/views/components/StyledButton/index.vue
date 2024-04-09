<script setup lang="ts">
import { reactive, h, computed } from 'vue';
import type { VNode } from 'vue';
import type { BtnColors } from './types';
import type { MdiSvgIcon } from '../types';
import { mdiGoogleCirclesExtended } from '@/assets/svg/path';

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>();

const props = withDefaults(defineProps<{
  color?: BtnColors
  class?: string
  href?: string
  target?: string
  text?: boolean
  icon?: MdiSvgIcon
  iconRight?: boolean
  onlyIcon?: boolean
  block?: boolean
  loading?: boolean
  disabled?: boolean
  xSmall?: boolean
  small?: boolean
  large?: boolean
  outline?: boolean
  tag?: string
  dropMenuToggle?: boolean
}>(), {
  href: '#',
  target: '_blank',
  text: false,
  right: false,
  block: false,
  onlyIcon: false,
  loading: false,
  disabled: false,
  iconRight: false,
  small: false,
  outline: false,
  tag: 'a',
  dropMenuToggle: false,
});

const buttonStyle = computed<any>(() => {
  return [
    'btn',
    props.text && 'text',
    !props.outline && props.color,
    props.onlyIcon && 'icon',
    !props.onlyIcon && props.icon ? (props.iconRight ? 'right' : 'left') : '',
    {
      large: props.large,
      small: props.small,
      xsmall: props.xSmall,
      outline: props.outline,
      block: !props.small && !props.xSmall && props.block,
    },
    props.class,
  ];
});

const hrefState = computed<string>(() => {
  if (!props.disabled) {
    return props.href ? props.href : '#';
  }

  return '';
});

const iconSize = computed<string>(() => {
  if (props.text) {
    return props.text ? '18' : '22';
  }

  if (props.large) {
    return '24';
  } else if (props.small) {
    return '18';
  } else if (props.xSmall) {
    return '16';
  }

  return '20';
});

const options = reactive<any>({
  class: buttonStyle.value,
  onClick: (event: MouseEvent): void => {
    if (props.href === '#') {
      event.preventDefault();

      if (!props.disabled && !props.loading) {
        emit('click', event);
      }
    }
  }
});

if (props.tag.toLowerCase() === 'a') {
  options.href = hrefState.value;
  options.target = props.target;
} else if (props.tag.toLowerCase() === 'button') {
  options.type = 'button';
}

const WrapperTag = computed<VNode>(() => h(props.text ? 'a' : props.tag, options));
</script>

<template>
  <WrapperTag :class="{ disabled: props.disabled || props.loading }" @click="onClick">
    <div class="btn-wrap">
      <template v-if="!props.onlyIcon">
        <template v-if="props.loading">
          <SvgIcon class="loading" type="mdi" :path="mdiGoogleCirclesExtended" />
        </template>
        <template v-else>
          <template v-if="props.icon">
            <SvgIcon
              type="mdi"
              :class="{ rotate: props.dropMenuToggle }"
              :size="iconSize"
              :path="props.icon"
              v-if="props.icon && !props.iconRight"
            />

            <slot></slot>

            <SvgIcon
              type="mdi"
              :class="{ rotate: props.dropMenuToggle }"
              :size="iconSize"
              :path="props.icon"
              v-if="props.icon && props.iconRight"
            />
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </template>
      </template>
      <template v-else>
        <div class="only-icon">
          <SvgIcon type="mdi" :size="iconSize" :path="props.icon" />
        </div>
      </template>
    </div>
  </WrapperTag>
</template>

<style lang="scss">
@import './style.scss';
</style>
<script lang="ts">
export default { name: 'StyledButton' };
</script>