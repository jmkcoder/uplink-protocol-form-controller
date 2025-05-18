[**@uplink-protocol/form-controller v0.2.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormService

# Class: FormService

Defined in: [services/form.service.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L7)

Service for managing form data and submission

## Extends

- [`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `any`\>\>\>

## Constructors

### Constructor

> **new FormService**(`initialFormData`, `configService`, `fieldErrorsService`, `stepsValidityService`): `FormService`

Defined in: [services/form.service.ts:11](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L11)

#### Parameters

##### initialFormData

`Record`\<`string`, `Record`\<`string`, `any`\>\>

##### configService

[`ConfigService`](ConfigService.md)

##### fieldErrorsService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

##### stepsValidityService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

#### Returns

`FormService`

#### Overrides

[`BaseService`](BaseService.md).[`constructor`](BaseService.md#constructor)

## Properties

### \_callbacks

> `protected` **\_callbacks**: (`value`) => `void`[] = `[]`

Defined in: [services/base.service.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L13)

Array of callback functions subscribed to state changes

#### Parameters

##### value

`Record`

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`_callbacks`](BaseService.md#_callbacks)

***

### current

> `protected` **current**: `Record`

Defined in: [services/base.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L10)

The current value of the service state

#### Inherited from

[`BaseService`](BaseService.md).[`current`](BaseService.md#current)

## Methods

### completeReset()

> **completeReset**(`resetTouchTracking`, `validateForm`): `void`

Defined in: [services/form.service.ts:160](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L160)

Completely reset the form, touch tracking, and validation state

#### Parameters

##### resetTouchTracking

() => `void`

Function to reset touch tracking

##### validateForm

() => `void`

Function to validate the entire form

#### Returns

`void`

***

### get()

> **get**(): `Record`

Defined in: [services/base.service.ts:56](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L56)

Get the current value

#### Returns

`Record`

Current value

#### Inherited from

[`BaseService`](BaseService.md).[`get`](BaseService.md#get)

***

### getAllData()

> **getAllData**(): `Record`\<`string`, `Record`\<`string`, `any`\>\>

Defined in: [services/form.service.ts:65](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L65)

Get all form data

#### Returns

`Record`\<`string`, `Record`\<`string`, `any`\>\>

Complete form data

***

### getFlatData()

> **getFlatData**(): `Record`\<`string`, `any`\>

Defined in: [services/form.service.ts:73](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L73)

Get flattened form data (merged from all steps)

#### Returns

`Record`\<`string`, `any`\>

Flattened form data

***

### getStepData()

> **getStepData**(`stepId`): `Record`\<`string`, `any`\>

Defined in: [services/form.service.ts:57](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L57)

Get form data for a specific step

#### Parameters

##### stepId

`string`

Step ID

#### Returns

`Record`\<`string`, `any`\>

Step data or empty object if step doesn't exist

***

### resetForm()

> **resetForm**(`defaultValues?`): `void`

Defined in: [services/form.service.ts:89](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L89)

Reset form data to initial values

#### Parameters

##### defaultValues?

`Record`\<`string`, `any`\>

Optional custom default values

#### Returns

`void`

***

### set()

> **set**(`value`): `void`

Defined in: [services/base.service.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/base.service.ts#L45)

Update the service value and notify all subscribers.

#### Parameters

##### value

`Record`

New value to set

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`set`](BaseService.md#set)

***

### submitForm()

> **submitForm**(`validateAndMarkTouched`, `findFirstInvalidStep`, `goToStep`): `object`

Defined in: [services/form.service.ts:120](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L120)

Handle form submission logic with integrated validation

#### Parameters

##### validateAndMarkTouched

() => `boolean`

Function to validate the entire form and mark fields touched

##### findFirstInvalidStep

() => `number`

Function to find the first invalid step

##### goToStep

(`index`) => `void`

Function to navigate to a step by index

#### Returns

`object`

Submission result object

##### data?

> `optional` **data**: `any`

##### errors?

> `optional` **errors**: `any`

##### success

> **success**: `boolean`

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

### updateField()

> **updateField**(`stepId`, `fieldId`, `value`): `void`

Defined in: [services/form.service.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/form.service.ts#L29)

Update a field value

#### Parameters

##### stepId

`string`

Step ID

##### fieldId

`string`

Field ID

##### value

`any`

New field value

#### Returns

`void`
