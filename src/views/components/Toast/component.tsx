import { createRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useToastMessage } from './hooks';
import './style.scss';

export const Toast = () => {
  const { toastList } = useToastMessage();

  return (
    <div id="toast">
      <TransitionGroup>
        {toastList.map((item) => {
          const ref = createRef<HTMLDivElement>();

          return (
            <CSSTransition
              key={`toast-${item.key}`}
              nodeRef={ref}
              timeout={200}
              classNames="toast-view"
            >
              <div
                ref={ref}
                key={`toast-${item.key}`}
                className={[
                  'toast-body',
                  item.color ? `bg-${item.color}` : '',
                ].join(' ')}
                onClick={() => null}
              >
                <span className="message">
                  {item.message}
                  {item.key}
                </span>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};
