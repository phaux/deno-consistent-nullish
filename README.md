# Simple Nullish Deno Lint Plugin

Enforces treating null and undefined values the same way. This plugin bans code
which relies on the distinction between null, undefined or a missing property.

> [!NOTE]
> "prosto" means "simply" in slavic languages.

## Usage

`deno.json`

```json
{
  "lint": {
    "plugins": ["jsr:@prosto/nullish"]
  }
}
```

## Rule `no-default-val`

Default values are only applied when original value is undefined or missing but
not null.

This rule bans default values in object/array destructuring and function
parameters:

```ts
const { foo = "" } = {};
console.log(foo);

const [bar = 1] = [];
console.log(bar);

function fn(opts = {}) {
  console.log(opts);
}
```

Use nullish coalescing operator (`??`) to apply default value for both null and
undefined:

```ts
const { foo } = {};
console.log(foo ?? "");

const [bar] = [];
console.log(bar ?? 1);

function fn(opts) {
  console.log(opts ?? {});
}
```

## Rule `no-in-operator` (autofixable)

`in` operator differentiates between lack of property and a property with
nullish value.

This rule bans usage of `in` operator:

```ts
if ("prop" in obj) console.log("obj has prop");
```

Use `obj.prop != null` to check for both missing and nullish properties:

```ts
if (obj.prop != null) console.log("obj has prop and it's not nullish");
```

## Rule `no-unsafe-spread`

[Object spread is broken] in TypeScript without `exactOptionalPropertyTypes` TS
option. In addition, it treats missing properties differently from nullish.

This rule bans spread in object when it's not the first element of the object
literal:

```ts
const opts = {
  foo: "",
  bar: 0,
  ...userOpts,
};
```

You should assign each property explicitly:

```ts
const opts = {
  foo: userOpts.foo ?? "",
  bar: userOpts.bar ?? 0,
};
```

[Object spread is broken]: https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABMOcAUcAOUDOAuRAb0RwH4CcoAnGMAc0QF8BKIgKEUQgUqJKcQBePvkQAiMQBpEAOjlZcTANwcuPOABsApjI1w6aHDKhwAqpkxaqAYQCGOLWmbMVjNmxTpio8ABMtwLRavkwubEA

## Rule `eq-nullish-loose` (autofixable)

This rule bans usage of `===` and `!==` operators to compare null or undefined
values:

```ts
if (foo === null) console.log("foo is null");
if (bar !== null) console.log("bar is not null");
if (baz === undefined) console.log("baz is undefined");
```

Use `value == null` to check for any nullish value:

```ts
if (foo == null) console.log("foo is nullish");
if (bar != null) console.log("bar is not nullish");
if (baz == undefined) console.log("baz is nullish");
```

## Rule `opt-prop-undef` (autofixable)

TypeScript differentiates missing properties from undefined when
`exactOptionalPropertyTypes` option is enabled. This makes it nontrivial to
create objects with optional properties, when they can't be nullish.

This rule bans optional properties without `undefined` in their type:

```ts
interface Test {
  foo?: string;
  bar?: number;
}
```

Use `T | undefined` to represent optional properties:

```ts
interface Test {
  foo?: string | undefined;
  bar?: number | undefined;
}
```

## TODOs

- [ ] add rule `consistent-nullish-type` - always require `null | undefined`
      type - never just one or the other.
- [ ] add rule `opt-param-undef` - require optional function parameters to
      include `undefined` in their type.
