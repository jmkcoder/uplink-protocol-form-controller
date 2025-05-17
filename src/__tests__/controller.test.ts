import { FormController } from '../controller';
import { createMockFormConfig } from './test-utils';

describe('FormController', () => {
  let controller: ReturnType<typeof FormController>;
  
  beforeEach(() => {
    const config = createMockFormConfig(3);
    controller = FormController(config);
  });

  describe('initialization', () => {
    test('should initialize properly with the given config', () => {
      expect(controller.bindings.config.current.steps.length).toBe(3);
      expect(controller.bindings.currentStepIndex.current).toBe(0);
      expect(controller.bindings.currentStep.current).toBeDefined();
      expect(controller.bindings.currentStep.current.id).toBe('step1');
    });
  });

  describe('form navigation', () => {
    test('should navigate to the next step with validation', () => {
      // Mock required field values to pass validation
      controller.methods.updateField('step1', 'field2_step1', 'Required value');
      
      // Navigate to next step
      const newIndex = controller.methods.nextStep();
      
      expect(newIndex).toBe(1);
      expect(controller.bindings.currentStepIndex.current).toBe(1);
      expect(controller.bindings.currentStep.current.id).toBe('step2');
    });

    test('should not navigate if validation fails', () => {
      // Don't set required field value
      
      // Try to navigate to next step
      const newIndex = controller.methods.nextStep();
      
      // Should stay on the first step
      expect(newIndex).toBe(0);
      expect(controller.bindings.currentStepIndex.current).toBe(0);
    });

    test('should go to previous step without validation', () => {
      // First go to step 2
      controller.methods.updateField('step1', 'field2_step1', 'Required value');
      controller.methods.nextStep();
      
      // Now go back
      const newIndex = controller.methods.prevStep();
      
      expect(newIndex).toBe(0);
      expect(controller.bindings.currentStepIndex.current).toBe(0);
    });

    test('should go to a specific step', () => {
      // Fill in required field values for first steps
      controller.methods.updateField('step1', 'field2_step1', 'Required value');
      controller.methods.updateField('step2', 'field2_step2', 'Required value');
      
      const result = controller.methods.goToStep(2);
      
      expect(result).toBe(true);
      expect(controller.bindings.currentStepIndex.current).toBe(2);
      expect(controller.bindings.currentStep.current.id).toBe('step3');
    });
  });

  describe('form data operations', () => {
    test('should update field values', () => {
      controller.methods.updateField('step1', 'field1_step1', 'New Value');
      
      const formData = controller.bindings.formData.current;
      expect(formData.step1.field1_step1).toBe('New Value');
    });

    test('should get step data', () => {
      controller.methods.updateField('step2', 'field1_step2', 'Step 2 Value');
      
      const stepData = controller.methods.getStepData('step2');
      expect(stepData.field1_step2).toBe('Step 2 Value');
    });

    test('should get all form data', () => {
      controller.methods.updateField('step1', 'field1_step1', 'Value 1');
      controller.methods.updateField('step2', 'field1_step2', 'Value 2');
      
      const allData = controller.methods.getAllData();
      expect(allData.step1.field1_step1).toBe('Value 1');
      expect(allData.step2.field1_step2).toBe('Value 2');
    });

    test('should get flattened form data', () => {
      controller.methods.updateField('step1', 'field1_step1', 'Value 1');
      controller.methods.updateField('step2', 'field1_step2', 'Value 2');
      
      const flatData = controller.methods.getFlatData();
      expect(flatData.field1_step1).toBe('Value 1');
      expect(flatData.field1_step2).toBe('Value 2');
    });
  });

  describe('form validation and submission', () => {
    test('should validate a field', () => {
      // Empty required field should not be valid
      const isValid = controller.methods.validateField('step1', 'field2_step1', '');
      
      expect(isValid).toBe(false);
      expect(controller.bindings.fieldErrors.current.step1?.field2_step1).toBeDefined();
    });

    test('should validate an entire step', () => {
      // Step has a required field that is empty, so should not be valid
      const isValid = controller.methods.validateStep('step1');
      
      expect(isValid).toBe(false);
      expect(controller.bindings.stepsValidity.current.step1).toBe(false);
    });

    test('should validate all steps', () => {
      // At least one step has a required field that is empty
      const isValid = controller.methods.validateForm();
      
      expect(isValid).toBe(false);
      expect(controller.bindings.isFormValid.current).toBe(false);
    });

    test('should handle form submission when invalid', () => {
      // Don't fill required fields
      
      const result = controller.methods.submitForm();
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test('should handle form submission when valid', () => {
      // Fill all required fields in all steps
      controller.methods.updateField('step1', 'field2_step1', 'Required 1');
      controller.methods.updateField('step2', 'field2_step2', 'Required 2');
      controller.methods.updateField('step3', 'field2_step3', 'Required 3');
      
      const result = controller.methods.submitForm();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.step1.field2_step1).toBe('Required 1');
    });
  });

  describe('form configuration changes', () => {
    test('should update form configuration', () => {
      const newConfig = createMockFormConfig(2);
      controller.methods.updateConfig(newConfig);
      
      expect(controller.bindings.config.current.steps.length).toBe(2);
      expect(controller.bindings.totalSteps.current).toBe(2);
    });    test('should add a new step', () => {
      const newStep = {
        id: 'step4',
        title: 'New Step',
        description: 'A new step',
        fields: {
          field1: {
            id: 'field1',
            type: 'text' as const,
            label: 'New Field',
            required: false
          }
        }
      };
      
      controller.methods.addStep(newStep);
      
      expect(controller.bindings.config.current.steps.length).toBe(4);
      expect(controller.bindings.totalSteps.current).toBe(4);
      expect(controller.bindings.formData.current.step4).toBeDefined();
    });

    test('should remove a step', () => {
      const result = controller.methods.removeStep('step2');
      
      expect(result).toBe(true);
      expect(controller.bindings.config.current.steps.length).toBe(2);
      expect(controller.bindings.totalSteps.current).toBe(2);
      expect(controller.bindings.formData.current.step2).toBeUndefined();
    });
  });

  describe('form reset', () => {
    test('should reset the form to initial values', () => {
      // Modify some fields
      controller.methods.updateField('step1', 'field1_step1', 'Changed value');
      expect(controller.bindings.formData.current.step1.field1_step1).toBe('Changed value');
      
      // Reset the form
      controller.methods.resetForm();
      
      // Should be reset to initial value
      const defaultValue = controller.bindings.config.current.defaultValues?.field1_step1 || '';
      expect(controller.bindings.formData.current.step1.field1_step1).toBe(defaultValue);
    });
  });
});
