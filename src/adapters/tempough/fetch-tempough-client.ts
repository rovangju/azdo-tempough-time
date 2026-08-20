import type {
  Connection,
  Project,
  ProjectTask,
  TimeEntry,
  TimeEntryRequest,
} from "../../domain";
import type { TempoughClient } from "../../ports/tempough-client";

export class TempoughApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "TempoughApiError";
  }
}

export function normalizeApiRoot(value: string): string {
  const normalized = value.trim().replace(/\/+$/, "");
  const url = new URL(normalized);
  if (!url.pathname.endsWith("/api/v1")) {
    throw new Error("API root must end with /api/v1.");
  }
  return normalized;
}

async function request<T>(
  connection: Connection,
  path: string,
  init?: RequestInit,
  transportRoot?: string,
): Promise<T> {
  const apiRoot = normalizeApiRoot(connection.apiRoot);
  const response = await fetch(`${transportRoot ?? apiRoot}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${connection.token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const body = await response.text();
  if (!response.ok) {
    throw new TempoughApiError(
      `Tempough returned ${response.status} ${response.statusText}.`,
      response.status,
      body,
    );
  }
  return body ? (JSON.parse(body) as T) : (undefined as T);
}

export class FetchTempoughClient implements TempoughClient {
  constructor(private readonly transportRoot?: string) {}

  async listProjects(connection: Connection): Promise<Project[]> {
    const projects = await request<Project[]>(connection, "/projects/", undefined, this.transportRoot);
    return projects.filter((project) => project.status === "active");
  }

  listProjectTasks(connection: Connection, projectId: number): Promise<ProjectTask[]> {
    return request(connection, `/projects/${projectId}/tasks/`, undefined, this.transportRoot);
  }

  createTimeEntry(
    connection: Connection,
    entry: TimeEntryRequest,
  ): Promise<TimeEntry> {
    return request(connection, "/time-entries/", {
      method: "POST",
      body: JSON.stringify(entry),
    }, this.transportRoot);
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof TempoughApiError) {
    return error.responseBody
      ? `${error.message}\n${error.responseBody}`
      : error.message;
  }
  return error instanceof Error ? error.message : String(error);
}
