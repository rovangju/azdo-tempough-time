import type { WorkItemContext } from "./domain";

export function buildNotes(workItem: WorkItemContext, projectCode: string, userNotes: string): string {
  if (workItem.id === null) {
    throw new Error("Save the work item before logging time.");
  }

  const reference = `[${projectCode} #${workItem.id} - ${workItem.title}]`;
  const trimmedNotes = userNotes.trim();
  return trimmedNotes ? `${reference} ${trimmedNotes}` : reference;
}
