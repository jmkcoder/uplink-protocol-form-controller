# Validation Guide

This document provides a comprehensive guide to all validation capabilities in the @uplink-protocol/form-controller package.

## Table of Contents

1. [Validation Overview](#validation-overview)
2. [Built-in Validators](#built-in-validators)
3. [Dynamic Validators](#dynamic-validators)
4. [Custom Validators](#custom-validators)
5. [Validation Context](#validation-context)
6. [Error Messages](#error-messages)
7. [Multiple Error Collection](#multiple-error-collection)
8. [Enhanced Validation Features](#enhanced-validation-features)
9. [Advanced Validation Scenarios](#advanced-validation-scenarios)

## Validation Overview

The form-controller offers a robust validation system with multiple layers of validation:

- **Field validation**: Applied to individual fields
- **Step validation**: Applied to each form step
- **Form validation**: Applied to the entire form

Validation can be:
- **Declarative**: Defined in field configuration
- **Imperative**: Triggered through validation methods
- **Reactive**: Automatically triggered during navigation/submission

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
  
  // Legacy dynamic validator (deprecated)
  dynamicValidator?: string;
  dynamicValidatorParams?: Record<string, any>;
  
  // Enhanced features
  dynamicValidators?: Array<{
    name: string;
    params?: Record<string, any>;
    errorMessage?: string;
  }>;
  
  errorMessage?: string;
  errorMessages?: {
    required?: string;
    pattern?: string;
    minLength?: string;
    maxLength?: string;
    min?: string;
    max?: string;
    email?: string;
    custom?: string;
  };
  collectAllErrors?: boolean;
}
```

### Validation Priority

Validation rules are evaluated in the following order:

1. **Required validation**: Always checked first, regardless of validation order.
2. **Type-specific validations**: Based on field type (email, pattern, length, numeric range, etc.)
3. **Custom validation**: User-defined validation functions.
4. **Dynamic validation**: Context-aware validation using registered validators.

By default, validation stops on the first error encountered. To collect all validation errors, see the [Multiple Error Collection](#multiple-error-collection) section.

## Built-in Validators

### Required Validation

Ensures a field has a value:

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  required: true // Shorthand for validation: { required: true }
}
```

Or explicitly:

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    errorMessage: 'Username is required'
  }
}
```

### Pattern Validation

Validates against a regular expression pattern:

```javascript
{
  id: 'email',
  type: 'email',
  label: 'Email Address',
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address'
  }
}
```

### Length Validation

Validates text length:

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    maxLength: 64,
    errorMessage: 'Password must be between 8 and 64 characters'
  }
}
```

### Numeric Range Validation

Validates numeric values within a range:

```javascript
{
  id: 'age',
  type: 'number',
  label: 'Age',
  validation: {
    required: true,
    min: 18,
    max: 120,
    errorMessage: 'Age must be between 18 and 120'
  }
}
```

### Custom Inline Validation

Provides a custom validation function:

```javascript
{
  id: 'zipCode',
  type: 'text',
  label: 'Zip Code',
  validation: {
    custom: (value) => {
      if (!value) return true; // Skip if empty
      const isValid = /^\d{5}(-\d{4})?$/.test(value);
      return isValid ? true : 'Please enter a valid US zip code';
    }
  }
}
```

## Dynamic Validators

Dynamic validators can access the entire form state and react to other field values.

### Built-in Dynamic Validators

#### requiredIf

Makes a field required based on conditions:

```javascript
// Legacy approach (deprecated)
{
  id: 'otherReason',
  type: 'text',
  label: 'Please specify',
  validation: {
    dynamicValidator: 'requiredIf',
    dynamicValidatorParams: {
      condition: 'equals',
      fields: ['reason'],
      value: 'other',
      errorMessage: 'Please specify the reason'
    }
  }
}

// New approach with dynamicValidators array
{
  id: 'otherReason',
  type: 'text',
  label: 'Please specify',
  validation: {
    dynamicValidators: [
      {
        name: 'requiredIf',
        params: {
          condition: 'equals',
          fields: ['reason'],
          value: 'other'
        },
        errorMessage: 'Please specify the reason'
      }
    ]
  }
}
```

Supported conditions:
- `equals`: Required when a specified field equals a specific value
- `notEquals`: Required when a specified field doesn't equal a specific value
- `notEmpty`: Required when specified fields have values

#### equals

Validates that a field equals a specific value or another field's value:

```javascript
// Legacy approach (deprecated)
{
  id: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validation: {
    dynamicValidator: 'equals',
    dynamicValidatorParams: {
      targetField: 'password',
      errorMessage: 'Passwords do not match'
    }
  }
}

// New approach with dynamicValidators array
{
  id: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validation: {
    dynamicValidators: [
      {
        name: 'equals',
        params: {
          targetField: 'password'
        },
        errorMessage: 'Passwords do not match'
      }
    ]
  }
}
```

### Multiple Dynamic Validators

You can apply multiple dynamic validators to a single field:

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    minLength: 3,
    dynamicValidators: [
      {
        name: 'uniqueUsername',
        params: { checkDatabase: true },
        errorMessage: 'This username is already taken'
      },
      {
        name: 'noSpecialChars',
        errorMessage: 'Username cannot contain special characters'
      }
    ],
    collectAllErrors: true
  }
}
```

### Custom Dynamic Validators

You can create and register your own dynamic validators:
      errorMessage: 'Passwords must match'
    }
  }
}
```

## Custom Validators

### Registering Custom Validators

You can create and register your own dynamic validators:

```javascript
form.methods.registerValidator('matchesPassword', (value, context) => {
  if (!value) return true; // Skip if empty
  
  if (value !== context.formData.password) {
    return 'Passwords do not match';
  }
  
  return true;
});
```

### Using Custom Validators

Once registered, you can use your custom validators in field configuration:

```javascript
{
  id: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validation: {
    dynamicValidator: 'matchesPassword'
  }
}
```

### Unregistering Validators

You can remove custom validators when no longer needed:

```javascript
form.methods.unregisterValidator('matchesPassword');
```

## Validation Context

Dynamic validators receive a context object with the following properties:

```typescript
interface ValidatorContext {
  field: Field;          // The field configuration
  formData: Record<string, any>; // The entire form data (flattened)
  stepId: string;        // The ID of the current step
  fieldId: string;       // The ID of the field being validated
}
```

This allows validators to:
- Access other field values
- Read field configuration
- Know which step is being validated
- Make context-aware validation decisions

## Error Messages

Error messages can be specified in several ways:

### Default Error Messages

If no custom message is provided, the validator generates a default message.

### Custom Error Messages in Field Configuration

```javascript
{
  id: 'email',
  type: 'email',
  label: 'Email Address',
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address'
  }
}
```

### Per-Validation Error Messages

You can specify different error messages for each type of validation:

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    errorMessages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters long',
      pattern: 'Password must include uppercase, lowercase, and numbers'
    }
  }
}
```

### Error Messages from Validator Functions

```javascript
validation: {
  custom: (value) => {
    if (!value) return true;
    return isValid ? true : 'Custom error message';
  }
}
```

### Error Messages from Dynamic Validators

For legacy dynamic validators:
```javascript
validation: {
  dynamicValidator: 'requiredIf',
  dynamicValidatorParams: {
    // ...parameters
    errorMessage: 'This field is required based on your other selections'
  }
}
```

For new multiple dynamic validators:
```javascript
validation: {
  dynamicValidators: [
    {
      name: 'uniqueUsername',
      params: { checkExisting: true },
      errorMessage: 'This username is already taken'
    }
  ]
}
```

## Multiple Error Collection

By default, validation stops at the first error encountered. However, you can configure fields to collect all validation errors by using the `collectAllErrors` flag:

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    custom: (value) => {
      if (value.includes('password')) {
        return 'Password should not contain the word "password"';
      }
      return true;
    },
    collectAllErrors: true // Enable collecting all validation errors
  }
}
```

