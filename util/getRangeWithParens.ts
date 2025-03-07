/**
 * Get range of node including surrounding parentheses.
 */
export function getRangeWithParens(
  sourceCode: Deno.lint.SourceCode,
  node: Deno.lint.TypeNode,
): Deno.lint.Range {
  let rangeStart = node.range[0];
  let rangeEnd = node.range[1];
  while (true) {
    const leftMatch = sourceCode.text.substring(0, rangeStart).match(/\(\s*$/);
    const rightMatch = sourceCode.text.substring(rangeEnd).match(/^\s*\)/);
    if (!leftMatch || !rightMatch) break;
    rangeStart -= leftMatch[0].length;
    rangeEnd += rightMatch[0].length;
  }
  return [rangeStart, rangeEnd];
}
