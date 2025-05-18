// Validation utility for dynamic form fields
import { Field } from "../interfaces/field.interface";
import { runValidator, ValidatorContext } from "./validator-registry";

/**
 * Validates a field value based on its validation rules
 * @param field The field configuration object
 * @param value The value to validate
 * @param context Additional context for dynamic validators
 * @param collectAllErrors Whether to collect all errors or stop at the first one
 * @returns An object containing isValid and error messages if any
 */
export const validateField = (
  field: Field, 
  value: any, 
  context?: Partial<ValidatorContext>,
  collectAllErrors: boolean = false
): { isValid: boolean; error?: string; errors?: string[] } => {  
  // Skip validation if field is disabled
  if (field.disabled) {
    return { isValid: true };
  }

  // Array to collect all errors if needed
  const errors: string[] = [];
  // Handle required validation whether it's in validation object or directly on field
  const isRequired = field.required === true || (field.validation && field.validation.required === true);
  // Required validation with special handling for checkboxes/booleans
  const isEmpty = field.type === 'checkbox' || typeof value === 'boolean' 
    ? value === false // For checkboxes, false is considered empty
    : value === undefined || value === null || value === '';
    
  if (isRequired && isEmpty) {
    // Use specific error message if available
    const errorMessage = field.validation?.errorMessages?.required || 
                        field.validation?.errorMessage || 
                        `${field.label} is required`;
    
    if (collectAllErrors) {
      errors.push(errorMessage);
      // Continue to other validations if we're collecting all errors
    } else {
      return {
        isValid: false,
        error: errorMessage,
        errors: [errorMessage]
      };
    }
  }
  
  // If there are no other validation rules, return valid
  if (!field.validation) {
    return errors.length ? { isValid: false, error: errors[0], errors } : { isValid: true };
  }

  const validation = field.validation;

  // Skip other validations if the field is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors.length ? { isValid: false, error: errors[0], errors } : { isValid: true };
  }// Type-specific validations
  switch (field.type) {
    case 'email':
      // Basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(value))) {
        const errorMessage = validation.errorMessages?.email || 
                            validation.errorMessage || 
                            `Please enter a valid email address`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      }
      break;
    
    case 'text':
    case 'textarea':
    case 'password':
      // Min length validation
      if (validation.minLength !== undefined && String(value).length < validation.minLength) {
        const errorMessage = validation.errorMessages?.minLength || 
                            validation.errorMessage || 
                            `${field.label} must be at least ${validation.minLength} characters`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      }
      
      // Max length validation
      if (validation.maxLength !== undefined && String(value).length > validation.maxLength) {
        const errorMessage = validation.errorMessages?.maxLength || 
                            validation.errorMessage || 
                            `${field.label} cannot exceed ${validation.maxLength} characters`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      }
      
      // Pattern validation
      if (validation.pattern) {
        const pattern = validation.pattern instanceof RegExp 
          ? validation.pattern 
          : new RegExp(validation.pattern);
          
        if (!pattern.test(String(value))) {
          const errorMessage = validation.errorMessages?.pattern || 
                              validation.errorMessage || 
                              `${field.label} format is invalid`;
          errors.push(errorMessage);
          if (!collectAllErrors) {
            return { isValid: false, error: errorMessage, errors };
          }
        }
      }
      break;
      
    case 'number':
    case 'tel':
      // Min value validation
      if (validation.min !== undefined && Number(value) < validation.min) {
        const errorMessage = validation.errorMessages?.min || 
                            validation.errorMessage || 
                            `${field.label} must be at least ${validation.min}`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      }
      
      // Max value validation
      if (validation.max !== undefined && Number(value) > validation.max) {
        const errorMessage = validation.errorMessages?.max || 
                            validation.errorMessage || 
                            `${field.label} cannot exceed ${validation.max}`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      }
      break;
  }  // Custom validation
  if (validation.custom) {
    const customResult = validation.custom(value);
    if (customResult === false) {
      const errorMessage = validation.errorMessages?.custom || 
                          validation.errorMessage || 
                          `${field.label} is invalid`;
      errors.push(errorMessage);
      if (!collectAllErrors) {
        return { isValid: false, error: errorMessage, errors };
      }
    } else if (typeof customResult === 'string') {
      errors.push(customResult);
      if (!collectAllErrors) {
        return { isValid: false, error: customResult, errors };
      }
    }
  }
      // Create a complete context object for validator(s)
  const validatorContext: ValidatorContext = {
    field,
    formData: context?.formData || {},
    stepId: context?.stepId || '',
    fieldId: context?.fieldId || ''
  };
  
  // Support for legacy single dynamic validator
  if (validation.dynamicValidator && context) {
    const dynamicResult = runValidator(
      validation.dynamicValidator,
      value,
      validatorContext,
      validation.dynamicValidatorParams
    );
    
    if (dynamicResult === false) {
      const errorMessage = validation.errorMessage || `${field.label} is invalid`;
      errors.push(errorMessage);
      if (!collectAllErrors) {
        return { isValid: false, error: errorMessage, errors };
      }
    } else if (typeof dynamicResult === 'string') {
      errors.push(dynamicResult);
      if (!collectAllErrors) {
        return { isValid: false, error: dynamicResult, errors };
      }
    }
  }
  
  // Support for multiple dynamic validators
  if (validation.dynamicValidators && validation.dynamicValidators.length > 0 && context) {
    for (const validator of validation.dynamicValidators) {
      const dynamicResult = runValidator(
        validator.name,
        value,
        validatorContext,
        validator.params
      );
      
      if (dynamicResult === false) {
        const errorMessage = validator.errorMessage || validation.errorMessage || `${field.label} is invalid`;
        errors.push(errorMessage);
        if (!collectAllErrors) {
          return { isValid: false, error: errorMessage, errors };
        }
      } else if (typeof dynamicResult === 'string') {
        errors.push(dynamicResult);
        if (!collectAllErrors) {
          return { isValid: false, error: dynamicResult, errors };
        }
      }
    }
  }
  
  // If we've collected any errors, return invalid with all errors
  if (errors.length > 0) {
    return { 
      isValid: false, 
      error: errors[0], // First error as the main error
      errors           // All errors collected
    };
  }
  
  // If no errors were found, return valid
  return { isValid: true };
};
