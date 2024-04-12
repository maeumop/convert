import { createSlice } from '@reduxjs/toolkit';
import type { TextFieldState, TextFieldReducer } from './types';

const textFieldState: TextFieldState = {
  isValidate: false,
  checkPass: false,
  message: '',
  errorTransition: false,
}

const textFieldReducer: TextFieldReducer = {
  setIsValidate: (state, { payload }) => {
    state.isValidate = payload;
  },
  setCheckPass: (state, { payload }) => {
    state.checkPass = payload;
  },
  setMessage: (state, { payload }) => {
    state.message = payload;
  },
  setErrorTransition: (state, { payload }) => {
    state.errorTransition = payload;
  },
};


export const textFieldSlice = createSlice({
  name: 'TextField',
  initialState: textFieldState,
  reducers: textFieldReducer,
});


export const textFieldActions = textFieldSlice.actions;