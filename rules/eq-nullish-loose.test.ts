import { assertSnapshot } from "@std/testing/snapshot";
import { eqNullishLooseRule } from "./eq-nullish-loose.ts";
import { assertEquals } from "@std/assert";

Deno.test("bans strict comparison to null or undefined", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    { name: "test", rules: { rule: eqNullishLooseRule } },
    "test.ts",
    `
    x === null;
    x === undefined;
    x !== null;
    x !== undefined;
    null === x;
    undefined === x;
    null !== x;
    undefined !== x;
    null === undefined;
    undefined !== null;
    null === null;
    undefined !== undefined;
    `
  );
  assertEquals(diagnostics.length, 6); // BUG: Deno parses `!==` as `!=`
  await assertSnapshot(t, diagnostics);
});
