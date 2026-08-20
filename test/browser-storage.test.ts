import { describe, expect, it } from "vitest";
import { BrowserSettingsStore } from "../src/adapters/storage/browser-settings-store";

describe("BrowserSettingsStore", () => {
  it("isolates settings by namespace", async () => {
    const first = new BrowserSettingsStore("tempough:v1:one:user");
    const second = new BrowserSettingsStore("tempough:v1:two:user");
    await first.setConnection({ apiRoot: "https://one.test/api/v1", token: "one" });
    await second.setConnection({ apiRoot: "https://two.test/api/v1", token: "two" });
    expect(await first.getConnection()).toEqual({ apiRoot: "https://one.test/api/v1", token: "one" });
    expect(await second.getConnection()).toEqual({ apiRoot: "https://two.test/api/v1", token: "two" });
  });

  it("clears connection without clearing the last selection", async () => {
    const store = new BrowserSettingsStore();
    await store.setConnection({ apiRoot: "https://example.test/api/v1", token: "token" });
    await store.setLastSelection({ projectId: 1, taskId: 2 });
    await store.clearConnection();
    expect(await store.getConnection()).toBeNull();
    expect(await store.getLastSelection()).toEqual({ projectId: 1, taskId: 2 });
  });
});
