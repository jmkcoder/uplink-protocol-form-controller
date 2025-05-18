import { runValidator, ValidatorContext } from '../../utils/validator-registry';
import { Field } from '../../interfaces/field.interface';

describe('Validator Registry', () => {
  // Helper function to create a mock validator context
  function createMockContext(
    fieldOverrides: Partial<Field> = {},
    formData: Record<string, any> = {}
  ): ValidatorContext {
    const field: Field = {
      id: 'testField',
      type: 'text',
      label: 'Test Field',
      placeholder: 'Test Placeholder',
      required: false,
      ...fieldOverrides
    };

    return {
      field,
      formData,
      stepId: 'testStep',
      fieldId: field.id
    };
  }

  describe('requiredIf validator', () => {    // Helper to run requiredIf validator with different scenarios
    const testRequiredIf = (
      value: any,
      condition: string,
      fields: string[],
      formData: Record<string, any>,
      validationParams: Record<string, any> = {},
      fieldType: 'text' | 'checkbox' = 'text'
    ) => {
      const context = createMockContext(
        {
          type: fieldType,
          validation: {
            dynamicValidator: 'requiredIf',
            dynamicValidatorParams: {
              condition,
              fields,
              ...validationParams
            }
          }
        },
        formData
      );

      return runValidator('requiredIf', value, context);
    };

    test('should pass when condition or fields are not specified', () => {
      // Missing condition
      expect(testRequiredIf('', undefined as any, ['field1'], {})).toBe(true);
      // Missing fields
      expect(testRequiredIf('', 'equals', undefined as any, {})).toBe(true);
      // Empty fields array
      expect(testRequiredIf('', 'equals', [], {})).toBe(true);
    });

    describe('condition: equals', () => {
      test('should pass when referenced field does not equal target value', () => {
        expect(
          testRequiredIf('', 'equals', ['field1'], { field1: 'value1' }, { value: 'value2' })
        ).toBe(true);
      });

      test('should pass when field has a value and condition is met', () => {
        expect(
          testRequiredIf('test', 'equals', ['field1'], { field1: 'value1' }, { value: 'value1' })
        ).toBe(true);
      });

      test('should fail when field is empty and condition is met', () => {
        expect(
          testRequiredIf('', 'equals', ['field1'], { field1: 'value1' }, { value: 'value1' })
        ).toBe('Test Field is required');
      });

      test('should use custom error message when provided', () => {
        expect(
          testRequiredIf(
            '',
            'equals',
            ['field1'],
            { field1: 'value1' },
            { value: 'value1', errorMessage: 'Custom error' }
          )
        ).toBe('Custom error');
      });
    });

    describe('condition: notEmpty', () => {
      test('should pass when any referenced field is empty', () => {
        expect(
          testRequiredIf('', 'notEmpty', ['field1', 'field2'], { field1: 'value1', field2: '' })
        ).toBe(true);
      });

      test('should pass when field has a value and all referenced fields are not empty', () => {
        expect(
          testRequiredIf('test', 'notEmpty', ['field1', 'field2'], { field1: 'value1', field2: 'value2' })
        ).toBe(true);
      });

      test('should fail when field is empty and all referenced fields are not empty', () => {
        expect(
          testRequiredIf('', 'notEmpty', ['field1', 'field2'], { field1: 'value1', field2: 'value2' })
        ).toBe('Test Field is required');
      });
    });

    describe('condition: notEquals', () => {
      test('should pass when any referenced field equals excluded value', () => {
        expect(
          testRequiredIf('', 'notEquals', ['field1', 'field2'], 
            { field1: 'value1', field2: 'excluded' }, 
            { value: 'excluded' })
        ).toBe(true);
      });

      test('should pass when field has a value and no fields equal excluded value', () => {
        expect(
          testRequiredIf('test', 'notEquals', ['field1', 'field2'], 
            { field1: 'value1', field2: 'value2' }, 
            { value: 'excluded' })
        ).toBe(true);
      });

      test('should fail when field is empty and no fields equal excluded value', () => {
        expect(
          testRequiredIf('', 'notEquals', ['field1', 'field2'], 
            { field1: 'value1', field2: 'value2' }, 
            { value: 'excluded' })
        ).toBe('Test Field is required');
      });
    });

    describe('checkbox handling', () => {
      test('should consider unchecked checkbox (false) as empty', () => {
        expect(
          testRequiredIf(
            false,
            'equals',
            ['field1'],
            { field1: 'value1' },
            { value: 'value1' },
            'checkbox'
          )
        ).toBe('Test Field is required');
      });

      test('should consider checked checkbox (true) as not empty', () => {
        expect(
          testRequiredIf(
            true,
            'equals',
            ['field1'],
            { field1: 'value1' },
            { value: 'value1' },
            'checkbox'
          )
        ).toBe(true);
      });
    });
  });

  describe('equals validator', () => {    // Helper to run equals validator with different scenarios
    const testEquals = (
      value: any,
      targetValue: any = undefined,
      targetField: string | undefined = undefined,
      formData: Record<string, any> = {},
      errorMessage: string | undefined = undefined
    ) => {
      const context = createMockContext(
        {
          validation: {
            dynamicValidator: 'equals',
            dynamicValidatorParams: {
              targetValue,
              targetField,
              errorMessage
            }
          }
        },
        formData
      );

      return runValidator('equals', value, context);
    };

    test('should pass when neither targetValue nor targetField is provided', () => {
      expect(testEquals('any value')).toBe(true);
    });

    test('should pass when value equals specified targetValue', () => {
      expect(testEquals('test value', 'test value')).toBe(true);
    });

    test('should fail when value does not equal specified targetValue', () => {
      const result = testEquals('wrong value', 'test value');
      expect(result).toBe('Test Field must equal test value');
    });

    test('should pass when value equals the value in targetField', () => {
      expect(testEquals('match', undefined, 'otherField', { otherField: 'match' })).toBe(true);
    });

    test('should fail when value does not equal the value in targetField', () => {
      const result = testEquals('no match', undefined, 'otherField', { otherField: 'match' });
      expect(result).toBe('Test Field must equal the other field');
    });

    test('should use custom error message when provided', () => {
      const result = testEquals('wrong', 'right', undefined, {}, 'Values must match!');
      expect(result).toBe('Values must match!');
    });

    test('should prioritize targetField over targetValue when both are provided', () => {
      // Should compare against field value, not targetValue
      expect(
        testEquals('match', 'no match', 'otherField', { otherField: 'match' })
      ).toBe(true);
      
      // Should fail comparing against field value, not targetValue
      const result = testEquals('no match', 'no match', 'otherField', { otherField: 'match' });
      expect(result).toBe('Test Field must equal the other field');
    });
  });
});
