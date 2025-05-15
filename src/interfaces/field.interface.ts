// Field interface for dynamic form fields
export interface Field {
  // Basic field properties
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'checkbox' | 
        'radio' | 'select' | 'textarea' | 'date' | 'file' | 'custom';
  label: string;
  value: any;
  
  // Optional field properties
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  // Validation
  validation?: {
    required?: boolean;
    pattern?: RegExp | string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean | string;
    // Dynamic validators configuration
    dynamicValidator?: string;  // Name of the registered validator to use
    dynamicValidatorParams?: Record<string, any>;  // Parameters for the dynamic validator
  };

  // For select, radio, and checkbox options
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;

  // Additional properties for custom fields
  props?: Record<string, any>;
}

// Step configuration for dynamic multi-step forms
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, Field>;
  validation?: (formData: Record<string, any>) => boolean | string;
}

// Form configuration 
export interface FormConfig {
  steps: FormStep[];
  defaultValues?: Record<string, any>;
}
