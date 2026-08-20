import type { Connection, LastSelection } from "../../domain";
import type { SettingsStore } from "../../ports/settings-store";

export class BrowserSettingsStore implements SettingsStore {
  constructor(private readonly namespace = "tempough:v1:local:mock-user") {}

  private key(name: string): string {
    return `${this.namespace}:${name}`;
  }

  async getConnection(): Promise<Connection | null> {
    return this.read<Connection>("connection");
  }

  async setConnection(connection: Connection): Promise<void> {
    window.localStorage.setItem(this.key("connection"), JSON.stringify(connection));
  }

  async getLastSelection(): Promise<LastSelection | null> {
    return this.read<LastSelection>("last-selection");
  }

  async setLastSelection(selection: LastSelection): Promise<void> {
    window.localStorage.setItem(this.key("last-selection"), JSON.stringify(selection));
  }

  async clearConnection(): Promise<void> {
    window.localStorage.removeItem(this.key("connection"));
  }

  async clearAll(): Promise<void> {
    window.localStorage.removeItem(this.key("connection"));
    window.localStorage.removeItem(this.key("last-selection"));
  }

  private read<T>(name: string): T | null {
    const value = window.localStorage.getItem(this.key(name));
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      window.localStorage.removeItem(this.key(name));
      return null;
    }
  }
}
