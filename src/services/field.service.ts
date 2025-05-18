import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { FormService } from './form.service';
import { validateField } from '../utils/validator';

/**
 * Service for managing field validation and errors
 */
export class FieldService {
  private configService: ConfigService;
  private formService: FormService;
  private fieldErrorsService: BaseService<Record<string, Record<string, string>>>;
  private stepsValidityService: BaseService<Record<string, boolean>>;

  constructor(
    configService: ConfigService,
    formService: FormService,
    fieldErrorsService: BaseService<Record<string, Record<string, string>>>,
    stepsValidityService: BaseService<Record<string, boolean>>
  ) {
    this.configService = configService;
    this.formService = formService;
    this.fieldErrorsService = fieldErrorsService;
    this.stepsValidityService = stepsValidityService;
  }

  /**
   * Validate a single field
   * @param stepId Step ID
   * @param fieldId Field ID
   * @param value Optional value to validate (defaults to current value in form data)
   * @param showErrors Whether to update the error state
   * @returns Validation result
   */
  validateField(
    stepId: string,
    fieldId: string,
    value?: any,
    showErrors = true
  ): boolean {
    // Get current step and field configuration
    const step = this.configService.getStepById(stepId);
    if (!step) return false;

    const field = step.fields[fieldId];
    if (!field) return false;

    // Use provided value or get from form data
    const fieldValue =
      value !== undefined
        ? value
        : this.formService.get()[stepId]?.[fieldId];    // Create context for dynamic validators
    const validationContext = {
      field,
      fieldId,
      stepId,
      formData: this.formService.get()[stepId] || {},
    };

    // Check if we should collect all errors
    const collectAllErrors = field.validation?.collectAllErrors === true;

    // Validate the field with context
    const result = validateField(field, fieldValue, validationContext, collectAllErrors);

    // Only update errors if showErrors is true
    if (showErrors) {
      const errors = { ...this.fieldErrorsService.get() };
      if (!errors[stepId]) {
        errors[stepId] = {};
      }

      if (result.isValid) {
        // Remove error if valid
        delete errors[stepId][fieldId];
      } else {
        // Add error message(s)
        if (result.errors && result.errors.length > 1 && collectAllErrors) {
          // If we're collecting all errors, join them with a separator
          errors[stepId][fieldId] = result.errors.join(' | ');
        } else {
          // Otherwise just use the first error
          errors[stepId][fieldId] = result.error || "Invalid field";
        }
      }

      this.fieldErrorsService.set(errors);
    } else if (result.isValid) {
      // Even when not showing errors, still remove existing errors
      // when field becomes valid
      const errors = { ...this.fieldErrorsService.get() };
      if (errors[stepId] && errors[stepId][fieldId]) {
        delete errors[stepId][fieldId];
        this.fieldErrorsService.set(errors);
      }
    }

    return result.isValid;
  }

  /**
   * Validate all fields in a step
   * @param stepId Step ID
   * @param showErrors Whether to update the error state
   * @returns Validation result
   */
  validateStep(stepId: string, showErrors = true): boolean {
    const step = this.configService.getStepById(stepId);
    if (!step) return false;

    let isStepValid = true;
    const stepData = this.formService.getStepData(stepId);

    // Validate each field in the step
    Object.keys(step.fields).forEach((fieldId) => {
      const isFieldValid = this.validateField(
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
          const errors = { ...this.fieldErrorsService.get() };
          if (!errors[stepId]) {
            errors[stepId] = {};
          }

          errors[stepId]["__step__"] =
            typeof customValid === "string"
              ? customValid
              : "Invalid step data";

          this.fieldErrorsService.set(errors);
        }
      }
    }

    // Update step validity state
    const validity = { ...this.stepsValidityService.get() };
    validity[stepId] = isStepValid;
    this.stepsValidityService.set(validity);

    return isStepValid;
  }

  /**
   * Validate all steps in the form
   * @param showErrors Whether to update the error state
   * @returns Validation result
   */
  validateForm(showErrors = true): boolean {
    const config = this.configService.get();
    let isValid = true;

    // Validate each step
    config.steps.forEach((step) => {
      const stepValid = this.validateStep(step.id, showErrors);
      if (!stepValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Get the field errors service
   * @returns Field errors service
   */
  getFieldErrorsService(): BaseService<Record<string, Record<string, string>>> {
    return this.fieldErrorsService;
  }

  /**
   * Get the steps validity service
   * @returns Steps validity service
   */
  getStepsValidityService(): BaseService<Record<string, boolean>> {
    return this.stepsValidityService;
  }
}
