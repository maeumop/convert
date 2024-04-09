import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import Icon from '@mdi/react';
import type { StyledButtonProps } from './types';
import { mdiGoogleCirclesExtended } from '@mdi/js';
import './style.scss';

export const StyledButton = (props: StyledButtonProps)=> {
  const buttonClass = useMemo<string>(() => {
    return [
      'btn',
      props.text && 'text',
      !props.outline && props.color,
      props.onlyIcon && 'icon',
      !props.onlyIcon && props.icon ? (props.iconRight ? 'right' : 'left') : '',
      props.large && 'large',
      props.small && 'small',
      props.xSmall && 'xsmall',
      props.outline && 'outline',
      (!props.small && !props.xSmall && props.block) && 'block',
      props.class,
      (props.disabled || props.loading) && 'disabled'
    ].join(' ');
  }, [
    props.text,
    props.outline,
    props.onlyIcon,
    props.icon,
    props.large,
    props.small,
    props.xSmall,
    props.class,
    props.block,
    props.loading,
    props.disabled,
  ]);

  const iconSize = useMemo<string>(() => {
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
  }, [props.text, props.large, props.small, props.xSmall]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    if (props.onClick !== null) {
      props.onClick(event);
    }
  }

  return (
    <a
      href={props.href}
      className={ buttonClass }
      onClick={ onClick }
    >
      <div className="btn-wrap">
        {!props.onlyIcon ? (
          <>
            {props.loading ? (
              <Icon className="loading" path={ mdiGoogleCirclesExtended } />
            ) : (
                <>
                  {props.icon ? (
                    <>
                      {props.icon && !props.iconRight && (
                        <Icon
                          className={[props.dropMenuToggle && 'rotate'].join('')}
                          size={ iconSize }
                          path={ props.icon }
                        />
                      )}

                      <slot></slot>

                      {props.icon && props.iconRight && (
                        <Icon
                          className={[props.dropMenuToggle && 'rotate'].join('')}
                          size={ iconSize }
                          path={ props.icon }
                        />
                      )}
                    </>
                  ) : (
                    props.children
                  )}
                </>
              )}
          </>
        ) : (
          <div className="only-icon">
            <Icon size={ iconSize } path={ props.icon } />
          </div>
        )}
      </div>
    </a>
  );
}

StyledButton.defaultProps = {
  color: 'primary',
  class: null,
  href: '#',
  target: null,
  text: false,
  icon: null,
  iconRight: false,
  onlyIcon: false,
  block: true,
  loading: false,
  disabled: false,
  xSmall: false,
  small: false,
  large: false,
  outline: false,
  dropMenuToggle: false,
  label: '',
}
