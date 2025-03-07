import { getRangeWithParens } from "../util/getRangeWithParens.ts";
import { isParenthesized } from "../util/isParenthesized.ts";
import { fc } from "../util/formatCode.ts";

export const optPropUndefRule: Deno.lint.Rule = {
  create(ctx) {
    return {
      TSPropertySignature: visitPropertyNode,
      PropertyDefinition: visitPropertyNode,
    };

    function visitPropertyNode(
      propNode: Deno.lint.TSPropertySignature | Deno.lint.PropertyDefinition,
    ) {
      if (!propNode.optional) return;
      if (!propNode.typeAnnotation) return;
      if (
        propNode.typeAnnotation.typeAnnotation.type !== "TSUnionType" ||
        !propNode.typeAnnotation.typeAnnotation.types.some(
          (t) => t.type === "TSUndefinedKeyword",
        )
      ) {
        const typeAnnotation = propNode.typeAnnotation.typeAnnotation;
        const keyName = ctx.sourceCode.getText(propNode.key);
        return ctx.report({
          node: propNode.key,
          message: `Type of optional property ${fc(keyName)} must include undefined.`,
          hint:
            "TypeScript differentiates missing properties from undefined when `exactOptionalPropertyTypes` option is enabled. " +
            `Include ${fc("undefined")} in the type to represent optional properties.`,
          *fix(fixer) {
            if (
              isParenthesized(ctx.sourceCode, typeAnnotation) ||
              typeAnnotation.type.endsWith("Keyword") ||
              typeAnnotation.type === "TSLiteralType" ||
              typeAnnotation.type === "TSTemplateLiteralType" ||
              typeAnnotation.type === "TSTypeReference" ||
              typeAnnotation.type === "TSIndexedAccessType" ||
              typeAnnotation.type === "TSArrayType" ||
              typeAnnotation.type === "TSTypeLiteral" ||
              typeAnnotation.type === "TSTupleType" ||
              typeAnnotation.type === "TSUnionType"
            ) {
              // Type annotation is a simple type.
              yield fixer.insertTextAfterRange(
                getRangeWithParens(ctx.sourceCode, typeAnnotation),
                " | undefined",
              );
            } else {
              // Type annotation is a complex type.
              // Wrap the complex type in parentheses to make sure precedence is correct.
              yield fixer.insertTextBefore(typeAnnotation, "(");
              yield fixer.insertTextAfter(typeAnnotation, ") | undefined");
            }
          },
        });
      }
    }
  },
};
