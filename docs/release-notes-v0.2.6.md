# Release Notes v0.2.6

## Feature Additions
- Added `ConfigManagerService` with improved configuration management capabilities
- Added ability to dynamically add and remove form steps with proper state management
- Added support for full form reset with `updateConfigWithFullReset` method

## Documentation Updates
- Updated API documentation to include new `ConfigManagerService` methods
- Enhanced examples to demonstrate dynamic step management

## Internal Improvements
- Improved form state management and cleanup when modifying form structure
- Better coordination between services for configuration updates

## Getting Started

```typescript
// Example of dynamically adding and removing steps
const formController = new FormController({...});
const configManager = formController.getService('configManager');

// Add a new step dynamically
const newStep = {
  id: 'dynamic-step',
  title: 'Dynamic Step',
  fields: {
    'dynamic-field': {
      label: 'Dynamic Field',
      type: 'text',
      validation: {
        required: true
      }
    }
  }
};

// Add step at a specific position (optional second parameter)
configManager.addStepWithFormData(newStep, 1);

// Remove a step and clean up related state
configManager.removeStepWithCleanup('dynamic-step');

// Reset form with a new configuration
configManager.updateConfigWithFullReset(newConfig);
```
