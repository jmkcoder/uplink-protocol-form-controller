import { Field } from "./interfaces/field.interface";
import { FormConfig } from "./interfaces/form-config.interface";
import { FormStep } from "./interfaces/form-step.interface";
import { DynamicValidator } from "./utils/validator-registry";
import { 
  BaseService, 
  ConfigService, 
  FieldService, 
  FormService, 
  InteractionService, 
  StepperService,
  ValidatorService,
  FormManagerService,
  ConfigManagerService,
  NavigationManager,
  BindingManager
} from "./services";
import { TypedController } from "@uplink-protocol/core";

/**
 * FormControllerClass - A class for multi-step forms with dynamic configuration
 */
export class FormControllerClass implements TypedController {
  // Core Services
  private configService: ConfigService;
  private stepperService: StepperService;
  private formService: FormService;
  private fieldService: FieldService;
  private interactionService: InteractionService;
  private validatorService: ValidatorService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;
  
  // Manager Services
  private formManagerService: FormManagerService;
  private configManagerService: ConfigManagerService;
  private navigationManager: NavigationManager;
  private bindingManager: BindingManager;

  // State
  private initialFormData: Record<string, Record<string, any>>;
  private stepValidationState: Record<string, boolean>;

  // Controller with bindings and methods
  public bindings: any;
  public methods: any;

