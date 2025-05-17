[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormStep

# Interface: FormStep

Defined in: [interfaces/form-step.interface.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L7)

Step configuration for dynamic multi-step forms.
Each step contains a set of related fields and optional validation.

## Properties

### description?

> `optional` **description**: `string`

Defined in: [interfaces/form-step.interface.ts:15](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L15)

Optional description text for the step

***

### fields

> **fields**: `Record`\<`string`, [`Field`](Field.md)\>

Defined in: [interfaces/form-step.interface.ts:21](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L21)

Map of fields contained in this step.
Keys are field IDs, values are field configurations.

***

### id

> **id**: `string`

Defined in: [interfaces/form-step.interface.ts:9](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L9)

Unique identifier for the step

***

### title

> **title**: `string`

Defined in: [interfaces/form-step.interface.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L12)

Display title for the step

***

### validation()?

> `optional` **validation**: (`formData`) => `string` \| `boolean`

Defined in: [interfaces/form-step.interface.ts:30](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/3be0707852a25b5a0095411b2a880ebe20f7683e/src/interfaces/form-step.interface.ts#L30)

Optional custom validation function for the entire step.
Called after all individual field validations have passed.

#### Parameters

##### formData

`Record`\<`string`, `any`\>

The current form data for all steps

#### Returns

`string` \| `boolean`

true if valid, or an error message string if invalid
