// This file defines the Validation interface used for form validation in the application.
export interface Validation {
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
  errorMessage?: string;  // Custom error message
}