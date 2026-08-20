export type MockScenario = "success" | "auth" | "validation" | "server" | "network";

let scenario: MockScenario = "success";

export function getMockScenario(): MockScenario {
  return scenario;
}

export function setMockScenario(next: MockScenario): void {
  scenario = next;
}
