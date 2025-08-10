// src/redux/formBuilderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldConfig, FormSchema } from '../types/formTypes';

// Define this slice's state shape
interface FormBuilderState {
  form: FormSchema;
}

// Create an empty initial state
const initialState: FormBuilderState = {
  form: {
    id: '',
    name: '',
    createdAt: '',
    fields: [],
  },
};

// Create the slice
const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Replace the entire form in Redux
    setForm: (state: FormBuilderState, action: PayloadAction<FormSchema>) => {
      state.form = action.payload;
    },

    // Add a new field to the form
    addField: (state: FormBuilderState, action: PayloadAction<FieldConfig>) => {
      state.form.fields.push(action.payload);
    },

    // Remove a field by id
    removeField: (state: FormBuilderState, action: PayloadAction<string>) => {
      state.form.fields = state.form.fields.filter(
        (f) => f.id !== action.payload
      );
    },
  },
});

// Eport the actions to use in components
export const { setForm, addField, removeField } = formBuilderSlice.actions;

// Export the reducer to add to the store
export default formBuilderSlice.reducer;
