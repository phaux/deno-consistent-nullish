export const optPropUndefRule: Deno.lint.Rule = {
  create(ctx) {
    return {
      TSPropertySignature: visitPropertyNode,
      PropertyDefinition: visitPropertyNode,
    };

    function visitPropertyNode(
      propNode: Deno.lint.TSPropertySignature | Deno.lint.PropertyDefinition
    ) {
      if (!propNode.optional) return;
      if (!propNode.typeAnnotation) return;
      if (
        propNode.typeAnnotation.typeAnnotation.type !== "TSUnionType" ||
        !propNode.typeAnnotation.typeAnnotation.types.some(
          (t) => t.type === "TSUndefinedKeyword"
        )
      ) {
        const typeAnnotation = propNode.typeAnnotation.typeAnnotation;
        return ctx.report({
          node: propNode.key,
          message: "Type of optional property must include undefined.",
          hint:
            "TypeScript differentiates missing properties from `undefined` when `exactOptionalPropertyTypes` option is enabled. " +
            "Please use `T | undefined` to represent optional properties.",
          *fix(fixer) {
            if (
              typeAnnotation.type === "TSTypeReference" ||
              typeAnnotation.type.endsWith("Keyword") ||
              (typeAnnotation.type === "TSUnionType" &&
                typeAnnotation.types.every(
                  (t) =>
                    t.type === "TSTypeReference" || t.type.endsWith("Keyword")
                ))
            ) {
              yield fixer.insertTextAfter(typeAnnotation, " | undefined");
            } else {
              yield fixer.insertTextBefore(typeAnnotation, "(");
              yield fixer.insertTextAfter(typeAnnotation, ") | undefined");
            }
          },
        });
      }
    }
  },
};
