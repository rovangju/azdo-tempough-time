# Tempough Time Tracking

An Azure DevOps work-item extension for creating enriched [Tempough](https://tempough.com/) time entries directly from task.

The extension adds a time-entry form to Azure DevOps work items. It uses the work-item ID, title, and URL to enrich entries sent to
Tempough.

![Time tracking input form](docs/preview.png)

## Developers

### Local Development

Run `make setup`, then use the Makefile as the project entry point. `make dev` opens the standalone UI with a mocked work item and mocked
Tempough API. Open `/?api=real` to proxy requests to a real Tempough API configured in `.env.local`.

`make dev-azdo` serves the extension over HTTPS for use inside Azure DevOps.

The normal development loop starts with `make dev`. UI, validation, storage, and error handling can be changed and tested without Azure
DevOps or a Tempough backend.

Open `http://localhost:5173/?api=real` when the browser workflow must be checked against a real Tempough API. The bearer token is entered in
the UI and is not read from an environment file. The connection `Test` will always succeed when requests use the CORS proxy, so it does not
verify that the configured API root is directly accessible from the browser.

### Azure DevOps

Build `make package-dev`, privately install that development VSIX once, then run `make dev-azdo`. Configure the real API root in
`.env.local` first.

The installed manifest loads current source from the local HTTPS server, so ordinary source changes need only a browser refresh. Manifest
changes require rebuilding and updating the development VSIX. API requests in this mode use the local Vite proxy to avoid browser CORS.
The connection `Test` therefore always succeeds in this mode and does not verify direct browser access to the configured API root.

## Engineering principles

- Keep everything minimal and thoughtful.
- A good local development experience is paramount for easy maintenance and quality.
  - Therefore, we depend on surface areas of Tempough API and Azure Devops as minimal as possible unless intentionally testing.
- Add abstractions only when they solve a current need.
- Treat Azure DevOps deployment as integration verification, not the development loop.

## AI-assisted development

AI tools have been used to develop this project and may assist with maintenance. AI-generated changes require human review and must pass
`make verify` and human "gut checks".

Keep changes small and aligned with the ADRs and principles. Never share credentials or unsanitized production data with an LLM. Verify API
assumptions before implementation.
