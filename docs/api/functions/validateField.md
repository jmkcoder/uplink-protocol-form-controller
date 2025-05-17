[**@uplink-protocol/form-controller v0.1.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / validateField

# Function: validateField()

> **validateField**(`field`, `value`, `context?`): `object`

Defined in: [utils/validator.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/utils/validator.ts#L12)

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
