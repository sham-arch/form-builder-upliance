import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { FieldType, FieldConfig } from '../types/formTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (field: FieldConfig) => void;
}

const fieldTypes: FieldType[] = [
  'text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'
];

export default function FieldEditor({ open, onClose, onSave }: Props) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);

  const handleSubmit = () => {
    const newField: FieldConfig = {
      id: Date.now().toString(),
      type,
      label,
      required,
      defaultValue: '',
    };
    onSave(newField);
    setLabel('');
    setType('text');
    setRequired(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Field</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          fullWidth
          margin="normal"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <TextField
          label="Field Type"
          select
          fullWidth
          margin="normal"
          value={type}
          onChange={(e) => setType(e.target.value as FieldType)}
        >
          {fieldTypes.map((ft) => (
            <MenuItem key={ft} value={ft}>
              {ft}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="Required"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
