import type { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import type { WorkItemContext, WorkItemHost } from "../domain";

export class AzureDevOpsWorkItemHost implements WorkItemHost {
  constructor(
    private readonly service: IWorkItemFormService,
    private readonly organization: string,
    private readonly project: string,
  ) {}

  async getCurrentWorkItem(): Promise<WorkItemContext> {
    const [id, title, type] = await Promise.all([
      this.service.getId(),
      this.service.getFieldValue("System.Title", false),
      this.service.getFieldValue("System.WorkItemType", false),
    ]);
    const savedId = Number.isInteger(id) && id > 0 ? id : null;
    return {
      id: savedId,
      title: String(title ?? "Untitled work item"),
      type: String(type ?? "Work Item"),
      url: savedId
        ? `https://dev.azure.com/${encodeURIComponent(this.organization)}/${encodeURIComponent(this.project)}/_workitems/edit/${savedId}`
        : null,
    };
  }
}
