[**@uplink-protocol/form-controller v0.1.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / BaseService

# Class: BaseService\<T\>

Defined in: services/base.service.ts:8

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

Defined in: services/base.service.ts:20

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

Defined in: services/base.service.ts:13

Array of callback functions subscribed to state changes

#### Parameters

##### value

`T`

#### Returns

`void`

***

### current

> `protected` **current**: `T`

Defined in: services/base.service.ts:10

The current value of the service state

## Methods

### get()

> **get**(): `T`

Defined in: services/base.service.ts:56

Get the current value

#### Returns

`T`

Current value

***

### set()

> **set**(`value`): `void`

Defined in: services/base.service.ts:45

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

Defined in: services/base.service.ts:31

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
