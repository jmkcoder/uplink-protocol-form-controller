import { FormService } from '../../services/form.service';
import { ConfigService } from '../../services/config.service';
import { BaseService } from '../../services/base.service';
import { createMockFormConfig } from '../test-utils';

describe('FormService', () => {
  let configService: ConfigService;
  let formService: FormService;
  let fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  let stepsValidityService: BaseService<Record<string, boolean>>;
  
  beforeEach(() => {
    const config = createMockFormConfig(2);
    configService = new ConfigService(config);
    
    // Initial form data
    const initialFormData: Record<string, Record<string, any>> = {
      step1: {
        field1_step1: 'Value 1',
        field2_step1: 'Value 2'
      },
      step2: {
        field1_step2: 'Value 3',
        field2_step2: 'Value 4'
      }
    };
    
    // Initial validity state
    const validityState: Record<string, boolean> = {
      step1: true,
      step2: true
    };
    
    fieldErrorsService = new BaseService<Record<string, Record<string, string>>>({});
    stepsValidityService = new BaseService<Record<string, boolean>>(validityState);
    
    formService = new FormService(
      initialFormData,
      configService,
      fieldErrorsService,
      stepsValidityService
    );
  });

  describe('basic operations', () => {
    test('should initialize with the provided form data', () => {
      const formData = formService.get();
      
      expect(formData.step1.field1_step1).toBe('Value 1');
      expect(formData.step2.field2_step2).toBe('Value 4');
    });

    test('should update a field value', () => {
      formService.updateField('step1', 'field1_step1', 'New Value');
      
      const formData = formService.get();
      expect(formData.step1.field1_step1).toBe('New Value');
    });

    test('should get data for a specific step', () => {
      const stepData = formService.getStepData('step2');
      
      expect(stepData.field1_step2).toBe('Value 3');
      expect(stepData.field2_step2).toBe('Value 4');
    });

    test('should return empty object for non-existent step', () => {
      const stepData = formService.getStepData('nonExistentStep');
      
      expect(stepData).toEqual({});
    });

    test('should get all form data', () => {
      const allData = formService.getAllData();
      
      expect(allData.step1.field1_step1).toBe('Value 1');
      expect(allData.step2.field1_step2).toBe('Value 3');
    });

    test('should get flattened form data', () => {
      const flatData = formService.getFlatData();
      
      expect(flatData.field1_step1).toBe('Value 1');
      expect(flatData.field2_step1).toBe('Value 2');
      expect(flatData.field1_step2).toBe('Value 3');
      expect(flatData.field2_step2).toBe('Value 4');
    });
  });

  describe('form reset', () => {
    test('should reset form to initial values', () => {
      // First, modify the form data
      formService.updateField('step1', 'field1_step1', 'Changed Value');
      expect(formService.get().step1.field1_step1).toBe('Changed Value');
      
      // Now reset the form
      formService.resetForm();
      
      // The form should use default values from config
      const config = configService.get();
      const defaultValue = config.defaultValues?.field1_step1 || '';
      
      expect(formService.get().step1.field1_step1).toBe(defaultValue);
    });

    test('should reset form with custom default values', () => {
      const customDefaults = {
        field1_step1: 'Custom Default',
        field2_step2: 'Another Default'
      };
      
      formService.resetForm(customDefaults);
      
      expect(formService.get().step1.field1_step1).toBe('Custom Default');
      expect(formService.get().step2.field2_step2).toBe('Another Default');
    });
  });

  describe('enhanced operations', () => {
    test('should submit form successfully when valid', () => {
      const validateAndMarkTouched = jest.fn().mockReturnValue(true);
      const findFirstInvalidStep = jest.fn();
      const goToStep = jest.fn();
      
      const result = formService.submitForm(
        validateAndMarkTouched,
        findFirstInvalidStep,
        goToStep
      );
      
      expect(validateAndMarkTouched).toHaveBeenCalledTimes(1);
      expect(findFirstInvalidStep).not.toHaveBeenCalled();
      expect(goToStep).not.toHaveBeenCalled();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(formService.getAllData());
    });

    test('should handle form submission failure', () => {
      const validateAndMarkTouched = jest.fn().mockReturnValue(false);
      const findFirstInvalidStep = jest.fn().mockReturnValue(1);
      const goToStep = jest.fn();
      
      const result = formService.submitForm(
        validateAndMarkTouched,
        findFirstInvalidStep,
        goToStep
      );
      
      expect(validateAndMarkTouched).toHaveBeenCalledTimes(1);
      expect(findFirstInvalidStep).toHaveBeenCalledTimes(1);
      expect(goToStep).toHaveBeenCalledWith(1);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test('should perform a complete form reset', () => {
      const resetTouchTracking = jest.fn();
      const validateForm = jest.fn();
      
      formService.updateField('step1', 'field1_step1', 'Changed Value');
      
      formService.completeReset(
        resetTouchTracking,
        validateForm
      );
      
      expect(resetTouchTracking).toHaveBeenCalledTimes(1);
      expect(validateForm).toHaveBeenCalledTimes(1);
      
      // Verify the form data was reset
      const config = configService.get();
      const defaultValue = config.defaultValues?.field1_step1 || '';
      expect(formService.get().step1.field1_step1).toBe(defaultValue);
    });
  });
});
