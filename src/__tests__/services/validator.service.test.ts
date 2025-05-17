import { ValidatorService } from '../../services/validator.service';
import { DynamicValidator } from '../../utils/validator-registry';

// Mock the validator-registry module
jest.mock('../../utils/validator-registry', () => {
  // Save original
  const originalModule = jest.requireActual('../../utils/validator-registry');
  
  return {
    __esModule: true,
    ...originalModule,
    registerValidator: jest.fn(),
    unregisterValidator: jest.fn().mockReturnValue(true),
    predefinedValidators: ['required', 'email', 'minLength']
  };
});

describe('ValidatorService', () => {
  let validatorService: ValidatorService;
  
  beforeEach(() => {
    validatorService = new ValidatorService();
    
    // Clear mock calls between tests
    const { registerValidator, unregisterValidator } = require('../../utils/validator-registry');
    registerValidator.mockClear();
    unregisterValidator.mockClear();
  });

  test('should register a validator', () => {
    const { registerValidator } = require('../../utils/validator-registry');
    const validatorFn: DynamicValidator = (value) => value ? true : 'Error';
    
    validatorService.registerValidator('testValidator', validatorFn);
    
    expect(registerValidator).toHaveBeenCalledWith('testValidator', validatorFn);
  });

  test('should unregister a validator', () => {
    const { unregisterValidator } = require('../../utils/validator-registry');
    
    const result = validatorService.unregisterValidator('testValidator');
    
    expect(unregisterValidator).toHaveBeenCalledWith('testValidator');
    expect(result).toBe(true);
  });

  test('should get available validators', () => {
    const validators = validatorService.getAvailableValidators();
    
    expect(validators).toEqual(['required', 'email', 'minLength']);
  });
});
