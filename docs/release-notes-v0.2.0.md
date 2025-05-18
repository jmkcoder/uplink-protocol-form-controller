# Version 0.2.0 Release Notes

We're excited to announce the release of version 0.2.0 of the @uplink-protocol/form-controller package!

## What's New

### Enhanced Validation System
- **Multiple Error Collection**: Now supports collecting and displaying multiple validation errors for a single field
- **Per-Validation Error Messages**: Custom error messages for each specific validation rule
- **Dynamic Validation Improvements**: Better context awareness for validators that depend on other field values

### Dynamic Form Modification
- **Improved Step Management**: More robust API for adding and removing steps at runtime
- **Better Step Navigation**: Enhanced navigation controls with improved validation integration

### Performance & Stability
- **Optimized Form State Updates**: Reduced unnecessary re-renders and state changes
- **Enhanced Error Handling**: More consistent error management across components
- **Fixed Edge Cases**: Resolved various corner cases in multi-step validation

## Migration Guide

This release is backwards compatible with v0.1.x. To upgrade:

```bash
npm install @uplink-protocol/form-controller@latest
```

### New Features Usage

#### Multiple Error Collection

```typescript
const formConfig = {
  steps: [{
    id: 'personal',
    title: 'Personal Information',
    fields: {
      email: {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        validation: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          collectAllErrors: true, // Enable multiple error collection
          errorMessages: {
            required: 'Email address is required',
            pattern: 'Please enter a valid email address'
          }
        }
      }
    }
  }]
};
```

#### Dynamic Validators with Custom Error Messages

```typescript
const formConfig = {
  steps: [{
    id: 'account',
    title: 'Account Information',
    fields: {
      password: {
        id: 'password',
        type: 'password',
        label: 'Password',
        validation: {
          required: true,
          dynamicValidators: [
            { 
              name: 'passwordStrength', 
              params: { minStrength: 3 },
              errorMessage: 'Password must contain uppercase, lowercase, number, and special character'
            }
          ]
        }
      }
    }
  }]
};
```

## Documentation

For full documentation, visit:
- [Usage Guide](https://github.com/uplink-protocol/form-controller/docs/usage-guide.md)
- [Validation Guide](https://github.com/uplink-protocol/form-controller/docs/validation-guide.md)
- [API Reference](https://github.com/uplink-protocol/form-controller/docs/api/README.md)

## Feedback

We value your feedback! Please submit any issues or feature requests through our [GitHub Issues](https://github.com/uplink-protocol/form-controller/issues) page.
