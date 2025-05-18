[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / Validation

# Interface: Validation

Defined in: [interfaces/validation.interface.ts:5](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/main/src/interfaces/validation.interface.ts#L5)

Validation interface defining rules for form field validation.
Supports both static and dynamic validation approaches.

## Properties

### collectAllErrors?

> `optional` **collectAllErrors**: `boolean`

Defined in: [interfaces/validation.interface.ts:47](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/main/src/interfaces/validation.interface.ts#L47)

Whether to collect all validation errors instead of stopping at the first one
This is useful for showing multiple validation errors at once

***

### custom()?

> `optional` **custom**: (`value`) => `string` \| `boolean`

Defined in: [interfaces/validation.interface.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L29)

Custom validation function

#### Parameters

##### value

`any`

The field value to validate

#### Returns

`string` \| `boolean`

true if valid, or an error message string if invalid

***

### dynamicValidator?

> `optional` **dynamicValidator**: `string`

Defined in: [interfaces/validation.interface.ts:35](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L35)

Name of registered dynamic validator to use
Dynamic validators have access to the entire form state

***

### dynamicValidatorParams?

> `optional` **dynamicValidatorParams**: `Record`\<`string`, `any`\>

Defined in: [interfaces/validation.interface.ts:41](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L41)

Parameters for the dynamic validator
Provides configuration options to the validator

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [interfaces/validation.interface.ts:47](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L47)

Custom error message to display on validation failure
Overrides default error messages

***

### max?

> `optional` **max**: `number`

Defined in: [interfaces/validation.interface.ts:22](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L22)

Maximum allowed numeric value

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [interfaces/validation.interface.ts:16](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L16)

Maximum allowed text length

***

### min?

> `optional` **min**: `number`

Defined in: [interfaces/validation.interface.ts:19](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L19)

Minimum allowed numeric value

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [interfaces/validation.interface.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L13)

Minimum allowed text length

***

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: [interfaces/validation.interface.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L10)

Regular expression pattern for validation

***

### required?

> `optional` **required**: `boolean`

Defined in: [interfaces/validation.interface.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/validation.interface.ts#L7)

Whether the field is required
