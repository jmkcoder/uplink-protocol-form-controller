[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / DynamicValidator

# Type Alias: DynamicValidator()

> **DynamicValidator** = (`value`, `context`) => `boolean` \| `string`

Defined in: [utils/validator-registry.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/utils/validator-registry.ts#L29)

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
