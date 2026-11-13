/** Join class names, skipping anything that is not a non-empty string. */
export function cx(...names: unknown[]): string {
  return names.filter((name): name is string => typeof name === "string" && name.length > 0).join(" ");
}
