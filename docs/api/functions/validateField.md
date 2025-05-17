[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / validateField

# Function: validateField()

> **validateField**(`field`, `value`, `context?`): `object`

Defined in: [utils/validator.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/utils/validator.ts#L12)

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

## Returns

`object`

An object containing isValid and error message if any

### error?

> `optional` **error**: `string`

### isValid

> **isValid**: `boolean`
