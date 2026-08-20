// mock Azure DevOps work-item host for local development and tests.
import type { WorkItemContext } from "../../domain";
import type { WorkItemHost } from "../../ports/work-item-host";

const mockWorkItem: WorkItemContext = {
  id: 1234,
  title: "Improve deployment health checks",
  type: "Task",
  url: "https://dev.azure.com/example/platform/_workitems/edit/1234",
};

export class MockWorkItemHost implements WorkItemHost {
  constructor(private readonly workItem = mockWorkItem) {}

  async getCurrentWorkItem(): Promise<WorkItemContext> {
    return this.workItem;
  }
}
