import type { WorkItemContext } from "./domain";

export function buildNotes(workItem: WorkItemContext, userNotes: string): string {
  if (workItem.id === null || !workItem.url) {
    throw new Error("Save the work item before logging time.");
  }

  const reference = `[#${workItem.id}] ${workItem.title}\n${workItem.url}`;
  const trimmedNotes = userNotes.trim();
  return trimmedNotes ? `${reference}\n\n${trimmedNotes}` : reference;
}
