// Storybook only: turns a component's Name.docs.md into the description of its Docs page.
// The first heading is dropped because the Docs page already shows the component name.
export function docsDescription(markdown: string): string {
  return markdown.replace(/^# .*\n+/, "");
}
