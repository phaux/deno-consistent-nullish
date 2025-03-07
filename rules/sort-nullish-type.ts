import { fc } from "../util/formatCode.ts";
import { getRangeWithParens } from "../util/getRangeWithParens.ts";

const typeOrder: Partial<Record<Deno.lint.TypeNode["type"], number>> = {
  TSNullKeyword: 1,
  TSUndefinedKeyword: 2,
};

export const sortNullishType: Deno.lint.Rule = {
  create: (ctx) => ({
    TSUnionType(unionNode) {
      const sortedTypes = unionNode.types
        .filter((t) => (typeOrder[t.type] ?? 0) > 0)
        .sort((a, b) => typeOrder[a.type]! - typeOrder[b.type]!)
        .map((t) => ctx.sourceCode.getText(t))
        .join(" | ");

      for (const [index, node] of unionNode.types.entries()) {
        if ((typeOrder[node.type] ?? 0) <= 0) continue;

        const targetIndex = unionNode.types.findLastIndex(
          (t) => (typeOrder[t.type] ?? 0) < (typeOrder[node.type] ?? 0),
        );
        if (targetIndex < index) continue;

        const targetNode = unionNode.types[targetIndex]!;
        const nodeText = ctx.sourceCode.getText(node);
        const targetNodeText = ctx.sourceCode.getText(targetNode);

        ctx.report({
          node: node,
          message: `Expected ${fc(nodeText)} to be after ${fc(targetNodeText)}`,
          hint: `For consistency, place ${fc(sortedTypes)} at the end of the union.`,
          *fix(fixer) {
            // Start from the end of previous member or start of the union if first member.
            const start = index === 0 ? unionNode.range[0] : getRangeWithParens(
              ctx.sourceCode,
              unionNode.types[index - 1]!,
            )[1];
            // End at the end of the current member.
            const end = getRangeWithParens(
              ctx.sourceCode,
              unionNode.types[index]!,
            )[1];
            // Remove range.
            yield fixer.removeRange([start, end]);
            // Insert current node text after the target node.
            yield fixer.insertTextAfterRange(
              getRangeWithParens(ctx.sourceCode, targetNode),
              ` | ${nodeText}`,
            );
          },
        });
      }
    },
  }),
};
