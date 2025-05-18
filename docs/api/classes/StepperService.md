[**@uplink-protocol/form-controller v0.2.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / StepperService

# Class: StepperService

Defined in: [services/stepper.service.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L7)

Service for managing multi-step form navigation

## Extends

- [`BaseService`](BaseService.md)\<`number`\>

## Constructors

### Constructor

> **new StepperService**(`initialStepIndex`, `configService`): `StepperService`

Defined in: [services/stepper.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L10)

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

Defined in: [services/base.service.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L13)

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

Defined in: [services/base.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L10)

The current value of the service state

#### Inherited from

[`BaseService`](BaseService.md).[`current`](BaseService.md#current)

## Accessors

### isFirstStep

#### Get Signature

> **get** **isFirstStep**(): `boolean`

Defined in: [services/stepper.service.ts:93](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L93)

Check if currently on the first step

##### Returns

`boolean`

True if on first step

***

### isLastStep

#### Get Signature

> **get** **isLastStep**(): `boolean`

Defined in: [services/stepper.service.ts:101](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L101)

Check if currently on the last step

##### Returns

`boolean`

True if on last step

## Methods

### get()

> **get**(): `number`

Defined in: [services/base.service.ts:56](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L56)

Get the current value

#### Returns

`number`

Current value

#### Inherited from

[`BaseService`](BaseService.md).[`get`](BaseService.md#get)

***

### goToStep()

> **goToStep**(`stepIndex`): `boolean`

Defined in: [services/stepper.service.ts:79](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L79)

Go to a specific step by index

#### Parameters

##### stepIndex

`number`

Target step index

#### Returns

`boolean`

True if navigation was successful, false otherwise

***

### nextStep()

> **nextStep**(`validateCallback?`): `number`

Defined in: [services/stepper.service.ts:19](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L19)

Navigate to the next step if possible

#### Parameters

##### validateCallback?

() => `boolean`

Optional validation callback that determines if navigation is allowed

#### Returns

`number`

New step index or current step if navigation isn't possible

***

### prevStep()

> **prevStep**(): `number`

Defined in: [services/stepper.service.ts:66](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L66)

Navigate to the previous step if possible

#### Returns

`number`

New step index or 0 if already at first step

***

### set()

> **set**(`value`): `void`

Defined in: [services/base.service.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L45)

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

Defined in: [services/base.service.ts:31](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L31)

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

Defined in: [services/stepper.service.ts:38](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/stepper.service.ts#L38)

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
