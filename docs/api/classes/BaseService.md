[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / BaseService

# Class: BaseService\<T\>

Defined in: [services/base.service.ts:8](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L8)

Base class for reactive services.
Provides common state management and subscription functionality for all derived services.

## Extended by

- [`ConfigService`](ConfigService.md)
- [`FormService`](FormService.md)
- [`StepperService`](StepperService.md)

## Type Parameters

### T

`T`

The type of data managed by this service

## Constructors

### Constructor

> **new BaseService**\<`T`\>(`initialValue`): `BaseService`\<`T`\>

Defined in: [services/base.service.ts:20](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L20)

Creates a new BaseService instance

#### Parameters

##### initialValue

`T`

The initial state value

#### Returns

`BaseService`\<`T`\>

## Properties

### \_callbacks

> `protected` **\_callbacks**: (`value`) => `void`[] = `[]`

Defined in: [services/base.service.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L13)

Array of callback functions subscribed to state changes

#### Parameters

##### value

`T`

#### Returns

`void`

***

### current

> `protected` **current**: `T`

Defined in: [services/base.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L10)

The current value of the service state

## Methods

### get()

> **get**(): `T`

Defined in: [services/base.service.ts:56](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L56)

Get the current value

#### Returns

`T`

Current value

***

### set()

> **set**(`value`): `void`

Defined in: [services/base.service.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/base.service.ts#L45)

Update the service value and notify all subscribers.

#### Parameters

##### value

`T`

New value to set

#### Returns

`void`

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
