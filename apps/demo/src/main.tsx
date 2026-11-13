import { StrictMode, Suspense, lazy, type ComponentType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

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

async function host(id: string): Promise<(children: ReactNode) => ReactNode> {
  // Run A gets a plain page: no Leeward CSS, so the system does not style its output.
  if (id !== "b-with-system") return (children) => children;
  // Run B gets the app setup that DESIGN.md asks for: fonts, base styles, a theme and the providers.
  await import("@leeward/react/fonts.css");
  await import("@leeward/react/styles.css");
  const { ToastProvider, TooltipProvider } = await import("@leeward/react");
  return (children) => (
    <div data-theme="light">
      <TooltipProvider>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </div>
  );
}

async function start() {
  const root = createRoot(document.getElementById("root")!);
  if (only) {
    const wrap = await host(only);
    root.render(
      <StrictMode>
        <div data-run={only}>{wrap(<Run id={only} />)}</div>
      </StrictMode>,
    );
    return;
  }
  await import("@leeward/react/fonts.css");
  await import("@leeward/react/styles.css");
  const { App } = await import("./App.tsx");
  root.render(
    <StrictMode>
      <App runs={Object.keys(screens)} />
    </StrictMode>,
  );
}

void start();
