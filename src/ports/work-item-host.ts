import type { WorkItemContext } from "../domain";

export interface WorkItemHost {
  getCurrentWorkItem(): Promise<WorkItemContext>;
}
