import { validateField } from '../../utils/validator';
import { Field } from '../../interfaces/field.interface';
import { ValidatorContext } from '../../utils/validator-registry';

// Mock the validator-registry module
jest.mock('../../utils/validator-registry', () => ({
  runValidator: jest.fn((name, value, context, params) => {
    // Mock different dynamic validators
    if (name === 'validator1') {
      return value === 'invalid1' ? 'Error from validator 1' : true;
    }
    if (name === 'validator2') {
      return value === 'invalid2' ? 'Error from validator 2' : true;
    }
    if (name === 'requiredIf') {
      // For the specific test case with legacy and new validators
      if (params && params.condition === 'equals' && params.field === 'otherField') {
        return context.formData?.otherField === params.value && !value ? 'Field is required based on condition' : true;
      }
      return value ? true : 'Field is required based on condition';
    }
    return true;
  }),
  ValidatorContext: jest.fn() // Mock the interface so it can be imported
}));

describe('Enhanced Validator', () => {
  // Create a basic field for testing
  const createField = (overrides: Partial<Field> = {}): Field => ({
    id: 'test',
    type: 'text',
    label: 'Test Field',
    ...overrides
  });

  test('should support specific error messages per validation rule', () => {
    const field = createField({
      validation: {
        minLength: 5,
        maxLength: 10,
        pattern: /^[A-Z]+$/,
        errorMessages: {
          minLength: 'Custom min length message',
          maxLength: 'Custom max length message',
          pattern: 'Custom pattern message'
        },
        collectAllErrors: true
      }
    });

    // Value that fails all validations
    const result = validateField(field, 'abc', {}, true);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Custom min length message');
    expect(result.errors).toContain('Custom pattern message');
    // Max length shouldn't fail
    expect(result.errors).not.toContain('Custom max length message');
  });

  test('should support multiple dynamic validators', () => {
    const { runValidator } = require('../../utils/validator-registry');
    
    const field = createField({
      validation: {
        dynamicValidators: [
          { name: 'validator1', errorMessage: 'Custom validator1 message' },
          { name: 'validator2', errorMessage: 'Custom validator2 message' }
        ],
        collectAllErrors: true
      }
    });

    const context = {
      field,
      formData: {},
      stepId: 'step1',
      fieldId: 'field1'
    };

    // Value that fails both validators
    const result = validateField(field, 'invalid1invalid2', context, true);
    
    // Should have called both validators
    expect(runValidator).toHaveBeenCalledWith('validator1', 'invalid1invalid2', expect.any(Object), undefined);
    expect(runValidator).toHaveBeenCalledWith('validator2', 'invalid1invalid2', expect.any(Object), undefined);
    
    // Legacy validator shouldn't have been called because it wasn't specified
    expect(runValidator).not.toHaveBeenCalledWith('requiredIf', expect.any(String), expect.any(Object), undefined);
  });  // Create a test specifically for verifying the validator.ts logic rather than mocks
  test('should process both legacy and new dynamic validators', () => {
    const { runValidator } = require('../../utils/validator-registry');
    
    // Create a field with both legacy and new validator styles
    const field = createField({
      validation: {
        // Legacy validator (single)
        dynamicValidator: 'requiredIf', 
        dynamicValidatorParams: { condition: 'equals', value: 'yes', field: 'otherField' },
        
        // New validators (multiple)
        dynamicValidators: [
          { name: 'validator1', errorMessage: 'Validator 1 failed' }
        ],
        
        // General error message as fallback
        errorMessage: 'General error',
        collectAllErrors: true
      }
    });
    
    // Setup context for validation
    const context = {
      field,
      formData: { otherField: 'yes' },
      stepId: 'step1',
      fieldId: 'test'
    };
    
    // Test with a value that will pass all validations
    validateField(field, 'valid-value', context, true);
    
    // Verify both validator types were called
    expect(runValidator).toHaveBeenCalledWith('requiredIf', 'valid-value', expect.any(Object), 
      { condition: 'equals', value: 'yes', field: 'otherField' });
    expect(runValidator).toHaveBeenCalledWith('validator1', 'valid-value', expect.any(Object), undefined);
    
    // Reset mock to verify with invalid value
    jest.clearAllMocks();
    
    // Now test with invalid values to ensure both validators can return errors
    // Setting up runValidator to fail for specific validators
    runValidator.mockImplementation((name, value, context, params) => {
      if (name === 'requiredIf') return 'Legacy validator failed';
      if (name === 'validator1') return 'New validator failed';
      return true;
    });
    
    const result = validateField(field, 'invalid-value', context, true);
    
    // Check that the validation failed
    expect(result.isValid).toBe(false);
    
    // Check that both validators were called
    expect(runValidator).toHaveBeenCalledWith('requiredIf', 'invalid-value', expect.any(Object), 
      { condition: 'equals', value: 'yes', field: 'otherField' });
    expect(runValidator).toHaveBeenCalledWith('validator1', 'invalid-value', expect.any(Object), undefined);
    
    // Check that errors from both validators were collected
    expect(result.errors).toContain('Legacy validator failed');
    expect(result.errors).toContain('New validator failed');
  });

  test('should pass custom parameters to dynamic validators', () => {
    const { runValidator } = require('../../utils/validator-registry');
    
    const customParams = { custom: 'parameter', value: 123 };
    
    const field = createField({
      validation: {
        dynamicValidators: [
          { 
            name: 'validator1', 
            params: customParams,
            errorMessage: 'Custom message' 
          }
        ]
      }
    });

    const context = {
      field,
      formData: {},
      stepId: 'step1',
      fieldId: 'field1'
    };

    validateField(field, 'test', context);
    
    // Should pass custom parameters to the validator
    expect(runValidator).toHaveBeenCalledWith('validator1', 'test', expect.any(Object), customParams);
  });
});
