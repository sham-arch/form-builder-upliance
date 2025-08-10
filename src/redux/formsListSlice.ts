import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema } from '../types/formTypes';

interface FormsListState {
  forms: FormSchema[];
}

const initialState: FormsListState = {
  forms: [],
};

const formsListSlice = createSlice({
  name: 'formsList',
  initialState,
  reducers: {
    setForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.forms = action.payload;
    },
    addForm: (state, action: PayloadAction<FormSchema>) => {
      state.forms.push(action.payload);
    },
    // Other reducers as needed
  },
});

export const { setForms, addForm } = formsListSlice.actions;
export default formsListSlice.reducer;
