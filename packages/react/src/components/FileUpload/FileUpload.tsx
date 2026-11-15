import { useId, useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { FieldError, FieldHint, useFieldIds } from "../Field/Field.tsx";
import { Icon } from "../Icon/Icon.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./FileUpload.module.css";

export interface FileUploadProps {
  label: string;
  /** Say which files are accepted and how large they can be, for example "PDF or photo, up to 10 MB". */
  hint?: ReactNode;
  /** Same format as the input accept attribute, for example "application/pdf,image/*". */
  accept?: string;
  multiple?: boolean;
  /** Largest file size in bytes. Larger files are refused with a message. */
  maxSize?: number;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  error?: ReactNode;
  disabled?: boolean;
  locale?: Locale;
  className?: string;
}

export function formatFileSize(bytes: number, locale: Locale = "en-US"): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: unit === 0 ? 0 : 1 }).format(size)} ${units[unit]}`;
}

function accepts(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith(".")) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith("/*")) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

/** Adds documents, such as an ID or a proof of address. Works with drag and drop and with a regular button. */
export function FileUpload({ label, hint, accept, multiple, maxSize, files, onFilesChange, error, disabled, locale = "en-US", className }: FileUploadProps) {
  const m = messages(locale);
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState<File[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const list = files ?? inner;
  const ids = useFieldIds({ hint, error: error ?? (problems.length ? problems.join(" ") : undefined) });
  const set = (next: File[]) => {
    if (files === undefined) setInner(next);
    onFilesChange?.(next);
  };
  const add = (picked: FileList | null) => {
    if (!picked) return;
    const ok: File[] = [];
    const bad: string[] = [];
    for (const file of Array.from(picked)) {
      if (!accepts(file, accept)) bad.push(m.fileWrongType(file.name));
      else if (maxSize !== undefined && file.size > maxSize) bad.push(m.fileTooLarge(file.name, formatFileSize(maxSize, locale)));
      else ok.push(file);
    }
    setProblems(bad);
    if (ok.length) set(multiple ? [...list, ...ok] : ok.slice(0, 1));
  };
  return (
    <div className={cx(styles.root, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <div
        className={cx(styles.zone, dragging && styles.dragging, disabled && styles.disabled, (error || problems.length > 0) && styles.invalid)}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) add(event.dataTransfer.files);
        }}
      >
        <Icon name="upload" size="lg" className={styles.icon} />
        <span className={styles.prompt} aria-disabled={disabled || undefined}>
          <span className={styles.button} aria-hidden="true">
            {multiple ? m.chooseFiles : m.chooseFile}
          </span>
          <span className={styles.drop}>{m.orDrop}</span>
        </span>
        <input
          ref={input}
          id={inputId}
          type="file"
          className={styles.input}
          {...(accept ? { accept } : {})}
          multiple={multiple ?? false}
          disabled={disabled ?? false}
          aria-describedby={ids.describedBy}
          aria-invalid={error || problems.length ? true : undefined}
          onChange={(event) => {
            add(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      {list.length > 0 && (
        <ul className={styles.files}>
          {list.map((file, i) => (
            <li key={`${file.name}-${i}`} className={styles.file}>
              <Icon name="document" size="md" className={styles.fileIcon} />
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatFileSize(file.size, locale)}</span>
              <IconButton icon="close" size="sm" label={m.removeFile(file.name)} disabled={disabled ?? false} onClick={() => set(list.filter((_, j) => j !== i))} />
            </li>
          ))}
        </ul>
      )}
      <FieldError id={ids.error}>{error ?? (problems.length ? problems.join(" ") : undefined)}</FieldError>
    </div>
  );
}
