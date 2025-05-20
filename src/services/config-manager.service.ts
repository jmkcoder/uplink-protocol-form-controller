import { ConfigService } from './config.service';
import { FormService } from './form.service';
import { FieldService } from './field.service';
import { InteractionService } from './interaction.service';
import { FormStep } from '../interfaces/form-step.interface';
import { FormConfig } from '../interfaces/form-config.interface';
import { BaseService } from './base.service';
import { StepperService } from './stepper.service';

/**
 * ConfigManagerService - Manages configuration operations that require coordination with other services
 * This provides a higher-level abstraction for configuration management across the form
 */
export class ConfigManagerService {
  private configService: ConfigService;
  private formService: FormService;
  private fieldService: FieldService;
  private interactionService: InteractionService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;
  private stepperService: StepperService;

  constructor(
    configService: ConfigService,
    formService: FormService,
    fieldService: FieldService,
    interactionService: InteractionService,
    fieldErrorsService: BaseService<Record<string, Record<string, string>>>,
    stepsValidityService: BaseService<Record<string, boolean>>,
    stepperService: StepperService
  ) {
    this.configService = configService;
    this.formService = formService;
    this.fieldService = fieldService;
    this.interactionService = interactionService;
    this.fieldErrorsService = fieldErrorsService;
    this.stepsValidityService = stepsValidityService;
    this.stepperService = stepperService;
  }
  /**
   * Update form configuration and reset all form state
   * @param newConfig New form configuration
   */
  updateConfigWithReset(newConfig: FormConfig): void {
    // First update the config service
    this.configService.set(newConfig);
    
    // Reset form and touch tracking
    this.interactionService.resetTouchTracking();
  }
  /**
   * Update config with full reset - handles all reset operations internally
   * @param newConfig New form configuration
   */
  updateConfigWithFullReset(newConfig: FormConfig): void {
    // Update the config
    this.configService.set(newConfig);
    
    // Reset touch tracking directly
    this.interactionService.resetTouchTracking();
    
    // Reset form data to defaults
    const initialFormData: Record<string, Record<string, any>> = {};

    // Initialize form data structure with default values
    newConfig.steps.forEach((step: FormStep) => {
      initialFormData[step.id] = {};

      // Set initial field values
      Object.entries(step.fields).forEach(([fieldId, field]) => {
        const defaultValue = newConfig.defaultValues?.[fieldId] ?? field.value ?? "";
        initialFormData[step.id][fieldId] = defaultValue;
      });
    });
    
    // Set the form data directly instead of using the callback
    this.formService.set(initialFormData);
    this.formService.resetForm();
    
    // Re-validate without showing errors
    this.fieldService.validateForm(false);
    
    // Reset to first step
    this.stepperService.set(0);
  }
  /**
   * Add a new step dynamically with updated form data
   * @param step New form step
   * @param index Position to insert (defaults to end)
   * @returns New steps length
   */
  addStepWithFormData(step: FormStep, index?: number): number {
    // Get the current config and steps
    const config = this.configService.get();
    const steps = [...config.steps];
    
    // Add the new step at the specified index or at the end
    if (index !== undefined && index >= 0 && index <= steps.length) {
      steps.splice(index, 0, step);
    } else {
      steps.push(step);
    }
    
    // Update the config
    const newConfig = { ...config, steps };
    this.configService.set(newConfig);
    
    // Initialize form data for the new step
    const formData = { ...this.formService.get() };
    formData[step.id] = {};
    
    Object.entries(step.fields).forEach(([fieldId, field]) => {
      const defaultValue = newConfig.defaultValues?.[fieldId] ?? field.value ?? "";
      formData[step.id][fieldId] = defaultValue;
    });

    this.formService.set(formData);
    
    // Validate the new step immediately (without showing errors)
    this.fieldService.validateStep(step.id, false);

    return steps.length;
  }
  /**
   * Remove a step dynamically and clean up related state
   * @param stepId ID of the step to remove
   * @returns Success flag
   */
  removeStepWithCleanup(stepId: string): boolean {
    // Get the current config and find the step to remove
    const config = this.configService.get();
    const stepIndex = config.steps.findIndex((step: FormStep) => step.id === stepId);
    
    if (stepIndex === -1) {
      return false;
    }
    
    // Create a new steps array without the removed step
    const steps = config.steps.filter((step: FormStep) => step.id !== stepId);
    
    // Update the config
    const newConfig = { ...config, steps };
    this.configService.set(newConfig);
    
    // Remove step data from form
    const formData = { ...this.formService.get() };
    delete formData[stepId];
    this.formService.set(formData);

    // Remove step validity
    const validity = { ...this.stepsValidityService.get() };
    delete validity[stepId];
    this.stepsValidityService.set(validity);

    // Remove step errors
    const errors = { ...this.fieldErrorsService.get() };
    delete errors[stepId];
    this.fieldErrorsService.set(errors);

    // Adjust current step index if needed
    const currentIndex = this.stepperService.get();
    if (currentIndex >= steps.length) {
      this.stepperService.set(Math.max(0, steps.length - 1));
    }

    return true;
  }
}
