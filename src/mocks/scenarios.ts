export type MockScenario = "success" | "auth" | "validation" | "server" | "network";

// Owns the active mock scenario and its public API, letting the development UI dropdown
// switch MSW responses at runtime without depending on the HTTP handler implementation,
// allowing scenarios such as successful requests, validation failures, and server errors.
let scenario: MockScenario = "success";

export function getMockScenario(): MockScenario {
  return scenario;
}

export function setMockScenario(next: MockScenario): void {
  scenario = next;
}
