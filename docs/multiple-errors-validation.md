# Enhanced Validation System

This document explains how to use the enhanced validation system that supports collecting multiple validation errors for a single field and specifying per-validation error messages.

## Overview

The form-controller now supports several advanced validation features:

1. **Multiple Error Collection**: Collect and display multiple validation errors for a field rather than stopping at the first error.
2. **Per-Validation Error Messages**: Define specific error messages for each type of validation rule.
3. **Multiple Dynamic Validators**: Apply multiple dynamic validators to a single field, each with its own parameters and error message.

These features are particularly useful for complex forms where detailed validation feedback improves user experience.

## How to Use

### Enabling Multiple Error Collection

To enable multiple error collection for a field, set the `collectAllErrors` flag in the field's validation object:

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
    errorMessage: 'Please enter a valid password',
    collectAllErrors: true // Enable multiple error collection
  }
}
```

### Per-Validation Error Messages

You can specify different error messages for each type of validation by using the `errorMessages` object:

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
    },
    collectAllErrors: true
  }
}
```

### Validation Priority

The validation system enforces the following priorities:

1. **Required Validation**: Always checked first. If a field is required and empty, other validations are skipped, following the best practices for form validation.
2. **Type-Specific Validations**: These include email format, min/max length, pattern validation, min/max value validation.
3. **Custom Validation**: User-provided validation functions.
4. **Dynamic Validation**: Context-aware validators registered with the system.

### Getting All Errors

When using the `validateField` function with `collectAllErrors` enabled, the result will include an `errors` array with all validation errors:

```javascript
const result = validateField(field, value, context, true);

if (!result.isValid) {
  console.log('All errors:', result.errors);
  // For display purposes, you might want to format these
  const formattedErrors = result.errors.join(' | ');
}
```

### In the Field Service

The FieldService has been updated to support displaying multiple errors. When `collectAllErrors` is enabled for a field, all errors will be combined (with a separator) into a single error message string.

## Multiple Dynamic Validators

You can now define multiple dynamic validators for a single field using the `dynamicValidators` array:

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    minLength: 3,
    maxLength: 20,
    dynamicValidators: [
      {
        name: 'uniqueUsername', 
        params: { checkExisting: true },
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

### Mixing Legacy and New Validators

The system maintains backward compatibility with the legacy single dynamic validator syntax:

```javascript
{
  id: 'confirmEmail',
  type: 'email',
  label: 'Confirm Email',
  validation: {
    // Legacy single validator
    dynamicValidator: 'equals',
    dynamicValidatorParams: {
      targetField: 'email',
      errorMessage: 'Email addresses must match'
    },
    // New multiple validators
    dynamicValidators: [
      {
        name: 'emailDomainCheck',
        params: { allowedDomains: ['company.com', 'partner.org'] },
        errorMessage: 'Only company domains are allowed'
      }
    ]
  }
}
```

Note: When both approaches are used, all validators will be executed according to the validation priority rules.

## Validation Priority

The validation system enforces the following priorities:

1. **Required Validation**: Always checked first. If a field is required and empty, other validations are skipped, following the best practices for form validation.
2. **Type-Specific Validations**: These include email format, min/max length, pattern validation, min/max value validation.
3. **Custom Validation**: User-provided validation functions.
4. **Dynamic Validation**: Context-aware validators registered with the system.

## Benefits

* **Better User Experience**: Users can see all validation issues at once, rather than fixing one issue only to encounter another.
* **More Specific Error Messages**: Tailored messages for each type of validation make it clearer what's wrong.
* **Richer Validation Logic**: Multiple dynamic validators allow for complex validation scenarios without custom code.
* **Reduced Form Submissions**: By showing all errors upfront, users can fix everything at once, reducing the number of form submission attempts.
* **Flexible Implementation**: You can enable these features on a per-field basis, allowing for targeted use where appropriate.

## Best Practices

* Use multiple error collection for complex fields with many validation rules.
* Define specific error messages for each validation type to be clear about what's wrong.
* Consider using separate error display components that can show errors as a list when multiple errors are present.
* Keep your validation error messages concise and clear, especially when multiple might display at once.
* Use the new `dynamicValidators` array for all new development (the legacy `dynamicValidator` is deprecated).
* Reserve multiple error collection for forms where showing all errors at once would be helpful - for simpler forms, the traditional approach might be more user-friendly.
