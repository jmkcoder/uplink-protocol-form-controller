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

/**
 * DynamicFormStepperController - A controller for multi-step forms with dynamic configuration
 * @param config - The form configuration with steps and field definitions
 * @returns A controller instance with bindings and methods for form state management
 */
export const FormController = (config: FormConfig) => {
  // Initialize form data from config defaults or empty objects
  const initialFormData: Record<string, Record<string, any>> = {};
  const stepValidationState: Record<string, boolean> = {};
  
  // Initialize form data structure and step validation state
  config.steps.forEach((step: FormStep) => {
    initialFormData[step.id] = {};

    // Set initial field values
    Object.entries(step.fields).forEach(([fieldId, field]: [string, Field]) => {
      const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? "";
      initialFormData[step.id][fieldId] = defaultValue;
    });

    // Check if step has required fields - if yes, initial validation state is false
    // Otherwise, it can be valid by default
    const hasRequiredFields = Object.values(step.fields).some(
      (field) => field.required === true
    );
    stepValidationState[step.id] = !hasRequiredFields;
  });

  // Initialize services
  const fieldErrorsService = new BaseService<Record<string, Record<string, string>>>({});
  const stepsValidityService = new BaseService<Record<string, boolean>>(stepValidationState);
  
  const configService = new ConfigService(config);
  const stepperService = new StepperService(0, configService);
  const formService = new FormService(
    initialFormData, 
    configService, 
    fieldErrorsService, 
    stepsValidityService
  );
  const fieldService = new FieldService(
    configService, 
    formService, 
    fieldErrorsService, 
    stepsValidityService
  );
  
  const interactionService = new InteractionService(configService, fieldService);
  const validatorService = new ValidatorService();

  // Initialize controller with reactive bindings system
  const controller = {
    bindings: {
      // Form configuration
      config: {
        current: config,
        _callbacks: [] as ((value: FormConfig) => void)[],
        subscribe: function (callback: (value: FormConfig) => void) {
          return configService.subscribe(callback);
        },
        set: function (value: FormConfig) {
          configService.set(value);
        },
      },

      // Track the current step index
      currentStepIndex: {
        current: 0,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function (callback: (value: number) => void) {
          return stepperService.subscribe(callback);
        },
        set: function (value: number) {
          stepperService.set(value);
        },
      },

      // Current step object
      currentStep: {
        current: config.steps[0],
        _callbacks: [] as ((value: FormStep) => void)[],
        subscribe: function (callback: (value: FormStep) => void) {
          // Create a computed property that depends on both currentStepIndex and config
          const unsubscribeIndex = stepperService.subscribe((stepIndex) => {
            const currentStep = configService.getStepByIndex(stepIndex);
            if (currentStep) {
              callback(currentStep);
              this.current = currentStep;
            }
          });

          // Also listen for config changes
          const unsubscribeConfig = configService.subscribe((newConfig) => {
            const currentStep = newConfig.steps[stepperService.get()];
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
        current: initialFormData,
        _callbacks: [] as ((
          value: Record<string, Record<string, any>>
        ) => void)[],
        subscribe: function (
          callback: (value: Record<string, Record<string, any>>) => void
        ) {
          return formService.subscribe(callback);
        },
        set: function (value: Record<string, Record<string, any>>) {
          formService.set(value);
        },
      },

      // Track step validity
      stepsValidity: {
        current: stepValidationState,
        _callbacks: [] as ((value: Record<string, boolean>) => void)[],
        subscribe: function (
          callback: (value: Record<string, boolean>) => void
        ) {
          return stepsValidityService.subscribe(callback);
        },
        set: function (value: Record<string, boolean>) {
          stepsValidityService.set(value);
        },
      },

      // Current step validity
      isCurrentStepValid: {
        current: false,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function (callback: (value: boolean) => void) {
          // Don't show validation errors on initial load
          // But still run validation to get correctness
          controller.methods.validateCurrentStep(false);

          // Setup subscriptions to dependencies for this computed property
          const unsubscribeStep = controller.bindings.currentStep.subscribe((step) => {
            const stepValid = stepsValidityService.get()[step.id] || false;
            callback(stepValid);
            this.current = stepValid;
          });

          const unsubscribeValidity = stepsValidityService.subscribe((validityMap) => {
            const currentStep = controller.bindings.currentStep.current;
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
          return fieldErrorsService.subscribe(callback);
        },
        set: function (value: Record<string, Record<string, string>>) {
          fieldErrorsService.set(value);
        },
      },

      // Computed: Total number of steps
      totalSteps: {
        current: config.steps.length,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function (callback: (value: number) => void) {
          // Update when config changes
          const unsubscribe = configService.subscribe((newConfig) => {
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
            return stepperService.isLastStep;
          };

          // Update when dependencies change
          const unsubscribeIndex = stepperService.subscribe(() => {
            const isLast = computeIsLast();
            callback(isLast);
            this.current = isLast;
          });

          const unsubscribeTotal = controller.bindings.totalSteps.subscribe(() => {
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
          const unsubscribe = stepperService.subscribe(() => {
            const isFirst = stepperService.isFirstStep;
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
            const allSteps = configService.get().steps;
            const validityMap = stepsValidityService.get();
            return allSteps.every((step) => validityMap[step.id] === true);
          };

          // Update when dependencies change
          const unsubscribeValidity = stepsValidityService.subscribe(() => {
            const formValid = calculateFormValidity();
            callback(formValid);
            this.current = formValid;
          });

          const unsubscribeConfig = configService.subscribe(() => {
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
    },

    methods: {
      // Navigate to next step
      nextStep: () => {
        const currentStep = controller.bindings.currentStep.current;
        
        // Mark all fields in the current step as touched to show all validation errors
        interactionService.markAllFieldsInStepTouched(currentStep.id, true);

        // Force validation just before navigation attempt with error display
        const currentStepValid = controller.methods.validateCurrentStep(true);

        // Only proceed if current step is valid
        if (currentStepValid) {
          const currentIndex = controller.bindings.currentStepIndex.current;
          const newIndex = currentIndex + 1;
          
          if (newIndex < configService.get().steps.length) {
            stepperService.set(newIndex);
            
            // Also update the current values in the bindings for immediate test access
            controller.bindings.currentStepIndex.current = newIndex;
            
            const step = configService.getStepByIndex(newIndex);
            if (step) {
              controller.bindings.currentStep.current = step;
            }
            
            return newIndex;
          }
        }
        
        return controller.bindings.currentStepIndex.current;
      },

      // Navigate to previous step
      prevStep: () => {
        const currentIndex = controller.bindings.currentStepIndex.current;
        
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          stepperService.set(newIndex);
          
          // Also update the current values in the bindings for immediate test access
          controller.bindings.currentStepIndex.current = newIndex;
          
          const step = configService.getStepByIndex(newIndex);
          if (step) {
            controller.bindings.currentStep.current = step;
          }
          
          return newIndex;
        }
        
        return currentIndex;
      },

      // Go to a specific step
      goToStep: (stepIndex: number) => {
        const result = stepperService.goToStep(stepIndex);
        
        // Also update the current values in the bindings for immediate test access
        if (result) {
          controller.bindings.currentStepIndex.current = stepIndex;
          
          const step = configService.getStepByIndex(stepIndex);
          if (step) {
            controller.bindings.currentStep.current = step;
          }
        }
        
        return result;
      },

      // Update form data for a field
      updateField: (stepId: string, fieldId: string, value: any) => {
        // Update the field value in formData
        const formData = { ...formService.get() };
        if (!formData[stepId]) {
          formData[stepId] = {};
        }
        formData[stepId][fieldId] = value;
        formService.set(formData);
        
        // Update bindings to make sure the change is propagated
        controller.bindings.formData.current = formData;

        // Mark this field as touched
        interactionService.markFieldTouched(stepId, fieldId, true);

        // Validate only the current field and show its errors
        fieldService.validateField(stepId, fieldId, value, true);

        // Validate the step with showing errors only for touched fields
        interactionService.validateStepWithTouchedErrors(stepId);
      },

      // Validate a single field
      validateField: (
        stepId: string,
        fieldId: string,
        value?: any,
        showErrors = true
      ) => {
        // Get the step and field
        const step = configService.getStepById(stepId);
        const field = step?.fields[fieldId];
        
        if (!step || !field) {
          return false;
        }
        
        // Validate the field
        const isValid = fieldService.validateField(stepId, fieldId, value, showErrors);
        
        // Ensure current errors are updated in the binding
        if (!isValid && showErrors) {
          // Get the current errors from the service
          const errors = fieldErrorsService.get();
          
          // Make sure we have the error structure
          if (!errors[stepId]) {
            errors[stepId] = {};
          }
          
          // If there's no error message yet, create one
          if (!errors[stepId][fieldId]) {
            errors[stepId][fieldId] = `${field.label} is required`;
          }
          
          // Update the current binding value for immediate access in tests
          controller.bindings.fieldErrors.current = { ...errors };
        }
        
        return isValid;
      },

      // Validate an entire step
      validateStep: (stepId: string, showErrors = true) => {
        return fieldService.validateStep(stepId, showErrors);
      },

      // Validate the current step
      validateCurrentStep: (showErrors = true) => {
        const currentStep = controller.bindings.currentStep.current;
        return fieldService.validateStep(currentStep.id, showErrors);
      },

      // Validate the current step showing errors only for touched fields
      validateCurrentStepWithTouchedErrors: () => {
        const currentStep = controller.bindings.currentStep.current;
        return interactionService.validateStepWithTouchedErrors(currentStep.id);
      },

      // Validate a step showing errors only for touched fields
      validateStepWithTouchedErrors: (stepId: string) => {
        return interactionService.validateStepWithTouchedErrors(stepId);
      },

      // Validate all steps
      validateForm: (showErrors = true) => {
        return fieldService.validateForm(showErrors);
      },

      // Submit the form
      submitForm: () => {
        // Use the formService's enhanced submitForm method
        return formService.submitForm(
          // Function to mark all fields touched and validate
          () => {
            interactionService.markAllFieldsTouched(true);
            return controller.methods.validateForm(true);
          },
          // Function to find the first invalid step
          () => {
            const validity = stepsValidityService.get();
            const config = configService.get();
            return config.steps.findIndex((step) => !validity[step.id]);
          },
          // Function to navigate to a step
          (index: number) => {
            if (index !== -1 && index !== stepperService.get()) {
              stepperService.set(index);
            }
          }
        );
      },

      // Reset the entire form
      resetForm: () => {
        // Reset touch tracking
        interactionService.resetTouchTracking();
        
        // Reset form data to defaults
        const config = configService.get();
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
        formService.set(initialFormData);
        
        // Update the current values in bindings
        controller.bindings.formData.current = initialFormData;
        
        // Re-validate without showing errors
        controller.methods.validateForm(false);
      },

      // Update form configuration (useful for dynamic forms)
      updateConfig: (newConfig: FormConfig) => {
        // First update the config service
        configService.set(newConfig);
        
        // Update the current value in bindings
        controller.bindings.config.current = newConfig;
        controller.bindings.totalSteps.current = newConfig.steps.length;
        
        // Reset form and touch tracking
        interactionService.resetTouchTracking();
        formService.resetForm();
        controller.methods.validateForm(false);
      },

      // Get form data for a specific step
      getStepData: (stepId: string) => {
        return formService.getStepData(stepId);
      },

      // Get all form data
      getAllData: () => {
        return formService.getAllData();
      },

      // Get flattened form data (merged from all steps)
      getFlatData: () => {
        return formService.getFlatData();
      },

      // Add a new step dynamically
      addStep: (step: FormStep, index?: number) => {
        // Get the current config and steps
        const config = configService.get();
        const steps = [...config.steps];
        
        // Add the new step at the specified index or at the end
        if (index !== undefined && index >= 0 && index <= steps.length) {
          steps.splice(index, 0, step);
        } else {
          steps.push(step);
        }
        
        // Update the config
        const newConfig = { ...config, steps };
        configService.set(newConfig);
        
        // Update current values in bindings
        controller.bindings.config.current = newConfig;
        controller.bindings.totalSteps.current = steps.length;
        
        // Initialize form data for the new step
        const formData = { ...formService.get() };
        formData[step.id] = {};
        
        Object.entries(step.fields).forEach(([fieldId, field]) => {
          const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? "";
          formData[step.id][fieldId] = defaultValue;
        });

        formService.set(formData);
        controller.bindings.formData.current = formData;
        
        // Validate the new step immediately (without showing errors)
        fieldService.validateStep(step.id, false);

        return steps.length;
      },

      // Remove a step dynamically
      removeStep: (stepId: string) => {
        // Get the current config and find the step to remove
        const config = configService.get();
        const stepIndex = config.steps.findIndex(step => step.id === stepId);
        
        if (stepIndex === -1) {
          return false;
        }
        
        // Create a new steps array without the removed step
        const steps = config.steps.filter(step => step.id !== stepId);
        
        // Update the config
        const newConfig = { ...config, steps };
        configService.set(newConfig);
        
        // Update bindings
        controller.bindings.config.current = newConfig;
        controller.bindings.totalSteps.current = steps.length;

        // Remove step data from form
        const formData = { ...formService.get() };
        delete formData[stepId];
        formService.set(formData);
        controller.bindings.formData.current = formData;

        // Remove step validity
        const validity = { ...stepsValidityService.get() };
        delete validity[stepId];
        stepsValidityService.set(validity);

        // Remove step errors
        const errors = { ...fieldErrorsService.get() };
        delete errors[stepId];
        fieldErrorsService.set(errors);
        controller.bindings.fieldErrors.current = errors;

        // Adjust current step index if needed
        const currentIndex = stepperService.get();
        if (currentIndex >= steps.length) {
          stepperService.set(Math.max(0, steps.length - 1));
        }

        return true;
      },

      // Register a dynamic validator
      registerValidator: (name: string, validatorFn: DynamicValidator) => {
        validatorService.registerValidator(name, validatorFn);
      },

      // Unregister a dynamic validator
      unregisterValidator: (name: string): boolean => {
        return validatorService.unregisterValidator(name);
      },

      // Get a list of all available validators (built-in + custom)
      getAvailableValidators: () => {
        return validatorService.getAvailableValidators();
      },
    },
  };

  // Set step validity without showing error messages initially
  config.steps.forEach((step) => {
    // Check if the step has required fields that are empty
    const hasRequiredEmptyFields = Object.entries(step.fields).some(
      ([fieldId, field]) => {
        if (field.required || (field.validation && field.validation.required)) {
          const value = initialFormData[step.id]?.[fieldId];
          const isEmpty = field.type === "checkbox" ? value === false : !value;
          return isEmpty;
        }
        return false;
      }
    );

    // Update step validity state without showing error messages
    if (hasRequiredEmptyFields) {
      const validity = { ...stepsValidityService.get() };
      validity[step.id] = false;
      stepsValidityService.set(validity);
    }
  });

  return controller;
};