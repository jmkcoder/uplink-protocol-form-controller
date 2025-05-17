import { BaseService } from './base.service';
import { FormConfig } from '../interfaces/form-config.interface';
import { FormStep } from '../interfaces/form-step.interface';

/**
 * Service for managing form configuration
 */
export class ConfigService extends BaseService<FormConfig> {
  constructor(initialConfig: FormConfig) {
    super(initialConfig);
  }
  /**
   * Update the entire form configuration
   * @param newConfig New form configuration
   */
  updateConfig(newConfig: FormConfig) {
    this.set(newConfig);
  }
  
  /**
   * Update the form configuration and reset related state
   * @param newConfig New form configuration
   * @param resetCallback Function to reset the form state
   */
  updateConfigAndReset(
    newConfig: FormConfig, 
    resetCallback: () => void
  ) {
    this.updateConfig(newConfig);
    resetCallback();
  }

  /**
   * Add a new step to the form configuration
   * @param step New form step
   * @param index Position to insert the step (defaults to end)
   * @returns New steps length
   */
  addStep(step: FormStep, index?: number): number {
    const config = { ...this.current };
    const steps = [...config.steps];

    // Default to adding at the end
    const insertIndex = index !== undefined ? index : steps.length;
    steps.splice(insertIndex, 0, step);

    config.steps = steps;
    this.set(config);

    return steps.length;
  }

  /**
   * Remove a step from the form configuration
   * @param stepId ID of the step to remove
   * @returns Success flag
   */
  removeStep(stepId: string): boolean {
    const config = { ...this.current };
    const stepIndex = config.steps.findIndex((s) => s.id === stepId);
    
    if (stepIndex === -1) return false;

    // Remove the step
    config.steps = config.steps.filter((s) => s.id !== stepId);
    this.set(config);

    return true;
  }

  /**
   * Get the step by ID
   * @param stepId Step ID
   * @returns Form step or undefined if not found
   */
  getStepById(stepId: string): FormStep | undefined {
    return this.current.steps.find((step) => step.id === stepId);
  }

  /**
   * Get step by index
   * @param index Step index
   * @returns Form step or undefined if index is out of bounds
   */
  getStepByIndex(index: number): FormStep | undefined {
    return this.current.steps[index];
  }

  /**
   * Get total number of steps
   * @returns Total number of steps
   */
  get totalSteps(): number {
    return this.current.steps.length;
  }
}
