import { afterEach, describe, expect, it, vi } from "vitest";
import { FetchTempoughClient, normalizeApiRoot, TempoughApiError } from "../src/api";

afterEach(() => vi.restoreAllMocks());

describe("Tempough API", () => {
  it("requires an API v1 root", () => {
    expect(normalizeApiRoot("https://example.test/api/v1/")).toBe("https://example.test/api/v1");
    expect(() => normalizeApiRoot("https://example.test")).toThrow("must end with /api/v1");
  });

  it("filters inactive projects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { id: 1, name: "Active", code: "A", status: "active" },
      { id: 2, name: "Old", code: "O", status: "archived" },
    ]), { status: 200 })));
    const client = new FetchTempoughClient();
    await expect(client.listProjects({ apiRoot: "https://example.test/api/v1", token: "token" }))
      .resolves.toEqual([{ id: 1, name: "Active", code: "A", status: "active" }]);
  });

  it("uses a same-origin transport root without changing connection validation", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const client = new FetchTempoughClient("http://localhost:5173/__tempough");
    await client.listProjects({ apiRoot: "https://api.example.test/api/v1", token: "token" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5173/__tempough/projects/",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
  });

  it("preserves an API error response body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"detail":"No access"}', {
      status: 403,
      statusText: "Forbidden",
    })));
    const client = new FetchTempoughClient();
    await expect(client.listProjects({ apiRoot: "https://example.test/api/v1", token: "token" }))
      .rejects.toEqual(expect.objectContaining<Partial<TempoughApiError>>({
        status: 403,
        responseBody: '{"detail":"No access"}',
      }));
  });
});
