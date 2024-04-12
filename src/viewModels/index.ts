import { configureStore } from '@reduxjs/toolkit';

interface ActionType {
  type: string;
}

const rootReducer = (state: number = 0, action: ActionType) => {
  switch (action.type) {
    case '+':
      return state + 1;
    case '-':
      return state - 1;
    default:
      return state;
  }
};

const store = configureStore({
  reducer: rootReducer
});

export default store;