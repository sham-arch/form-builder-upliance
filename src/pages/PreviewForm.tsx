// src/pages/PreviewForm.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { FormSchema, FieldConfig } from '../types/formTypes';

export default function PreviewForm() {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load form schema and initialize values on mount
  useEffect(() => {
    const saved = localStorage.getItem('forms');
    if (saved) {
      try {
        const parsed: FormSchema[] = JSON.parse(saved);
        const found = parsed.find(f => f.id === formId);
        if (found) {
          setForm(found);
          const defaults: Record<string, any> = {};
          found.fields.forEach(field => {
            defaults[field.id] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
          });
          setValues(defaults);
        }
      } catch {
        console.error('Failed to parse forms in localStorage');
      }
    }
  }, [formId]);

  // Safely evaluate derived fields based on their formula and parent values
  useEffect(() => {
    if (!form) return;

    const updatedValues = { ...values };
    let hasChange = false;

    form.fields.forEach(field => {
      if (field.derivedFrom && field.formula) {
        try {
          // Use a safe function to evaluate the formula with current values
          // We replace 'values' keyword in formula with our current values object
          // For security, do NOT use direct eval in production!
          const func = new Function('values', `return ${field.formula}`);
          const result = func(values);
          if (updatedValues[field.id] !== result) {
            updatedValues[field.id] = result ?? '';
            hasChange = true;
          }
        } catch (e) {
          console.error(`Error evaluating derived field "${field.label}":`, e);
        }
      }
    });

    if (hasChange) {
      setValues(updatedValues);
    }
  }, [values, form]);

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const validateField = (field: FieldConfig, value: any): string | null => {
    if (field.required && (value === '' || value === null || value === undefined)) {
      return 'This field is required';
    }
    if (!field.validation) return null;

    if (field.validation.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
      return `Minimum length is ${field.validation.minLength}`;
    }
    if (field.validation.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
      return `Maximum length is ${field.validation.maxLength}`;
    }
    if (field.validation.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) return 'Invalid email address';
    }
    if (field.validation.passwordRule) {
      const pwRegex = /^(?=.*[0-9]).{8,}$/;
      if (typeof value === 'string' && !pwRegex.test(value)) return 'Password must be at least 8 characters and contain a number';
    }
    return null;
  };

  const handleSubmit = () => {
    if (!form) return;

    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, values[field.id]);
      if (error) newErrors[field.id] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!\n\n' + JSON.stringify(values, null, 2));
    }
  };

  if (!form) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Form not found</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        {form.name}
      </Typography>
      <Stack spacing={2}>
        {form.fields.map(field => {
          const commonProps = {
            key: field.id,
            label: field.label,
            required: field.required,
            value: values[field.id] ?? '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
              // For checkbox, event.target.checked; else event.target.value
              if (field.type === 'checkbox') {
                handleChange(field.id, e.target.checked);
              } else {
                handleChange(field.id, e.target.value);
              }
            },
            error: !!errors[field.id],
            helperText: errors[field.id] || '',
          };

          switch (field.type) {
            case 'text':
              return <TextField {...commonProps} />;

            case 'number':
              return <TextField {...commonProps} type="number" />;

            case 'textarea':
              return <TextField {...commonProps} multiline minRows={4} />;

            case 'date':
              return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;

            case 'select':
              return (
                <FormControl fullWidth key={field.id} error={!!errors[field.id]}>
                  <FormLabel>{field.label}</FormLabel>
                  <Select
                    value={values[field.id] ?? ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                  >
                    {field.options?.map(opt => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[field.id] && (
                    <Typography variant="caption" color="error">
                      {errors[field.id]}
                    </Typography>
                  )}
                </FormControl>
              );

            case 'radio':
              return (
                <FormControl component="fieldset" key={field.id} error={!!errors[field.id]}>
                  <FormLabel component="legend">{field.label}</FormLabel>
                  <RadioGroup
                    value={values[field.id] ?? ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    row
                  >
                    {field.options?.map(opt => (
                      <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                    ))}
                  </RadioGroup>
                  {errors[field.id] && (
                    <Typography variant="caption" color="error">
                      {errors[field.id]}
                    </Typography>
                  )}
                </FormControl>
              );

            case 'checkbox':
              return (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox
                      checked={values[field.id] ?? false}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                    />
                  }
                  label={field.label}
                />
              );

            case 'derived':
              // Show derived fields as read-only text fields
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  value={values[field.id] ?? ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              );

            default:
              return null;
          }
        })}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
