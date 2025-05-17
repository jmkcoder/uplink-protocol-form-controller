/**
 * Validation interface defining rules for form field validation.
 * Supports both static and dynamic validation approaches.
 */
export interface Validation {
  /** Whether the field is required */
  required?: boolean;
  
  /** Regular expression pattern for validation */
  pattern?: RegExp | string;
  
  /** Minimum allowed text length */
  minLength?: number;
  
  /** Maximum allowed text length */
  maxLength?: number;
  
  /** Minimum allowed numeric value */
  min?: number;
  
  /** Maximum allowed numeric value */
  max?: number;
  
  /** 
   * Custom validation function
   * @param value The field value to validate
   * @returns true if valid, or an error message string if invalid
   */
  custom?: (value: any) => boolean | string;
  
  /** 
   * Name of registered dynamic validator to use
   * Dynamic validators have access to the entire form state
   */
  dynamicValidator?: string;
  
  /**
   * Parameters for the dynamic validator
   * Provides configuration options to the validator
   */
  dynamicValidatorParams?: Record<string, any>;
  
  /** 
   * Custom error message to display on validation failure
   * Overrides default error messages
   */
  errorMessage?: string;
}