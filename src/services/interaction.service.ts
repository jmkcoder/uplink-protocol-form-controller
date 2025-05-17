import { ConfigService } from './config.service';
import { FieldService } from './field.service';

/**
 * Service for tracking user interactions with form fields
 */
export class InteractionService {
  private touchedFields: Record<string, Record<string, boolean>> = {};
  private configService: ConfigService;
  private fieldService: FieldService;

  constructor(configService: ConfigService, fieldService: FieldService) {
    this.configService = configService;
    this.fieldService = fieldService;
    
    // Initialize touchedFields structure
    this.initTouchTracking();
  }

  /**
   * Initialize touch tracking for all steps and fields
   */
  private initTouchTracking(): void {
    const config = this.configService.get();
    config.steps.forEach((step) => {
      this.touchedFields[step.id] = {}; 
      
      Object.keys(step.fields).forEach((fieldId) => {
        this.touchedFields[step.id][fieldId] = false;
      });
    });
  }

  /**
   * Mark a field as touched
   * @param stepId Step ID
   * @param fieldId Field ID
   * @param touched Touch state (defaults to true)
   */
  markFieldTouched(stepId: string, fieldId: string, touched = true): void {
    if (!this.touchedFields[stepId]) {
      this.touchedFields[stepId] = {};
    }
    this.touchedFields[stepId][fieldId] = touched;
  }

  /**
   * Mark all fields in a step as touched
   * @param stepId Step ID
   * @param touched Touch state (defaults to true)
   */
  markAllFieldsInStepTouched(stepId: string, touched = true): void {
    const step = this.configService.getStepById(stepId);
    if (!step) return;

    if (!this.touchedFields[stepId]) {
      this.touchedFields[stepId] = {};
    }

    Object.keys(step.fields).forEach((fieldId) => {
      this.touchedFields[stepId][fieldId] = touched;
    });
  }

  /**
   * Mark all fields in all steps as touched
   * @param touched Touch state (defaults to true)
   */
  markAllFieldsTouched(touched = true): void {
    const config = this.configService.get();
    
    config.steps.forEach((step) => {
      if (!this.touchedFields[step.id]) {
        this.touchedFields[step.id] = {};
      }
      
      Object.keys(step.fields).forEach((fieldId) => {
        this.touchedFields[step.id][fieldId] = touched;
      });
    });
  }

  /**
   * Check if a field has been touched
   * @param stepId Step ID
   * @param fieldId Field ID
   * @returns Whether the field has been touched
   */
  isFieldTouched(stepId: string, fieldId: string): boolean {
    return this.touchedFields[stepId]?.[fieldId] === true;
  }
  /**
   * Validate a step showing errors only for touched fields
   * @param stepId Step ID
   * @returns Validation result
   */
  validateStepWithTouchedErrors(stepId: string): boolean {
    const step = this.configService.getStepById(stepId);
    if (!step) return false;

    let isStepValid = true;
    const stepData = this.configService.getStepById(stepId);

    // Validate each field in the step
    Object.keys(step.fields).forEach((fieldId) => {
      // For each field, pass showErrors=true if the field has been touched
      // otherwise pass showErrors=false to still validate but not show errors
      const fieldTouched = this.touchedFields[stepId]?.[fieldId] === true;
      const isFieldValid = this.fieldService.validateField(
        stepId,
        fieldId,
        undefined,
        fieldTouched // Only show errors for touched fields
      );

      if (!isFieldValid) {
        isStepValid = false;
      }
    });

    return isStepValid;
  }

  /**
   * Reset touch tracking state
   */
  resetTouchTracking(): void {
    this.initTouchTracking();
  }

  /**
   * Get touch state for all fields
   * @returns Touch state
   */
  getTouchState(): Record<string, Record<string, boolean>> {
    return this.touchedFields;
  }
}
