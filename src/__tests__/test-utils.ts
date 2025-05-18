import { FormConfig } from '../interfaces/form-config.interface';
import { FormStep } from '../interfaces/form-step.interface';
import { Field } from '../interfaces/field.interface';

/**
 * Creates a mock field for testing
 */
export function createMockField(overrides?: Partial<Field>): Field {
  return {
    id: overrides?.id || 'test-field',
    type: 'text',
    label: 'Test Field',
    placeholder: 'Enter text',
    required: false,
    ...overrides
  };
}

/**
 * Creates a mock step for testing
 */
export function createMockStep(id: string, fields?: Record<string, Field>): FormStep {
  return {
    id,
    title: `Step ${id}`,
    description: `Description for step ${id}`,
    fields: fields || {
      [`field1_${id}`]: createMockField({ id: `field1_${id}`, label: `Field 1 in ${id}` }),
      [`field2_${id}`]: createMockField({ id: `field2_${id}`, label: `Field 2 in ${id}`, required: true })
    }
  };
}

/**
 * Creates a mock form configuration for testing
 */
export function createMockFormConfig(numSteps = 2): FormConfig {
  const steps: FormStep[] = [];

  for (let i = 1; i <= numSteps; i++) {
    steps.push(createMockStep(`step${i}`));
  }

  return {
    steps,
    defaultValues: {
      [`field1_step1`]: 'Default value'
    }
  };
}

/**
 * Creates a test validator function
 */
export function createTestValidator(shouldPass: boolean, errorMessage = 'Test validation error') {
  return () => shouldPass ? true : errorMessage;
}
