[**@uplink-protocol/form-controller v0.2.6**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / FormControllerClass

# Class: FormControllerClass

Defined in: [controller.ts:23](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L23)

FormControllerClass - A class for multi-step forms with dynamic configuration

## Implements

- `TypedController`

## Constructors

### Constructor

> **new FormControllerClass**(`config`): `FormControllerClass`

Defined in: [controller.ts:50](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L50)

#### Parameters

##### config

[`FormConfig`](../interfaces/FormConfig.md)

#### Returns

`FormControllerClass`

## Properties

### bindingManager

> `protected` **bindingManager**: [`BindingManager`](BindingManager.md)

Defined in: [controller.ts:38](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L38)

***

### bindings

> **bindings**: `any`

Defined in: [controller.ts:45](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L45)

#### Implementation of

`TypedController.bindings`

***

### configManagerService

> `protected` **configManagerService**: [`ConfigManagerService`](ConfigManagerService.md)

Defined in: [controller.ts:36](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L36)

***

### configService

> `protected` **configService**: [`ConfigService`](ConfigService.md)

Defined in: [controller.ts:25](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L25)

***

### fieldErrorsService

> `protected` **fieldErrorsService**: [`BaseService`](BaseService.md)\<`Record`\<`string`, `Record`\<`string`, `string`\>\>\>

Defined in: [controller.ts:31](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L31)

***

### fieldService

> `protected` **fieldService**: [`FieldService`](FieldService.md)

Defined in: [controller.ts:28](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L28)

***

### formManagerService

> `protected` **formManagerService**: [`FormManagerService`](FormManagerService.md)

Defined in: [controller.ts:35](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L35)

***

### formService

> `protected` **formService**: [`FormService`](FormService.md)

Defined in: [controller.ts:27](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L27)

***

### initialFormData

> `protected` **initialFormData**: `Record`\<`string`, `Record`\<`string`, `any`\>\> = `{}`

Defined in: [controller.ts:41](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L41)

***

### interactionService

> `protected` **interactionService**: [`InteractionService`](InteractionService.md)

Defined in: [controller.ts:29](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L29)

***

### methods

> **methods**: `any`

Defined in: [controller.ts:46](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L46)

#### Implementation of

`TypedController.methods`

***

### navigationManager

> `protected` **navigationManager**: [`NavigationManager`](NavigationManager.md)

Defined in: [controller.ts:37](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L37)

***

### stepperService

> `protected` **stepperService**: [`StepperService`](StepperService.md)

Defined in: [controller.ts:26](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L26)

***

### stepsValidityService

> `protected` **stepsValidityService**: [`BaseService`](BaseService.md)\<`Record`\<`string`, `boolean`\>\>

Defined in: [controller.ts:32](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L32)

***

### stepValidationState

> `protected` **stepValidationState**: `Record`\<`string`, `boolean`\> = `{}`

Defined in: [controller.ts:42](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L42)

***

### validatorService

> `protected` **validatorService**: [`ValidatorService`](ValidatorService.md)

Defined in: [controller.ts:30](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L30)

## Methods

### initializeManagerServices()

> `protected` **initializeManagerServices**(): `void`

Defined in: [controller.ts:125](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L125)

Initialize manager services
This method can be overridden by subclasses to customize manager service initialization

#### Returns

`void`

***

### initializeMethods()

> `protected` **initializeMethods**(): `void`

Defined in: [controller.ts:161](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L161)

Initialize the methods object with all controller functions
This method can be overridden by subclasses to customize controller functionality

#### Returns

`void`

***

### initializeServices()

> `protected` **initializeServices**(`config`): `void`

Defined in: [controller.ts:99](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L99)

Initialize base services
This method can be overridden by subclasses to customize service initialization

#### Parameters

##### config

[`FormConfig`](../interfaces/FormConfig.md)

The form configuration

#### Returns

`void`

***

### initializeStepValidation()

> `protected` **initializeStepValidation**(): `void`

Defined in: [controller.ts:358](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L358)

Initialize step validation without showing error messages
This method can be overridden by subclasses to customize validation behavior

#### Returns

`void`

***

### setupInitialFormData()

> `protected` **setupInitialFormData**(`config`): `void`

Defined in: [controller.ts:75](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/b4197b802291c2a362dd28d04ee111d1534495f5/src/controller.ts#L75)

Set up initial form data and validation state
This method can be overridden by subclasses to customize initial data setup

#### Parameters

##### config

[`FormConfig`](../interfaces/FormConfig.md)

The form configuration

#### Returns

`void`
