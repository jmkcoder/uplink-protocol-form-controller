# Form Controller Features Guide

This document provides a comprehensive overview of all features and capabilities available in the @uplink-protocol/form-controller package.

## Table of Contents

1. [Core Features](#core-features)
2. [Form Configuration](#form-configuration)
3. [Field Types and Configuration](#field-types-and-configuration)
4. [Validation Capabilities](#validation-capabilities)
5. [Form Navigation](#form-navigation)
6. [State Management](#state-management)
7. [Dynamic Form Modification](#dynamic-form-modification)
8. [Advanced Use Cases](#advanced-use-cases)

## Core Features

The form-controller provides a complete solution for managing form state, validation, and user interactions with the following core capabilities:

- **Flexible Form Structure**: Build single-page forms or multi-step wizards with a consistent API
- **Reactive State Management**: All form state is reactive and observable through a bindings system
- **Built-in Validation**: Comprehensive validation rules that can be configured declaratively
- **Dynamic Validation**: Context-aware validators that can adapt based on other field values
- **Progressive Form Building**: Add or remove steps on-the-fly for truly dynamic forms
- **Framework Agnostic**: Works with any UI library (React, Vue, Angular) or vanilla JavaScript
- **Centralized Form State**: Maintain form state separate from UI components
- **Immutable Updates**: Safe, immutable state updates that maintain data integrity
- **Comprehensive Error Handling**: Field-level and form-level error management

## Form Configuration

### FormConfig Interface

```typescript
interface FormConfig {
  steps: FormStep[];
  defaultValues?: Record<string, any>;
}
```

A FormConfig is the top-level configuration object passed to the FormController constructor. It contains:

- **steps**: An array of FormStep objects defining each step in your form
- **defaultValues**: (Optional) Initial values for form fields accessible by field ID

### FormStep Interface

```typescript
interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, Field>;
  validation?: (formData: Record<string, any>) => boolean | string;
}
```

Each step in a form is configured with:

- **id**: Unique identifier for the step
- **title**: Display title for the step
- **description**: (Optional) Descriptive text for the step
- **fields**: Map of field IDs to field configuration objects
- **validation**: (Optional) Custom step-level validation function

## Field Types and Configuration

### Field Interface

```typescript
interface Field {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'checkbox' | 
        'radio' | 'select' | 'textarea' | 'date' | 'file' | 'custom';
  label: string;
  value?: any;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  validation?: Validation;
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;
  props?: Record<string, any>;
}
```

The Field interface supports a wide range of input types:
- **Basic inputs**: text, email, password, number, tel, date
- **Selection inputs**: checkbox, radio, select
- **Multi-line input**: textarea
- **Advanced inputs**: file, custom

Field properties include:
- **id**: Unique identifier for the field
- **type**: The type of field (determines input component)
- **label**: Display label for the field
- **value**: (Optional) Initial value
- **placeholder**: (Optional) Placeholder text
- **helperText**: (Optional) Additional guidance text
- **required**: (Optional) Whether the field is required
- **disabled**: (Optional) Whether the field is disabled
- **hidden**: (Optional) Whether the field is hidden
- **validation**: (Optional) Validation rules
- **options**: (Optional) Available options for select, radio, checkbox fields
- **props**: (Optional) Additional properties for custom field types

## Validation Capabilities

### Validation Interface

```typescript
interface Validation {
  required?: boolean;
  pattern?: RegExp | string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
  dynamicValidator?: string;
  dynamicValidatorParams?: Record<string, any>;
  errorMessage?: string;
}
```

The form-controller provides a powerful validation system with:

### Built-in Validators

- **required**: Ensures field has a value
- **pattern**: Validates against a regular expression
- **minLength/maxLength**: Validates text length
- **min/max**: Validates numeric range
- **custom**: Custom validation function

### Dynamic Validators

Dynamic validators can access the entire form state and react to other field values:

- **requiredIf**: Makes a field required based on conditions:
  - `equals`: Required when a specified field equals a specific value
  - `notEquals`: Required when a specified field doesn't equal a specific value
  - `notEmpty`: Required when specified fields have values

- **equals**: Validates that a field equals a specific value or another field's value

### Custom Dynamic Validators

You can register your own dynamic validators using the `registerValidator` method:

```javascript
form.methods.registerValidator('matchesPassword', (value, context) => {
  if (value !== context.formData.password) {
    return 'Passwords do not match';
  }
  return true;
});
```

The validator context provides access to:
- The current field configuration
- The entire form data
- The step ID and field ID

## Form Navigation

The form-controller provides methods for navigating through multi-step forms:

- **nextStep()**: Advances to the next step (with validation)
- **prevStep()**: Returns to the previous step (without validation)
- **goToStep(index)**: Jumps to a specific step by index (with validation for skipped steps)

Navigation bindings provide information about the current state:
- **isFirstStep**: Whether the current step is the first
- **isLastStep**: Whether the current step is the last
- **currentStepIndex**: The index of the current step
- **currentStep**: The configuration object for the current step
- **totalSteps**: The total number of steps in the form

## State Management

The form-controller uses a reactive bindings system to maintain and expose form state:

### Data Access Bindings

- **formData**: The complete form data organized by step ID and field ID
- **getAllData()**: Method to get all form data (nested by step)
- **getFlatData()**: Method to get form data flattened into a single object
- **getStepData(stepId)**: Method to get data for a specific step

### Validation Bindings

- **fieldErrors**: Current validation errors by step ID and field ID
- **stepsValidity**: Validation state for each step
- **isCurrentStepValid**: Whether the current step is valid
- **isFormValid**: Whether the entire form is valid

### Subscription System

All bindings provide a subscription mechanism:

```javascript
form.bindings.formData.subscribe((data) => {
  console.log('Form data changed:', data);
});

form.bindings.fieldErrors.subscribe((errors) => {
  console.log('Validation errors changed:', errors);
});
```

## Dynamic Form Modification

The form-controller supports dynamic modification of the form structure at runtime:

- **updateConfig(newConfig)**: Replace the entire form configuration
- **addStep(step, index?)**: Add a new step at the specified index (or end)
- **removeStep(stepId)**: Remove a step by ID
- **updateField(stepId, fieldId, value)**: Update a field's value

## Advanced Use Cases

### Conditional Fields and Steps

You can implement conditional fields that appear based on other field values:

```javascript
// Show/hide a field based on another field's value
form.bindings.formData.subscribe((data) => {
  const showExtraField = data.step1.optIn === true;
  document.getElementById('extraFieldContainer').style.display = 
    showExtraField ? 'block' : 'none';
});
```

### Dynamic Step Creation

Create form steps dynamically based on user input:

```javascript
// Add a new step dynamically
const addNewSection = () => {
  const stepCount = form.bindings.totalSteps.current;
  const newStepId = `dynamic-step-${stepCount}`;
  
  form.methods.addStep({
    id: newStepId,
    title: `Dynamic Section ${stepCount}`,
    fields: {
      dynamicField: {
        id: 'dynamicField',
        type: 'text',
        label: 'Dynamic Field',
        required: true
      }
    }
  });
};
```

### Saving and Restoring Form State

Implement form state persistence:

```javascript
// Save form state to localStorage
const saveFormState = () => {
  const formData = form.methods.getAllData();
  localStorage.setItem('savedForm', JSON.stringify(formData));
};

// Restore form state
const restoreFormState = () => {
  const savedData = JSON.parse(localStorage.getItem('savedForm') || '{}');
  
  // Update each field with saved values
  Object.entries(savedData).forEach(([stepId, stepData]) => {
    Object.entries(stepData).forEach(([fieldId, value]) => {
      form.methods.updateField(stepId, fieldId, value);
    });
  });
};
```

### Multi-page Form with Validation

Create a wizard-style form with validation between steps:

```javascript
// Next button with validation
nextButton.addEventListener('click', () => {
  if (form.methods.validateCurrentStep(true)) {
    form.methods.nextStep();
    renderCurrentStep();
  }
});

// Back button without validation
backButton.addEventListener('click', () => {
  form.methods.prevStep();
  renderCurrentStep();
});

// Submit button with full form validation
submitButton.addEventListener('click', () => {
  const result = form.methods.submitForm();
  if (result.success) {
    // Handle successful submission
    console.log('Form submitted successfully:', result.data);
  } else {
    // Handle validation errors
    console.error('Form validation failed:', result.errors);
  }
});
```

### Form Reset Functionality

Provide a way to clear form data:

```javascript
// Reset button
resetButton.addEventListener('click', () => {
  form.methods.resetForm();
  renderCurrentStep();
});
```

This features guide provides a comprehensive overview of all capabilities available in the form-controller package. For implementation details and code examples, refer to the [Usage Guide](./usage-guide.md).
