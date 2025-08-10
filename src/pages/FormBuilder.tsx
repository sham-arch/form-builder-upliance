import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addField, removeField } from '../redux/formBuilderSlice';
import {
  Button,
  Typography,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import FieldEditor from '../components/FieldEditor';
import SaveFormDialog from '../components/SaveFormDialog';

export default function FormBuilder() {
  const dispatch = useAppDispatch();
  const fields = useAppSelector((state) => state.formBuilder.form.fields);
  const navigate = useNavigate();
  const [openFieldEditor, setOpenFieldEditor] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleAddField = (fieldData: any) => {
    dispatch(addField(fieldData));
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    navigate('/myforms');
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Create New Form
      </Typography>

      <Stack spacing={2} mb={2}>
        {fields.length === 0 && <Typography>No fields yet.</Typography>}
        <List>
          {fields.map((f) => (
            <React.Fragment key={f.id}>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleDeleteField(f.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${f.label} (${f.type})`}
                  secondary={f.required ? 'Required' : 'Optional'}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Stack>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenFieldEditor(true)}
        sx={{ mr: 2 }}
      >
        Add Field
      </Button>

      <Button
        variant="outlined"
        color="success"
        onClick={() => setOpenSaveDialog(true)}
        disabled={fields.length === 0}
      >
        Save Form
      </Button>

      {/* Field Editor Dialog */}
      <FieldEditor
        open={openFieldEditor}
        onClose={() => setOpenFieldEditor(false)}
        onSave={handleAddField}
      />

      {/* Save Form Dialog */}
      <SaveFormDialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        onSaveSuccess={() => setShowSnackbar(true)}
      />

      {/* Snackbar for save success */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity='success'
            sx={{ width: '100%' }}
            >
              Form saved successfully!
            </Alert>
        </Snackbar>
    </Paper>
  );
}
