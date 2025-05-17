[**@uplink-protocol/form-controller v0.1.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / ValidatorService

# Class: ValidatorService

Defined in: services/validator.service.ts:6

Service for managing dynamic validators

## Constructors

### Constructor

> **new ValidatorService**(): `ValidatorService`

Defined in: services/validator.service.ts:7

#### Returns

`ValidatorService`

## Methods

### getAvailableValidators()

> **getAvailableValidators**(): `string`[]

Defined in: services/validator.service.ts:33

Get all available validators

#### Returns

`string`[]

List of predefined validators

***

### registerValidator()

> **registerValidator**(`name`, `validatorFn`): `void`

Defined in: services/validator.service.ts:14

Register a dynamic validator

#### Parameters

##### name

`string`

Validator name

##### validatorFn

[`DynamicValidator`](../type-aliases/DynamicValidator.md)

Validator function

#### Returns

`void`

***

### unregisterValidator()

> **unregisterValidator**(`name`): `boolean`

Defined in: services/validator.service.ts:24

Unregister a dynamic validator

#### Parameters

##### name

`string`

Validator name

#### Returns

`boolean`

Success flag
