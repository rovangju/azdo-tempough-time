import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/app";
import type { SettingsStore } from "../src/ports/settings-store";
import type { TempoughClient } from "../src/ports/tempough-client";
import type { WorkItemHost } from "../src/ports/work-item-host";

const host: WorkItemHost = {
  getCurrentWorkItem: async () => ({
    id: 1234,
    title: "Fix health checks",
    type: "Task",
    url: "https://dev.azure.com/example/project/_workitems/edit/1234",
  }),
};

function setup() {
  const store: SettingsStore = {
    getConnection: async () => ({ apiRoot: "https://example.test/api/v1", token: "secret" }),
    setConnection: vi.fn(),
    getLastSelection: async () => null,
    setLastSelection: vi.fn(),
    clearConnection: vi.fn(),
    clearAll: vi.fn(),
  };
  const client: TempoughClient = {
    listProjects: async () => [{ id: 10, name: "Platform", code: "PLAT", status: "active" }],
    listProjectTasks: async () => [{ id: 20, taskId: 30, taskName: "Development", taskBillableDefault: true, phaseId: null, phaseName: null }],
    createTimeEntry: vi.fn(async (connection, request) => ({ id: 1, ...request })),
  };
  render(<App host={host} store={store} client={client} />);
  return { store, client };
}

describe("App", () => {
  it("submits an enriched time entry and retains selections", async () => {
    const { client, store } = setup();
    const project = await screen.findByRole("combobox", { name: "Project" });
    await waitFor(() => expect(project).not.toBeDisabled());
    fireEvent.focus(project);
    fireEvent.click(screen.getByRole("option", { name: "PLAT - Platform" }));
    const task = await screen.findByRole("combobox", { name: "Task" });
    await waitFor(() => expect(task).not.toBeDisabled());
    fireEvent.focus(task);
    fireEvent.click(screen.getByRole("option", { name: "Development" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Hours" }), { target: { value: "1.5" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Notes" }), { target: { value: "Reviewed rollout." } });
    fireEvent.click(screen.getByRole("button", { name: "Create time entry" }));

    await waitFor(() => expect(client.createTimeEntry).toHaveBeenCalled());
    expect(client.createTimeEntry).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        projectId: 10,
        taskId: 30,
        hours: "1.5",
        billable: true,
        notes: expect.stringContaining("[#1234] Fix health checks"),
      }),
    );
    expect(store.setLastSelection).toHaveBeenCalledWith({ projectId: 10, taskId: 30 });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Time entry created"));
    expect(screen.getByRole("combobox", { name: "Project" })).toHaveValue("PLAT - Platform");
    expect(screen.getByRole("combobox", { name: "Task" })).toHaveValue("Development");
    expect(screen.getByRole("spinbutton", { name: "Hours" })).toHaveValue(null);
  });
});
