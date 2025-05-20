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
  ValidatorService
} from "./services";
import { TypedController } from "@uplink-protocol/core";

/**
 * FormControllerClass - A class for multi-step forms with dynamic configuration
 */
export class FormControllerClass implements TypedController {
  // Services
  private configService: ConfigService;
  private stepperService: StepperService;
  private formService: FormService;
  private fieldService: FieldService;
  private interactionService: InteractionService;
  private validatorService: ValidatorService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;

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

    // Initialize controller
    this.initializeBindings(config);
    this.initializeMethods();
    
    // Set step validity without showing error messages initially
    this.initializeStepValidation();
  }

  /**
   * Initialize the reactive bindings system
   */
  private initializeBindings(config: FormConfig): void {
    const self = this;

    this.bindings = {
      // Form configuration
      config: {
        current: config,
        _callbacks: [] as ((value: FormConfig) => void)[],
        subscribe: function (callback: (value: FormConfig) => void) {
          return self.configService.subscribe(callback);
        },
        set: function (value: FormConfig) {
          self.configService.set(value);
          console.log("Config updated:", value);
        },
      },

      // Track the current step index
      currentStepIndex: {
        current: 0,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function (callback: (value: number) => void) {
          return self.stepperService.subscribe(callback);
        },
        set: function (value: number) {
          self.stepperService.set(value);
        },
      },

      // Current step object
      currentStep: {
        current: config.steps[0],
        _callbacks: [] as ((value: FormStep) => void)[],
        subscribe: function (callback: (value: FormStep) => void) {
          // Create a computed property that depends on both currentStepIndex and config
          const unsubscribeIndex = self.stepperService.subscribe((stepIndex) => {
            const currentStep = self.configService.getStepByIndex(stepIndex);
            if (currentStep) {
              callback(currentStep);
              this.current = currentStep;
            }
          });

          // Also listen for config changes
          const unsubscribeConfig = self.configService.subscribe((newConfig) => {
            const currentStep = newConfig.steps[self.stepperService.get()];
            if (currentStep) {
              callback(currentStep);
              this.current = currentStep;
            }
          });

          // Initialize with current value
          callback(this.current);

          return () => {
            unsubscribeIndex();
            unsubscribeConfig();
          };
        },
        set: function () {
          // This is a computed property, so setting directly does nothing
          console.warn(
            "Cannot directly set currentStep as it's computed from currentStepIndex"
          );
        },
      },

      // Form data for all steps
      formData: {
        current: self.initialFormData,
        _callbacks: [] as ((
          value: Record<string, Record<string, any>>
        ) => void)[],
        subscribe: function (
          callback: (value: Record<string, Record<string, any>>) => void
        ) {
          return self.formService.subscribe(callback);
        },
        set: function (value: Record<string, Record<string, any>>) {
          self.formService.set(value);
        },
      },

      // Track step validity
      stepsValidity: {
        current: self.stepValidationState,
        _callbacks: [] as ((value: Record<string, boolean>) => void)[],
        subscribe: function (
          callback: (value: Record<string, boolean>) => void
        ) {
          return self.stepsValidityService.subscribe(callback);
        },
        set: function (value: Record<string, boolean>) {
          self.stepsValidityService.set(value);
        },
      },

      // Current step validity
      isCurrentStepValid: {
        current: false,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function (callback: (value: boolean) => void) {
          // Don't show validation errors on initial load
          // But still run validation to get correctness
          self.methods.validateCurrentStep(false);

          // Setup subscriptions to dependencies for this computed property
          const unsubscribeStep = self.bindings.currentStep.subscribe((step: FormStep) => {
            const stepValid = self.stepsValidityService.get()[step.id] || false;
            callback(stepValid);
            this.current = stepValid;
          });

          const unsubscribeValidity = self.stepsValidityService.subscribe((validityMap) => {
            const currentStep = self.bindings.currentStep.current;
            const stepValid = validityMap[currentStep.id] || false;
            callback(stepValid);
            this.current = stepValid;
          });

          return () => {
            unsubscribeStep();
            unsubscribeValidity();
          };
        },
        set: function () {
          // This is a computed property, so setting directly does nothing
          console.warn(
            "Cannot directly set isCurrentStepValid as it's computed"
          );
        },
      },

      // Field-level validation errors
      fieldErrors: {
        current: {} as Record<string, Record<string, string>>,
        _callbacks: [] as ((
          value: Record<string, Record<string, string>>
        ) => void)[],
        subscribe: function (
          callback: (value: Record<string, Record<string, string>>) => void
        ) {
          return self.fieldErrorsService.subscribe(callback);
        },
        set: function (value: Record<string, Record<string, string>>) {
          self.fieldErrorsService.set(value);
        },
      },

      // Computed: Total number of steps
      totalSteps: {
        current: config.steps.length,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function (callback: (value: number) => void) {
          // Update when config changes
          const unsubscribe = self.configService.subscribe((newConfig) => {
            const stepsCount = newConfig.steps.length;
            callback(stepsCount);
            this.current = stepsCount;
          });

          // Initialize with current value
          callback(this.current);
          
          return unsubscribe;
        },
        set: function () {
          // This is a computed property, so setting it directly does nothing
          console.warn(
            "Cannot directly set totalSteps as it's computed from config"
          );
        },
      },

      // Computed: Check if we're on the last step
      isLastStep: {
        current: config.steps.length === 1,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function (callback: (value: boolean) => void) {
          const computeIsLast = () => {
            return self.stepperService.isLastStep;
          };

          // Update when dependencies change
          const unsubscribeIndex = self.stepperService.subscribe(() => {
            const isLast = computeIsLast();
            callback(isLast);
            this.current = isLast;
          });

          const unsubscribeTotal = self.bindings.totalSteps.subscribe(() => {
            const isLast = computeIsLast();
            callback(isLast);
            this.current = isLast;
          });

          // Initialize with current value
          callback(this.current);

          return () => {
            unsubscribeIndex();
            unsubscribeTotal();
          };
        },
        set: function () {
          // This is a computed property, so setting directly does nothing
        },
      },

      // Computed: Check if we're on the first step
      isFirstStep: {
        current: true,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function (callback: (value: boolean) => void) {
          // Update when stepIndex changes
          const unsubscribe = self.stepperService.subscribe(() => {
            const isFirst = self.stepperService.isFirstStep;
            callback(isFirst);
            this.current = isFirst;
          });

          // Initialize with current value
          callback(this.current);

          return unsubscribe;
        },
        set: function () {
          // This is a computed property, so setting directly does nothing
        },
      },

      // Overall form validity
      isFormValid: {
        current: false,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function (callback: (value: boolean) => void) {
          const calculateFormValidity = () => {
            const allSteps = self.configService.get().steps;
            const validityMap = self.stepsValidityService.get();
            return allSteps.every((step) => validityMap[step.id] === true);
          };

          // Update when dependencies change
          const unsubscribeValidity = self.stepsValidityService.subscribe(() => {
            const formValid = calculateFormValidity();
            callback(formValid);
            this.current = formValid;
          });

          const unsubscribeConfig = self.configService.subscribe(() => {
            const formValid = calculateFormValidity();
            callback(formValid);
            this.current = formValid;
          });

          // Initialize with current value
          const isValid = calculateFormValidity();
          this.current = isValid;
          callback(isValid);

          return () => {
            unsubscribeValidity();
            unsubscribeConfig();
          };
        },
        set: function () {
          // This is a computed property, so setting directly does nothing
        },
      },
    };
  }

  /**
   * Initialize the methods object with all controller functions
   */
  private initializeMethods(): void {
    const self = this;

    this.methods = {
      // Navigate to next step
      nextStep: () => {
        const currentStep = self.bindings.currentStep.current;
        
        // Mark all fields in the current step as touched to show all validation errors
        self.interactionService.markAllFieldsInStepTouched(currentStep.id, true);

        // Force validation just before navigation attempt with error display
        const currentStepValid = self.methods.validateCurrentStep(true);

        // Only proceed if current step is valid
        if (currentStepValid) {
          const currentIndex = self.bindings.currentStepIndex.current;
          const newIndex = currentIndex + 1;
          
          if (newIndex < self.configService.get().steps.length) {
            self.stepperService.set(newIndex);
            
            // Also update the current values in the bindings for immediate test access
            self.bindings.currentStepIndex.current = newIndex;
            
            const step = self.configService.getStepByIndex(newIndex);
            if (step) {
              self.bindings.currentStep.current = step;
            }
            
            return newIndex;
          }
        }
        
        return self.bindings.currentStepIndex.current;
      },

      // Navigate to previous step
      prevStep: () => {
        const currentIndex = self.bindings.currentStepIndex.current;
        
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          self.stepperService.set(newIndex);
          
          // Also update the current values in the bindings for immediate test access
          self.bindings.currentStepIndex.current = newIndex;
          
          const step = self.configService.getStepByIndex(newIndex);
          if (step) {
            self.bindings.currentStep.current = step;
          }
          
          return newIndex;
        }
        
        return currentIndex;
      },

      // Go to a specific step
      goToStep: (stepIndex: number) => {
        const result = self.stepperService.goToStep(stepIndex);
        
        // Also update the current values in the bindings for immediate test access
        if (result) {
          self.bindings.currentStepIndex.current = stepIndex;
          
          const step = self.configService.getStepByIndex(stepIndex);
          if (step) {
            self.bindings.currentStep.current = step;
          }
        }
        
        return result;
      },

      // Update form data for a field
      updateField: (stepId: string, fieldId: string, value: any) => {
        // Update the field value in formData
        const formData = { ...self.formService.get() };
        if (!formData[stepId]) {
          formData[stepId] = {};
        }
        formData[stepId][fieldId] = value;
        self.formService.set(formData);
        
        // Update bindings to make sure the change is propagated
        self.bindings.formData.current = formData;

        // Mark this field as touched
        self.interactionService.markFieldTouched(stepId, fieldId, true);

        // Validate only the current field and show its errors
        self.fieldService.validateField(stepId, fieldId, value, true);

        // Validate the step with showing errors only for touched fields
        self.interactionService.validateStepWithTouchedErrors(stepId);
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
        // Use the formService's enhanced submitForm method
        return self.formService.submitForm(
          // Function to mark all fields touched and validate
          () => {
            self.interactionService.markAllFieldsTouched(true);
            return self.methods.validateForm(true);
          },
          // Function to find the first invalid step
          () => {
            const validity = self.stepsValidityService.get();
            const config = self.configService.get();
            return config.steps.findIndex((step) => !validity[step.id]);
          },
          // Function to navigate to a step
          (index: number) => {
            if (index !== -1 && index !== self.stepperService.get()) {
              self.stepperService.set(index);
            }
          }
        );
      },

      // Reset the entire form
      resetForm: () => {
        // Reset touch tracking
        self.interactionService.resetTouchTracking();
        
        // Reset form data to defaults
        const config = self.configService.get();
        const initialFormData: Record<string, Record<string, any>> = {};
  
        // Initialize form data structure with default values
        config.steps.forEach((step: FormStep) => {
          initialFormData[step.id] = {};
    
          // Set initial field values
          Object.entries(step.fields).forEach(([fieldId, field]: [string, Field]) => {
            const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? "";
            initialFormData[step.id][fieldId] = defaultValue;
          });
        });
        
        // Set the form data
        self.formService.set(initialFormData);
        
        // Update the current values in bindings
        self.bindings.formData.current = initialFormData;
        
        // Re-validate without showing errors
        self.methods.validateForm(false);
      },

      // Update form configuration (useful for dynamic forms)
      updateConfig: (newConfig: FormConfig) => {
        // First update the config service
        self.configService.set(newConfig);
        
        // Update the current value in bindings
        self.bindings.config.current = newConfig;
        self.bindings.totalSteps.current = newConfig.steps.length;
        
        // Reset form and touch tracking
        self.interactionService.resetTouchTracking();
        self.formService.resetForm();
        self.methods.validateForm(false);
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
        // Get the current config and steps
        const config = self.configService.get();
        const steps = [...config.steps];
        
        // Add the new step at the specified index or at the end
        if (index !== undefined && index >= 0 && index <= steps.length) {
          steps.splice(index, 0, step);
        } else {
          steps.push(step);
        }
        
        // Update the config
        const newConfig = { ...config, steps };
        self.configService.set(newConfig);
        
        // Update current values in bindings
        self.bindings.config.current = newConfig;
        self.bindings.totalSteps.current = steps.length;
        
        // Initialize form data for the new step
        const formData = { ...self.formService.get() };
        formData[step.id] = {};
        
        Object.entries(step.fields).forEach(([fieldId, field]) => {
          const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? "";
          formData[step.id][fieldId] = defaultValue;
        });

        self.formService.set(formData);
        self.bindings.formData.current = formData;
        
        // Validate the new step immediately (without showing errors)
        self.fieldService.validateStep(step.id, false);

        return steps.length;
      },

      // Remove a step dynamically
      removeStep: (stepId: string) => {
        // Get the current config and find the step to remove
        const config = self.configService.get();
        const stepIndex = config.steps.findIndex(step => step.id === stepId);
        
        if (stepIndex === -1) {
          return false;
        }
        
        // Create a new steps array without the removed step
        const steps = config.steps.filter(step => step.id !== stepId);
        
        // Update the config
        const newConfig = { ...config, steps };
        self.configService.set(newConfig);
        
        // Update bindings
        self.bindings.config.current = newConfig;
        self.bindings.totalSteps.current = steps.length;

        // Remove step data from form
        const formData = { ...self.formService.get() };
        delete formData[stepId];
        self.formService.set(formData);
        self.bindings.formData.current = formData;

        // Remove step validity
        const validity = { ...self.stepsValidityService.get() };
        delete validity[stepId];
        self.stepsValidityService.set(validity);

        // Remove step errors
        const errors = { ...self.fieldErrorsService.get() };
        delete errors[stepId];
        self.fieldErrorsService.set(errors);
        self.bindings.fieldErrors.current = errors;

        // Adjust current step index if needed
        const currentIndex = self.stepperService.get();
        if (currentIndex >= steps.length) {
          self.stepperService.set(Math.max(0, steps.length - 1));
        }

        return true;
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