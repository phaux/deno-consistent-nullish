import { getOperatorRange } from "../util/getOperatorRange.ts";

export const eqNullishLooseRule: Deno.lint.Rule = {
  create: (ctx) => ({
    BinaryExpression(exprNode) {
      const op = exprNode.operator;
      if (op !== "===" && op !== "!==") return;

      const nullishNode = getNullishOperand(exprNode);
      if (!nullishNode) return;

      const nullishText = ctx.sourceCode.getText(nullishNode);
      ctx.report({
        range: getOperatorRange(ctx.sourceCode, exprNode),
        message:
          `Strict equality comparison with ${nullishText} is not allowed.`,
        hint: `Differentiating between null and undefined is forbidden. ` +
          `Use \`value ${opMap[op]} ${nullishText}\` ` +
          `to check for any nullish value.`,
        fix(fixer) {
          return fixer.replaceTextRange(
            getOperatorRange(ctx.sourceCode, exprNode),
            opMap[op],
          );
        },
      });
    },
  }),
};

const getNullishOperand = (node: Deno.lint.BinaryExpression) =>
  isNullish(node.right) ? node.right : isNullish(node.left) ? node.left : null;

const isNullish = (node: Deno.lint.Node) =>
  (node.type === "Literal" && node.value == null) ||
  (node.type === "Identifier" && node.name === "undefined");

const opMap = {
  "===": "==",
  "!==": "!=",
} as const;
