[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / StepperService

# Class: StepperService

Defined in: [services/stepper.service.ts:8](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L8)

Service for managing multi-step form navigation

## Extends

- [`BaseService`](BaseService.md)\<`number`\>

## Constructors

### Constructor

> **new StepperService**(`initialStepIndex`, `configService`): `StepperService`

Defined in: [services/stepper.service.ts:11](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L11)

#### Parameters

##### initialStepIndex

`number`

##### configService

[`ConfigService`](ConfigService.md)

#### Returns

`StepperService`

#### Overrides

[`BaseService`](BaseService.md).[`constructor`](BaseService.md#constructor)

## Properties

### \_callbacks

> `protected` **\_callbacks**: (`value`) => `void`[] = `[]`

Defined in: [services/base.service.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/base.service.ts#L13)

Array of callback functions subscribed to state changes

#### Parameters

##### value

`number`

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`_callbacks`](BaseService.md#_callbacks)

***

### current

> `protected` **current**: `number`

Defined in: [services/base.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/base.service.ts#L10)

The current value of the service state

#### Inherited from

[`BaseService`](BaseService.md).[`current`](BaseService.md#current)

## Accessors

### isFirstStep

#### Get Signature

> **get** **isFirstStep**(): `boolean`

Defined in: [services/stepper.service.ts:95](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L95)

Check if currently on the first step

##### Returns

`boolean`

True if on first step

***

### isLastStep

#### Get Signature

> **get** **isLastStep**(): `boolean`

Defined in: [services/stepper.service.ts:103](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L103)

Check if currently on the last step

##### Returns

`boolean`

True if on last step

## Methods

### get()

> **get**(): `number`

Defined in: [services/base.service.ts:56](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/base.service.ts#L56)

Get the current value

#### Returns

`number`

Current value

#### Inherited from

[`BaseService`](BaseService.md).[`get`](BaseService.md#get)

***

### goToStep()

> **goToStep**(`stepIndex`): `boolean`

Defined in: [services/stepper.service.ts:81](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L81)

Go to a specific step by index

#### Parameters

##### stepIndex

`number`

Target step index

#### Returns

`boolean`

True if navigation was successful, false otherwise

***

### goToStepWithBindings()

> **goToStepWithBindings**(`stepIndex`, `updateBindings`): `boolean`

Defined in: [services/stepper.service.ts:177](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L177)

Enhanced version of goToStep that also updates bindings

#### Parameters

##### stepIndex

`number`

Target step index

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update bindings after navigation

#### Returns

`boolean`

True if navigation succeeded, false otherwise

***

### nextStep()

> **nextStep**(`validateCallback?`): `number`

Defined in: [services/stepper.service.ts:21](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L21)

Navigate to the next step if possible

#### Parameters

##### validateCallback?

() => `boolean`

Optional validation callback that determines if navigation is allowed

#### Returns

`number`

New step index or current step if navigation isn't possible

***

### nextStepWithValidation()

> **nextStepWithValidation**(`currentStep`, `markFieldsTouched`, `validateCurrentStep`, `updateBindings`): `number`

Defined in: [services/stepper.service.ts:116](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L116)

Validate current step and navigate to next if valid
Also updates bindings to ensure immediate access to current values

#### Parameters

##### currentStep

[`FormStep`](../interfaces/FormStep.md)

The current step object

##### markFieldsTouched

(`stepId`, `touched`) => `void`

Function to mark fields as touched

##### validateCurrentStep

(`showErrors`) => `boolean`

Function to validate the current step

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update bindings after navigation

#### Returns

`number`

New step index or current step if navigation fails

***

### prevStep()

> **prevStep**(): `number`

Defined in: [services/stepper.service.ts:68](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L68)

Navigate to the previous step if possible

#### Returns

`number`

New step index or 0 if already at first step

***

### prevStepWithBindings()

> **prevStepWithBindings**(`updateBindings`): `number`

Defined in: [services/stepper.service.ts:152](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L152)

Enhanced version of prevStep that also updates bindings

#### Parameters

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update bindings after navigation

#### Returns

`number`

New step index or current index if navigation fails

***

### set()

> **set**(`value`): `void`

Defined in: [services/base.service.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/base.service.ts#L45)

Update the service value and notify all subscribers.

#### Parameters

##### value

`number`

New value to set

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`set`](BaseService.md#set)

***

### subscribe()

> **subscribe**(`callback`): () => `void`

Defined in: [services/base.service.ts:31](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/base.service.ts#L31)

Subscribe to changes in the service value.
Callback is immediately invoked with the current value.

#### Parameters

##### callback

(`value`) => `void`

Function to be called when value changes

#### Returns

An unsubscribe function that removes this subscription

> (): `void`

##### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`subscribe`](BaseService.md#subscribe)

***

### validateAndNext()

> **validateAndNext**(`currentStepId`, `markStepTouched`, `validateStep`): `number`

Defined in: [services/stepper.service.ts:40](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/stepper.service.ts#L40)

Validate current step and navigate to next if valid

#### Parameters

##### currentStepId

`string`

Current step ID for touch marking

##### markStepTouched

(`stepId`, `touched`) => `void`

Function to mark all fields in step as touched

##### validateStep

(`showErrors`) => `boolean`

Function to validate the current step

#### Returns

`number`

New step index or current step if validation fails
