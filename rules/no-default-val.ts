import { trimRange } from "../util/trimRange.ts";

export const noDefaultValRule: Deno.lint.Rule = {
  create: (ctx) => ({
    AssignmentPattern(node) {
      ctx.report({
        range: trimRange(ctx.sourceCode, [
          node.left.range[1],
          node.right.range[0],
        ]),
        message: "Default values are not allowed.",
        hint: "Default value is only applied when the original is undefined but not null. " +
          "Use nullish coalescing operator (`??`) to apply default value.",
      });
    },
  }),
};
