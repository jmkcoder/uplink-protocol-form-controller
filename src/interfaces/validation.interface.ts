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
   * @deprecated Use dynamicValidators array instead for multiple validators
   */
  dynamicValidator?: string;
  
  /**
   * Parameters for the dynamic validator
   * Provides configuration options to the validator
   * @deprecated Use dynamicValidators array instead
   */
  dynamicValidatorParams?: Record<string, any>;
  
  /**
   * Array of dynamic validators to use
   * Each validator can have its own parameters and error message
   */
  dynamicValidators?: Array<{
    /** Name of registered validator */
    name: string;
    /** Parameters to pass to the validator */
    params?: Record<string, any>;
    /** Custom error message for this validator */
    errorMessage?: string;
  }>;
  
  /** 
   * Custom error message to display on validation failure
   * Overrides default error messages for all validations
   * Use errorMessages for specific error messages per validation type
   */
  errorMessage?: string;
  
  /**
   * Custom error messages for specific validation types
   * Allows specifying different messages for each validation rule
   */
  errorMessages?: {
    /** Error message for required validation */
    required?: string;
    /** Error message for pattern validation */
    pattern?: string;
    /** Error message for minLength validation */
    minLength?: string;
    /** Error message for maxLength validation */
    maxLength?: string;
    /** Error message for min validation */
    min?: string;
    /** Error message for max validation */
    max?: string;
    /** Error message for email validation */
    email?: string;
    /** Error message for custom validation (if not returned by the function) */
    custom?: string;
  };
  
  /**
   * Whether to collect all validation errors instead of stopping at the first one
   * This is useful for showing multiple validation errors at once
   */
  collectAllErrors?: boolean;
}