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
