// Markdown guides link to files relative to their own folder. In Storybook those links would
// break, so they are rewritten to the same files on GitHub.
const repo = "https://github.com/kscarfi/leeward-design-system/blob/main/";

export function githubLinks(markdown: string, folder: string): string {
  return markdown.replace(/\]\((?!https?:|#|mailto:)([^)]+)\)/g, (_match, target: string) => {
    const parts = `${folder}/${target}`.split("/");
    const out: string[] = [];
    for (const part of parts) {
      if (part === "..") out.pop();
      else if (part !== "." && part !== "") out.push(part);
    }
    return `](${repo}${out.join("/")})`;
  });
}
