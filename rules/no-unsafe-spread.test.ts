import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { noUnsafeSpreadRule } from "./no-unsafe-spread.ts";

const plugin: Deno.lint.Plugin = {
  name: "test",
  rules: { rule: noUnsafeSpreadRule },
};

Deno.test("bans spread in objects", async (t) => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    ({ a: 1, ...obj });
    ({ a: 1, b: 2, ...obj });
    ({ a: 1, ...obj, c: 3 });
    ({ obj, ...obj });
    ({ ...obj1, ...obj2, ...obj3 });
    `
  );
  assertEquals(diagnostics.length, 6);
  await assertSnapshot(t, diagnostics);
});

Deno.test("allows spread in non-object", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    ([1, ...arr]);
    f(1, 2, ...arr);
    ([1, ...arr, 3]);
    f(arr, ...arr);
    ([...arr1, ...arr2]);
    `
  );
  assertEquals(diagnostics.length, 0);
});

Deno.test("allows spread as first element", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `
    ({ ...obj, b: 2 });
    ({ ...obj, b: 2, c: 3 });
    ({ ...obj });
    `
  );
  assertEquals(diagnostics.length, 0);
});
