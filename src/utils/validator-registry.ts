// Validator registry for dynamic field validators
import { Field } from "../interfaces/field.interface";

/**
 * Context provided to dynamic validators.
 * Gives validators access to the current field, form data, and location information.
 */
export interface ValidatorContext {
  /** The field configuration of the field being validated */
  field: Field;
  
  /** The entire form data flattened into a single object */
  formData: Record<string, any>;
  
  /** The ID of the step containing the field being validated */
  stepId: string;
  
  /** The ID of the field being validated */
  fieldId: string;
}

/**
 * Dynamic validator function signature.
 * 
 * @param value The value to validate
 * @param context The validation context with form state
 * @returns true if valid, or an error message string if invalid
 */
export type DynamicValidator = (
  value: any,
  context: ValidatorContext
) => boolean | string;

// Map to store registered validators
const validatorRegistry: Record<string, DynamicValidator> = {};

/**
 * Register a new dynamic validator
 * @param name Unique name for the validator
 * @param validator The validator function
 */
export const registerValidator = (name: string, validator: DynamicValidator): void => {
  if (validatorRegistry[name]) {
    console.warn(`Validator '${name}' already exists and will be overwritten.`);
  }
  validatorRegistry[name] = validator;
};

/**
 * Unregister a dynamic validator
 * @param name Name of the validator to remove
 */
export const unregisterValidator = (name: string): boolean => {
  if (validatorRegistry[name]) {
    delete validatorRegistry[name];
    return true;
  }
  return false;
};

/**
 * Get a registered validator
 * @param name Name of the validator
 * @returns The validator function or undefined if not found
 */
export const getValidator = (name: string): DynamicValidator | undefined => {
  return validatorRegistry[name];
};

/**
 * Run a named validator
 * @param name Name of the validator to run
 * @param value The value to validate
 * @param context Context information for validation
 * @returns The result of the validation - true/string for valid/invalid
 */
export const runValidator = (
  name: string,
  value: any,
  context: ValidatorContext
): boolean | string => {
  const validator = validatorRegistry[name];
  if (!validator) {
    console.warn(`Validator '${name}' not found.`);
    return true;
  }
  return validator(value, context);
};

// Register built-in validators

// requiredIf: makes a field required based on a condition
registerValidator('requiredIf', (value, context) => {
  const { condition, fields, errorMessage } = context.field.validation?.dynamicValidatorParams || {};
  
  // If no condition or fields are specified, skip validation
  if (!condition || !fields || !fields.length) {
    return true;
  }
    // Get the values of the referenced fields
  const fieldValues = fields.map((fieldId: string) => context.formData[fieldId]);
  
  // Evaluate the condition
  let isRequired = false;
  switch (condition) {
    case 'equals':
      // Check if any referenced field equals the specified value
      const targetValue = context.field.validation?.dynamicValidatorParams?.value;
      isRequired = fieldValues.some((fieldValue: any) => fieldValue === targetValue);
      break;
      
    case 'notEmpty':
      // Check if all referenced fields are not empty
      isRequired = fieldValues.every((fieldValue: any) => 
        fieldValue !== undefined && 
        fieldValue !== null &&
        fieldValue !== ''
      );
      break;
        case 'notEquals':
      // Check if no referenced field equals the specified value
      const excludedValue = context.field.validation?.dynamicValidatorParams?.value;
      isRequired = fieldValues.every((fieldValue: any) => fieldValue !== excludedValue);
      break;
      
    default:
      return true;
  }
  
  // If the field is required based on the condition and it's empty, return error
  if (isRequired) {
    const isEmpty = 
      context.field.type === 'checkbox' ? 
        value === false : 
        value === undefined || value === null || value === '';
        
    if (isEmpty) {
      return errorMessage || `${context.field.label} is required`;
    }
  }
  
  return true;
});

// equals: validates that the field equals a specific value or another field's value
registerValidator('equals', (value, context) => {
  const { targetValue, targetField, errorMessage } = context.field.validation?.dynamicValidatorParams || {};
  
  let comparisonValue;
  if (targetField) {
    comparisonValue = context.formData[targetField];
  } else if (targetValue !== undefined) {
    comparisonValue = targetValue;
  } else {
    return true;
  }
  
  if (value !== comparisonValue) {
    return errorMessage || `${context.field.label} must equal ${targetField ? 'the other field' : targetValue}`;
  }
  
  return true;
});

// Export default predefined validators for easier access
export const predefinedValidators = {
  requiredIf: 'requiredIf',
  equals: 'equals'
};
