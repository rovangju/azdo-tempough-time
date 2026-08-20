import { describe, expect, it } from "vitest";
import { buildNotes } from "../src/notes";

const workItem = {
  id: 1234,
  title: "Fix health checks",
  type: "Task",
  url: "https://dev.azure.com/example/project/_workitems/edit/1234",
};

describe("buildNotes", () => {
  it("adds the Azure DevOps reference before user notes", () => {
    expect(buildNotes(workItem, "Investigated timeout behavior.")).toBe(
      "[#1234] Fix health checks\nhttps://dev.azure.com/example/project/_workitems/edit/1234\n\nInvestigated timeout behavior.",
    );
  });

  it("omits the trailing separator when user notes are empty", () => {
    expect(buildNotes(workItem, "  ")).toBe(
      "[#1234] Fix health checks\nhttps://dev.azure.com/example/project/_workitems/edit/1234",
    );
  });

  it("rejects unsaved work items", () => {
    expect(() => buildNotes({ ...workItem, id: null, url: null }, "")).toThrow(
      "Save the work item",
    );
  });
});
