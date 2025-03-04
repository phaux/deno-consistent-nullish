import { assertSnapshot } from "@std/testing/snapshot";
import { noDefaultValRule } from "./no-default-val.ts";
import { assertEquals } from "@std/assert";

const plugin: Deno.lint.Plugin = {
  name: "test",
  rules: { rule: noDefaultValRule },
};

Deno.test("bans default parameters", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    function foo(a = 1) {}
    const bar = (a = 1, b = 2) => {};
    const baz = function (a = "a") {};
    const obj = { foo(a = {}) {} };
    class Foo { foo(a = []) {} }
    `
  );
  assertEquals(diagnostics.length, 6);
  await assertSnapshot(t, diagnostics);
});

Deno.test("bans default object properties", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    function foo({ a = 1 }) {}
    const bar = ({ a = 1, b = 2 }) => {};
    const baz = function ({ a: a = "a" }) {};
    const { a: b = {} } = {};
    `
  );
  assertEquals(diagnostics.length, 2); // BUG: Deno parses `{ a = b }` as `{ a: b }`
  await assertSnapshot(t, diagnostics);
});

Deno.test("allows object property renames", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    function foo({ a: a }) {}
    const bar = ({ a: b, b: a }) => {};
    const baz = function ({ a: x }) {};
    const { a: x } = {};
    `
  );
  assertEquals(diagnostics.length, 0);
});

Deno.test("bans default array elements", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    function foo([a = 1]) {}
    const bar = ([a = 1, b = 2]) => {};
    const baz = function ([a = "a"]) {};
    const [a = []] = [];
    `
  );
  assertEquals(diagnostics.length, 5);
  await assertSnapshot(t, diagnostics);
});
