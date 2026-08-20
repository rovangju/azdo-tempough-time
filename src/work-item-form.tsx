import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as SDK from "azure-devops-extension-sdk";
import type { IExtensionDataService } from "azure-devops-extension-api/Common/CommonServices";
import {
  WorkItemTrackingServiceIds,
  type IWorkItemNotificationListener,
  type IWorkItemFormService,
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { App } from "./app";
import { AzureDevOpsWorkItemHost } from "./adapters/host/azure-devops-work-item-host";
import { AzureDevOpsSettingsStore } from "./adapters/storage/azure-devops-settings-store";
import { FetchTempoughClient } from "./adapters/tempough/fetch-tempough-client";

// Production composition root for the Azure DevOps work-item form contribution:
// initializes the SDK, connects application ports to Azure DevOps/HTTP adapters, and renders App.
async function start(): Promise<void> {
  try {
    await SDK.init({ loaded: false, applyTheme: true });
    await SDK.ready();
    const [formService, extensionDataService, accessToken] = await Promise.all([
      SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService),
      SDK.getService<IExtensionDataService>("ms.vss-features.extension-data-service"),
      SDK.getAccessToken(),
    ]);
    const extension = SDK.getExtensionContext();
    const dataManager = await extensionDataService.getExtensionDataManager(extension.id, accessToken);
    const host = SDK.getHost();
    const project = SDK.getPageContext().webContext.project;
    const listener: IWorkItemNotificationListener = {
      onLoaded: () => undefined,
      onFieldChanged: () => undefined,
      onSaved: () => window.location.reload(),
      onRefreshed: () => undefined,
      onReset: () => undefined,
      onUnloaded: () => undefined,
    };
    SDK.register(SDK.getContributionId(), listener);
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App
          host={new AzureDevOpsWorkItemHost(formService, host.name, project.name)}
          store={new AzureDevOpsSettingsStore(dataManager)}
          client={new FetchTempoughClient()}
        />
      </StrictMode>,
    );
    await SDK.notifyLoadSucceeded();
  } catch (reason) {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await SDK.notifyLoadFailed(error);
  }
}

void start();
