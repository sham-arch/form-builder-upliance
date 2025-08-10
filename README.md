#  React + Redux Form Builder
It’s a dynamic **Form Builder** built with **React, TypeScript, Redux Toolkit, Material-UI (MUI)**, and **localStorage**.

Users can:
- Create dynamic forms with customizable fields & validations
- Preview how saved forms look and behave for an end user
- View, open, and delete saved forms from localStorage
- Use **Derived Fields** that update automatically based on other fields

---

##  Live Demo
[Click here to view the deployed project](YOUR_DEPLOYMENT_LINK)

---

## Features

### 1. **Form Creation** (`/create`)
- Add field types: **Text, Number, Textarea, Select, Radio, Checkbox, Date**
- Configure each field:
  - Label
  - Required toggle
  - Default value
  - Validation rules:
    - Required
    - Min / Max length
    - Email format
    - Password rule (min 8 characters, include a number)
- Mark fields as **Derived Fields** with a calculation formula
- Delete or reorder fields
- Save form schema to localStorage

### 2. **Preview Form** (`/preview/:formId`)
- Loads selected form schema from localStorage
- Dynamically renders the configured fields
- Validations applied as per configuration
- Derived fields auto-calculate when parent fields change
- Submit simulates usage (no data is persisted)

### 3. **My Forms** (`/myforms`)
- Lists all saved forms with:
  - Form name
  - Date created
- Click to open in Preview
- Delete form (updates list + localStorage instantly)

## 🛠 Tech Stack
- **React 18**
- **TypeScript**
- **Redux Toolkit**
- **React Router v6**
- **Material-UI v5**
- **localStorage** for persistence

## 🏃 Getting Started

### Clone the Repository

### Install Dependencies

### Start the Development Server
Go to [**http://localhost:3000**](http://localhost:3000) in your browser.

---

## 📦 Build for Production
