import { validateField } from '../../utils/validator';
import { Field } from '../../interfaces/field.interface';
import { ValidatorContext } from '../../utils/validator-registry';

// Mock the validator-registry module
jest.mock('../../utils/validator-registry', () => ({
  runValidator: jest.fn((name, value, context) => {
    if (name === 'testDynamicValidator') {
      if (value === 'invalid') {
        return 'Dynamic validation failed';
      }
      return true;
    }
    return true;
  })
}));

describe('Validator with multiple errors support', () => {
  // Create a basic field for testing
  const createField = (overrides: Partial<Field> = {}): Field => ({
    id: 'test',
    type: 'text',
    label: 'Test Field',
    ...overrides
  });

  test('should prioritize required validation over other validations', () => {    const field = createField({
      required: true,
      validation: {
        minLength: 5,
        pattern: /^[A-Z]+$/
      }
    });

    // Empty value should fail with required error
    const result = validateField(field, '');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Test Field is required');
  });

  test('should collect multiple errors when collectAllErrors is true', () => {
    const field = createField({
      validation: {
        minLength: 5,
        maxLength: 10,
        pattern: /^[A-Z]+$/,
        collectAllErrors: true
      }
    });

    // Value fails multiple validations
    const result = validateField(field, 'abc', {}, true);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(1);
    
    // Should include both min length and pattern errors
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('at least 5 characters'),
      expect.stringContaining('format is invalid')
    ]));
  });

  test('should stop at first error when collectAllErrors is false', () => {
    const field = createField({
      validation: {
        minLength: 5,
        maxLength: 10,
        pattern: /^[A-Z]+$/
      }
    });

    // Value fails multiple validations but should only return the first error
    const result = validateField(field, 'abc');
    expect(result.isValid).toBe(false);
    expect(result.errors?.length).toBe(1);
  });

  test('should skip other validations if field is empty and not required', () => {
    const field = createField({
      validation: {
        minLength: 5,
        pattern: /^[A-Z]+$/,
        collectAllErrors: true
      }
    });

    const result = validateField(field, '');
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });
  test('should respect validation order', () => {
    const customValidatorCalled = jest.fn();
    const field = createField({
      validation: {
        minLength: 3,
        pattern: /^[a-z]+$/,
        custom: (value) => {
          customValidatorCalled();
          return true;
        }
      }
    });

    // Value fails min length validation
    validateField(field, 'ab');
    expect(customValidatorCalled).not.toHaveBeenCalled();

    // Value passes min length but fails pattern
    validateField(field, 'ABC');
    expect(customValidatorCalled).not.toHaveBeenCalled();

    // Value passes all validations
    validateField(field, 'abc');
    expect(customValidatorCalled).toHaveBeenCalled();
  });

  test('should handle dynamic validators correctly', () => {
    const { runValidator } = require('../../utils/validator-registry');
    const field = createField({
      validation: {
        dynamicValidator: 'testDynamicValidator'
      }
    });

    const context = {
      field,
      formData: {},
      stepId: 'step1',
      fieldId: 'field1'
    };    // Valid case
    const validResult = validateField(field, 'valid', context);
    expect(validResult.isValid).toBe(true);
    expect(runValidator).toHaveBeenCalledWith('testDynamicValidator', 'valid', expect.any(Object), undefined);

    // Invalid case
    const invalidResult = validateField(field, 'invalid', context);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.error).toBe('Dynamic validation failed');
  });

  test('should combine multiple errors from different validation types', () => {
    const { runValidator } = require('../../utils/validator-registry');
    runValidator.mockImplementationOnce(() => 'Dynamic error');

    const field = createField({
      validation: {
        minLength: 10,
        custom: () => 'Custom error',
        dynamicValidator: 'testDynamicValidator',
        collectAllErrors: true
      }
    });

    const context = {
      field,
      formData: {},
      stepId: 'step1',
      fieldId: 'field1'
    };

    // Value that fails all validations
    const result = validateField(field, 'short', context, true);
    expect(result.isValid).toBe(false);
    expect(result.errors?.length).toBe(3);
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('at least 10 characters'),
      'Custom error',
      'Dynamic error'
    ]));
  });
});
