import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
// Harbor is a partner brand generated from one color with `pnpm theme:generate`.
import "@leeward/tokens/partners/harbor.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider, TooltipProvider } from "@leeward/react";
import { App } from "./App.tsx";
import { PhoneApp } from "./PhoneApp.tsx";
import { StoreProvider } from "./store.tsx";
import { followParent } from "./theme.ts";

// ?embed is the app inside the phone frame; without it, the showcase page around it.
const embedded = new URLSearchParams(location.search).has("embed");
if (embedded) followParent();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ToastProvider placement="top">
        <StoreProvider>{embedded ? <PhoneApp /> : <App />}</StoreProvider>
      </ToastProvider>
    </TooltipProvider>
  </StrictMode>,
);
