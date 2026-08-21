import type { IExtensionDataManager } from "azure-devops-extension-api/Common/CommonServices";
import type { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { describe, expect, it, vi } from "vitest";
import { AzureDevOpsWorkItemHost } from "../src/adapters/host/azure-devops-work-item-host";
import { MockWorkItemHost } from "../src/adapters/host/mock-work-item-host";
import { AzureDevOpsSettingsStore } from "../src/adapters/storage/azure-devops-settings-store";

describe("AzureDevOpsWorkItemHost", () => {
  it("maps a saved work item and constructs its URL", async () => {
    const service = {
      getId: vi.fn().mockResolvedValue(42),
      getFieldValue: vi.fn()
        .mockResolvedValueOnce("Fix build")
        .mockResolvedValueOnce("Task"),
    } as unknown as IWorkItemFormService;

    const host = new AzureDevOpsWorkItemHost(service, "Example Org", "Platform Team");

    await expect(host.getCurrentWorkItem()).resolves.toEqual({
      id: 42,
      title: "Fix build",
      type: "Task",
      url: "https://dev.azure.com/Example%20Org/Platform%20Team/_workitems/edit/42",
    });
  });

  it("uses defaults for an unsaved work item", async () => {
    const service = {
      getId: vi.fn().mockResolvedValue(0),
      getFieldValue: vi.fn().mockResolvedValue(null),
    } as unknown as IWorkItemFormService;

    const host = new AzureDevOpsWorkItemHost(service, "org", "project");

    await expect(host.getCurrentWorkItem()).resolves.toEqual({
      id: null,
      title: "Untitled work item",
      type: "Work Item",
      url: null,
    });
  });
});

describe("MockWorkItemHost", () => {
  it("returns its configured work item", async () => {
    const workItem = { id: 7, title: "Test item", type: "Bug", url: null };

    await expect(new MockWorkItemHost(workItem).getCurrentWorkItem()).resolves.toBe(workItem);
  });
});

describe("AzureDevOpsSettingsStore", () => {
  it("reads and writes user-scoped settings", async () => {
    const manager = {
      getValue: vi.fn()
        .mockResolvedValueOnce({ apiRoot: "https://example.test/api/v1", token: "token" })
        .mockResolvedValueOnce({ projectId: 1, taskId: 2 }),
      setValue: vi.fn().mockResolvedValue(undefined),
    } as unknown as IExtensionDataManager;
    const store = new AzureDevOpsSettingsStore(manager);

    await expect(store.getConnection()).resolves.toEqual({ apiRoot: "https://example.test/api/v1", token: "token" });
    await expect(store.getLastSelection()).resolves.toEqual({ projectId: 1, taskId: 2 });
    await store.setConnection({ apiRoot: "https://new.test/api/v1", token: "new-token" });
    await store.setLastSelection({ projectId: 3, taskId: 4 });
    await store.clearConnection();
    await store.clearAll();

    expect(manager.setValue).toHaveBeenCalledWith(
      "connection",
      { apiRoot: "https://new.test/api/v1", token: "new-token" },
      { scopeType: "User" },
    );
    expect(manager.setValue).toHaveBeenCalledWith(
      "last-selection",
      { projectId: 3, taskId: 4 },
      { scopeType: "User" },
    );
    expect(manager.setValue).toHaveBeenCalledWith("connection", null, { scopeType: "User" });
    expect(manager.setValue).toHaveBeenCalledWith("last-selection", null, { scopeType: "User" });
  });

  it("normalizes missing settings to null", async () => {
    const manager = {
      getValue: vi.fn().mockResolvedValue(undefined),
    } as unknown as IExtensionDataManager;
    const store = new AzureDevOpsSettingsStore(manager);

    await expect(store.getConnection()).resolves.toBeNull();
    await expect(store.getLastSelection()).resolves.toBeNull();
  });
});
