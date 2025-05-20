import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { FormStep } from '../interfaces/form-step.interface';

/**
 * Service for managing multi-step form navigation
 */
export class StepperService extends BaseService<number> {
  private configService: ConfigService;

  constructor(initialStepIndex: number, configService: ConfigService) {
    super(initialStepIndex);
    this.configService = configService;
  }
  
  /**
   * Navigate to the next step if possible
   * @param validateCallback Optional validation callback that determines if navigation is allowed
   * @returns New step index or current step if navigation isn't possible
   */
  nextStep(validateCallback?: () => boolean): number {
    if (this.current < this.configService.totalSteps - 1) {
      // If validation callback is provided, only proceed if it returns true
      if (validateCallback && !validateCallback()) {
        return this.current;
      }
      const newValue = this.current + 1;
      this.set(newValue);
      return newValue;
    }
    return this.current;
  }
  
  /**
   * Validate current step and navigate to next if valid
   * @param currentStepId Current step ID for touch marking
   * @param markStepTouched Function to mark all fields in step as touched
   * @param validateStep Function to validate the current step
   * @returns New step index or current step if validation fails
   */  validateAndNext(
    currentStepId: string,
    markStepTouched: (stepId: string, touched: boolean) => void,
    validateStep: (showErrors: boolean) => boolean
  ): number {
    // Mark all fields in the current step as touched to show all validation errors
    markStepTouched(currentStepId, true);    // Force validation just before navigation attempt with error display
    const currentStepValid = validateStep(true);

    // Only proceed if current step is valid
    if (currentStepValid) {
      // Direct navigation without using nextStep to ensure it works
      const newIndex = this.current + 1;
      
      // Only navigate if it's a valid index
      if (newIndex < this.configService.totalSteps) {
        this.set(newIndex);
        return newIndex;
      }
    }

    return this.get();
  }

  /**
   * Navigate to the previous step if possible
   * @returns New step index or 0 if already at first step
   */
  prevStep(): number {
    if (this.current > 0) {
      const newValue = this.current - 1;
      this.set(newValue);
      return newValue;
    }
    return 0;
  }
  /**
   * Go to a specific step by index
   * @param stepIndex Target step index
   * @returns True if navigation was successful, false otherwise
   */
  goToStep(stepIndex: number): boolean {
    if (stepIndex >= 0 && stepIndex < this.configService.totalSteps) {
      this.set(stepIndex);
      // Force an update of the current property
      this.current = stepIndex;
      return true;
    }
    return false;
  }

  /**
   * Check if currently on the first step
   * @returns True if on first step
   */
  get isFirstStep(): boolean {
    return this.current === 0;
  }

  /**
   * Check if currently on the last step
   * @returns True if on last step
   */
  get isLastStep(): boolean {
    return this.current === this.configService.totalSteps - 1;
  }
  /**
   * Validate current step and navigate to next if valid
   * Also updates bindings to ensure immediate access to current values
   * 
   * @param currentStep The current step object
   * @param markFieldsTouched Function to mark fields as touched
   * @param validateCurrentStep Function to validate the current step
   * @param updateBindings Function to update bindings after navigation
   * @returns New step index or current step if navigation fails
   */
  nextStepWithValidation(
    currentStep: FormStep,
    markFieldsTouched: (stepId: string, touched: boolean) => void,
    validateCurrentStep: (showErrors: boolean) => boolean,
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): number {
    // Mark all fields in the current step as touched to show all validation errors
    markFieldsTouched(currentStep.id, true);

    // Force validation just before navigation attempt with error display
    const currentStepValid = validateCurrentStep(true);

    // Only proceed if current step is valid
    if (currentStepValid) {
      const currentIndex = this.get();
      const newIndex = currentIndex + 1;
      
      if (newIndex < this.configService.totalSteps) {
        this.set(newIndex);
        
        // Get and update step info
        const step = this.configService.getStepByIndex(newIndex);
        updateBindings(newIndex, step || null);
        
        return newIndex;
      }
    }
    
    return this.get();
  }
  /**
   * Enhanced version of prevStep that also updates bindings
   * 
   * @param updateBindings Function to update bindings after navigation
   * @returns New step index or current index if navigation fails
   */
  prevStepWithBindings(
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): number {
    const currentIndex = this.get();
    
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.set(newIndex);
      
      // Get and update step info
      const step = this.configService.getStepByIndex(newIndex);
      updateBindings(newIndex, step || null);
      
      return newIndex;
    }
    
    return currentIndex;
  }
  /**
   * Enhanced version of goToStep that also updates bindings
   * 
   * @param stepIndex Target step index
   * @param updateBindings Function to update bindings after navigation
   * @returns True if navigation succeeded, false otherwise
   */
  goToStepWithBindings(
    stepIndex: number,
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): boolean {
    const result = this.goToStep(stepIndex);
    
    if (result) {
      const step = this.configService.getStepByIndex(stepIndex);
      updateBindings(stepIndex, step || null);
    }
    
    return result;
  }
}
