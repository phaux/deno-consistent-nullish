import { fc } from "../util/formatCode.ts";
import { getOperatorRange } from "../util/getOperatorRange.ts";

export const noInOperatorRule: Deno.lint.Rule = {
  create: (ctx) => ({
    BinaryExpression(exprNode) {
      if (exprNode.operator !== "in") return;

      let newPropText = `[${ctx.sourceCode.getText(exprNode.left)}]`;
      if (
        exprNode.left.type === "Literal" &&
        typeof exprNode.left.value === "string" &&
        exprNode.left.value.match(/^\w[\w\d]*$/)
      ) {
        newPropText = `.${exprNode.left.value}`;
      }

      ctx.report({
        range: getOperatorRange(ctx.sourceCode, exprNode),
        message: "`in` operator is not allowed.",
        hint:
          "`in` operator differentiates between missing property and a property with nullish value. " +
          `Use ${fc(`obj${newPropText} != null`)} to check for missing or nullish property.`,
        *fix(fixer) {
          // Remove left operand and `in` operator.
          yield fixer.removeRange([
            exprNode.left.range[0],
            exprNode.right.range[0],
          ]);
          // Add property access.
          yield fixer.insertTextAfterRange(
            exprNode.right.range,
            `${newPropText} != null`,
          );
        },
      });
    },
  }),
};
