import type { Connection, LastSelection } from "../domain";

export interface SettingsStore {
  getConnection(): Promise<Connection | null>;
  setConnection(connection: Connection): Promise<void>;
  getLastSelection(): Promise<LastSelection | null>;
  setLastSelection(selection: LastSelection): Promise<void>;
  clearConnection(): Promise<void>;
  clearAll(): Promise<void>;
}
