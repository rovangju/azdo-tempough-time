import { describe, expect, it } from "vitest";
import { buildNotes } from "../src/notes";

const workItem = {
  id: 1234,
  title: "Fix health checks",
  type: "Task",
  url: "https://dev.azure.com/example/project/_workitems/edit/1234",
};

describe("buildNotes", () => {
  it("adds the project and Azure DevOps reference before user notes", () => {
    expect(buildNotes(workItem, "PLAT", "Investigated timeout behavior.")).toBe(
      "[PLAT #1234 - Fix health checks] Investigated timeout behavior.",
    );
  });

  it("omits the trailing space when user notes are empty", () => {
    expect(buildNotes(workItem, "PLAT", "  ")).toBe("[PLAT #1234 - Fix health checks]");
  });

  it("rejects unsaved work items", () => {
    expect(() => buildNotes({ ...workItem, id: null, url: null }, "PLAT", "")).toThrow(
      "Save the work item",
    );
  });
});
