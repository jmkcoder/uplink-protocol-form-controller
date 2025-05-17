# Form Controller Technical Documentation

This document provides technical implementation details for developers working with or extending the @uplink-protocol/form-controller package.

## Architecture Overview

The form-controller package is built using a service-oriented architecture with a reactive state management system.

### Core Components

1. **FormController**: The main entry point that initializes services and exposes the public API
2. **Services**: Specialized modules handling specific concerns:
   - **BaseService**: Foundation for reactive state management
   - **ConfigService**: Manages form configuration
   - **FieldService**: Handles field operations and validation
   - **FormService**: Manages form data
   - **InteractionService**: Handles user interactions
   - **StepperService**: Manages multi-step navigation
   - **ValidatorService**: Handles validation rules

### State Management

The form-controller uses a custom reactive state management system with three key concepts:

1. **Services**: Internal state containers with getters/setters and subscription capabilities
2. **Bindings**: Public reactive properties exposed to consumers
3. **Methods**: Public functions for interacting with the form

## Implementation Details

### Reactive Updates

The form-controller maintains state consistency using a pub/sub pattern:

1. Services maintain internal state
2. State changes trigger callback notifications
3. Bindings subscribe to service changes and expose current values
4. UI components can subscribe to binding changes

For example, updating a field value:

```javascript
// User updates a field
form.methods.updateField('personal', 'name', 'John');

// Internally:
// 1. FieldService updates formService state
// 2. FormService notifies subscribers
// 3. Binding callbacks are triggered
// 4. UI components react to the change
```

### Validation Pipeline

Field validation follows this process:

1. **Field-level validation**:
   - Check required fields
   - Apply pattern validation
   - Check length constraints
   - Apply custom validators

2. **Dynamic validation**:
   - Apply registered dynamic validators
   - Process validation with context

3. **Error management**:
   - Update fieldErrors state
   - Update stepsValidity state
   - Update derived states (isCurrentStepValid, isFormValid)

### State Cloning for Immutability

To maintain state integrity, the controller creates deep clones of state objects before modifications:

```typescript
// Example from FormService
public updateFieldValue(stepId: string, fieldId: string, value: any): void {
  const formData = this.cloneFormData();
  
  if (!formData[stepId]) {
    formData[stepId] = {};
  }
  
  formData[stepId][fieldId] = value;
  this.set(formData);
}

private cloneFormData(): Record<string, Record<string, any>> {
  return JSON.parse(JSON.stringify(this.get()));
}
```

## Best Practices

### Synchronous State Updates

Always update both service state and binding values for immediate access:

```typescript
// Example from StepperService
public goToStep(index: number): boolean {
  if (index < 0 || index >= this.configService.getTotalSteps()) {
    return false;
  }
  
  // Update the internal state
  this.set(index);
  
  // Update the binding's current value for immediate access
  this.binding.current = index;
  
  return true;
}
```

### Error State Management

Validation errors should be properly managed and cleared when no longer relevant:

```typescript
// Example from FieldService
public validateField(stepId: string, fieldId: string, value: any, showErrors = true): boolean {
  // Clear previous errors for this field
  this.clearFieldError(stepId, fieldId);
  
  // Perform validation...
  
  // Only set errors if showErrors is true
  if (!isValid && showErrors) {
    this.setFieldError(stepId, fieldId, errorMessage);
  }
  
  return isValid;
}
```

### Step Navigation

Ensure consistent state during step navigation:

```typescript
// Example from controller methods
methods: {
  nextStep(): number {
    // Validate current step before proceeding
    if (!controller.methods.validateCurrentStep(true)) {
      return currentIndex;
    }
    
    // Only proceed if validation passed
    const newIndex = Math.min(currentIndex + 1, totalSteps - 1);
    stepperService.set(newIndex);
    return newIndex;
  }
}
```

### Object Cloning

Always make proper deep clones of objects to ensure reactive updates:

```typescript
// Bad - shallow copy may not trigger reactivity
const updatedData = {...formData};

// Good - deep clone ensures all nested objects are new references
const updatedData = JSON.parse(JSON.stringify(formData));
```

## Common Pitfalls

### Stale Binding Values

Problem: Accessing binding values immediately after updates may return stale data.

Solution: Update both service state and binding current values:

```typescript
// Update service state
service.set(newValue);

// Also update binding current value for immediate access
binding.current = newValue;
```

### Missed Validation Errors

Problem: Validation errors not appearing when expected.

Solution: Ensure you're passing the showErrors flag when needed:

