import { useEffect, useMemo } from "react";
import { Icon, Text } from "@leeward/react";

/** A download link for a text file that ships with the docs, such as AGENTS.md. */
export function DownloadFile({ fileName, content, label, type = "text/markdown" }: { fileName: string; content: string; label: string; type?: string }) {
  const href = useMemo(() => URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` })), [content, type]);
  useEffect(() => () => URL.revokeObjectURL(href), [href]);
  const size = `${Math.max(1, Math.round(new Blob([content]).size / 1024))} KB`;
  return (
    <a
      href={href}
      download={fileName}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--lw-space-xs)",
        height: "var(--lw-button-height-md)",
        padding: "0 var(--lw-button-padding-x-pill-md)",
        borderRadius: "var(--lw-button-radius-pill)",
        background: "var(--lw-fill-primary-default)",
        color: "var(--lw-fill-primary-on-default)",
        fontWeight: "var(--lw-type-button-md-weight)",
        fontSize: "var(--lw-type-button-md-size)",
        textDecoration: "none",
      }}
    >
      <Icon name="download" size="md" />
      {label}
      <Text as="span" variant="caption" style={{ color: "inherit" }}>{size}</Text>
    </a>
  );
}
