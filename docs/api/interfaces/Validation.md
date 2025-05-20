[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / Validation

# Interface: Validation

Defined in: [interfaces/validation.interface.ts:5](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L5)

Validation interface defining rules for form field validation.
Supports both static and dynamic validation approaches.

## Properties

### collectAllErrors?

> `optional` **collectAllErrors**: `boolean`

Defined in: [interfaces/validation.interface.ts:92](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L92)

Whether to collect all validation errors instead of stopping at the first one
This is useful for showing multiple validation errors at once

***

### custom()?

> `optional` **custom**: (`value`) => `string` \| `boolean`

Defined in: [interfaces/validation.interface.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L29)

Custom validation function

#### Parameters

##### value

`any`

The field value to validate

#### Returns

`string` \| `boolean`

true if valid, or an error message string if invalid

***

### ~~dynamicValidator?~~

> `optional` **dynamicValidator**: `string`

Defined in: [interfaces/validation.interface.ts:36](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L36)

Name of registered dynamic validator to use
Dynamic validators have access to the entire form state

#### Deprecated

Use dynamicValidators array instead for multiple validators

***

### ~~dynamicValidatorParams?~~

> `optional` **dynamicValidatorParams**: `Record`\<`string`, `any`\>

Defined in: [interfaces/validation.interface.ts:43](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L43)

Parameters for the dynamic validator
Provides configuration options to the validator

#### Deprecated

Use dynamicValidators array instead

***

### dynamicValidators?

> `optional` **dynamicValidators**: `object`[]

Defined in: [interfaces/validation.interface.ts:49](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L49)

Array of dynamic validators to use
Each validator can have its own parameters and error message

#### errorMessage?

> `optional` **errorMessage**: `string`

Custom error message for this validator

#### name

> **name**: `string`

Name of registered validator

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

Parameters to pass to the validator

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [interfaces/validation.interface.ts:63](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L63)

Custom error message to display on validation failure
Overrides default error messages for all validations
Use errorMessages for specific error messages per validation type

***

### errorMessages?

> `optional` **errorMessages**: `object`

Defined in: [interfaces/validation.interface.ts:69](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L69)

Custom error messages for specific validation types
Allows specifying different messages for each validation rule

#### custom?

> `optional` **custom**: `string`

Error message for custom validation (if not returned by the function)

#### email?

> `optional` **email**: `string`

Error message for email validation

#### max?

> `optional` **max**: `string`

Error message for max validation

#### maxLength?

> `optional` **maxLength**: `string`

Error message for maxLength validation

#### min?

> `optional` **min**: `string`

Error message for min validation

#### minLength?

> `optional` **minLength**: `string`

Error message for minLength validation

#### pattern?

> `optional` **pattern**: `string`

Error message for pattern validation

#### required?

> `optional` **required**: `string`

Error message for required validation

***

### max?

> `optional` **max**: `number`

Defined in: [interfaces/validation.interface.ts:22](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L22)

Maximum allowed numeric value

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [interfaces/validation.interface.ts:16](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L16)

Maximum allowed text length

***

### min?

> `optional` **min**: `number`

Defined in: [interfaces/validation.interface.ts:19](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L19)

Minimum allowed numeric value

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [interfaces/validation.interface.ts:13](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L13)

Minimum allowed text length

***

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: [interfaces/validation.interface.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L10)

Regular expression pattern for validation

***

### required?

> `optional` **required**: `boolean`

Defined in: [interfaces/validation.interface.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/interfaces/validation.interface.ts#L7)

Whether the field is required
