import { StepperService } from '../../services/stepper.service';
import { ConfigService } from '../../services/config.service';
import { createMockFormConfig } from '../test-utils';

describe('StepperService', () => {
  let configService: ConfigService;
  let stepperService: StepperService;
  
  beforeEach(() => {
    // Create a form with 3 steps
    configService = new ConfigService(createMockFormConfig(3));
    stepperService = new StepperService(0, configService);
  });

  describe('basic operations', () => {
    test('should initialize with the provided step index', () => {
      expect(stepperService.get()).toBe(0);
      expect(stepperService.isFirstStep).toBe(true);
      expect(stepperService.isLastStep).toBe(false);
    });

    test('should navigate to next step', () => {
      const newIndex = stepperService.nextStep();
      
      expect(newIndex).toBe(1);
      expect(stepperService.get()).toBe(1);
      expect(stepperService.isFirstStep).toBe(false);
      expect(stepperService.isLastStep).toBe(false);
    });

    test('should not go beyond the last step', () => {
      stepperService.set(2); // Go to the last step
      const newIndex = stepperService.nextStep();
      
      expect(newIndex).toBe(2); // Should stay at the last step
      expect(stepperService.isLastStep).toBe(true);
    });

    test('should navigate to previous step', () => {
      stepperService.set(2);
      const newIndex = stepperService.prevStep();
      
      expect(newIndex).toBe(1);
      expect(stepperService.get()).toBe(1);
    });

    test('should not go before the first step', () => {
      const newIndex = stepperService.prevStep();
      
      expect(newIndex).toBe(0); // Should stay at the first step
      expect(stepperService.isFirstStep).toBe(true);
    });

    test('should go to specific step by index', () => {
      const result = stepperService.goToStep(2);
      
      expect(result).toBe(true);
      expect(stepperService.get()).toBe(2);
      expect(stepperService.isLastStep).toBe(true);
    });

    test('should not go to invalid step index', () => {
      const result = stepperService.goToStep(5);
      
      expect(result).toBe(false);
      expect(stepperService.get()).toBe(0); // Should stay at the original step
    });
  });

  describe('validation during navigation', () => {
    test('should use validation callback during next step', () => {
      const validateCallback = jest.fn().mockReturnValue(true);
      const newIndex = stepperService.nextStep(validateCallback);
      
      expect(validateCallback).toHaveBeenCalledTimes(1);
      expect(newIndex).toBe(1);
    });

    test('should not go to next step if validation fails', () => {
      const validateCallback = jest.fn().mockReturnValue(false);
      const newIndex = stepperService.nextStep(validateCallback);
      
      expect(validateCallback).toHaveBeenCalledTimes(1);
      expect(newIndex).toBe(0); // Should stay at current step
    });
  });

  describe('enhanced operations', () => {
    test('should validate and navigate to next step if valid', () => {
      const markStepTouched = jest.fn();
      const validateStep = jest.fn().mockReturnValue(true);
      
      const newIndex = stepperService.validateAndNext(
        'step1',
        markStepTouched,
        validateStep
      );
      
      expect(markStepTouched).toHaveBeenCalledWith('step1', true);
      expect(validateStep).toHaveBeenCalledWith(true);
      expect(newIndex).toBe(1);
    });

    test('should not navigate if validation fails', () => {
      const markStepTouched = jest.fn();
      const validateStep = jest.fn().mockReturnValue(false);
      
      const newIndex = stepperService.validateAndNext(
        'step1',
        markStepTouched,
        validateStep
      );
      
      expect(markStepTouched).toHaveBeenCalledWith('step1', true);
      expect(validateStep).toHaveBeenCalledWith(true);
      expect(newIndex).toBe(0); // Should stay at current step
    });
  });
});
