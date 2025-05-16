// Validation utility for dynamic form fields
import { Field } from "../interfaces/field.interface";
import { runValidator, ValidatorContext } from "./validator-registry";

/**
 * Validates a field value based on its validation rules
 * @param field The field configuration object
 * @param value The value to validate
 * @param context Additional context for dynamic validators
 * @returns An object containing isValid and error message if any
 */
export const validateField = (
  field: Field, 
  value: any, 
  context?: Partial<ValidatorContext>
): { isValid: boolean; error?: string } => {  
  // Skip validation if field is disabled
  if (field.disabled) {
    return { isValid: true };
  }
  // Handle required validation whether it's in validation object or directly on field
  const isRequired = field.required === true || (field.validation && field.validation.required === true);
    // Required validation with special handling for checkboxes/booleans
  const isEmpty = field.type === 'checkbox' || typeof value === 'boolean' 
    ? value === false // For checkboxes, false is considered empty
    : value === undefined || value === null || value === '';
    
  if (isRequired && isEmpty) {
    // Use custom error message if available (either at field or validation level)
    const errorMessage = field.validation?.errorMessage || `${field.label} is required`;
    return {
      isValid: false,
      error: errorMessage
    };
  }
  
  // If there are no other validation rules, return valid
  if (!field.validation) {
    return { isValid: true };
  }

  const validation = field.validation;

  // Skip other validations if the field is empty and not required
  if (value === undefined || value === null || value === '') {
    return { isValid: true };
  }

  // Type-specific validations
  switch (field.type) {    case 'email':
      // Basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(value))) {
        return {
          isValid: false,
          error: field.validation?.errorMessage  || `Please enter a valid email address`
        };
      }
      break;
    
    case 'text':
    case 'textarea':
    case 'password':      // Min length validation
      if (validation.minLength !== undefined && String(value).length < validation.minLength) {
        return {
          isValid: false,
          error: field.validation?.errorMessage || `${field.label} must be at least ${validation.minLength} characters`
        };
      }
      
      // Max length validation
      if (validation.maxLength !== undefined && String(value).length > validation.maxLength) {
        return {
          isValid: false,
          error: field.validation?.errorMessage || `${field.label} cannot exceed ${validation.maxLength} characters`
        };
      }
      
      // Pattern validation
      if (validation.pattern) {
        const pattern = validation.pattern instanceof RegExp 
          ? validation.pattern 
          : new RegExp(validation.pattern);
          
        if (!pattern.test(String(value))) {
          return {
            isValid: false,
            error: field.validation?.errorMessage || `${field.label} format is invalid`
          };
        }
      }
      break;
      
    case 'number':
    case 'tel':      // Min value validation
      if (validation.min !== undefined && Number(value) < validation.min) {
        return {
          isValid: false,
          error: field.validation?.errorMessage || `${field.label} must be at least ${validation.min}`
        };
      }
      
      // Max value validation
      if (validation.max !== undefined && Number(value) > validation.max) {
        return {
          isValid: false,
          error: field.validation?.errorMessage || `${field.label} cannot exceed ${validation.max}`
        };
      }
      break;
  }
    // Custom validation
  if (validation.custom) {
    const customResult = validation.custom(value);
    if (customResult === false) {
      return {
        isValid: false,
        error: `${field.label} is invalid`
      };
    } else if (typeof customResult === 'string') {
      return {
        isValid: false,
        error: customResult
      };
    }
  }
    // Dynamic validator
  if (validation.dynamicValidator && context) {
    // Create a complete context object for the validator
    const validatorContext: ValidatorContext = {
      field,
      formData: context.formData || {},
      stepId: context.stepId || '',
      fieldId: context.fieldId || ''
    };
    
    const dynamicResult = runValidator(
      validation.dynamicValidator,
      value,
      validatorContext
    );
    
    if (dynamicResult === false) {
      return {
        isValid: false,
        error: validation.errorMessage || `${field.label} is invalid`
      };
    } else if (typeof dynamicResult === 'string') {
      return {
        isValid: false,
        error: typeof dynamicResult === 'string' ? dynamicResult : validation.errorMessage || `${field.label} is invalid`
      };
    }
  }
  
  return { isValid: true };
};
