import { useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Table.module.css";

export interface TableColumn<Row> {
  key: string;
  header: string;
  /** Numbers and amounts align to the end and use tabular figures. */
  align?: "start" | "end";
  sortable?: boolean;
  /** How to show the cell. Defaults to the row's value at `key`. */
  render?: (row: Row) => ReactNode;
  /** The value used for sorting, when it differs from what is shown (for example a Date behind a formatted string). */
  sortValue?: (row: Row) => string | number | Date;
}

export interface TableSort {
  key: string;
  direction: "ascending" | "descending";
}

export interface TableProps<Row> {
  /** Says what the table lists, for example "Transactions in November". Read as the table's name. */
  caption: string;
  /** Keep the caption for screen readers but hide it, when a heading right above says the same. */
  hideCaption?: boolean;
  columns: Array<TableColumn<Row>>;
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Controlled sort. Without `onSortChange`, the table sorts itself. */
  sort?: TableSort;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  /** Shown in one row when there are no rows. */
  emptyText?: ReactNode;
  locale?: Locale;
  className?: string;
}

function valueOf<Row>(row: Row, column: TableColumn<Row>): string | number | Date {
  if (column.sortValue) return column.sortValue(row);
  const v = (row as Record<string, unknown>)[column.key];
  return typeof v === "number" || v instanceof Date ? v : String(v ?? "");
}

/** Rows and columns of data people compare, such as a statement on desktop. On phones, prefer a List. */
export function Table<Row>({ caption, hideCaption, columns, rows, rowKey, sort, defaultSort, onSortChange, emptyText, locale = "en-US", className }: TableProps<Row>) {
  const m = messages(locale);
  const captionId = useId();
  const [innerSort, setInnerSort] = useState<TableSort | undefined>(defaultSort);
  const current = sort ?? innerSort;
  const sorted = useMemo(() => {
    if (!current || onSortChange) return rows;
    const column = columns.find((c) => c.key === current.key);
    if (!column) return rows;
    const dir = current.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = valueOf(a, column), y = valueOf(b, column);
      if (typeof x === "string" && typeof y === "string") return x.localeCompare(y, locale) * dir;
      return (Number(x) - Number(y)) * dir;
    });
  }, [rows, columns, current, onSortChange, locale]);
  const toggle = (key: string) => {
    const next: TableSort = { key, direction: current?.key === key && current.direction === "ascending" ? "descending" : "ascending" };
    if (sort === undefined) setInnerSort(next);
    onSortChange?.(next);
  };
  return (
    // The scroll container is focusable so keyboard users can scroll wide tables.
    <div className={cx(styles.scroll, className)} role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className={styles.table}>
        <caption id={captionId} className={cx(styles.caption, hideCaption && styles.srOnly)}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = current?.key === column.key;
              return (
                <th key={column.key} scope="col" className={cx(styles.th, column.align === "end" && styles.end)} aria-sort={column.sortable ? (active ? current!.direction : "none") : undefined}>
                  {column.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => toggle(column.key)}>
                      {column.header}
                      <Icon name={active ? (current!.direction === "ascending" ? "arrow-up" : "arrow-down") : "arrows-up-down"} size="sm" className={cx(styles.sortIcon, active && styles.sortActive)} />
                      <span className={styles.srOnly}>{active ? `, ${current!.direction === "ascending" ? m.sortedAscending : m.sortedDescending}` : ""}</span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyText ?? m.noResults}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)} className={styles.row}>
                {columns.map((column) => (
                  <td key={column.key} className={cx(styles.td, column.align === "end" && styles.end)}>
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
