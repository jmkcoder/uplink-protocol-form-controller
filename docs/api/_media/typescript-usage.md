# Using Form Controller with TypeScript

This guide demonstrates how to use the form-controller package with TypeScript, leveraging type definitions for better developer experience.

## Basic Setup

```typescript
import { FormController, FormConfig, Field } from '@uplink-protocol/form-controller';

// Define your form configuration with proper types
const formConfig: FormConfig = {
  steps: [
    {
      id: 'contact',
      title: 'Contact Information',
      fields: {
        name: {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          required: true
        } as Field,
        email: {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }
        } as Field
      }
    }
  ]
};

// Initialize the form controller
const form = FormController(formConfig);
```

## TypeScript Benefits

Using TypeScript with form-controller provides several advantages:

1. **Type Checking**: Catch configuration errors at compile time
2. **IntelliSense**: Get autocompletion and hints as you type
3. **Documentation**: Access JSDoc comments directly in your IDE
4. **Refactoring**: Reliable refactoring with type safety

## Typed Event Handlers

```typescript
// Type-safe event handlers
const handleFieldChange = (stepId: string, fieldId: string, value: any) => {
  form.methods.updateField(stepId, fieldId, value);
};

// Type-safe form submission
const handleSubmit = () => {
  const result = form.methods.submitForm();
  
  if (result.success) {
    // TypeScript knows result.data is available
    console.log('Form data:', result.data);
  } else {
    // TypeScript knows result.errors is available
    console.error('Validation errors:', result.errors);
  }
};
```

## Custom Validators with TypeScript

```typescript
import { DynamicValidator, ValidatorContext } from '@uplink-protocol/form-controller';

// Create a strongly-typed custom validator
const passwordStrengthValidator: DynamicValidator = (value, context: ValidatorContext) => {
  if (!value) return true;
  
  // Type-safe access to context properties
  const { formData, field } = context;
  
  let strength = 0;
  
  // Length check
  if (value.length >= 8) strength += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[a-z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;
  
  // Return appropriate message based on strength
  if (strength < 3) {
    return 'Password must contain at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters';
  }
  
  return true;
};

// Register the validator
form.methods.registerValidator('passwordStrength', passwordStrengthValidator);
```

## Type-Safe Subscriptions

```typescript
// Type-safe reactive subscriptions
form.bindings.formData.subscribe((data) => {
  // TypeScript knows the structure of data
  const nameValue = data.contact?.name;
  console.log('Name updated:', nameValue);
});

form.bindings.fieldErrors.subscribe((errors) => {
  // TypeScript knows the structure of errors
  const emailError = errors.contact?.email;
  if (emailError) {
    showError('email', emailError);
  }
});
```

## Advanced Type Usage

```typescript
// Extract types from the form controller for reuse
type FormData = ReturnType<typeof form.methods.getAllData>;
type FlatFormData = ReturnType<typeof form.methods.getFlatData>;
type FormErrors = typeof form.bindings.fieldErrors.current;

// Create strongly-typed helper functions
function processFormData(data: FormData) {
  // Process the form data with type safety
}

function handleFormErrors(errors: FormErrors) {
  // Process errors with type safety
}

// Example usage
form.bindings.formData.subscribe(processFormData);
form.bindings.fieldErrors.subscribe(handleFormErrors);
```

This guide demonstrates how to leverage TypeScript's type system with the form-controller package for a better developer experience with increased reliability and productivity.
