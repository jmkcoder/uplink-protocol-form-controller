[**@uplink-protocol/form-controller v0.2.5**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / validateField

# Function: validateField()

> **validateField**(`field`, `value`, `context?`, `collectAllErrors?`): `object`

Defined in: [utils/validator.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/dd3b5a64ac66f6e3d93aa3a73dfcfe7109a8afc2/src/utils/validator.ts#L13)

Validates a field value based on its validation rules

## Parameters

### field

[`Field`](../interfaces/Field.md)

The field configuration object

### value

`any`

The value to validate

### context?

`Partial`\<`ValidatorContext`\>

Additional context for dynamic validators

### collectAllErrors?

`boolean` = `false`

Whether to collect all errors or stop at the first one

## Returns

`object`

An object containing isValid and error messages if any

### error?

> `optional` **error**: `string`

### errors?

> `optional` **errors**: `string`[]

### isValid

> **isValid**: `boolean`
