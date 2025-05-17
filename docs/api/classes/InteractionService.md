[**@uplink-protocol/form-controller v0.1.1**](../README.md)

***

[@uplink-protocol/form-controller](../globals.md) / InteractionService

# Class: InteractionService

Defined in: [services/interaction.service.ts:7](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L7)

Service for tracking user interactions with form fields

## Constructors

### Constructor

> **new InteractionService**(`configService`, `fieldService`): `InteractionService`

Defined in: [services/interaction.service.ts:12](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L12)

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

Defined in: [services/interaction.service.ts:135](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L135)

Get touch state for all fields

#### Returns

`Record`\<`string`, `Record`\<`string`, `boolean`\>\>

Touch state

***

### isFieldTouched()

> **isFieldTouched**(`stepId`, `fieldId`): `boolean`

Defined in: [services/interaction.service.ts:89](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L89)

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

Defined in: [services/interaction.service.ts:52](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L52)

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

Defined in: [services/interaction.service.ts:69](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L69)

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

Defined in: [services/interaction.service.ts:40](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L40)

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

Defined in: [services/interaction.service.ts:127](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L127)

Reset touch tracking state

#### Returns

`void`

***

### validateStepWithTouchedErrors()

> **validateStepWithTouchedErrors**(`stepId`): `boolean`

Defined in: [services/interaction.service.ts:97](https://github.com/jmkcoder/uplink-protocol-form-controller/blob/8991786ca293392fbb1434d450f2a292fb340f1d/src/services/interaction.service.ts#L97)

Validate a step showing errors only for touched fields

#### Parameters

##### stepId

`string`

Step ID

#### Returns

`boolean`

Validation result
