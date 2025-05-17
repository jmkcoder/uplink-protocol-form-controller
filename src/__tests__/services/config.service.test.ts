import { ConfigService } from '../../services/config.service';
import { createMockFormConfig, createMockStep } from '../test-utils';

describe('ConfigService', () => {
  let configService: ConfigService;
  
  beforeEach(() => {
    configService = new ConfigService(createMockFormConfig(2));
  });

  describe('basic operations', () => {
    test('should initialize with the provided configuration', () => {
      const config = configService.get();
      expect(config.steps.length).toBe(2);
      expect(config.steps[0].id).toBe('step1');
      expect(config.steps[1].id).toBe('step2');
    });

    test('should update configuration', () => {
      const newConfig = createMockFormConfig(3);
      configService.updateConfig(newConfig);
      
      const config = configService.get();
      expect(config.steps.length).toBe(3);
    });
  });

  describe('step operations', () => {
    test('should add a new step', () => {
      const newStep = createMockStep('step3');
      const newLength = configService.addStep(newStep);
      
      expect(newLength).toBe(3);
      expect(configService.get().steps[2].id).toBe('step3');
    });

    test('should add a step at specific index', () => {
      const newStep = createMockStep('stepX');
      configService.addStep(newStep, 1);
      
      const steps = configService.get().steps;
      expect(steps.length).toBe(3);
      expect(steps[0].id).toBe('step1');
      expect(steps[1].id).toBe('stepX');
      expect(steps[2].id).toBe('step2');
    });

    test('should remove a step', () => {
      const result = configService.removeStep('step1');
      
      expect(result).toBe(true);
      expect(configService.get().steps.length).toBe(1);
      expect(configService.get().steps[0].id).toBe('step2');
    });

    test('should return false when trying to remove non-existent step', () => {
      const result = configService.removeStep('non-existent');
      
      expect(result).toBe(false);
      expect(configService.get().steps.length).toBe(2);
    });
  });

  describe('step retrieval', () => {
    test('should get step by ID', () => {
      const step = configService.getStepById('step2');
      
      expect(step).toBeDefined();
      expect(step?.id).toBe('step2');
    });

    test('should return undefined for non-existent step ID', () => {
      const step = configService.getStepById('non-existent');
      
      expect(step).toBeUndefined();
    });

    test('should get step by index', () => {
      const step = configService.getStepByIndex(1);
      
      expect(step).toBeDefined();
      expect(step?.id).toBe('step2');
    });

    test('should return undefined for out-of-bounds index', () => {
      const step = configService.getStepByIndex(5);
      
      expect(step).toBeUndefined();
    });
  });

  describe('enhanced operations', () => {
    test('should update config and call reset callback', () => {
      const resetCallback = jest.fn();
      const newConfig = createMockFormConfig(1);
      
      configService.updateConfigAndReset(newConfig, resetCallback);
      
      expect(configService.get().steps.length).toBe(1);
      expect(resetCallback).toHaveBeenCalledTimes(1);
    });
  });
});
