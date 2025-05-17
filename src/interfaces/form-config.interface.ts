import { FormStep } from "./form-step.interface";

/**
 * Form configuration interface.
 * Defines the structure and behavior of the entire form.
 */
export interface FormConfig {
  /** 
   * Array of form steps.
   * Each step contains a set of related fields.
   */
  steps: FormStep[];
  
  /**
   * Default values for form fields.
   * Keys are field IDs, values are the default values.
   * These values will override any default values defined in the field configurations.
   */
  defaultValues?: Record<string, any>;
}