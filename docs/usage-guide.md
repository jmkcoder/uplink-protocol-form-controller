# Form Controller Documentation

A flexible, reactive form management system for both multi-step and single-step forms with advanced validation capabilities.

## Table of Contents

1. [Installation](#installation)
2. [Form Controller Basics](#form-controller-basics)
3. [Creating a Form](#creating-a-form)
   - [Single-Step Form](#single-step-form)
   - [Multi-Step Form](#multi-step-form)
4. [Field Validation](#field-validation)
   - [Built-in Validators](#built-in-validators)
   - [Custom Validators](#custom-validators)
   - [Dynamic Validators](#dynamic-validators)
5. [Reactive Bindings](#reactive-bindings)
6. [API Reference](#api-reference)

## Installation

```bash
npm install @odyssey/form-controller
```

## Form Controller Basics

The Form Controller provides a reactive system for managing form state, validation, and navigation between form steps. It can be used for both simple single-page forms and complex multi-step wizards.

Key features:
- Reactive state management
- Built-in and custom validation
- Dynamic, context-aware validators
- Step navigation and state tracking
- Flexible field configurations

## Creating a Form

### Single-Step Form

Even though the controller is designed for multi-step forms, you can easily use it for a single form by defining just one step:

```javascript
// Import the form controller
const { FormController } = require('@odyssey/form-controller');

// Create a form configuration with a single step
const formConfig = {
  steps: [
    {
      id: 'contact-info',
      title: 'Contact Information',
      fields: {
        name: {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          value: ''
        },
        email: {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          value: '',
          validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }
        },
        phone: {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          value: ''
        }
      }
    }
  ]
};

// Initialize the form controller
const form = FormController(formConfig);

// Connect form to the UI
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (form.methods.validateForm(true)) {
    const formData = form.methods.getFlatData();
    console.log('Form data:', formData);
    // Submit data to server
  }
});

// Connect input fields
document.querySelectorAll('input, select, textarea').forEach(element => {
  const fieldId = element.id;
  const stepId = 'contact-info'; // The ID of our only step
  
  // Set initial values if they exist
  if (form.bindings.formData.current[stepId]?.[fieldId]) {
    element.value = form.bindings.formData.current[stepId][fieldId];
  }
  
  // Add change event listeners
  element.addEventListener('input', (e) => {
    form.methods.updateField(stepId, fieldId, e.target.value);
  });
});

// Display validation errors
form.bindings.fieldErrors.subscribe((errors) => {
  Object.entries(errors['contact-info'] || {}).forEach(([fieldId, errorMsg]) => {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = errorMsg;
    }
  });
});
```

### Multi-Step Form

For multi-step forms, define multiple steps in the configuration:

```javascript
const formConfig = {
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: {
        firstName: {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true,
          value: ''
        },
        lastName: {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          required: true,
          value: ''
        }
      }
    },
    {
      id: 'contact',
      title: 'Contact Information',
      fields: {
        email: {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          value: '',
          validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }
        },
        phone: {
          id: 'phone',
          type: 'tel',
          label: 'Phone',
          value: ''
        }
      }
    },
    {
      id: 'preferences',
      title: 'Preferences',
      fields: {
        notifications: {
          id: 'notifications',
          type: 'checkbox',
          label: 'Receive notifications',
          value: false
        }
      }
    }
  ]
};

const form = FormController(formConfig);

// Setup navigation buttons
document.getElementById('nextBtn').addEventListener('click', () => {
  form.methods.nextStep();
  renderCurrentStep();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  form.methods.prevStep();
  renderCurrentStep();
});

document.getElementById('submitBtn').addEventListener('click', () => {
  if (form.methods.validateForm(true)) {
    const formData = form.methods.getFlatData();
    console.log('Form data:', formData);
    // Submit data to server
  }
});

// Update UI when step changes
form.bindings.currentStep.subscribe(renderCurrentStep);

function renderCurrentStep() {
  const currentStep = form.bindings.currentStep.current;
  
  // Update step title and fields
  document.getElementById('stepTitle').textContent = currentStep.title;
  
  // Clear and render fields for current step
  const fieldsContainer = document.getElementById('formFields');
  fieldsContainer.innerHTML = '';
  
  Object.entries(currentStep.fields).forEach(([fieldId, field]) => {
    // Create input elements based on field type
    // ...field rendering logic...
    
    // Attach event listeners
    const input = document.getElementById(fieldId);
    if (input) {
      input.value = form.bindings.formData.current[currentStep.id][fieldId] || '';
      input.addEventListener('input', (e) => {
        form.methods.updateField(currentStep.id, fieldId, e.target.value);
      });
    }
  });
  
  // Show/hide prev/next buttons
  document.getElementById('prevBtn').style.display = 
    form.bindings.isFirstStep.current ? 'none' : 'block';
    
  document.getElementById('nextBtn').style.display = 
    form.bindings.isLastStep.current ? 'none' : 'block';
    
  document.getElementById('submitBtn').style.display = 
    form.bindings.isLastStep.current ? 'block' : 'none';
}

// Initial render
renderCurrentStep();
```

## Field Validation

The form controller provides several ways to validate fields:

### Built-in Validators

Built-in validators are based on the field's properties:

```javascript
const emailField = {
  id: 'email',
  type: 'email',
  label: 'Email Address',
  required: true,
  value: '',
  validation: {
    // Email pattern validation
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Min/max length validation
    minLength: 5,
    maxLength: 100
  }
};

const ageField = {
  id: 'age',
  type: 'number',
  label: 'Age',
  value: '',
  validation: {
    // Range validation
    min: 18,
    max: 120
  }
};
```

### Custom Validators

For more complex validation, you can use custom validator functions:

```javascript
const passwordField = {
  id: 'password',
  type: 'password',
  label: 'Password',
  required: true,
  value: '',
  validation: {
    // Custom validator function
    custom: (value) => {
      // Password must contain at least one uppercase letter, one lowercase letter, 
      // one number, and be at least 8 characters long
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      
      if (!regex.test(value)) {
        return 'Password must have at least 8 characters with uppercase, lowercase, and a number';
      }
      
      return true; // Valid
    }
  }
};
```

### Dynamic Validators

Dynamic validators are powerful validation functions that have access to the entire form context. This allows for validation rules that depend on other field values.

#### Registering a Dynamic Validator

```javascript
// Require the form controller
const { FormController } = require('@odyssey/form-controller');

// Create form configuration
const formConfig = {/* ...form config... */};

// Initialize the form controller
const form = FormController(formConfig);

// Register a dynamic validator that makes a field required based on another field's value
form.methods.registerValidator('requiredIf', (value, context) => {
  const { 
    dependsOn, // ID of the field this depends on
    dependsOnValue // Value that should trigger the requirement
  } = context.field.validation.dynamicValidatorParams || {};
  
  // Skip if not properly configured
  if (!dependsOn) return true;
  
  // Get the value of the dependent field
  const dependentValue = context.formData[dependsOn];
  
  // Determine if this field should be required
  const isRequired = dependsOnValue !== undefined 
    ? dependentValue === dependsOnValue // Required if the dependent field equals the specified value
    : Boolean(dependentValue); // Required if the dependent field has any truthy value
  
  // If required but empty, return error message
  if (isRequired && (value === undefined || value === null || value === '')) {
    return `${context.field.label} is required when ${dependsOn} is specified`;
  }
  
  // Otherwise valid
  return true;
});

// Register a validator that checks if two fields match
form.methods.registerValidator('equals', (value, context) => {
  const { matchField, errorMessage } = context.field.validation.dynamicValidatorParams || {};
  
  if (!matchField) return true;
  
  const fieldToMatch = context.formData[matchField];
  
  if (value !== fieldToMatch) {
    return errorMessage || `Must match ${matchField}`;
  }
  
  return true;
});
```

#### Using Dynamic Validators in Fields

```javascript
// Example: Payment form where credit card fields are required 
// only if payment method is 'creditCard'
const paymentMethodField = {
  id: 'paymentMethod',
  type: 'select',
  label: 'Payment Method',
  required: true,
  value: '',
  options: [
    { label: 'Credit Card', value: 'creditCard' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bankTransfer' }
  ]
};

const cardNumberField = {
  id: 'cardNumber',
  type: 'text',
  label: 'Card Number',
  value: '',
  validation: {
    dynamicValidator: 'requiredIf',
    dynamicValidatorParams: {
      dependsOn: 'paymentMethod',
      dependsOnValue: 'creditCard',
      errorMessage: 'Card number is required for credit card payments'
    }
  }
};

// Example: Password confirmation field that must match the password field
const passwordField = {
  id: 'password',
  type: 'password',
  label: 'Password',
  required: true,
  value: ''
};

const confirmPasswordField = {
  id: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  required: true,
  value: '',
  validation: {
    dynamicValidator: 'equals',
    dynamicValidatorParams: {
      matchField: 'password',
      errorMessage: 'Passwords must match'
    }
  }
};
```

## Reactive Bindings

The form controller uses a reactive binding system to update the UI whenever form state changes.

```javascript
// Subscribe to form state changes
form.bindings.formData.subscribe(formData => {
  console.log('Form data updated:', formData);
});

// Track step validity
form.bindings.stepsValidity.subscribe(validityMap => {
  const currentStepId = form.bindings.currentStep.current.id;
  const isCurrentStepValid = validityMap[currentStepId];
  
  document.getElementById('nextBtn').disabled = !isCurrentStepValid;
});

// Show/hide navigation buttons based on current step
form.bindings.isFirstStep.subscribe(isFirst => {
  document.getElementById('prevBtn').style.display = isFirst ? 'none' : 'block';
});

form.bindings.isLastStep.subscribe(isLast => {
  document.getElementById('nextBtn').style.display = isLast ? 'none' : 'block';
  document.getElementById('submitBtn').style.display = isLast ? 'block' : 'none';
});

// Display validation errors
form.bindings.fieldErrors.subscribe(errors => {
  const currentStepId = form.bindings.currentStep.current.id;
  const stepErrors = errors[currentStepId] || {};
  
  // Clear all error messages
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  
  // Display new error messages
  Object.entries(stepErrors).forEach(([fieldId, errorMsg]) => {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
  });
});
```

## API Reference

### Initialization

```javascript
const form = FormController(formConfig);
```

### Navigation Methods

- **nextStep()** - Navigate to the next step (if current step is valid)
- **prevStep()** - Navigate to the previous step
- **goToStep(stepIndex)** - Navigate to a specific step by index

### Form Data Methods

- **updateField(stepId, fieldId, value)** - Update a field's value
- **getStepData(stepId)** - Get form data for a specific step
- **getAllData()** - Get all form data organized by steps
- **getFlatData()** - Get flattened form data merged from all steps

### Validation Methods

- **validateField(stepId, fieldId, value, showErrors)** - Validate a single field
- **validateStep(stepId, showErrors)** - Validate an entire step
- **validateCurrentStep(showErrors)** - Validate the current step
- **validateForm(showErrors)** - Validate the entire form
- **registerValidator(name, validatorFn)** - Register a custom dynamic validator
- **unregisterValidator(name)** - Remove a custom validator

### Form Management Methods

- **submitForm()** - Validate and submit the form
- **resetForm()** - Reset the form to initial values
- **updateConfig(newConfig)** - Update form configuration (for dynamic forms)
- **addStep(step, index)** - Add a new step dynamically
- **removeStep(stepId)** - Remove a step dynamically

### Reactive Bindings

- **config** - The current form configuration
- **currentStepIndex** - Index of the current step
- **currentStep** - The current step object
- **formData** - Form data for all steps
- **stepsValidity** - Validation state for each step
- **isCurrentStepValid** - Whether the current step is valid
- **fieldErrors** - Validation error messages
- **totalSteps** - Total number of steps
- **isLastStep** - Whether the current step is the last one
- **isFirstStep** - Whether the current step is the first one
- **isFormValid** - Whether the entire form is valid
