[**@uplink-protocol/form-controller v0.2.0**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / InteractionService

# Class: InteractionService

Defined in: [services/interaction.service.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L7)

Service for tracking user interactions with form fields

## Constructors

### Constructor

> **new InteractionService**(`configService`, `fieldService`): `InteractionService`

Defined in: [services/interaction.service.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L12)

#### Parameters

##### configService

[`ConfigService`](ConfigService.md)

##### fieldService

[`FieldService`](FieldService.md)

#### Returns

`InteractionService`

## Methods

### getTouchState()

> **getTouchState**(): `Record`\<`string`, `Record`\<`string`, `boolean`\>\>

Defined in: [services/interaction.service.ts:134](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L134)

Get touch state for all fields

#### Returns

`Record`\<`string`, `Record`\<`string`, `boolean`\>\>

Touch state

***

### isFieldTouched()

> **isFieldTouched**(`stepId`, `fieldId`): `boolean`

Defined in: [services/interaction.service.ts:89](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L89)

Check if a field has been touched

#### Parameters

##### stepId

`string`

Step ID

##### fieldId

`string`

Field ID

#### Returns

`boolean`

Whether the field has been touched

***

### markAllFieldsInStepTouched()

> **markAllFieldsInStepTouched**(`stepId`, `touched`): `void`

Defined in: [services/interaction.service.ts:52](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L52)

Mark all fields in a step as touched

#### Parameters

##### stepId

`string`

Step ID

##### touched

`boolean` = `true`

Touch state (defaults to true)

#### Returns

`void`

***

### markAllFieldsTouched()

> **markAllFieldsTouched**(`touched`): `void`

Defined in: [services/interaction.service.ts:69](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L69)

Mark all fields in all steps as touched

#### Parameters

##### touched

`boolean` = `true`

Touch state (defaults to true)

#### Returns

`void`

***

### markFieldTouched()

> **markFieldTouched**(`stepId`, `fieldId`, `touched`): `void`

Defined in: [services/interaction.service.ts:40](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L40)

Mark a field as touched

#### Parameters

##### stepId

`string`

Step ID

##### fieldId

`string`

Field ID

##### touched

`boolean` = `true`

Touch state (defaults to true)

#### Returns

`void`

***

### resetTouchTracking()

> **resetTouchTracking**(): `void`

Defined in: [services/interaction.service.ts:126](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L126)

Reset touch tracking state

#### Returns

`void`

***

### validateStepWithTouchedErrors()

> **validateStepWithTouchedErrors**(`stepId`): `boolean`

Defined in: [services/interaction.service.ts:97](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8226087892ff308dad52ba8f951d70bde4dbbb0b/src/services/interaction.service.ts#L97)

Validate a step showing errors only for touched fields

#### Parameters

##### stepId

`string`

Step ID

#### Returns

`boolean`

Validation result
