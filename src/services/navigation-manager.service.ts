import { StepperService } from './stepper.service';
import { InteractionService } from './interaction.service';
import { FieldService } from './field.service';
import { ConfigService } from './config.service';
import { FormStep } from '../interfaces/form-step.interface';

/**
 * NavigationManager - Handles complex navigation operations with validation and binding updates
 * This provides a higher-level abstraction for navigation operations
 */
export class NavigationManager {
  private stepperService: StepperService;
  private configService: ConfigService;
  private fieldService: FieldService;
  private interactionService: InteractionService;

  constructor(
    stepperService: StepperService,
    configService: ConfigService,
    fieldService: FieldService,
    interactionService: InteractionService
  ) {
    this.stepperService = stepperService;
    this.configService = configService;
    this.fieldService = fieldService;
    this.interactionService = interactionService;
  }

  /**
   * Navigate to the next step with validation
   * @param updateBindings Function to update binding values after navigation
   * @returns New step index or current step if navigation isn't possible
   */
  goToNextWithValidation(
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): number {
    // Get the current step
    const currentIndex = this.stepperService.get();
    const currentStep = this.configService.get().steps[currentIndex];
    
    if (!currentStep) {
      return currentIndex;
    }

    // Mark all fields in the current step as touched to show validation errors
    this.interactionService.markAllFieldsInStepTouched(currentStep.id, true);

    // Validate the current step with error display
    const isValid = this.fieldService.validateStep(currentStep.id, true);    // Only proceed if current step is valid
    const totalSteps = this.configService.get().steps.length;
    if (isValid && currentIndex < totalSteps - 1) {
      const newIndex = currentIndex + 1;
      this.stepperService.set(newIndex);
      
      // Get new step and update bindings
      const newStep = this.configService.get().steps[newIndex];
      updateBindings(newIndex, newStep || null);
      
      return newIndex;
    }
    
    return currentIndex;
  }

  /**
   * Navigate to the previous step
   * @param updateBindings Function to update binding values after navigation
   * @returns New step index or current step if navigation isn't possible
   */
  goToPrevious(
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): number {
    const currentIndex = this.stepperService.get();
    
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.stepperService.set(newIndex);
        // Get new step and update bindings
      const newStep = this.configService.get().steps[newIndex];
      updateBindings(newIndex, newStep || null);
      
      return newIndex;
    }
    
    return currentIndex;
  }

  /**
   * Navigate to a specific step by index
   * @param stepIndex Target step index
   * @param updateBindings Function to update binding values after navigation
   * @returns True if navigation succeeded, false otherwise
   */
  goToSpecificStep(
    stepIndex: number,
    updateBindings: (newIndex: number, step: FormStep | null) => void
  ): boolean {    if (stepIndex >= 0 && stepIndex < this.configService.get().steps.length) {
      this.stepperService.set(stepIndex);
      
      // Get new step and update bindings
      const newStep = this.configService.get().steps[stepIndex];
      updateBindings(stepIndex, newStep || null);
      
      return true;
    }
    
    return false;
  }
}
