[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / validateField

# Function: validateField()

> **validateField**(`field`, `value`, `context?`, `collectAllErrors?`): `object`

Defined in: [utils/validator.ts:15](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/main/src/utils/validator.ts#L15)

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

`boolean`

Whether to collect all errors or stop at the first one (defaults to value of field.validation.collectAllErrors or false)

## Returns

`object`

An object containing isValid and error message(s) if any

### error?

> `optional` **error**: `string`

The first error message or primary error

### errors?

> `optional` **errors**: `string[]`

Array of all validation error messages (only present when validation fails and collectAllErrors is true)

### isValid

> **isValid**: `boolean`

Whether the field passed all validations
