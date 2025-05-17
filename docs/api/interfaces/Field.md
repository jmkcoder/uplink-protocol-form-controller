[**@uplink-protocol/form-controller v0.1.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / Field

# Interface: Field

Defined in: [interfaces/field.interface.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L7)

Field interface for dynamic form fields.
Defines the structure and behavior of individual form fields.

## Properties

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [interfaces/field.interface.ts:37](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L37)

Whether the field is disabled/readonly

***

### helperText?

> `optional` **helperText**: `string`

Defined in: [interfaces/field.interface.ts:31](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L31)

Helper text to display below the field
Useful for providing additional context or instructions

***

### hidden?

> `optional` **hidden**: `boolean`

Defined in: [interfaces/field.interface.ts:40](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L40)

Whether the field should be hidden from view

***

### id

> **id**: `string`

Defined in: [interfaces/field.interface.ts:9](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L9)

Unique identifier for the field

***

### label

> **label**: `string`

Defined in: [interfaces/field.interface.ts:19](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L19)

Display label for the field

***

### options?

> `optional` **options**: `object`[]

Defined in: [interfaces/field.interface.ts:49](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L49)

Options for select, radio, and checkbox fields
Each option has a label, value, and optional disabled state

#### disabled?

> `optional` **disabled**: `boolean`

#### label

> **label**: `string`

#### value

> **value**: `any`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [interfaces/field.interface.ts:25](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L25)

Placeholder text for input fields

***

### props?

> `optional` **props**: `Record`\<`string`, `any`\>

Defined in: [interfaces/field.interface.ts:59](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L59)

Additional properties for custom fields
Allows extending field capabilities with custom attributes

***

### required?

> `optional` **required**: `boolean`

Defined in: [interfaces/field.interface.ts:34](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L34)

Whether the field is required

***

### type

> **type**: `"number"` \| `"text"` \| `"email"` \| `"password"` \| `"tel"` \| `"checkbox"` \| `"radio"` \| `"select"` \| `"textarea"` \| `"date"` \| `"file"` \| `"custom"`

Defined in: [interfaces/field.interface.ts:15](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L15)

The type of input field 
Controls the UI rendering and validation behavior

***

### validation?

> `optional` **validation**: [`Validation`](Validation.md)

Defined in: [interfaces/field.interface.ts:43](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L43)

Validation rules for the field

***

### value?

> `optional` **value**: `any`

Defined in: [interfaces/field.interface.ts:22](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/da9b373dfdce0655de13c8f4010de07e8f23017d/src/interfaces/field.interface.ts#L22)

Initial/default value for the field
