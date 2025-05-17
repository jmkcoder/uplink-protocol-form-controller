[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormController

# Function: FormController()

> **FormController**(`config`): `object`

Defined in: [controller.ts:20](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/controller.ts#L20)

DynamicFormStepperController - A controller for multi-step forms with dynamic configuration

## Parameters

### config

[`FormConfig`](../interfaces/FormConfig.md)

The form configuration with steps and field definitions

## Returns

`object`

A controller instance with bindings and methods for form state management

### bindings

> **bindings**: `object`

#### bindings.config

> **config**: `object`

#### bindings.config.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

[`FormConfig`](../interfaces/FormConfig.md)

##### Returns

`void`

#### bindings.config.current

> **current**: [`FormConfig`](../interfaces/FormConfig.md) = `config`

#### bindings.config.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

[`FormConfig`](../interfaces/FormConfig.md)

##### Returns

`void`

#### bindings.config.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.currentStep

> **currentStep**: `object`

#### bindings.currentStep.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

[`FormStep`](../interfaces/FormStep.md)

##### Returns

`void`

#### bindings.currentStep.current

> **current**: [`FormStep`](../interfaces/FormStep.md)

#### bindings.currentStep.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

[`FormStep`](../interfaces/FormStep.md)

##### Returns

`void`

#### bindings.currentStep.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.currentStepIndex

> **currentStepIndex**: `object`

#### bindings.currentStepIndex.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`number`

##### Returns

`void`

#### bindings.currentStepIndex.current

> **current**: `number` = `0`

#### bindings.currentStepIndex.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`number`

##### Returns

`void`

#### bindings.currentStepIndex.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.fieldErrors

> **fieldErrors**: `object`

#### bindings.fieldErrors.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`Record`\<`string`, `Record`\<`string`, `string`\>\>

##### Returns

`void`

#### bindings.fieldErrors.current

> **current**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### bindings.fieldErrors.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`Record`\<`string`, `Record`\<`string`, `string`\>\>

##### Returns

`void`

#### bindings.fieldErrors.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.formData

> **formData**: `object`

#### bindings.formData.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`Record`\<`string`, `Record`\<`string`, `any`\>\>

##### Returns

`void`

#### bindings.formData.current

> **current**: `Record`\<`string`, `Record`\<`string`, `any`\>\> = `initialFormData`

#### bindings.formData.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`Record`\<`string`, `Record`\<`string`, `any`\>\>

##### Returns

`void`

#### bindings.formData.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.isCurrentStepValid

> **isCurrentStepValid**: `object`

#### bindings.isCurrentStepValid.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isCurrentStepValid.current

> **current**: `boolean` = `false`

#### bindings.isCurrentStepValid.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isCurrentStepValid.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.isFirstStep

> **isFirstStep**: `object`

#### bindings.isFirstStep.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isFirstStep.current

> **current**: `boolean` = `true`

#### bindings.isFirstStep.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isFirstStep.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.isFormValid

> **isFormValid**: `object`

#### bindings.isFormValid.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isFormValid.current

> **current**: `boolean` = `false`

#### bindings.isFormValid.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isFormValid.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.isLastStep

> **isLastStep**: `object`

#### bindings.isLastStep.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isLastStep.current

> **current**: `boolean`

#### bindings.isLastStep.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### bindings.isLastStep.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.stepsValidity

> **stepsValidity**: `object`

#### bindings.stepsValidity.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`Record`\<`string`, `boolean`\>

##### Returns

`void`

#### bindings.stepsValidity.current

> **current**: `Record`\<`string`, `boolean`\> = `stepValidationState`

#### bindings.stepsValidity.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`Record`\<`string`, `boolean`\>

##### Returns

`void`

#### bindings.stepsValidity.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

#### bindings.totalSteps

> **totalSteps**: `object`

#### bindings.totalSteps.\_callbacks

> **\_callbacks**: (`value`) => `void`[]

##### Parameters

###### value

`number`

##### Returns

`void`

#### bindings.totalSteps.current

> **current**: `number` = `config.steps.length`

#### bindings.totalSteps.set()

> **set**: (`value`) => `void`

##### Parameters

###### value

`number`

##### Returns

`void`

#### bindings.totalSteps.subscribe()

> **subscribe**: (`callback`) => () => `void`

##### Parameters

###### callback

(`value`) => `void`

##### Returns

> (): `void`

###### Returns

`void`

### methods

> **methods**: `object`

#### methods.addStep()

> **addStep**: (`step`, `index?`) => `number`

##### Parameters

###### step

[`FormStep`](../interfaces/FormStep.md)

###### index?

`number`

##### Returns

`number`

#### methods.getAllData()

> **getAllData**: () => `Record`\<`string`, `Record`\<`string`, `any`\>\>

##### Returns

`Record`\<`string`, `Record`\<`string`, `any`\>\>

#### methods.getAvailableValidators()

> **getAvailableValidators**: () => `string`[]

##### Returns

`string`[]

#### methods.getFlatData()

> **getFlatData**: () => `Record`\<`string`, `any`\>

##### Returns

`Record`\<`string`, `any`\>

#### methods.getStepData()

> **getStepData**: (`stepId`) => `Record`\<`string`, `any`\>

##### Parameters

###### stepId

`string`

##### Returns

`Record`\<`string`, `any`\>

#### methods.goToStep()

> **goToStep**: (`stepIndex`) => `boolean`

##### Parameters

###### stepIndex

`number`

##### Returns

`boolean`

#### methods.nextStep()

> **nextStep**: () => `number`

##### Returns

`number`

#### methods.prevStep()

> **prevStep**: () => `number`

##### Returns

`number`

#### methods.registerValidator()

> **registerValidator**: (`name`, `validatorFn`) => `void`

##### Parameters

###### name

`string`

###### validatorFn

[`DynamicValidator`](../type-aliases/DynamicValidator.md)

##### Returns

`void`

#### methods.removeStep()

> **removeStep**: (`stepId`) => `boolean`

##### Parameters

###### stepId

`string`

##### Returns

`boolean`

#### methods.resetForm()

> **resetForm**: () => `void`

##### Returns

`void`

#### methods.submitForm()

> **submitForm**: () => `object`

##### Returns

`object`

###### data?

> `optional` **data**: `any`

###### errors?

> `optional` **errors**: `any`

###### success

> **success**: `boolean`

#### methods.unregisterValidator()

> **unregisterValidator**: (`name`) => `boolean`

##### Parameters

###### name

`string`

##### Returns

`boolean`

#### methods.updateConfig()

> **updateConfig**: (`newConfig`) => `void`

##### Parameters

###### newConfig

[`FormConfig`](../interfaces/FormConfig.md)

##### Returns

`void`

#### methods.updateField()

> **updateField**: (`stepId`, `fieldId`, `value`) => `void`

##### Parameters

###### stepId

`string`

###### fieldId

`string`

###### value

`any`

##### Returns

`void`

#### methods.validateCurrentStep()

> **validateCurrentStep**: (`showErrors`) => `boolean`

##### Parameters

###### showErrors

`boolean` = `true`

##### Returns

`boolean`

#### methods.validateCurrentStepWithTouchedErrors()

> **validateCurrentStepWithTouchedErrors**: () => `boolean`

##### Returns

`boolean`

#### methods.validateField()

> **validateField**: (`stepId`, `fieldId`, `value?`, `showErrors`) => `boolean`

##### Parameters

###### stepId

`string`

###### fieldId

`string`

###### value?

`any`

###### showErrors?

`boolean` = `true`

##### Returns

`boolean`

#### methods.validateForm()

> **validateForm**: (`showErrors`) => `boolean`

##### Parameters

###### showErrors

`boolean` = `true`

##### Returns

`boolean`

#### methods.validateStep()

> **validateStep**: (`stepId`, `showErrors`) => `boolean`

##### Parameters

###### stepId

`string`

###### showErrors

`boolean` = `true`

##### Returns

`boolean`

#### methods.validateStepWithTouchedErrors()

> **validateStepWithTouchedErrors**: (`stepId`) => `boolean`

##### Parameters

###### stepId

`string`

##### Returns

`boolean`
