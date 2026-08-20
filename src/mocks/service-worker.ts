import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Intercepts browser API requests using the mock responses defined by the handlers.
// Import `worker` in the app bootstrap and call `await worker.start()` to enable mocking.
export const worker = setupWorker(...handlers);
