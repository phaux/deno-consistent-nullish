import { assertSnapshot } from "@std/testing/snapshot";
import { assertEquals } from "@std/assert";
import { optPropUndefRule } from "./opt-prop-undef.ts";

const plugin: Deno.lint.Plugin = {
  name: "test",
  rules: { rule: optPropUndefRule },
};

Deno.test("requires optional properties to include undefined", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    type T1 = { a?: string }
    interface T2 { a?: string | number }
    class C { a?: () => undefined }
    `,
  );
  assertEquals(diagnostics.length, 3);
  await assertSnapshot(t, diagnostics);
});

Deno.test("allows optional properties which include undefined", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    type T1 = { a?: string | undefined }
    interface T2 { a?: string | number | undefined }
    class C { a?: (() => undefined) | undefined }
    `,
  );
  assertEquals(diagnostics.length, 0);
});
