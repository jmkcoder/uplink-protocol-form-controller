import { FormService } from './form.service';
import { FieldService } from './field.service';
import { InteractionService } from './interaction.service';
import { StepperService } from './stepper.service';

/**
 * FormManagerService - Handles form operations that require coordination with other services
 * This provides a higher-level abstraction for form operations
 */
export class FormManagerService {
  private formService: FormService;
  private fieldService: FieldService;
  private interactionService: InteractionService;
  private stepperService: StepperService;

  constructor(
    formService: FormService,
    fieldService: FieldService,
    interactionService: InteractionService,
    stepperService: StepperService
  ) {
    this.formService = formService;
    this.fieldService = fieldService;
    this.interactionService = interactionService;
    this.stepperService = stepperService;
  }

  /**
   * Update a field value and handle validation and touch state
   * @param stepId Step ID
   * @param fieldId Field ID
   * @param value New field value
   */
  updateFieldWithValidation(stepId: string, fieldId: string, value: any): void {
    // Update the field value in formService
    this.formService.updateField(stepId, fieldId, value);
    
    // Mark this field as touched
    this.interactionService.markFieldTouched(stepId, fieldId, true);

    // Validate only the current field and show its errors
    this.fieldService.validateField(stepId, fieldId, value, true);

    // Validate the step with showing errors only for touched fields
    this.interactionService.validateStepWithTouchedErrors(stepId);
  }

  /**
   * Handle form submission logic with integrated validation
   * @param showValidationErrors Whether to show validation errors
   * @returns Submission result object
   */
  submitFormWithValidation(showValidationErrors = true): { success: boolean, data?: any, errors?: any } {
    // Mark all fields as touched to show validation errors
    this.interactionService.markAllFieldsTouched(true);
    
    // Validate the entire form
    const isValid = this.fieldService.validateForm(showValidationErrors);

    if (isValid) {
      // Prepare final form data
      const formData = this.formService.getAllData();
      
      return {
        success: true,
        data: formData,
      };
    } else {
      // Find and navigate to the first invalid step
      const validityMap = this.fieldService.getStepsValidityService().get();
      const config = this.formService.getConfigService().get();
      const firstInvalidStepIndex = config.steps.findIndex(step => !validityMap[step.id]);
      
      if (firstInvalidStepIndex !== -1 && firstInvalidStepIndex !== this.stepperService.get()) {
        this.stepperService.goToStep(firstInvalidStepIndex);
      }

      return {
        success: false,
        errors: this.fieldService.getFieldErrorsService().get(),
      };
    }
  }

  /**
   * Reset the form to its initial state
   */
  resetFormCompletely(): void {
    // Reset form data to defaults
    this.formService.resetForm();
    
    // Reset touch tracking state
    this.interactionService.resetTouchTracking();
    
    // Re-validate all steps immediately (without showing errors)
    this.fieldService.validateForm(false);
    
    // Reset to first step
    this.stepperService.set(0);
  }
}
