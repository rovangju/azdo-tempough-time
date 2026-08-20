import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { FetchTempoughClient } from "./api";
import { MockWorkItemHost } from "./host/mock-host";
import { worker } from "./mocks/browser";
import { setMockScenario, type MockScenario } from "./mocks/scenarios";
import { BrowserSettingsStore } from "./storage/browser-storage";

const useRealApi = new URLSearchParams(window.location.search).get("api") === "real";
const configuredApiRoot = import.meta.env.VITE_TEMPOUGH_API_ROOT as string | undefined;
const client = new FetchTempoughClient(
  useRealApi ? `${window.location.origin}/__tempough` : undefined,
);

// This entry-local component is not exported or reused.
// eslint-disable-next-line react-refresh/only-export-components
function LocalApp() {
  const [scenario, setScenario] = useState<MockScenario>("success");
  return (
    <App
      host={new MockWorkItemHost()}
      store={new BrowserSettingsStore()}
      client={client}
      initialApiRoot={useRealApi ? configuredApiRoot : undefined}
      developmentControls={!useRealApi && (
        <label className="dev-controls">
          Mock API scenario
          <select value={scenario} onChange={(event) => {
            const next = event.target.value as MockScenario;
            setScenario(next);
            setMockScenario(next);
          }}>
            <option value="success">Success</option>
            <option value="auth">Authentication failure</option>
            <option value="validation">Validation failure</option>
            <option value="server">Server failure</option>
            <option value="network">Network failure</option>
          </select>
        </label>
      )}
    />
  );
}

async function start(): Promise<void> {
  if (!useRealApi) {
    await worker.start({ onUnhandledRequest: "bypass" });
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode><LocalApp /></StrictMode>,
  );
}

void start();
