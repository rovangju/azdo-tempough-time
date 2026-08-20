import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as SDK from "azure-devops-extension-sdk";
import type { IExtensionDataService } from "azure-devops-extension-api/Common/CommonServices";
import type {
  IWorkItemNotificationListener,
  IWorkItemFormService,
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { App } from "./app";
import { AzureDevOpsWorkItemHost } from "./adapters/host/azure-devops-work-item-host";
import { AzureDevOpsSettingsStore } from "./adapters/storage/azure-devops-settings-store";
import { FetchTempoughClient } from "./adapters/tempough/fetch-tempough-client";

function trace(message: string): void {
  void fetch("/__azdo_trace", { method: "POST", body: message }).catch(() => undefined);
}

// Production composition root for the Azure DevOps work-item form contribution:
// initializes the SDK, connects application ports to Azure DevOps/HTTP adapters, and renders App.
async function start(): Promise<void> {
  const root = document.getElementById("root")!;

  if (window.parent === window) {
    root.textContent = "The development host is reachable. Open this contribution from an Azure DevOps work item.";
    return;
  }

  try {
    trace("entry point loaded in iframe");
    void SDK.init({ applyTheme: true });
    await SDK.ready();
    trace(`SDK ready; contribution=${SDK.getContributionId()}`);
    const listener: IWorkItemNotificationListener = {
      onLoaded: () => undefined,
      onFieldChanged: () => undefined,
      onSaved: () => window.location.reload(),
      onRefreshed: () => undefined,
      onReset: () => undefined,
      onUnloaded: () => undefined,
    };
    SDK.register(SDK.getContributionId(), () => listener);
    trace("work-item provider registered");

    const [formService, extensionDataService, accessToken] = await Promise.all([
      SDK.getService<IWorkItemFormService>("ms.vss-work-web.work-item-form"),
      SDK.getService<IExtensionDataService>("ms.vss-features.extension-data-service"),
      SDK.getAccessToken(),
    ]);
    trace("Azure DevOps services resolved");
    const extension = SDK.getExtensionContext();
    const dataManager = await extensionDataService.getExtensionDataManager(extension.id, accessToken);
    trace("extension data manager resolved");
    const host = SDK.getHost();
    const project = SDK.getPageContext().webContext.project;
    const transportRoot = import.meta.env.DEV ? `${window.location.origin}/__tempough` : undefined;
    createRoot(root).render(
      <StrictMode>
        <App
          host={new AzureDevOpsWorkItemHost(formService, host.name, project.name)}
          store={new AzureDevOpsSettingsStore(dataManager)}
          client={new FetchTempoughClient(transportRoot)}
        />
      </StrictMode>,
    );
    trace("React application rendered");
  } catch (reason) {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    trace(`initialization failed: ${error.message}`);
    console.error("Tempough extension initialization failed", error);
    root.textContent = `Tempough extension initialization failed: ${error.message}`;
  }
}

void start();
