import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setForm } from '../redux/formBuilderSlice';
import { addForm } from '../redux/formsListSlice';
import { FormSchema } from '../types/formTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void; // parent passes this
}

export default function SaveFormDialog({ open, onClose, onSaveSuccess }: Props) {
  const [name, setName] = useState('');
  const form = useAppSelector((state) => state.formBuilder.form);
  const dispatch = useAppDispatch();

  const handleSave = () => {
    const newForm: FormSchema = {
      ...form,
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedForms = JSON.parse(localStorage.getItem('forms') || '[]');
    savedForms.push(newForm);
    localStorage.setItem('forms', JSON.stringify(savedForms));

    // Update redux
    dispatch(setForm(newForm));
    dispatch(addForm(newForm));

    setName('');
    onClose();
    onSaveSuccess(); // ✅ call parent callback to show Snackbar
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField
          label="Form Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
