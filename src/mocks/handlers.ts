import { delay, http, HttpResponse } from "msw";
import projects from "./fixtures/projects.json";
import projectTasks from "./fixtures/project-tasks.json";
import { getMockScenario } from "./scenarios";

// mock HTTP routes and maps the active scenario to the appropriate API response.
function scenarioResponse() {
  switch (getMockScenario()) {
    case "auth":
      return HttpResponse.json({ detail: "Invalid or expired API token." }, { status: 401 });
    case "validation":
      return HttpResponse.json({ hours: ["Ensure this value is less than or equal to 24."] }, { status: 400 });
    case "server":
      return HttpResponse.json({ detail: "Temporary service failure." }, { status: 503 });
    case "network":
      return HttpResponse.error();
    default:
      return null;
  }
}

export const handlers = [
  http.get("*/projects/", async () => {
    await delay(150);
    return scenarioResponse() ?? HttpResponse.json(projects);
  }),
  http.get("*/projects/:projectId/tasks/", async () => {
    await delay(150);
    return scenarioResponse() ?? HttpResponse.json(projectTasks);
  }),
  http.post("*/time-entries/", async ({ request }) => {
    await delay(250);
    const failure = scenarioResponse();
    if (failure) {
      return failure;
    }
    const entry = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: 901, ...entry }, { status: 201 });
  }),
];
