import { Field } from "./field.interface";

// Step configuration for dynamic multi-step forms
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, Field>;
  validation?: (formData: Record<string, any>) => boolean | string;
}