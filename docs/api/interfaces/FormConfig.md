[**@uplink-protocol/form-controller v0.2.5**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormConfig

# Interface: FormConfig

Defined in: [interfaces/form-config.interface.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/dd3b5a64ac66f6e3d93aa3a73dfcfe7109a8afc2/src/interfaces/form-config.interface.ts#L7)

Form configuration interface.
Defines the structure and behavior of the entire form.

## Properties

### defaultValues?

> `optional` **defaultValues**: `Record`\<`string`, `any`\>

Defined in: [interfaces/form-config.interface.ts:19](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/dd3b5a64ac66f6e3d93aa3a73dfcfe7109a8afc2/src/interfaces/form-config.interface.ts#L19)

Default values for form fields.
Keys are field IDs, values are the default values.
These values will override any default values defined in the field configurations.

***

### steps

> **steps**: [`FormStep`](FormStep.md)[]

Defined in: [interfaces/form-config.interface.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/dd3b5a64ac66f6e3d93aa3a73dfcfe7109a8afc2/src/interfaces/form-config.interface.ts#L12)

Array of form steps.
Each step contains a set of related fields.
