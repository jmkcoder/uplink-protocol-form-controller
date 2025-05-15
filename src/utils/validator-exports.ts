// Exports validator functions for use in the form controller
import { 
  registerValidator as register, 
  unregisterValidator as unregister,
  predefinedValidators,
  DynamicValidator
} from './validator-registry';

/**
 * Register a custom dynamic validator
 */
export const registerValidator = register;

/**
 * Unregister a dynamic validator
 */
export const unregisterValidator = unregister;

/**
 * Get predefined validators
 */
export const getAvailableValidators = () => predefinedValidators;

/**
 * Type for dynamic validator function
 */
export { DynamicValidator };
