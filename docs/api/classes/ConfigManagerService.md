[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / ConfigManagerService

# Class: ConfigManagerService

Defined in: [services/config-manager.service.ts:14](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L14)

ConfigManagerService - Manages configuration operations that require coordination with other services
This provides a higher-level abstraction for configuration management across the form

## Constructors

### Constructor

> **new ConfigManagerService**(`configService`, `formService`, `fieldService`, `interactionService`, `fieldErrorsService`, `stepsValidityService`, `stepperService`): `ConfigManagerService`

Defined in: [services/config-manager.service.ts:23](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L23)

#### Parameters

##### configService

[`ConfigService`](ConfigService.md)

##### formService

[`FormService`](FormService.md)

##### fieldService

[`FieldService`](FieldService.md)

##### interactionService

[`InteractionService`](InteractionService.md)

##### fieldErrorsService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

##### stepsValidityService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

##### stepperService

[`StepperService`](StepperService.md)

#### Returns

`ConfigManagerService`

## Methods

### addStepWithFormData()

> **addStepWithFormData**(`step`, `index?`): `number`

Defined in: [services/config-manager.service.ts:91](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L91)

Add a new step dynamically with updated form data

#### Parameters

##### step

[`FormStep`](../interfaces/FormStep.md)

New form step

##### index?

`number`

Position to insert (defaults to end)

#### Returns

`number`

New steps length

***

### removeStepWithCleanup()

> **removeStepWithCleanup**(`stepId`): `boolean`

Defined in: [services/config-manager.service.ts:128](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L128)

Remove a step dynamically and clean up related state

#### Parameters

##### stepId

`string`

ID of the step to remove

#### Returns

`boolean`

Success flag

***

### updateConfigWithFullReset()

> **updateConfigWithFullReset**(`newConfig`): `void`

Defined in: [services/config-manager.service.ts:55](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L55)

Update config with full reset - handles all reset operations internally

#### Parameters

##### newConfig

[`FormConfig`](../interfaces/FormConfig.md)

New form configuration

#### Returns

`void`

***

### updateConfigWithReset()

> **updateConfigWithReset**(`newConfig`): `void`

Defined in: [services/config-manager.service.ts:44](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/config-manager.service.ts#L44)

Update form configuration and reset all form state

#### Parameters

##### newConfig

[`FormConfig`](../interfaces/FormConfig.md)

New form configuration

#### Returns

`void`
