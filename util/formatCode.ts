/**
 * Formats code for display in messages.
 */
export function fc(code: string) {
  return `\`${code.replace(/`/g, "\\`")}\``;
}
