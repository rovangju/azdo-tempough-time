export interface WorkItemContext {
  id: number | null;
  title: string;
  type: string;
  url: string | null;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  status: string;
}

export interface ProjectTask {
  id: number;
  taskId: number;
  taskName: string;
  taskBillableDefault: boolean;
  phaseId: number | null;
  phaseName: string | null;
}

export interface Connection {
  apiRoot: string;
  token: string;
}

export interface LastSelection {
  projectId: number;
  taskId: number;
}

export interface TimeEntryRequest {
  projectId: number;
  taskId: number;
  date: string;
  hours: string;
  notes: string;
  billable: boolean;
}

export interface TimeEntry extends TimeEntryRequest {
  id: number;
}

export interface WorkItemHost {
  getCurrentWorkItem(): Promise<WorkItemContext>;
}

export interface SettingsStore {
  getConnection(): Promise<Connection | null>;
  setConnection(connection: Connection): Promise<void>;
  getLastSelection(): Promise<LastSelection | null>;
  setLastSelection(selection: LastSelection): Promise<void>;
  clearConnection(): Promise<void>;
  clearAll(): Promise<void>;
}

export interface TempoughClient {
  listProjects(connection: Connection): Promise<Project[]>;
  listProjectTasks(connection: Connection, projectId: number): Promise<ProjectTask[]>;
  createTimeEntry(connection: Connection, entry: TimeEntryRequest): Promise<TimeEntry>;
}
