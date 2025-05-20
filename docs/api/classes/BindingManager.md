[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / BindingManager

# Class: BindingManager

Defined in: [services/binding-manager.service.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/binding-manager.service.ts#L12)

BindingManager - Manages the bindings system for the form controller
Handles subscription setup and value propagation to the binding objects

## Constructors

### Constructor

> **new BindingManager**(`configService`, `stepperService`, `formService`, `fieldErrorsService`, `stepsValidityService`): `BindingManager`

Defined in: [services/binding-manager.service.ts:24](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/binding-manager.service.ts#L24)

#### Parameters

##### configService

[`ConfigService`](ConfigService.md)

##### stepperService

[`StepperService`](StepperService.md)

##### formService

[`FormService`](FormService.md)

##### fieldErrorsService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

##### stepsValidityService

[`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

#### Returns

`BindingManager`

## Properties

### bindings

> **bindings**: `any`

Defined in: [services/binding-manager.service.ts:22](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/binding-manager.service.ts#L22)

## Methods

### updateBindingsAfterNavigation()

> **updateBindingsAfterNavigation**(`newIndex`, `step`): `void`

Defined in: [services/binding-manager.service.ts:327](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/binding-manager.service.ts#L327)

Update binding values for the current step after navigation

#### Parameters

##### newIndex

`number`

New step index

##### step

New step object

`null` | [`FormStep`](../interfaces/FormStep.md)

#### Returns

`void`
