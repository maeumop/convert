import { configureStore, createSlice } from '@reduxjs/toolkit';

export const textFieldSlice = createSlice({
  name: 'TextField',
  initialState: {
    isValidate: false,
    checkPass: false,
    message: '',
    errorTransition: false,
  },
  reducers: {
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
  }
});


export const store = configureStore({
  reducer: textFieldSlice.reducer,
});

export const { setIsValidate, setCheckPass, setMessage, setErrorTransition } = textFieldSlice.actions;