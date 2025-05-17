[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / ConfigService

# Class: ConfigService

Defined in: [services/config.service.ts:8](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L8)

Service for managing form configuration

## Extends

- [`BaseService`](BaseService.md)\<[`FormConfig`](../interfaces/FormConfig.md)\>

## Constructors

### Constructor

> **new ConfigService**(`initialConfig`): `ConfigService`

Defined in: [services/config.service.ts:9](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L9)

#### Parameters

##### initialConfig

[`FormConfig`](../interfaces/FormConfig.md)

#### Returns

`ConfigService`

#### Overrides

[`BaseService`](BaseService.md).[`constructor`](BaseService.md#constructor)

## Properties

### \_callbacks

> `protected` **\_callbacks**: (`value`) => `void`[] = `[]`

Defined in: [services/base.service.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L13)

Array of callback functions subscribed to state changes

#### Parameters

##### value

[`FormConfig`](../interfaces/FormConfig.md)

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`_callbacks`](BaseService.md#_callbacks)

***

### current

> `protected` **current**: [`FormConfig`](../interfaces/FormConfig.md)

Defined in: [services/base.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L10)

The current value of the service state

#### Inherited from

[`BaseService`](BaseService.md).[`current`](BaseService.md#current)

## Accessors

### totalSteps

#### Get Signature

> **get** **totalSteps**(): `number`

Defined in: [services/config.service.ts:93](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L93)

Get total number of steps

##### Returns

`number`

Total number of steps

## Methods

### addStep()

> **addStep**(`step`, `index?`): `number`

Defined in: [services/config.service.ts:39](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L39)

Add a new step to the form configuration

#### Parameters

##### step

[`FormStep`](../interfaces/FormStep.md)

New form step

##### index?

`number`

Position to insert the step (defaults to end)

#### Returns

`number`

New steps length

***

### get()

> **get**(): [`FormConfig`](../interfaces/FormConfig.md)

Defined in: [services/base.service.ts:56](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L56)

Get the current value

#### Returns

[`FormConfig`](../interfaces/FormConfig.md)

Current value

#### Inherited from

[`BaseService`](BaseService.md).[`get`](BaseService.md#get)

***

### getStepById()

> **getStepById**(`stepId`): `undefined` \| [`FormStep`](../interfaces/FormStep.md)

Defined in: [services/config.service.ts:76](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L76)

Get the step by ID

#### Parameters

##### stepId

`string`

Step ID

#### Returns

`undefined` \| [`FormStep`](../interfaces/FormStep.md)

Form step or undefined if not found

***

### getStepByIndex()

> **getStepByIndex**(`index`): `undefined` \| [`FormStep`](../interfaces/FormStep.md)

Defined in: [services/config.service.ts:85](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L85)

Get step by index

#### Parameters

##### index

`number`

Step index

#### Returns

`undefined` \| [`FormStep`](../interfaces/FormStep.md)

Form step or undefined if index is out of bounds

***

### removeStep()

> **removeStep**(`stepId`): `boolean`

Defined in: [services/config.service.ts:58](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L58)

Remove a step from the form configuration

#### Parameters

##### stepId

`string`

ID of the step to remove

#### Returns

`boolean`

Success flag

***

### set()

> **set**(`value`): `void`

Defined in: [services/base.service.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L45)

Update the service value and notify all subscribers.

#### Parameters

##### value

[`FormConfig`](../interfaces/FormConfig.md)

New value to set

#### Returns

`void`

#### Inherited from

[`BaseService`](BaseService.md).[`set`](BaseService.md#set)

***

### subscribe()

> **subscribe**(`callback`): () => `void`

Defined in: [services/base.service.ts:31](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L31)

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

### updateConfig()

> **updateConfig**(`newConfig`): `void`

Defined in: [services/config.service.ts:16](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L16)

Update the entire form configuration

#### Parameters

##### newConfig

[`FormConfig`](../interfaces/FormConfig.md)

New form configuration

#### Returns

`void`

***

### updateConfigAndReset()

> **updateConfigAndReset**(`newConfig`, `resetCallback`): `void`

Defined in: [services/config.service.ts:25](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/config.service.ts#L25)

Update the form configuration and reset related state

#### Parameters

##### newConfig

[`FormConfig`](../interfaces/FormConfig.md)

New form configuration

##### resetCallback

() => `void`

Function to reset the form state

#### Returns

`void`
