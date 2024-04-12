import { h, render, isVNode }  from 'vue';
import type { App, VNode } from 'vue';
import MessageBoxComponent from './component.vue';
import { messageBoxType } from './const';
import type { MessageBoxModel, MessageBoxType, MessageBoxOptions } from './types';

export default {
  install(app: App) {
    const body = document.querySelector('body') as HTMLBodyElement;
    const msgWrapper = document.createElement('div');
    msgWrapper.id = 'messageBox';

    body.appendChild(msgWrapper);

    let vNode: VNode | null = null;

    const destroy = (): void => {
      render(null, msgWrapper);
      vNode = null;
    };

    const setMessage = (opt: MessageBoxOptions | string, type: MessageBoxType): void => {
      const props: MessageBoxOptions = {
        message: '',
        title: (type === messageBoxType.alert) ? '알림' : '확인',
        type
      };

      if (opt instanceof Object) {
        if ('title' in opt) {
          props.title = opt.title;
        }

        if ('width' in opt) {
          if (!isNaN(Number(opt.width))) {
            props.width = Number(opt.width);
          }
        }

        if ('btnOkayText' in opt) {
          props.btnOkayText = opt.btnOkayText;
        }

        if ('btnCancelText' in opt) {
          props.btnCancelText = opt.btnCancelText;
        }

        if (opt.okay instanceof Function) {
          props.okay = opt.okay;
        }

        if (opt.asyncOkay instanceof Function) {
          props.asyncOkay = opt.asyncOkay;
        }

        if (opt.cancel instanceof Function) {
          props.cancel = opt.cancel;
        }

        if (opt.escCancel === false) {
          props.escCancel = false;
        }

        if (opt.enterOkay === false) {
          props.enterOkay = false;
        }

        props.destroy = destroy;

        props.message = opt.message;
      } else {
        props.message = opt;
      }

      props.destroy = destroy;

      if (!isVNode(vNode)) {
        const wrapper = document.querySelector('#messageBox') as HTMLDivElement;

        vNode = h(MessageBoxComponent, props);
        render(vNode, wrapper);
      }
    };

    const alert = (params: MessageBoxOptions | string): void => {
      setMessage(params, messageBoxType.alert);
    };

    const confirm = (params: MessageBoxOptions | string): void => {
      setMessage(params, messageBoxType.confirm);
    };

    const messageBox: MessageBoxModel = {
      alert,
      confirm,
      destroy
    };

    app.config.globalProperties.$messageBox = messageBox;
    app.provide('MessageBox', messageBox);
  }
};