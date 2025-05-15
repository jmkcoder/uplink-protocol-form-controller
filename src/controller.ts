import { Field, FormConfig, FormStep } from "./interfaces/field.interface";
import { validateField } from "./utils/validator";
import { DynamicValidator } from "./utils/validator-registry";

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
  config.steps.forEach(step => {
    initialFormData[step.id] = {};
    
    // Set initial field values
    Object.entries(step.fields).forEach(([fieldId, field]) => {
      const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? '';
      initialFormData[step.id][fieldId] = defaultValue;
    });
    
    // Check if step has required fields - if yes, initial validation state is false
    // Otherwise, it can be valid by default
    const hasRequiredFields = Object.values(step.fields).some(field => field.required === true);
    stepValidationState[step.id] = !hasRequiredFields;
  });
  
  // Initialize controller with reactive bindings system
  const controller = {
    bindings: {
      // Form configuration
      config: {
        current: config,
        _callbacks: [] as ((value: FormConfig) => void)[],
        subscribe: function(callback: (value: FormConfig) => void) {
          this._callbacks.push(callback);
          // Immediately invoke with current value
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: FormConfig) {
          this.current = value;
          if (this._callbacks && this._callbacks.length) {
            this._callbacks.forEach(callback => callback(value));
          }
        }
      },
      
      // Track the current step index
      currentStepIndex: {
        current: 0,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function(callback: (value: number) => void) {
          this._callbacks.push(callback);
          // Immediately invoke with current value
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: number) {
          this.current = value;
          if (this._callbacks && this._callbacks.length) {
            this._callbacks.forEach(callback => callback(value));
          }
        }
      },
      
      // Current step object
      currentStep: {
        current: config.steps[0],
        _callbacks: [] as ((value: FormStep) => void)[],
        subscribe: function(callback: (value: FormStep) => void) {
          // Capture currentStepIndex binding for dependency tracking
          const currentStepIndexBinding = controller.bindings.currentStepIndex;
          const configBinding = controller.bindings.config;
          
          this._callbacks.push(callback);
          
          // Initialize with current value
          callback(this.current);
          
          // Update when either currentStepIndex or config changes
          const unsubscribeIndex = currentStepIndexBinding.subscribe(stepIndex => {
            this.current = configBinding.current.steps[stepIndex];
            callback(this.current);
          });
          
          const unsubscribeConfig = configBinding.subscribe(newConfig => {
            this.current = newConfig.steps[currentStepIndexBinding.current];
            callback(this.current);
          });
          
          return () => {
            unsubscribeIndex();
            unsubscribeConfig();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: FormStep) {
          // This is a computed property, so setting directly does nothing
          console.warn("Cannot directly set currentStep as it's computed from currentStepIndex");
        }
      },
      
      // Form data for all steps
      formData: {
        current: initialFormData,
        _callbacks: [] as ((value: Record<string, Record<string, any>>) => void)[],
        subscribe: function(callback: (value: Record<string, Record<string, any>>) => void) {
          this._callbacks.push(callback);
          // Immediately invoke with current value
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: Record<string, Record<string, any>>) {
          this.current = value;
          if (this._callbacks && this._callbacks.length) {
            this._callbacks.forEach(callback => callback(value));
          }
        }
      },
      
      // Track step validity
      stepsValidity: {
        current: stepValidationState,
        _callbacks: [] as ((value: Record<string, boolean>) => void)[],
        subscribe: function(callback: (value: Record<string, boolean>) => void) {
          this._callbacks.push(callback);
          // Immediately invoke with current value
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: Record<string, boolean>) {
          this.current = value;
          if (this._callbacks && this._callbacks.length) {
            this._callbacks.forEach(callback => callback(value));
          }
        }
      },      // Current step validity
      isCurrentStepValid: {
        current: false,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function(callback: (value: boolean) => void) {
          // Capture dependencies
          const currentStepBinding = controller.bindings.currentStep;
          const stepsValidityBinding = controller.bindings.stepsValidity;
          
          this._callbacks.push(callback);
          
          // Don't show validation errors on initial load
          // But still run validation to get correctness
          controller.methods.validateCurrentStep(false);
          
          // Get updated validation state
          const isValid = stepsValidityBinding.current[currentStepBinding.current.id] || false;
          this.current = isValid;
          callback(isValid);
          
          // Setup subscriptions to dependencies
          const unsubscribeStep = currentStepBinding.subscribe(step => {
            const stepValid = stepsValidityBinding.current[step.id] || false;
            if (this.current !== stepValid) {
              this.current = stepValid;
              callback(stepValid);
            }
          });
          
          const unsubscribeValidity = stepsValidityBinding.subscribe(validityMap => {
            const currentStepId = currentStepBinding.current.id;
            const stepValid = validityMap[currentStepId] || false;
            if (this.current !== stepValid) {
              this.current = stepValid;
              callback(stepValid);
            }
          });
          
          return () => {
            unsubscribeStep();
            unsubscribeValidity();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: boolean) {
          // This is a computed property, so setting directly does nothing
          console.warn("Cannot directly set isCurrentStepValid as it's computed");
        }
      },
      
      // Field-level validation errors
      fieldErrors: {
        current: {} as Record<string, Record<string, string>>,
        _callbacks: [] as ((value: Record<string, Record<string, string>>) => void)[],
        subscribe: function(callback: (value: Record<string, Record<string, string>>) => void) {
          this._callbacks.push(callback);
          // Immediately invoke with current value
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: Record<string, Record<string, string>>) {
          this.current = value;
          if (this._callbacks && this._callbacks.length) {
            this._callbacks.forEach(callback => callback(value));
          }
        }
      },
      
      // Computed: Total number of steps
      totalSteps: {
        current: config.steps.length,
        _callbacks: [] as ((value: number) => void)[],
        subscribe: function(callback: (value: number) => void) {
          // Depend on config
          const configBinding = controller.bindings.config;
          
          this._callbacks.push(callback);
          
          // Initialize with current value
          callback(this.current);
          
          // Update when config changes
          const unsubscribe = configBinding.subscribe(newConfig => {
            const stepsCount = newConfig.steps.length;
            if (this.current !== stepsCount) {
              this.current = stepsCount;
              callback(stepsCount);
            }
          });
          
          return () => {
            unsubscribe();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: number) {
          // This is a computed property, so setting it directly does nothing
          console.warn("Cannot directly set totalSteps as it's computed from config");
        }
      },
      
      // Computed: Check if we're on the last step
      isLastStep: {
        current: config.steps.length === 1,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function(callback: (value: boolean) => void) {
          // Capture dependencies
          const currentStepIndexBinding = controller.bindings.currentStepIndex;
          const totalStepsBinding = controller.bindings.totalSteps;
          
          // Add to callbacks array
          this._callbacks.push(callback);
          
          // Initialize with current value
          const isLast = currentStepIndexBinding.current === totalStepsBinding.current - 1;
          this.current = isLast;
          callback(isLast);
          
          // Setup subscriptions to dependencies
          const unsubscribeIndex = currentStepIndexBinding.subscribe(stepIndex => {
            const isLastStep = stepIndex === totalStepsBinding.current - 1;
            if (this.current !== isLastStep) {
              this.current = isLastStep;
              callback(isLastStep);
            }
          });
          
          const unsubscribeTotal = totalStepsBinding.subscribe(total => {
            const isLastStep = currentStepIndexBinding.current === total - 1;
            if (this.current !== isLastStep) {
              this.current = isLastStep;
              callback(isLastStep);
            }
          });
          
          return () => {
            unsubscribeIndex();
            unsubscribeTotal();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: boolean) {
          // This is a computed property, so setting directly does nothing
        }
      },
      
      // Computed: Check if we're on the first step
      isFirstStep: {
        current: true,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function(callback: (value: boolean) => void) {
          // Capture currentStep binding from parent object
          const currentStepIndexBinding = controller.bindings.currentStepIndex;
          
          // Add to callbacks array
          this._callbacks.push(callback);
          
          // Initialize with current value
          const isFirst = currentStepIndexBinding.current === 0;
          this.current = isFirst;
          callback(isFirst);
          
          // Update when currentStep changes
          const unsubscribe = currentStepIndexBinding.subscribe(stepIndex => {
            const isFirstStep = stepIndex === 0;
            if (this.current !== isFirstStep) {
              this.current = isFirstStep;
              callback(isFirstStep);
            }
          });
          
          return () => {
            unsubscribe();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: boolean) {
          // This is a computed property, so setting directly does nothing
        }
      },
      
      // Overall form validity
      isFormValid: {
        current: false,
        _callbacks: [] as ((value: boolean) => void)[],
        subscribe: function(callback: (value: boolean) => void) {
          // Depend on stepsValidity
          const stepsValidityBinding = controller.bindings.stepsValidity;
          const configBinding = controller.bindings.config;
          
          this._callbacks.push(callback);
          
          // Calculate overall form validity
          const calculateFormValidity = () => {
            const allSteps = configBinding.current.steps;
            const validityMap = stepsValidityBinding.current;
            
            // All steps must be valid
            return allSteps.every(step => validityMap[step.id] === true);
          };
          
          // Initialize with current value
          const isValid = calculateFormValidity();
          this.current = isValid;
          callback(isValid);
          
          // Update when step validity changes
          const unsubscribeValidity = stepsValidityBinding.subscribe(() => {
            const formValid = calculateFormValidity();
            if (this.current !== formValid) {
              this.current = formValid;
              callback(formValid);
            }
          });
          
          // Update when config changes
          const unsubscribeConfig = configBinding.subscribe(() => {
            const formValid = calculateFormValidity();
            if (this.current !== formValid) {
              this.current = formValid;
              callback(formValid);
            }
          });
          
          return () => {
            unsubscribeValidity();
            unsubscribeConfig();
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: boolean) {
          // This is a computed property, so setting directly does nothing
        }
      }
    },
    
    methods: {      // Navigate to next step
      nextStep: () => {
        if (
          controller.bindings.currentStepIndex.current <
          controller.bindings.totalSteps.current - 1
        ) {
          // Force validation just before navigation attempt with error display
          const currentStepValid = controller.methods.validateCurrentStep(true);
          
          // Only proceed if current step is valid
          if (currentStepValid) {
            const newValue = controller.bindings.currentStepIndex.current + 1;
            controller.bindings.currentStepIndex.set(newValue);
            return newValue;
          }
          
          return controller.bindings.currentStepIndex.current;
        }
        return controller.bindings.currentStepIndex.current;
      },
      
      // Navigate to previous step
      prevStep: () => {
        if (controller.bindings.currentStepIndex.current > 0) {
          const newValue = controller.bindings.currentStepIndex.current - 1;
          controller.bindings.currentStepIndex.set(newValue);
          return newValue;
        }
        return 0;
      },
      
      // Go to a specific step
      goToStep: (stepIndex: number) => {
        if (
          stepIndex >= 0 &&
          stepIndex < controller.bindings.totalSteps.current
        ) {
          controller.bindings.currentStepIndex.set(stepIndex);
          return true;
        }
        return false;
      },
      
      // Update form data for a field
      updateField: (stepId: string, fieldId: string, value: any) => {
        // Get current step configuration
        const step = controller.bindings.config.current.steps.find(s => s.id === stepId);
        
        // Safety check for step and field existence
        if (!step || !step.fields[fieldId]) {
          console.error(`Step "${stepId}" or field "${fieldId}" doesn't exist`);
          return;
        }
        
        // Create a deep copy of the current form data
        const formData = JSON.parse(JSON.stringify(controller.bindings.formData.current));
        
        // Initialize step data if it doesn't exist
        if (!formData[stepId]) {
          formData[stepId] = {};
        }
        
        // Update the field value
        formData[stepId][fieldId] = value;
        controller.bindings.formData.set(formData);
        
        // Validate the field and update errors
        controller.methods.validateField(stepId, fieldId, value);
        
        // Validate the step after updating field
        controller.methods.validateStep(stepId);
      },      // Validate a single field
      validateField: (stepId: string, fieldId: string, value?: any, showErrors = true) => {
        // Get current step and field configuration
        const step = controller.bindings.config.current.steps.find(s => s.id === stepId);
        if (!step) return false;
        
        const field = step.fields[fieldId];
        if (!field) return false;
        
        // Use provided value or get from form data
        const fieldValue = value !== undefined 
          ? value 
          : controller.bindings.formData.current[stepId]?.[fieldId];
        
        // Create context for dynamic validators
        const validationContext = {
          field,
          fieldId,
          stepId,
          formData: controller.bindings.formData.current[stepId] || {}
        };
        
        // Validate the field with context
        const result = validateField(field, fieldValue, validationContext);
        
        // Only update errors if showErrors is true
        if (showErrors) {
          const errors = { ...controller.bindings.fieldErrors.current };
          if (!errors[stepId]) {
            errors[stepId] = {};
          }
          
          if (result.isValid) {
            // Remove error if valid
            delete errors[stepId][fieldId];
          } else {
            // Add error message
            errors[stepId][fieldId] = result.error || 'Invalid field';
          }
          
          controller.bindings.fieldErrors.set(errors);
        } else if (result.isValid) {
          // Even when not showing errors, still remove existing errors
          // when field becomes valid
          const errors = { ...controller.bindings.fieldErrors.current };
          if (errors[stepId] && errors[stepId][fieldId]) {
            delete errors[stepId][fieldId];
            controller.bindings.fieldErrors.set(errors);
          }
        }
        
        return result.isValid;
      },
        // Validate an entire step
      validateStep: (stepId: string, showErrors = true) => {
        const step = controller.bindings.config.current.steps.find(s => s.id === stepId);
        if (!step) return false;
        
        let isStepValid = true;
        const stepData = controller.bindings.formData.current[stepId] || {};
        
        // Validate each field in the step
        Object.keys(step.fields).forEach(fieldId => {
          const isFieldValid = controller.methods.validateField(
            stepId, 
            fieldId, 
            stepData[fieldId],
            showErrors
          );
          
          if (!isFieldValid) {
            isStepValid = false;
          }
        });
        
        // Check custom step validation if provided
        if (isStepValid && step.validation) {
          const customValid = step.validation(stepData);
          if (customValid !== true) {
            isStepValid = false;
            
            // Only show errors if explicitly requested
            if (showErrors) {
              // Update errors with custom validation message
              const errors = { ...controller.bindings.fieldErrors.current };
              if (!errors[stepId]) {
                errors[stepId] = {};
              }
              
              errors[stepId]['__step__'] = typeof customValid === 'string' 
                ? customValid 
                : 'Invalid step data';
                
              controller.bindings.fieldErrors.set(errors);
            }
          }
        }
        
        // Update step validity state
        const validity = { ...controller.bindings.stepsValidity.current };
        validity[stepId] = isStepValid;
        controller.bindings.stepsValidity.set(validity);
        
        return isStepValid;
      },
        // Validate the current step
      validateCurrentStep: (showErrors = true) => {
        const currentStep = controller.bindings.currentStep.current;
        return controller.methods.validateStep(currentStep.id, showErrors);
      },
        // Validate all steps
      validateForm: (showErrors = true) => {
        const config = controller.bindings.config.current;
        let isValid = true;
        
        // Validate each step
        config.steps.forEach(step => {
          const stepValid = controller.methods.validateStep(step.id, showErrors);
          if (!stepValid) {
            isValid = false;
          }
        });
        
        return isValid;
      },
      
      // Submit the form
      submitForm: () => {
        // Validate the entire form before submission
        const isValid = controller.methods.validateForm();
        
        if (isValid) {
          // Prepare final form data - flatten step structure if needed
          const formData = controller.bindings.formData.current;
          
          // Here you would typically submit the data to a server
          console.log('Form submitted:', JSON.stringify(formData, null, 2));
          
          return {
            success: true,
            data: formData
          };
        } else {
          console.warn('Cannot submit form: validation failed');
          
          // Find the first invalid step
          const config = controller.bindings.config.current;
          const validity = controller.bindings.stepsValidity.current;
          
          const firstInvalidStepIndex = config.steps.findIndex(step => 
            !validity[step.id]
          );
          
          // Navigate to the first invalid step if not already there
          if (firstInvalidStepIndex !== -1 && 
              firstInvalidStepIndex !== controller.bindings.currentStepIndex.current) {
            controller.bindings.currentStepIndex.set(firstInvalidStepIndex);
          }
          
          return {
            success: false,
            errors: controller.bindings.fieldErrors.current
          };
        }
      },
      
      // Reset the entire form
      resetForm: () => {
        const config = controller.bindings.config.current;
        const initialData: Record<string, Record<string, any>> = {};
        
        // Reset to initial values from config
        config.steps.forEach(step => {
          initialData[step.id] = {};
          
          Object.entries(step.fields).forEach(([fieldId, field]) => {
            const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? '';
            initialData[step.id][fieldId] = defaultValue;
          });
        });
          // Reset all form state
        controller.bindings.formData.set(initialData);
        controller.bindings.fieldErrors.set({});
        controller.bindings.currentStepIndex.set(0);
        
        // Re-validate all steps immediately
        controller.methods.validateForm();
      },
      
      // Update form configuration (useful for dynamic forms)
      updateConfig: (newConfig: FormConfig) => {
        controller.bindings.config.set(newConfig);
          // Reset form and initialize with new config
        controller.methods.resetForm();
        
        // Re-validate all steps immediately
        controller.methods.validateForm();
      },
      
      // Get form data for a specific step
      getStepData: (stepId: string) => {
        return controller.bindings.formData.current[stepId] || {};
      },
      
      // Get all form data
      getAllData: () => {
        return controller.bindings.formData.current;
      },
      
      // Get flattened form data (merged from all steps)
      getFlatData: () => {
        const flatData: Record<string, any> = {};
        const formData = controller.bindings.formData.current;
        
        Object.values(formData).forEach(stepData => {
          Object.entries(stepData).forEach(([key, value]) => {
            flatData[key] = value;
          });
        });
        
        return flatData;
      },
      
      // Add a new step dynamically
      addStep: (step: FormStep, index?: number) => {
        const config = { ...controller.bindings.config.current };
        const steps = [...config.steps];
        
        // Default to adding at the end
        const insertIndex = index !== undefined ? index : steps.length;
        steps.splice(insertIndex, 0, step);
        
        config.steps = steps;
        controller.bindings.config.set(config);
        
        // Initialize form data for the new step
        const formData = { ...controller.bindings.formData.current };
        formData[step.id] = {};
        
        Object.entries(step.fields).forEach(([fieldId, field]) => {
          const defaultValue = config.defaultValues?.[fieldId] ?? field.value ?? '';
          formData[step.id][fieldId] = defaultValue;
        });
        
        controller.bindings.formData.set(formData);
        
        // Update step validity
        const validity = { ...controller.bindings.stepsValidity.current };
        validity[step.id] = false;
        controller.bindings.stepsValidity.set(validity);
          // Validate the new step immediately
        controller.methods.validateStep(step.id);
        
        return steps.length;
      },
      
      // Remove a step dynamically
      removeStep: (stepId: string) => {
        const config = { ...controller.bindings.config.current };
        const currentIndex = controller.bindings.currentStepIndex.current;
        
        const stepIndex = config.steps.findIndex(s => s.id === stepId);
        if (stepIndex === -1) return false;
        
        // Remove the step
        config.steps = config.steps.filter(s => s.id !== stepId);
        controller.bindings.config.set(config);
        
        // Remove step data
        const formData = { ...controller.bindings.formData.current };
        delete formData[stepId];
        controller.bindings.formData.set(formData);
        
        // Remove step validity
        const validity = { ...controller.bindings.stepsValidity.current };
        delete validity[stepId];
        controller.bindings.stepsValidity.set(validity);
        
        // Remove step errors
        const errors = { ...controller.bindings.fieldErrors.current };
        delete errors[stepId];
        controller.bindings.fieldErrors.set(errors);
        
        // Adjust current step index if needed
        if (currentIndex >= config.steps.length) {
          controller.bindings.currentStepIndex.set(Math.max(0, config.steps.length - 1));
        } else if (stepIndex <= currentIndex && currentIndex > 0) {
          controller.bindings.currentStepIndex.set(currentIndex - 1);
        }
        
        return true;
      },      // Register a dynamic validator
      registerValidator: (name: string, validatorFn: DynamicValidator) => {
        const { registerValidator } = require('./utils/validator-registry');
        registerValidator(name, validatorFn);
      },
      
      // Unregister a dynamic validator
      unregisterValidator: (name: string): boolean => {
        const { unregisterValidator } = require('./utils/validator-registry');
        return unregisterValidator(name);
      },
      
      // Get a list of all available validators (built-in + custom)
      getAvailableValidators: () => {
        const { predefinedValidators } = require('./utils/validator-registry');
        return predefinedValidators;
      }
    }
  };  // Set step validity without showing error messages initially
  config.steps.forEach(step => {
    // Check if the step has required fields that are empty
    const hasRequiredEmptyFields = Object.entries(step.fields).some(([fieldId, field]) => {
      if (field.required || (field.validation && field.validation.required)) {
        const value = controller.bindings.formData.current[step.id]?.[fieldId];
        const isEmpty = field.type === 'checkbox' ? value === false : !value;
        return isEmpty;
      }
      return false;
    });
    
    // Update step validity state without showing error messages
    if (hasRequiredEmptyFields) {
      const validity = { ...controller.bindings.stepsValidity.current };
      validity[step.id] = false;
      controller.bindings.stepsValidity.set(validity);
    }
  });
  
  return controller;
};
