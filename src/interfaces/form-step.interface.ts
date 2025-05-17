import { Field } from "./field.interface";

/**
 * Step configuration for dynamic multi-step forms.
 * Each step contains a set of related fields and optional validation.
 */
export interface FormStep {
  /** Unique identifier for the step */
  id: string;
  
  /** Display title for the step */
  title: string;
  
  /** Optional description text for the step */
  description?: string;
  
  /** 
   * Map of fields contained in this step.
   * Keys are field IDs, values are field configurations.
   */
  fields: Record<string, Field>;
  
  /**
   * Optional custom validation function for the entire step.
   * Called after all individual field validations have passed.
   * 
   * @param formData The current form data for all steps
   * @returns true if valid, or an error message string if invalid
   */
  validation?: (formData: Record<string, any>) => boolean | string;
}