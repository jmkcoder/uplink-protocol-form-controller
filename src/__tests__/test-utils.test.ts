import { createMockField, createMockStep, createMockFormConfig, createTestValidator } from './test-utils';

describe('Test Utilities', () => {
  describe('createMockField', () => {
    test('should create a field with default values', () => {
      const field = createMockField();
      expect(field.id).toBe('test-field');
      expect(field.type).toBe('text');
      expect(field.label).toBe('Test Field');
    });

    test('should allow overriding default values', () => {
      const field = createMockField({ 
        id: 'custom-id', 
        type: 'email', 
        label: 'Custom Label',
        required: true
      });
      expect(field.id).toBe('custom-id');
      expect(field.type).toBe('email');
      expect(field.label).toBe('Custom Label');
      expect(field.required).toBe(true);
    });
  });

  describe('createMockStep', () => {
    test('should create a step with default fields', () => {
      const step = createMockStep('step1');
      expect(step.id).toBe('step1');
      expect(step.title).toBe('Step step1');
      expect(Object.keys(step.fields).length).toBe(2);
      expect(step.fields.field1_step1).toBeDefined();
      expect(step.fields.field2_step1).toBeDefined();
    });

    test('should allow custom fields', () => {
      const customFields = {
        'custom-field': createMockField({
          id: 'custom-field',
          label: 'Custom Field'
        })
      };
      const step = createMockStep('step1', customFields);
      expect(Object.keys(step.fields).length).toBe(1);
      expect(step.fields['custom-field']).toBeDefined();
    });
  });

  describe('createMockFormConfig', () => {
    test('should create a form config with specified number of steps', () => {
      const config = createMockFormConfig(3);
      expect(config.steps.length).toBe(3);
      expect(config.steps[0].id).toBe('step1');
      expect(config.steps[1].id).toBe('step2');
      expect(config.steps[2].id).toBe('step3');
    });
  });

  describe('createTestValidator', () => {
    test('should create a passing validator', () => {
      const validator = createTestValidator(true);
      expect(validator()).toBe(true);
    });

    test('should create a failing validator with default error message', () => {
      const validator = createTestValidator(false);
      expect(validator()).toBe('Test validation error');
    });

    test('should create a failing validator with custom error message', () => {
      const validator = createTestValidator(false, 'Custom error');
      expect(validator()).toBe('Custom error');
    });
  });
});
