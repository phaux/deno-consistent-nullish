import { trimRange } from "./trimRange.ts";

/**
 * Returns the range of the operator in a binary expression.
 */
export function getOperatorRange(
  sourceCode: Deno.lint.SourceCode,
  node: Deno.lint.BinaryExpression
): Deno.lint.Range {
  return trimRange(sourceCode, [node.left.range[1], node.right.range[0]]);
}