### Benefits of Multiple Error Collection

- **Improved UX**: Users can see all validation issues at once
- **Efficient Form Completion**: Reduces the number of submission attempts
- **Comprehensive Feedback**: Especially useful for complex fields

### Accessing Multiple Errors

When validating a field programmatically, you can access all collected errors:

```javascript
// In custom code that uses the validator directly
const result = validateField(field, value, context);
if (!result.isValid) {
  console.log('First error:', result.error);
  console.log('All errors:', result.errors);
}
```

For more details, see the [Multiple Errors Validation](./multiple-errors-validation.md) documentation.

## Enhanced Validation Features

The form-controller provides enhanced validation capabilities that make it easier to build sophisticated forms with rich validation feedback.

### Per-Validation Error Messages

You can specify different error messages for each validation rule using the `errorMessages` object:

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    errorMessages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters long',
      pattern: 'Password must include uppercase, lowercase, and numbers'
    }
  }
}
```

The supported error message keys include:
- `required`: For required field validation
- `pattern`: For pattern/regex validation
- `minLength`: For minimum text length validation
- `maxLength`: For maximum text length validation
- `min`: For minimum numeric value validation
- `max`: For maximum numeric value validation
- `email`: For email format validation
- `custom`: For custom validation functions

### Multiple Dynamic Validators

You can apply multiple dynamic validators to a single field:

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    dynamicValidators: [
      {
        name: 'uniqueUsername',
        params: { checkDatabase: true },
        errorMessage: 'This username is already taken'
      },
      {
        name: 'noSpecialChars',
        errorMessage: 'Username cannot contain special characters'
      }
    ]
  }
}
```

