import { assertSnapshot } from "@std/testing/snapshot";
import { noInOperatorRule } from "./no-in-operator.ts";
import { assertEquals } from "@std/assert";

Deno.test("bans in operator", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    { name: "test", rules: { rule: noInOperatorRule } },
    "test.ts",
    `
    if (x in obj) {}
    if ("foo" in obj) {}
    if (!("foo" in obj)) {}
    if ("a" + "b" in [] + []) {}
    if ("foo" in getObj()) {}
    if (1 in obj) {}
    if (x in {}) {}
    `
  );
  assertEquals(diagnostics.length, 7);
  await assertSnapshot(t, diagnostics);
});
