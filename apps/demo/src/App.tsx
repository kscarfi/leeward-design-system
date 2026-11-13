import { Badge, Heading, Text } from "@leeward/react";
import styles from "./App.module.css";

const LABELS: Record<string, string> = {
  "a-without-system": "Run A: without the design system",
  "b-with-system": "Run B: with the design system",
};

export function App({ runs }: { runs: string[] }) {
  const ids = ["a-without-system", "b-with-system"];
  return (
    <main className={styles.page} data-theme="light">
      <header className={styles.header}>
        <Heading level={1} size="lg">Same prompt, two results</Heading>
        <Text tone="secondary">One prompt, one agent, two runs. Outputs are unedited. Metrics are in COMPARISON.md.</Text>
      </header>
      <div className={styles.grid}>
        {ids.map((id) => (
          <section key={id} className={styles.column} aria-labelledby={`${id}-title`}>
            <div className={styles.columnHeader}>
              <Heading level={2} size="xs" id={`${id}-title`}>{LABELS[id]}</Heading>
              {!runs.includes(id) && <Badge tone="warning">Not run yet</Badge>}
            </div>
            {/* Each run renders in an iframe so its global styles cannot leak into the other. */}
            <iframe className={styles.frame} title={LABELS[id]} src={`?run=${id}`} />
          </section>
        ))}
      </div>
    </main>
  );
}
