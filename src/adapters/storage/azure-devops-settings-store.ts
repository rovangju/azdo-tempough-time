import type { IExtensionDataManager } from "azure-devops-extension-api/Common/CommonServices";
import type { Connection, LastSelection } from "../../domain";
import type { SettingsStore } from "../../ports/settings-store";

const options = { scopeType: "User" };

export class AzureDevOpsSettingsStore implements SettingsStore {
  constructor(private readonly manager: IExtensionDataManager) {}

  async getConnection(): Promise<Connection | null> {
    return (await this.manager.getValue<Connection | null>("connection", {
      ...options,
      defaultValue: null,
    })) ?? null;
  }

  async setConnection(connection: Connection): Promise<void> {
    await this.manager.setValue("connection", connection, options);
  }

  async getLastSelection(): Promise<LastSelection | null> {
    return (await this.manager.getValue<LastSelection | null>("last-selection", {
      ...options,
      defaultValue: null,
    })) ?? null;
  }

  async setLastSelection(selection: LastSelection): Promise<void> {
    await this.manager.setValue("last-selection", selection, options);
  }

  async clearConnection(): Promise<void> {
    await this.manager.setValue("connection", null, options);
  }

  async clearAll(): Promise<void> {
    await Promise.all([
      this.manager.setValue("connection", null, options),
      this.manager.setValue("last-selection", null, options),
    ]);
  }
}
