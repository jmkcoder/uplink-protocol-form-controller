import { ConfigService } from './config.service';
import { StepperService } from './stepper.service';
import { FormService } from './form.service';
import { BaseService } from './base.service';
import { FormStep } from '../interfaces/form-step.interface';
import { FormConfig } from '../interfaces/form-config.interface';

/**
 * BindingManager - Manages the bindings system for the form controller
 * Handles subscription setup and value propagation to the binding objects
 */
export class BindingManager {
  private configService: ConfigService;
  private stepperService: StepperService;
  private formService: FormService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;
  
  // Bindings object that will be exposed to consumers
  public bindings: any;

  constructor(
    configService: ConfigService,
    stepperService: StepperService,
    formService: FormService,
    fieldErrorsService: BaseService<Record<string, Record<string, string>>>,
    stepsValidityService: BaseService<Record<string, boolean>>
  ) {
    this.configService = configService;
    this.stepperService = stepperService;
    this.formService = formService;
    this.fieldErrorsService = fieldErrorsService;
    this.stepsValidityService = stepsValidityService;
    
    // Initialize the bindings object
    this.initializeBindings();
  }

  /**
   * Initialize the reactive bindings system
   */
  private initializeBindings(): void {
    const self = this;
    const config = this.configService.get();

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
        current: self.formService.get(),
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
        current: self.stepsValidityService.get(),
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
   * Update binding values for the current step after navigation
   * @param newIndex New step index
   * @param step New step object
   */
  updateBindingsAfterNavigation(newIndex: number, step: FormStep | null): void {
    if (this.bindings) {
      this.bindings.currentStepIndex.current = newIndex;
      
      if (step) {
        this.bindings.currentStep.current = step;
      }
    }
  }
}
