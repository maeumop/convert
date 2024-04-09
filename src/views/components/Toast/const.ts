import {
  mdiCheckCircleOutline,
  mdiChatAlert,
  mdiInformationVariantCircleOutline,
  mdiCloseOctagon,
} from '@/assets/svg/path';

export const toastColorCase = {
  success: 'success',
  warning: 'warning',
  info: 'info',
  danger: 'danger'
} as const;

export const toastIconCase = {
  success: mdiCheckCircleOutline,
  warning: mdiChatAlert,
  info: mdiInformationVariantCircleOutline,
  danger: mdiCloseOctagon
} as const;