/**
 * Removes leading and trailing whitespace from a range.
 */
export function trimRange(
  sourceCode: Deno.lint.SourceCode,
  range: Deno.lint.Range
): Deno.lint.Range {
  const text = sourceCode.text.slice(range[0], range[1]);
  const trimmed = text.trim();
  const start = range[0] + text.indexOf(trimmed);
  const end = start + trimmed.length;
  return [start, end];
}
