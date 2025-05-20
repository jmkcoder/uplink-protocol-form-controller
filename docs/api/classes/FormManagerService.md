[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormManagerService

# Class: FormManagerService

Defined in: [services/form-manager.service.ts:10](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/form-manager.service.ts#L10)

FormManagerService - Handles form operations that require coordination with other services
This provides a higher-level abstraction for form operations

## Constructors

### Constructor

> **new FormManagerService**(`formService`, `fieldService`, `interactionService`, `stepperService`): `FormManagerService`

Defined in: [services/form-manager.service.ts:16](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/form-manager.service.ts#L16)

#### Parameters

##### formService

[`FormService`](FormService.md)

##### fieldService

[`FieldService`](FieldService.md)

##### interactionService

[`InteractionService`](InteractionService.md)

##### stepperService

[`StepperService`](StepperService.md)

#### Returns

`FormManagerService`

## Methods

### resetFormCompletely()

> **resetFormCompletely**(): `void`

Defined in: [services/form-manager.service.ts:88](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/form-manager.service.ts#L88)

Reset the form to its initial state

#### Returns

`void`

***

### submitFormWithValidation()

> **submitFormWithValidation**(`showValidationErrors`): `object`

Defined in: [services/form-manager.service.ts:53](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/form-manager.service.ts#L53)

Handle form submission logic with integrated validation

#### Parameters

##### showValidationErrors

`boolean` = `true`

Whether to show validation errors

#### Returns

`object`

Submission result object

##### data?

> `optional` **data**: `any`

##### errors?

> `optional` **errors**: `any`

##### success

> **success**: `boolean`

***

### updateFieldWithValidation()

> **updateFieldWithValidation**(`stepId`, `fieldId`, `value`): `void`

Defined in: [services/form-manager.service.ts:34](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/form-manager.service.ts#L34)

Update a field value and handle validation and touch state

#### Parameters

##### stepId

`string`

Step ID

##### fieldId

`string`

Field ID

##### value

`any`

New field value

#### Returns

`void`
