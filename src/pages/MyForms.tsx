// src/pages/MyForms.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { FormSchema } from "../types/formTypes";

export default function MyForms() {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("forms");
    if (saved) {
      try {
        const parsed: FormSchema[] = JSON.parse(saved);
        setForms(parsed);
      } catch {
        setForms([]);
      }
    }
  }, []);

  const handleOpenForm = (formId: string) => {
    navigate(`/preview/${formId}`);
  };

  const handleDeleteForm = (formId: string) => {
    const updatedForms = forms.filter((form) => form.id !== formId);
    setForms(updatedForms);
    localStorage.setItem("forms", JSON.stringify(updatedForms));
  };

  if (forms.length === 0) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">No saved forms found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Saved Forms</Typography>
      <List>
        {forms.map((form) => (
          <React.Fragment key={form.id}>
            <ListItem
              component="li"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteForm(form.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => handleOpenForm(form.id)}>
                <ListItemText
                  primary={form.name || "(Unnamed Form)"}
                  secondary={new Date(form.createdAt).toLocaleString()}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}
