[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FieldService

# Class: FieldService

Defined in: [services/field.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L10)

Service for managing field validation and errors

## Constructors

### Constructor

> **new FieldService**(`configService`, `formService`, `fieldErrorsService`, `stepsValidityService`): `FieldService`

Defined in: [services/field.service.ts:16](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L16)

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

Defined in: [services/field.service.ts:178](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L178)

Get the field errors service

#### Returns

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

Field errors service

***

### getStepsValidityService()

> **getStepsValidityService**(): [`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

Defined in: [services/field.service.ts:186](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L186)

Get the steps validity service

#### Returns

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

Steps validity service

***

### validateField()

> **validateField**(`stepId`, `fieldId`, `value?`, `showErrors?`): `boolean`

Defined in: [services/field.service.ts:36](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L36)

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

Defined in: [services/field.service.ts:159](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L159)

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

Defined in: [services/field.service.ts:101](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/field.service.ts#L101)

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
