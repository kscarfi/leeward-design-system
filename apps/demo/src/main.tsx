import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import { StrictMode, Suspense, lazy, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Each run is loaded on its own so a broken run cannot break the other.
const runs = import.meta.glob<{ default: ComponentType }>("../runs/*/TransferScreen.tsx");
const screens = Object.fromEntries(Object.entries(runs).map(([path, loader]) => [path.split("/")[2]!, lazy(loader)]));
const params = new URLSearchParams(location.search);
const only = params.get("run");

function Run({ id }: { id: string }) {
  const Screen = screens[id];
  if (!Screen) return <p>No output yet for {id}. See RUNBOOK.md.</p>;
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Screen />
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>{only ? <div data-run={only}><Run id={only} /></div> : <App runs={Object.keys(runs).map((k) => k.split("/")[2]!)} />}</StrictMode>,
);
