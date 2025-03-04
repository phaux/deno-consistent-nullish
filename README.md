# Consistent Nullish Deno Lint Plugin

Enforces treating null and undefined values the same way.
This plugin bans code which relies on the distinction between null and undefined.

## Rules

### `no-default-val`

Default value is only applied when undefined but not null.

Use nullish coalescing operator (`??`) to apply default value for both null and undefined.

### `no-in-operator`

`in` operator differentiates between lack of property and a property with nullish value.

Use `obj.prop != null` to check for both missing and nullish properties.

### `no-unsafe-spread`

Object spread is broken in TypeScript.

Please assign each property explicitly.

### `eq-nullish-loose`

Differentiating between null and undefined is forbidden.

Use `value == null` to check for any nullish value.

### `opt-prop-undef`

TypeScript differentiates missing properties from `undefined` when `exactOptionalPropertyTypes` option is enabled.

Use `T | undefined` to represent optional properties.
