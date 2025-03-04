import { trimRange } from "../util/trimRange.ts";

export const noUnsafeSpreadRule: Deno.lint.Rule = {
  create: (ctx) => ({
    ObjectExpression(objNode) {
      for (const [propIdx, propNode] of objNode.properties.entries()) {
        if (propIdx <= 0) continue;
        if (propNode.type !== "SpreadElement") continue;

        ctx.report({
          range: trimRange(ctx.sourceCode, [
            propNode.range[0],
            propNode.argument.range[0],
          ]),
          message: "Object spread is only allowed as the first element.",
          hint:
            "Object spread is broken in TypeScript without `exactOptionalPropertyTypes` mode. " +
            "Please assign each property explicitly.",
        });
      }
    },
  }),
};
