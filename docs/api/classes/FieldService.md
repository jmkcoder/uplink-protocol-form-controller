[**@uplink-protocol/form-controller v0.2.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FieldService

# Class: FieldService

Defined in: [services/field.service.ts:9](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L9)

Service for managing field validation and errors

## Constructors

### Constructor

> **new FieldService**(`configService`, `formService`, `fieldErrorsService`, `stepsValidityService`): `FieldService`

Defined in: [services/field.service.ts:15](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L15)

#### Parameters

##### configService

[`ConfigService`](ConfigService.md)

##### formService

[`FormService`](FormService.md)

##### fieldErrorsService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

##### stepsValidityService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

#### Returns

`FieldService`

## Methods

### getFieldErrorsService()

> **getFieldErrorsService**(): [`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

Defined in: [services/field.service.ts:184](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L184)

Get the field errors service

#### Returns

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

Field errors service

***

### getStepsValidityService()

> **getStepsValidityService**(): [`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

Defined in: [services/field.service.ts:192](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L192)

Get the steps validity service

#### Returns

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

Steps validity service

***

### validateField()

> **validateField**(`stepId`, `fieldId`, `value?`, `showErrors?`): `boolean`

Defined in: [services/field.service.ts:35](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L35)

Validate a single field

#### Parameters

##### stepId

`string`

Step ID

##### fieldId

`string`

Field ID

##### value?

`any`

Optional value to validate (defaults to current value in form data)

##### showErrors?

`boolean` = `true`

Whether to update the error state

#### Returns

`boolean`

Validation result

***

### validateForm()

> **validateForm**(`showErrors`): `boolean`

Defined in: [services/field.service.ts:165](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L165)

Validate all steps in the form

#### Parameters

##### showErrors

`boolean` = `true`

Whether to update the error state

#### Returns

`boolean`

Validation result

***

### validateStep()

> **validateStep**(`stepId`, `showErrors`): `boolean`

Defined in: [services/field.service.ts:107](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/field.service.ts#L107)

Validate all fields in a step

#### Parameters

##### stepId

`string`

Step ID

##### showErrors

`boolean` = `true`

Whether to update the error state

#### Returns

`boolean`

Validation result
