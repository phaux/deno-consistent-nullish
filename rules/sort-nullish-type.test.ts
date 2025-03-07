import { assertSnapshot } from "@std/testing/snapshot";
import { assertEquals } from "@std/assert";
import { sortNullishType } from "./sort-nullish-type.ts";

const plugin: Deno.lint.Plugin = {
  name: "test",
  rules: { rule: sortNullishType },
};

Deno.test("bans wrong order of types", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    interface A { a: null | string; }
    type B = { b?: undefined | number; }
    function foo(arg?: boolean | undefined | null): undefined | null {}
    let x: T | null | void | undefined;
    const y: T | undefined | null | void;
    `,
  );
  assertEquals(diagnostics.length, 7);
  await assertSnapshot(t, diagnostics);
});

Deno.test("allows correct order of types", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    interface A { a: string | null; }
    type B = { b?: number | undefined; }
    function foo(arg?: boolean | null | undefined): null | undefined {}
    let x: T | void | null | undefined;
    const y: T | void | null | undefined;
    `,
  );
  assertEquals(diagnostics.length, 0);
});
