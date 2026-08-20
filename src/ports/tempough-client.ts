import type {
  Connection,
  Project,
  ProjectTask,
  TimeEntry,
  TimeEntryRequest,
} from "../domain";

export interface TempoughClient {
  listProjects(connection: Connection): Promise<Project[]>;
  listProjectTasks(connection: Connection, projectId: number): Promise<ProjectTask[]>;
  createTimeEntry(connection: Connection, entry: TimeEntryRequest): Promise<TimeEntry>;
}
