import { FormStep } from "./form-step.interface";

// Form configuration 
export interface FormConfig {
  steps: FormStep[];
  defaultValues?: Record<string, any>;
}