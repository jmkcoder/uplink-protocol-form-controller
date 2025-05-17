import { BaseService } from './base.service';
import { FormConfig } from '../interfaces/form-config.interface';
import { FormStep } from '../interfaces/form-step.interface';
import { ConfigService } from './config.service';

/**
 * Service for managing form data and submission
 */
export class FormService extends BaseService<Record<string, Record<string, any>>> {
  private configService: ConfigService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;

  constructor(
    initialFormData: Record<string, Record<string, any>>, 
    configService: ConfigService,
    fieldErrorsService: BaseService<Record<string, Record<string, string>>>,
    stepsValidityService: BaseService<Record<string, boolean>>
  ) {
    super(initialFormData);
    this.configService = configService;
    this.fieldErrorsService = fieldErrorsService;
    this.stepsValidityService = stepsValidityService;
  }

  /**
   * Update a field value
   * @param stepId Step ID
   * @param fieldId Field ID
   * @param value New field value
   */
  updateField(stepId: string, fieldId: string, value: any): void {
    // Get current step configuration
    const step = this.configService.getStepById(stepId);

    // Safety check for step and field existence
    if (!step || !step.fields[fieldId]) {
      console.error(`Step "${stepId}" or field "${fieldId}" doesn't exist`);
      return;
    }

    // Create a deep copy of the current form data
    const formData = JSON.parse(JSON.stringify(this.current));

    // Initialize step data if it doesn't exist
    if (!formData[stepId]) {
      formData[stepId] = {};
    }

    // Update the field value
    formData[stepId][fieldId] = value;
    this.set(formData);
  }

  /**
   * Get form data for a specific step
   * @param stepId Step ID
   * @returns Step data or empty object if step doesn't exist
   */
  getStepData(stepId: string): Record<string, any> {
    return this.current[stepId] || {};
  }

  /**
   * Get all form data
   * @returns Complete form data
   */
  getAllData(): Record<string, Record<string, any>> {
    return this.current;
  }

  /**
   * Get flattened form data (merged from all steps)
   * @returns Flattened form data
   */
  getFlatData(): Record<string, any> {
    const flatData: Record<string, any> = {};

    Object.values(this.current).forEach((stepData) => {
      Object.entries(stepData).forEach(([key, value]) => {
        flatData[key] = value;
      });
    });

    return flatData;
  }

  /**
   * Reset form data to initial values
   * @param defaultValues Optional custom default values
   */
  resetForm(defaultValues?: Record<string, any>): void {
    const config = this.configService.get();
    const initialData: Record<string, Record<string, any>> = {};

    // Reset to initial values from config
    config.steps.forEach((step) => {
      initialData[step.id] = {};

      Object.entries(step.fields).forEach(([fieldId, field]) => {
        const defaultValue = 
          defaultValues?.[fieldId] ?? 
          config.defaultValues?.[fieldId] ?? 
          field.value ?? 
          "";
        initialData[step.id][fieldId] = defaultValue;
      });
    });
    
    // Reset form data
    this.set(initialData);
    
    // Reset errors
    this.fieldErrorsService.set({});
  }
  /**
   * Handle form submission logic with integrated validation
   * @param validateAndMarkTouched Function to validate the entire form and mark fields touched
   * @param findFirstInvalidStep Function to find the first invalid step
   * @param goToStep Function to navigate to a step by index
   * @returns Submission result object
   */
  submitForm(
    validateAndMarkTouched: () => boolean,
    findFirstInvalidStep: () => number,
    goToStep: (index: number) => void
  ): { success: boolean, data?: any, errors?: any } {
    // Validate the entire form before submission
    const isValid = validateAndMarkTouched();

    if (isValid) {
      // Prepare final form data
      const formData = this.getAllData();

      // Here you would typically submit the data to a server
      console.log("Form submitted:", JSON.stringify(formData, null, 2));

      return {
        success: true,
        data: formData,
      };
    } else {
      console.warn("Cannot submit form: validation failed");

      // Find and navigate to the first invalid step
      const firstInvalidStepIndex = findFirstInvalidStep();
      if (firstInvalidStepIndex !== -1) {
        goToStep(firstInvalidStepIndex);
      }

      return {
        success: false,
        errors: this.fieldErrorsService.get(),
      };
    }
  }
  
  /**
   * Completely reset the form, touch tracking, and validation state
   * @param resetTouchTracking Function to reset touch tracking
   * @param validateForm Function to validate the entire form
   */
  completeReset(
    resetTouchTracking: () => void,
    validateForm: () => void
  ): void {
    // Reset the form data to initial values
    this.resetForm();
    
    // Reset touch tracking state
    resetTouchTracking();
    
    // Re-validate all steps immediately (without showing errors)
    validateForm();
  }
}
