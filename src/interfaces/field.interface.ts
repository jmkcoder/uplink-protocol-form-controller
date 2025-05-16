import { Validation } from "./validation.interface";

// Field interface for dynamic form fields
export interface Field {
  // Basic field properties
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'checkbox' | 
        'radio' | 'select' | 'textarea' | 'date' | 'file' | 'custom';
  label: string;
  value?: any;
  
  // Optional field properties
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  // Validation
  validation?: Validation;
  // For select, radio, and checkbox options
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;

  // Additional properties for custom fields
  props?: Record<string, any>;
}
