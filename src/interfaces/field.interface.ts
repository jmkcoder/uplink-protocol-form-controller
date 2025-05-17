import { Validation } from "./validation.interface";

/**
 * Field interface for dynamic form fields.
 * Defines the structure and behavior of individual form fields.
 */
export interface Field {
  /** Unique identifier for the field */
  id: string;
  
  /** 
   * The type of input field 
   * Controls the UI rendering and validation behavior
   */
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'checkbox' | 
        'radio' | 'select' | 'textarea' | 'date' | 'file' | 'custom';
  
  /** Display label for the field */
  label: string;
  
  /** Initial/default value for the field */
  value?: any;
  
  /** Placeholder text for input fields */
  placeholder?: string;
  
  /** 
   * Helper text to display below the field
   * Useful for providing additional context or instructions
   */
  helperText?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled/readonly */
  disabled?: boolean;
  
  /** Whether the field should be hidden from view */
  hidden?: boolean;
  
  /** Validation rules for the field */
  validation?: Validation;
  
  /** 
   * Options for select, radio, and checkbox fields
   * Each option has a label, value, and optional disabled state
   */
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;

  /** 
   * Additional properties for custom fields
   * Allows extending field capabilities with custom attributes
   */
  props?: Record<string, any>;
}
