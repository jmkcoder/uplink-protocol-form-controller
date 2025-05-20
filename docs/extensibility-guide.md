# Form Controller Extensibility Guide

This document provides a guide on how to extend the FormControllerClass to create custom form controllers with specialized behavior.

## Overview

Thanks to the class-based architecture refactoring, the `FormControllerClass` has been designed to be highly extensible. You can create custom form controllers by extending this class and overriding specific methods to customize behavior without duplicating code.

## Extensibility Features

The `FormControllerClass` provides several extension points:

- **Protected properties** for access in subclasses
- **Protected methods** that can be overridden
- **Lifecycle hooks** at various stages of initialization
- **Modular service architecture** for targeted customization

## Creating a Custom Form Controller

To create a custom form controller, extend the `FormControllerClass`:

```typescript
import { FormControllerClass, FormConfig } from '@uplink-protocol/form-controller';

export class CustomFormController extends FormControllerClass {
  constructor(config: FormConfig) {
    super(config);
    // Additional initialization if needed
  }
  
  // Override methods as needed
}
```

## Extension Points

### Protected Properties

All service instances and state objects are accessible in subclasses:

```typescript
class CustomFormController extends FormControllerClass {
  customMethod() {
    // Access services directly
    const fieldData = this.fieldService.getFieldData(stepId, fieldId);
    
    // Access manager services
    this.formManagerService.customOperation();
    
    // Access state
    const data = this.initialFormData;
  }
}
```

### Initialization Hooks

You can customize the initialization process by overriding these methods:

#### 1. `setupInitialFormData`

Override to customize how initial form data is set up:

```typescript
protected setupInitialFormData(config: FormConfig): void {
  // Call the parent implementation first
  super.setupInitialFormData(config);
  
  // Add custom logic
  config.steps.forEach(step => {
    // Add default values for custom fields
    this.initialFormData[step.id]['customField'] = 'default value';
  });
}
```

#### 2. `initializeServices`

Override to customize service initialization:

```typescript
protected initializeServices(config: FormConfig): void {
  // Call the parent implementation
  super.initializeServices(config);
  
  // Replace a service with a custom implementation
  this.validatorService = new EnhancedValidatorService();
  
  // Add additional services
  this.myCustomService = new MyCustomService(config);
}
```

#### 3. `initializeManagerServices`

Override to customize manager service initialization:

```typescript
protected initializeManagerServices(): void {
  // Call the parent implementation
  super.initializeManagerServices();
  
  // Replace a manager with a custom implementation
  this.navigationManager = new CustomNavigationManager(
    this.stepperService,
    this.configService,
    this.fieldService,
    this.interactionService
  );
}
```

#### 4. `initializeMethods`

Override to customize or extend available controller methods:

```typescript
protected initializeMethods(): void {
  // Call the parent implementation to get all standard methods
  super.initializeMethods();
  
  // Add custom methods
  this.methods.customSubmit = () => {
    // Custom submission logic
    this.methods.submitForm();
    // Additional processing after submission
    this.sendDataToServer();
  };
  
  // Override existing methods
  const originalSubmit = this.methods.submitForm;
  this.methods.submitForm = () => {
    // Pre-processing
    this.beforeSubmit();
    
    // Call original method
    const result = originalSubmit();
    
    // Post-processing
    this.afterSubmit();
    
    return result;
  };
}
```

#### 5. `initializeStepValidation`

Override to customize the initial step validation behavior:

```typescript
protected initializeStepValidation(): void {
  // Call the parent implementation
  super.initializeStepValidation();
  
  // Add custom validation logic
  this.validateCustomRules();
}
```

## Examples

### Example 1: Creating a Form Controller with Analytics

```typescript
import { FormControllerClass, FormConfig } from '@uplink-protocol/form-controller';

export class AnalyticsFormController extends FormControllerClass {
  private analyticsService: AnalyticsService;
  
  constructor(config: FormConfig) {
    super(config);
    this.analyticsService = new AnalyticsService();
  }
  
  protected initializeMethods(): void {
    super.initializeMethods();
    
    // Wrap navigation methods with analytics
    const originalNextStep = this.methods.nextStep;
    this.methods.nextStep = () => {
      const previousStep = this.bindings.currentStep.current.id;
      const result = originalNextStep();
      const currentStep = this.bindings.currentStep.current.id;
      
      this.analyticsService.trackNavigation(previousStep, currentStep);
      return result;
    };
    
    // Wrap submission with analytics
    const originalSubmit = this.methods.submitForm;
    this.methods.submitForm = () => {
      const result = originalSubmit();
      if (result.success) {
        this.analyticsService.trackCompletion(result.data);
      }
      return result;
    };
  }
}
```

### Example 2: Custom Validation Form Controller

```typescript
import { FormControllerClass, FormConfig } from '@uplink-protocol/form-controller';

export class EnhancedValidationController extends FormControllerClass {
  constructor(config: FormConfig) {
    super(config);
  }
  
  protected initializeServices(config: FormConfig): void {
    super.initializeServices(config);
    
    // Replace the validator service with an enhanced one
    this.validatorService = new EnhancedValidatorService();
  }
  
  protected initializeMethods(): void {
    super.initializeMethods();
    
    // Add advanced validation methods
    this.methods.validateWithRules = (rules) => {
      return this.validatorService.validateWithCustomRules(
        this.formService.getAllData(),
        rules
      );
    };
  }
  
  protected initializeStepValidation(): void {
    super.initializeStepValidation();
    
    // Add cross-field validation
    this.methods.validateCrossFieldRules();
  }
}
```

## Best Practices

1. **Call super methods first**: When overriding methods, call the parent implementation first unless you want to completely replace the behavior.

2. **Avoid modifying base services directly**: Instead of modifying the base services, create enhanced services and replace the references in your subclass.

3. **Maintain the services architecture**: If adding new services, follow the existing pattern of keeping core services separate from manager services.

4. **Use composition for complex extensions**: For very complex extensions, consider composing multiple controllers rather than deeply nesting inheritance.

5. **Document your extensions**: Make sure to document your custom controller's features and how they differ from the base implementation.

## Conclusion

The refactored class-based architecture of the FormControllerClass makes it highly extensible, allowing for customization at various levels. By extending the base class and overriding specific methods, you can create specialized form controllers tailored to specific needs without duplicating code.
