import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "../src/mocks/handlers";
import { getMockScenario, setMockScenario, type MockScenario } from "../src/mocks/scenarios";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  setMockScenario("success");
  server.resetHandlers();
});
afterAll(() => server.close());

describe("mock API", () => {
  it("switches the active scenario", () => {
    setMockScenario("validation");
    expect(getMockScenario()).toBe("validation");
  });

  it("returns successful project, task, and time-entry responses", async () => {
    const projects = await fetch("https://example.test/projects/");
    const tasks = await fetch("https://example.test/projects/1/tasks/");
    const entry = await fetch("https://example.test/time-entries/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours: "1" }),
    });

    expect(projects.status).toBe(200);
    expect(await projects.json()).toEqual(expect.arrayContaining([expect.objectContaining({ status: "active" })]));
    expect(tasks.status).toBe(200);
    expect(await tasks.json()).toEqual(expect.any(Array));
    await expect(entry.json()).resolves.toEqual({ id: 901, hours: "1" });
  });

  it.each([
    ["auth", 401],
    ["validation", 400],
    ["server", 503],
  ] satisfies Array<[MockScenario, number]>)("returns the %s failure", async (scenario, status) => {
    setMockScenario(scenario);
    const response = await fetch("https://example.test/projects/");
    expect(response.status).toBe(status);
  });

  it("simulates a network failure", async () => {
    setMockScenario("network");
    await expect(fetch("https://example.test/projects/")).rejects.toThrow();
  });
});
