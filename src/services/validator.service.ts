import { DynamicValidator } from '../utils/validator-registry';

/**
 * Service for managing dynamic validators
 */
export class ValidatorService {
  constructor() {}

  /**
   * Register a dynamic validator
   * @param name Validator name
   * @param validatorFn Validator function
   */
  registerValidator(name: string, validatorFn: DynamicValidator): void {
    const { registerValidator } = require('../utils/validator-registry');
    registerValidator(name, validatorFn);
  }

  /**
   * Unregister a dynamic validator
   * @param name Validator name
   * @returns Success flag
   */
  unregisterValidator(name: string): boolean {
    const { unregisterValidator } = require('../utils/validator-registry');
    return unregisterValidator(name);
  }

  /**
   * Get all available validators
   * @returns List of predefined validators
   */
  getAvailableValidators(): string[] {
    const { predefinedValidators } = require('../utils/validator-registry');
    return predefinedValidators;
  }
}
