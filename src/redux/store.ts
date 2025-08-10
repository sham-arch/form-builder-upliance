import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './formBuilderSlice';
import formsListReducer from './formsListSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    formsList: formsListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
