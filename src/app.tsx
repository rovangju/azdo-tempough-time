import { useEffect, useMemo, useState } from "react";
import { formatApiError, normalizeApiRoot } from "./adapters/tempough/fetch-tempough-client";
import type {
  Connection,
  Project,
  ProjectTask,
  WorkItemContext,
} from "./domain";
import { buildNotes } from "./notes";
import type { SettingsStore } from "./ports/settings-store";
import type { TempoughClient } from "./ports/tempough-client";
import type { WorkItemHost } from "./ports/work-item-host";
import { SearchableSelect } from "./searchable-select";
import "./styles.css";

interface AppProps {
  host: WorkItemHost;
  store: SettingsStore;
  client: TempoughClient;
  developmentControls?: React.ReactNode;
  initialApiRoot?: string;
}

function localDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function toPositiveId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function projectLabel(project: Project): string {
  return project.code ? `${project.code} - ${project.name}` : project.name;
}

export function App({ host, store, client, developmentControls, initialApiRoot = "" }: AppProps) {
  const [workItem, setWorkItem] = useState<WorkItemContext | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [apiRoot, setApiRoot] = useState(initialApiRoot);
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [date, setDate] = useState(localDate);
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [connectionValidated, setConnectionValidated] = useState(false);
  const [message, setMessage] = useState("");
  const [flashMessage, setFlashMessage] = useState(false);
  const [error, setError] = useState("");

  const selectedTask = tasks.find((task) => task.taskId === Number(taskId));
  const notesPreview = useMemo(() => {
    if (!workItem || workItem.id === null || !workItem.url) {
      return "";
    }
    return buildNotes(workItem, notes);
  }, [notes, workItem]);

  useEffect(() => {
    void Promise.all([
      host.getCurrentWorkItem(),
      store.getConnection(),
      store.getLastSelection(),
    ]).then(([currentWorkItem, savedConnection, selection]) => {
      setWorkItem(currentWorkItem);
      if (savedConnection) {
        setConnection(savedConnection);
        setApiRoot(savedConnection.apiRoot);
        setToken(savedConnection.token);
      }
      if (selection) {
        setProjectId(String(selection.projectId));
        setTaskId(String(selection.taskId));
      }
    }).catch((reason: unknown) => setError(formatApiError(reason)));
  }, [host, store]);

  useEffect(() => {
    if (!connection) {
      return;
    }
    let cancelled = false;
    setBusy(true);
    setConnectionValidated(false);
    setError("");
    void client.listProjects(connection)
      .then((availableProjects) => {
        if (cancelled) {
          return;
        }
        setProjects(availableProjects);
        setConnectionValidated(true);
        setProjectId((currentProjectId) => {
          if (!currentProjectId) {
            return currentProjectId;
          }
          const selectedProject = availableProjects.find((project) => project.id === Number(currentProjectId));
          if (selectedProject) {
            return currentProjectId;
          }
          setTaskId("");
          return "";
        });
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setConnectionValidated(false);
          setError(formatApiError(reason));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBusy(false);
        }
      });
    return () => { cancelled = true; };
  }, [client, connection]);

  useEffect(() => {
    const selectedProjectId = toPositiveId(projectId);
    if (!connection || selectedProjectId === null) {
      setTasks([]);
      return;
    }
    let cancelled = false;
    setBusy(true);
    void client.listProjectTasks(connection, selectedProjectId)
      .then((availableTasks) => {
        if (cancelled) {
          return;
        }
        setTasks(availableTasks);
        setTaskId((currentTaskId) => {
          if (!currentTaskId) {
            return currentTaskId;
          }
          const selected = availableTasks.find((task) => task.taskId === Number(currentTaskId));
          if (selected) {
            return currentTaskId;
          }
          return "";
        });
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(formatApiError(reason));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBusy(false);
        }
      });
    return () => { cancelled = true; };
  }, [client, connection, projectId]);

  function connectionFromFields(): Connection {
    const next = { apiRoot: normalizeApiRoot(apiRoot), token: token.trim() };
    if (!next.token) {
      throw new Error("API token is required.");
    }
    return next;
  }

  async function saveConnection(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setMessage("");
    setFlashMessage(false);
    try {
      const next = connectionFromFields();
      await store.setConnection(next);
      setConnection(next);
      setMessage("Connection saved. Validating with Tempough.");
    } catch (reason) {
      setError(formatApiError(reason));
    }
  }

  async function testConnection(): Promise<void> {
    setBusy(true);
    setError("");
    setMessage("");
    setFlashMessage(false);
    try {
      await client.listProjects(connectionFromFields());
      setConnectionValidated(true);
      setMessage("Connection test succeeded.");
      setFlashMessage(true);
    } catch (reason) {
      setConnectionValidated(false);
      setError(formatApiError(reason));
    } finally {
      setBusy(false);
    }
  }

  async function clearConnection(): Promise<void> {
    await store.clearConnection();
    setConnection(null);
    setToken("");
    setProjects([]);
    setTasks([]);
    setConnectionValidated(false);
    setMessage("Connection cleared.");
    setFlashMessage(false);
    setError("");
  }

  function selectProject(id: number | null): void {
    setProjectId(id === null ? "" : String(id));
    setTaskId("");
  }

  function selectTask(id: number | null): void {
    setTaskId(id === null ? "" : String(id));
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setMessage("");
    setFlashMessage(false);
    const selectedProjectId = toPositiveId(projectId);
    const numericHours = Number(hours);
    if (!connection) {
      return setError("Configure a Tempough connection first.");
    }
    if (!workItem || workItem.id === null || !workItem.url) {
      return setError("Save the work item before logging time.");
    }
    if (selectedProjectId === null || !selectedTask) {
      return setError("Select a project and task.");
    }
    if (!/^\d+(?:\.\d{1,2})?$/.test(hours) || numericHours <= 0 || numericHours > 24) {
      return setError("Hours must be greater than zero, at most 24, and use no more than two decimal places.");
    }
    setBusy(true);
    try {
      await client.createTimeEntry(connection, {
        projectId: selectedProjectId,
        taskId: selectedTask.taskId,
        date,
        hours,
        notes: buildNotes(workItem, notes),
        billable: selectedTask.taskBillableDefault,
      });
      await store.setLastSelection({ projectId: selectedProjectId, taskId: selectedTask.taskId });
      setHours("");
      setNotes("");
      setMessage("Time entry created.");
    } catch (reason) {
      setError(formatApiError(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell">
      {developmentControls}
      <details className="settings" open={!connection}>
        <summary>
          Settings
          {connectionValidated && <span className="connection-indicator" title="Connection validated" aria-label="Connection validated" />}
        </summary>
        <form className="settings-grid" onSubmit={(event) => void saveConnection(event)}>
          <label>
            API root
            <input type="url" value={apiRoot} onChange={(event) => setApiRoot(event.target.value)} placeholder="https://tempough.example/api/v1" required />
          </label>
          <label>
            API token
            <input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" required />
          </label>
          <div className="button-row">
            <button type="submit" disabled={busy}>Save</button>
            <button type="button" className="button-secondary" disabled={busy} onClick={() => void testConnection()}>Test</button>
            {connection && <button type="button" className="button-secondary" disabled={busy} onClick={() => void clearConnection()}>Clear</button>}
          </div>
        </form>
      </details>

      <form className="entry-form" onSubmit={(event) => void submit(event)}>
        <div className="field-grid">
          <SearchableSelect
            label="Project"
            options={projects.map((project) => ({ id: project.id, label: projectLabel(project) }))}
            value={toPositiveId(projectId)}
            disabled={!connection || busy}
            onChange={(option) => selectProject(option?.id ?? null)}
          />
          <SearchableSelect
            label="Task"
            options={tasks.map((task) => ({ id: task.taskId, label: task.taskName }))}
            value={toPositiveId(taskId)}
            disabled={!projectId || busy}
            onChange={(option) => selectTask(option?.id ?? null)}
          />
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </label>
          <label>
            Hours
            <input type="number" min="0.01" max="24" step="0.01" value={hours} onChange={(event) => setHours(event.target.value)} placeholder="1.50" required />
          </label>
        </div>
        <label>
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </label>
        {workItem?.id === null ? (
          <p className="notice">Save the work item before logging time.</p>
        ) : notesPreview ? (
          <details className="preview">
            <summary>Entry notes preview</summary>
            <pre>{notesPreview}</pre>
          </details>
        ) : null}
        {error && <pre className="status status-error" role="alert">{error}</pre>}
        {message && <p className={`status status-success${flashMessage ? " status-flash" : ""}`} role="status">{message}</p>}
        <button type="submit" className="submit-button" disabled={busy || !connection || workItem?.id === null}>
          {busy ? "Working..." : "Create time entry"}
        </button>
      </form>
    </main>
  );
}