```typescript
// Won't show errors in UI but will return validity
const isValid = form.methods.validateField(stepId, fieldId, value, false);

// Will show errors in UI and return validity
const isValid = form.methods.validateField(stepId, fieldId, value, true);
```

### Form Reset Issues

Problem: Form reset doesn't clear all state.

Solution: Ensure you reset all aspects of form state:

```typescript
resetForm(): void {
  // Reset form data to initial values
  this.initializeFormData();
  
  // Clear all validation errors
  this.fieldErrorsService.set({});
  
  // Reset step validity state
  this.initializeStepValidationState();
  
  // Reset to first step
  this.stepperService.set(0);
}
```

## Extension Points

The form-controller is designed to be extended in the following ways:

### Custom Field Types

Add support for custom field types by:

1. Extending the Field interface type definition
2. Implementing appropriate validation for the field type
3. Creating a UI component to render and interact with the field

### Custom Validators

Register custom validators to handle complex validation rules:

```javascript
form.methods.registerValidator('uniqueUsername', async (value, context) => {
  // Skip validation for empty values (unless required)
  if (!value) return true;
  
  try {
    const response = await fetch(`/api/check-username?username=${value}`);
    const { isAvailable } = await response.json();
    
    return isAvailable ? true : 'Username already taken';
  } catch (error) {
    console.error('Username validation error:', error);
    return 'Could not validate username';
  }
});
```

### Service Extensions

Create additional services by extending BaseService:

```typescript
class CustomAnalyticsService extends BaseService<Record<string, any>> {
  constructor() {
    super({});
  }
  
  trackFieldChange(stepId: string, fieldId: string, value: any): void {
    const analytics = this.get();
    
    if (!analytics[stepId]) {
      analytics[stepId] = {};
    }
    
    analytics[stepId][fieldId] = {
      value,
      timestamp: new Date().toISOString(),
      interactionCount: (analytics[stepId][fieldId]?.interactionCount || 0) + 1
    };
    
    this.set(analytics);
  }
}
```

## Performance Considerations

### Large Forms

For forms with many fields, consider these optimizations:

1. **Lazy Validation**: Only validate fields on change, not on every render
2. **Selective Updates**: Only update changed parts of the form state
3. **Throttled Subscriptions**: Throttle binding callbacks for rapidly changing values

### Subscription Management

Always clean up subscriptions to prevent memory leaks:

```javascript
// Set up subscription
const unsubscribe = form.bindings.formData.subscribe(handleFormDataChange);

// Clean up when component is destroyed
useEffect(() => {
  return () => {
    unsubscribe();
  };
}, []);
```

## Integration Strategies

### React Integration

```javascript
import { useEffect, useState } from 'react';
import { FormController } from '@uplink-protocol/form-controller';

function FormComponent({ config }) {
  const [form] = useState(() => FormController(config));
  const [formData, setFormData] = useState(form.bindings.formData.current);
  const [errors, setErrors] = useState(form.bindings.fieldErrors.current);
  
  useEffect(() => {
    const unsubFormData = form.bindings.formData.subscribe(setFormData);
    const unsubErrors = form.bindings.fieldErrors.subscribe(setErrors);
    
    return () => {
      unsubFormData();
      unsubErrors();
    };
  }, [form]);
  
  const handleChange = (stepId, fieldId, value) => {
    form.methods.updateField(stepId, fieldId, value);
  };
  
  // Render form fields based on current step
  // ...
}
```

### Vue Integration

```javascript
import { onMounted, onUnmounted, ref } from 'vue';
import { FormController } from '@uplink-protocol/form-controller';

export default {
  props: ['config'],
  setup(props) {
    const form = FormController(props.config);
    const formData = ref(form.bindings.formData.current);
    const errors = ref(form.bindings.fieldErrors.current);
    
    let unsubFormData, unsubErrors;
    
    onMounted(() => {
      unsubFormData = form.bindings.formData.subscribe(data => {
        formData.value = data;
      });
      
      unsubErrors = form.bindings.fieldErrors.subscribe(data => {
        errors.value = data;
      });
    });
    
    onUnmounted(() => {
      unsubFormData && unsubFormData();
      unsubErrors && unsubErrors();
    });
    
    const handleChange = (stepId, fieldId, value) => {
      form.methods.updateField(stepId, fieldId, value);
    };
    
    return {
      form,
      formData,
      errors,
      handleChange
    };
  }
};
```

This technical documentation provides detailed implementation insights for developers working with the form-controller package.
