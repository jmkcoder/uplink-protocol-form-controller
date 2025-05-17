[**@uplink-protocol/form-controller v0.1.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / DynamicValidator

# Type Alias: DynamicValidator()

> **DynamicValidator** = (`value`, `context`) => `boolean` \| `string`

Defined in: [utils/validator-registry.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/utils/validator-registry.ts#L29)

Dynamic validator function signature.

## Parameters

### value

`any`

The value to validate

### context

`ValidatorContext`

The validation context with form state

## Returns

`boolean` \| `string`

true if valid, or an error message string if invalid
