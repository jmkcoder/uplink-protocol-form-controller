**@uplink-protocol/form-controller v0.2.5**

***

# @uplink-protocol/form-controller

A lightweight yet powerful form management system for building dynamic, multi-step forms with advanced validation capabilities. This module is part of the Odyssey Uplink Protocol.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Flexible Form Structure** - Support for both single-step and multi-step forms
- **Built-in Validation** - Comprehensive validation rules out of the box
- **Dynamic Validation** - Context-aware validators that can react to other field values
- **Enhanced Validation** - Support for multiple validation errors and per-validation error messages
- **Reactive State Management** - Subscribe to state changes for reactive UI updates
- **Progressive Form Building** - Add or remove steps dynamically
- **Framework Agnostic** - Works with any UI library or vanilla JavaScript

## Installation

```bash
npm install @uplink-protocol/form-controller
```

## Basic Usage

```javascript
// Import the form controller
const { FormController } = require('@uplink-protocol/form-controller');

// Define your form configuration
const formConfig = {
  steps: [
    {
      id: 'contact',
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
        }
      }
    }
  ]
};

// Initialize the form controller
const form = FormController(formConfig);

// Update field values
form.methods.updateField('contact', 'name', 'John Doe');

// Validate the form
if (form.methods.validateForm(true)) {
  // Form is valid, get the data
  const formData = form.methods.getFlatData();
  console.log('Form data:', formData);
}
```

## Multi-step Form Example

```javascript
const wizardForm = FormController({
  steps: [
    {
      id: 'personal',
      title: 'Personal Details',
      fields: {
        // Personal info fields
      }
    },
    {
      id: 'address',
      title: 'Address Information',
      fields: {
        // Address fields
      }
    },
    {
      id: 'preferences',
      title: 'User Preferences',
      fields: {
        // Preferences fields
      }
    }
  ]
});

// Navigate between steps
wizardForm.methods.nextStep();  // Advance to next step if current is valid
wizardForm.methods.prevStep();  // Go back to previous step
wizardForm.methods.goToStep(1); // Jump to specific step

// Check current status
const isLastStep = wizardForm.bindings.isLastStep.current;
const isFormValid = wizardForm.bindings.isFormValid.current;
```

## Dynamic Validation

```javascript
// Register a custom validator
form.methods.registerValidator('matchesPassword', (value, context) => {
  if (value !== context.formData.password) {
    return 'Passwords do not match';
  }
  return true;
});

// Use in a field definition
const confirmPasswordField = {
  id: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validation: {
    dynamicValidator: 'matchesPassword'
  }
};
```

## Enhanced Validation

```javascript
// Field with per-validation error messages
const passwordField = {
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    // Specific error messages for each validation rule
    errorMessages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters long',
      pattern: 'Password must include uppercase, lowercase, and numbers'
    },
    // Enable multiple error collection
    collectAllErrors: true
  }
};

// Field with multiple dynamic validators
const usernameField = {
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    // Multiple dynamic validators with custom parameters
    dynamicValidators: [
      {
        name: 'uniqueUsername', 
        params: { checkDatabase: true },
        errorMessage: 'This username is already taken'
      },
      {
        name: 'allowedCharacters',
        errorMessage: 'Username can only contain letters, numbers, and underscores'
      }
    ],
    collectAllErrors: true
  }
};
```

## Reactive UI Updates

```javascript
// Subscribe to form data changes
form.bindings.formData.subscribe(data => {
  console.log('Form data updated:', data);
  updateUI(data);
});

// Subscribe to validation errors
form.bindings.fieldErrors.subscribe(errors => {
  displayErrors(errors);
});
```

## Documentation

For detailed documentation and examples, see:

- [Features Guide](_media/features-guide.md) - Comprehensive listing of all features and capabilities
- [Usage Guide](_media/usage-guide.md) - Step-by-step guide to using the form controller
- [Validation Guide](_media/validation-guide.md) - In-depth guide to validation capabilities
- [Technical Guide](_media/technical-guide.md) - Implementation details and best practices
- [TypeScript Usage](_media/typescript-usage.md) - Guide to using the form controller with TypeScript
- [API Reference](_media/README.md) - Auto-generated API documentation with types and examples

## Use Cases

- **Multi-step Wizards** - Build complex, multi-step registration or checkout flows
- **Dynamic Forms** - Create forms that adapt based on user input
- **Complex Validation** - Implement interdependent field validation rules
- **Form State Management** - Maintain form state separate from UI components

## License

MIT © Odyssey Uplink Protocol Team
