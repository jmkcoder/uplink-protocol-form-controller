[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / NavigationManager

# Class: NavigationManager

Defined in: [services/navigation-manager.service.ts:11](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/navigation-manager.service.ts#L11)

NavigationManager - Handles complex navigation operations with validation and binding updates
This provides a higher-level abstraction for navigation operations

## Constructors

### Constructor

> **new NavigationManager**(`stepperService`, `configService`, `fieldService`, `interactionService`): `NavigationManager`

Defined in: [services/navigation-manager.service.ts:17](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/navigation-manager.service.ts#L17)

#### Parameters

##### stepperService

[`StepperService`](StepperService.md)

##### configService

[`ConfigService`](ConfigService.md)

##### fieldService

[`FieldService`](FieldService.md)

##### interactionService

[`InteractionService`](InteractionService.md)

#### Returns

`NavigationManager`

## Methods

### goToNextWithValidation()

> **goToNextWithValidation**(`updateBindings`): `number`

Defined in: [services/navigation-manager.service.ts:34](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/navigation-manager.service.ts#L34)

Navigate to the next step with validation

#### Parameters

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update binding values after navigation

#### Returns

`number`

New step index or current step if navigation isn't possible

***

### goToPrevious()

> **goToPrevious**(`updateBindings`): `number`

Defined in: [services/navigation-manager.service.ts:70](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/navigation-manager.service.ts#L70)

Navigate to the previous step

#### Parameters

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update binding values after navigation

#### Returns

`number`

New step index or current step if navigation isn't possible

***

### goToSpecificStep()

> **goToSpecificStep**(`stepIndex`, `updateBindings`): `boolean`

Defined in: [services/navigation-manager.service.ts:94](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/services/navigation-manager.service.ts#L94)

Navigate to a specific step by index

#### Parameters

##### stepIndex

`number`

Target step index

##### updateBindings

(`newIndex`, `step`) => `void`

Function to update binding values after navigation

#### Returns

`boolean`

True if navigation succeeded, false otherwise