  /**
   * Constructor for the FormControllerClass
   * @param config - The form configuration with steps and field definitions
   */
  constructor(config: FormConfig) {
    // Initialize form data from config defaults or empty objects
    this.initialFormData = {};
    this.stepValidationState = {};
    
    // Initialize form data structure and step validation state
    config.steps.forEach((step: FormStep) => {
      this.initialFormData[step.id] = {};

      // Set initial field values
      Object.entries(step.fields).forEach(([fieldId, field]: [string, Field]) => {
        const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? "";
        this.initialFormData[step.id][fieldId] = defaultValue;
      });

      // Check if step has required fields - if yes, initial validation state is false
      // Otherwise, it can be valid by default
      const hasRequiredFields = Object.values(step.fields).some(
        (field) => field.required === true
      );
      this.stepValidationState[step.id] = !hasRequiredFields;
    });

    // Initialize services
    this.fieldErrorsService = new BaseService<Record<string, Record<string, string>>>({});
    this.stepsValidityService = new BaseService<Record<string, boolean>>(this.stepValidationState);
    
    this.configService = new ConfigService(config);
    this.stepperService = new StepperService(0, this.configService);
    this.formService = new FormService(
      this.initialFormData, 
      this.configService, 
      this.fieldErrorsService, 
      this.stepsValidityService
    );
    this.fieldService = new FieldService(
      this.configService, 
      this.formService, 
      this.fieldErrorsService, 
      this.stepsValidityService
    );    
    this.interactionService = new InteractionService(this.configService, this.fieldService);
    this.validatorService = new ValidatorService();
    
    // Initialize manager services
    this.formManagerService = new FormManagerService(
      this.formService,
      this.fieldService,
      this.interactionService,
      this.stepperService
    );
    
    this.configManagerService = new ConfigManagerService(
      this.configService,
      this.formService,
      this.fieldService,
      this.interactionService,
      this.fieldErrorsService,
      this.stepsValidityService,
      this.stepperService
    );    
    this.navigationManager = new NavigationManager(
      this.stepperService,
      this.configService,
      this.fieldService,
      this.interactionService
    );
    
    this.bindingManager = new BindingManager(
      this.configService,
      this.stepperService,
      this.formService,
      this.fieldErrorsService,
      this.stepsValidityService
    );
    
    // Use the bindings from the binding manager
    this.bindings = this.bindingManager.bindings;
    
    // Initialize methods
    this.initializeMethods();
    
    // Set step validity without showing error messages initially
    this.initializeStepValidation();
  }
  // The initializeBindings method has been refactored out and moved to the BindingManager service
  /**
   * Initialize the methods object with all controller functions
   */
  private initializeMethods(): void {
    const self = this;

    this.methods = {
      // Navigate to next step
      nextStep: () => {
        return self.navigationManager.goToNextWithValidation((newIndex, step) => {
          // Update the current values in the bindings for immediate test access
          self.bindings.currentStepIndex.current = newIndex;
          
          if (step) {
            self.bindings.currentStep.current = step;
          }
        });
      },

      // Navigate to previous step
      prevStep: () => {
        return self.navigationManager.goToPrevious((newIndex, step) => {
          // Update the current values in the bindings for immediate test access
          self.bindings.currentStepIndex.current = newIndex;
          
          if (step) {
            self.bindings.currentStep.current = step;
          }
        });
      },

      // Go to a specific step
      goToStep: (stepIndex: number) => {
        return self.navigationManager.goToSpecificStep(stepIndex, (newIndex, step) => {
          // Update the current values in the bindings for immediate test access
          self.bindings.currentStepIndex.current = newIndex;
          
          if (step) {
            self.bindings.currentStep.current = step;
          }
        });
      },

      // Update form data for a field
      updateField: (stepId: string, fieldId: string, value: any) => {
        self.formManagerService.updateFieldWithValidation(stepId, fieldId, value);
        
        // Update bindings to make sure the change is propagated
        self.bindings.formData.current = self.formService.get();
      },

      // Validate a single field
      validateField: (
        stepId: string,
        fieldId: string,
        value?: any,
        showErrors = true
      ) => {
        // Get the step and field
        const step = self.configService.getStepById(stepId);
        const field = step?.fields[fieldId];
        
        if (!step || !field) {
          return false;
        }
        
        // Validate the field
        const isValid = self.fieldService.validateField(stepId, fieldId, value, showErrors);
        
        // Ensure current errors are updated in the binding
        if (!isValid && showErrors) {
          // Get the current errors from the service
          const errors = self.fieldErrorsService.get();
          
          // Make sure we have the error structure
          if (!errors[stepId]) {
            errors[stepId] = {};
          }
          
          // If there's no error message yet, create one
          if (!errors[stepId][fieldId]) {
            errors[stepId][fieldId] = `${field.label} is required`;
          }
          
          // Update the current binding value for immediate access in tests
          self.bindings.fieldErrors.current = { ...errors };
        }
        
        return isValid;
      },

      // Validate an entire step
      validateStep: (stepId: string, showErrors = true) => {
        return self.fieldService.validateStep(stepId, showErrors);
      },

      // Validate the current step
      validateCurrentStep: (showErrors = true) => {
        const currentStep = self.bindings.currentStep.current;
        return self.fieldService.validateStep(currentStep.id, showErrors);
      },

      // Validate the current step showing errors only for touched fields
      validateCurrentStepWithTouchedErrors: () => {
        const currentStep = self.bindings.currentStep.current;
        return self.interactionService.validateStepWithTouchedErrors(currentStep.id);
      },

      // Validate a step showing errors only for touched fields
      validateStepWithTouchedErrors: (stepId: string) => {
        return self.interactionService.validateStepWithTouchedErrors(stepId);
      },

      // Validate all steps
      validateForm: (showErrors = true) => {
        return self.fieldService.validateForm(showErrors);
      },

      // Submit the form
      submitForm: () => {
        return self.formManagerService.submitFormWithValidation(true);
      },

      // Reset the entire form
      resetForm: () => {
        self.formManagerService.resetFormCompletely();
        
        // Update the current values in bindings
        self.bindings.formData.current = self.formService.get();
      },      // Update form configuration (useful for dynamic forms)
      updateConfig: (newConfig: FormConfig) => {
        // Use the streamlined manager service method to update config and reset all state
        self.configManagerService.updateConfigWithFullReset(newConfig);
        
        // Update the current values in bindings
        self.bindings.config.current = newConfig;
        self.bindings.totalSteps.current = newConfig.steps.length;
      },

      // Get form data for a specific step
      getStepData: (stepId: string) => {
        return self.formService.getStepData(stepId);
      },

      // Get all form data
      getAllData: () => {
        return self.formService.getAllData();
      },

      // Get flattened form data (merged from all steps)
      getFlatData: () => {
        return self.formService.getFlatData();
      },

      // Add a new step dynamically
      addStep: (step: FormStep, index?: number) => {
        const newLength = self.configManagerService.addStepWithFormData(step, index);
        
        // Update current values in bindings
        self.bindings.config.current = self.configService.get();
        self.bindings.totalSteps.current = newLength;
        self.bindings.formData.current = self.formService.get();
        
        return newLength;
      },

      // Remove a step dynamically
      removeStep: (stepId: string) => {
        const result = self.configManagerService.removeStepWithCleanup(stepId);
          if (result) {
          // Update bindings
          self.bindings.config.current = self.configService.get();
          self.bindings.totalSteps.current = self.configService.get().steps.length;
          self.bindings.formData.current = self.formService.get();
          self.bindings.fieldErrors.current = self.fieldErrorsService.get();
        }
        
        return result;
      },

      // Register a dynamic validator
      registerValidator: (name: string, validatorFn: DynamicValidator) => {
        self.validatorService.registerValidator(name, validatorFn);
      },

      // Unregister a dynamic validator
      unregisterValidator: (name: string): boolean => {
        return self.validatorService.unregisterValidator(name);
      },

      // Get a list of all available validators (built-in + custom)
      getAvailableValidators: () => {
        return self.validatorService.getAvailableValidators();
      },
    };
  }

  /**
   * Initialize step validation without showing error messages
   */
  private initializeStepValidation(): void {
    const config = this.configService.get();
    
    config.steps.forEach((step) => {
      // Check if the step has required fields that are empty
      const hasRequiredEmptyFields = Object.entries(step.fields).some(
        ([fieldId, field]) => {
          if (field.required || (field.validation && field.validation.required)) {
            const value = this.initialFormData[step.id]?.[fieldId];
            const isEmpty = field.type === "checkbox" ? value === false : !value;
            return isEmpty;
          }
          return false;
        }
      );

      // Update step validity state without showing error messages
      if (hasRequiredEmptyFields) {
        const validity = { ...this.stepsValidityService.get() };
        validity[step.id] = false;
        this.stepsValidityService.set(validity);
      }
    });
  }
}

/**
 * FormController - Factory function that creates and returns a new FormControllerClass instance.
 * 
 * @param config - The form configuration with steps and field definitions
 * @returns A FormControllerClass instance
 */
export const FormController = (config: FormConfig): FormControllerClass => {
  return new FormControllerClass(config);
}