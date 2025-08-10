export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'derived';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  validation?: ValidationRule;
  options?: string[];
  derivedFrom?: string[];
  formula?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldConfig[];
}