Each validator in the array can have:
- `name`: The registered validator name
- `params`: Custom parameters for the validator
- `errorMessage`: Specific error message for this validator

### Combining Enhanced Features

You can combine all enhanced validation features for maximum flexibility:

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    
    // Per-validation error messages
    errorMessages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      pattern: 'Password must include uppercase, lowercase, and numbers'
    },
    
    // Multiple dynamic validators with custom parameters
    dynamicValidators: [
      {
        name: 'passwordStrength',
        params: { minStrength: 3 },
        errorMessage: 'Your password is too weak'
      },
      {
        name: 'notPreviouslyUsed',
        params: { historyCheck: true },
        errorMessage: 'You cannot reuse a previous password'
      }
    ],
    
    // Collect all validation errors
    collectAllErrors: true
  }
}
```

See the [Multiple Errors Validation](./multiple-errors-validation.md) document for more examples and best practices.

## Advanced Validation Scenarios

### Asynchronous Validation

You can implement asynchronous validation by combining the form controller with your own async logic:

```javascript
// Field definition
const usernameField = {
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true
  }
};

// Async validation handler
const checkUsernameAvailability = async (username) => {
  // Clear any existing async errors
  form.methods.clearFieldError('account', 'username');
  
  try {
    const response = await fetch(`/api/check-username?username=${username}`);
    const { isAvailable } = await response.json();
    
    if (!isAvailable) {
      form.methods.setFieldError('account', 'username', 'Username already taken');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Username validation error:', error);
    form.methods.setFieldError('account', 'username', 'Could not validate username');
    return false;
  }
};

// Connect to UI
usernameInput.addEventListener('blur', async (e) => {
  const username = e.target.value;
  
  // First apply standard validation
  const isValid = form.methods.validateField('account', 'username', username);
  
  // If basic validation passes, check availability
  if (isValid && username) {
    const isAvailable = await checkUsernameAvailability(username);
    // Update UI based on result
  }
});
```

### Cross-Step Validation

You can implement validation that depends on fields in different steps:

```javascript
// Register a validator that checks across steps
form.methods.registerValidator('uniqueInList', (value, context) => {
  if (!value) return true;
  
  // Get items from another step
  const existingItems = context.formData.itemList || [];
  
  // Skip validation for the current item being edited
  const currentItemId = context.formData.currentItemId;
  
  const isDuplicate = existingItems.some(item => 
    item.name === value && item.id !== currentItemId
  );
  
  return isDuplicate ? 'This name already exists in your list' : true;
});
```

### Conditional Field Requirements

Make fields conditionally required based on complex logic:

```javascript
// Payment method scenario
{
  id: 'cardNumber',
  type: 'text',
  label: 'Card Number',
  validation: {
    dynamicValidator: 'requiredIf',
    dynamicValidatorParams: {
      condition: 'equals',
      fields: ['paymentMethod'],
      value: 'credit-card',
      errorMessage: 'Card number is required for credit card payments'
    }
  }
}
```

### Form-Level Validation

Implement validation at the form level:

```javascript
const submitForm = () => {
  // First validate all fields
  const isValid = form.methods.validateForm(true);
  
  if (isValid) {
    const formData = form.methods.getFlatData();
    
    // Perform form-level validation
    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        // Set a form-level error
        setFormError('End date must be after start date');
        return false;
      }
    }
    
    // Submit the data
    submitToServer(formData);
  }
};
```

### Complex Validation Rules

For very complex validation rules, you can create a dedicated validator:

```javascript
form.methods.registerValidator('passwordStrength', (value, context) => {
  if (!value) return true;
  
  let strength = 0;
  let feedback = '';
  
  // Length check
  if (value.length >= 8) strength += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[a-z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;
  
  // Custom password policy
  if (value.toLowerCase().includes(context.formData.username?.toLowerCase())) {
    feedback = 'Password cannot contain your username';
    strength = 0;
  }
  
  // Return feedback based on strength
  switch (strength) {
    case 0:
    case 1:
      return feedback || 'Password is very weak';
    case 2:
      return feedback || 'Password is weak';
    case 3:
      return true; // Acceptable
    case 4:
    case 5:
      return true; // Strong
  }
});
```

This validation guide provides a comprehensive overview of all validation capabilities in the form-controller package.
