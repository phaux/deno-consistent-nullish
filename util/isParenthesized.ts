/**
 * Check if node is parenthesized.
 */
export function isParenthesized(
  sourceCode: Deno.lint.SourceCode,
  node: Deno.lint.TypeNode,
): boolean {
  return (
    sourceCode.text.substring(0, node.range[0]).match(/\(\s*$/) != null &&
    sourceCode.text.substring(node.range[1]).match(/^\s*\)/) != null
  );
}
