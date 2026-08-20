# Tempough Time Tracking

An Azure DevOps work-item extension for creating enriched Tempough time entries.

The extension adds a time-entry form to Azure DevOps work items. It uses the work-item ID, title, and URL to enrich entries sent to Tempough.

## Developers

Use Node 24 and npm. Run `make setup` once, then use the Makefile as the project entry point. `make dev` opens the standalone UI with a mocked work item and mocked Tempough API. Open `/?api=real` to proxy requests to a real Tempough API configured in `.env.local`. `make dev-azdo` serves the extension over HTTPS for use inside Azure DevOps. Run `make help` for the remaining build and verification commands.

The normal development loop starts with `make dev`. UI, validation, storage, and error handling can be changed and tested without Azure DevOps or a Tempough backend. Open `http://localhost:5173/?api=real` when the browser workflow must be checked against a real Tempough API. The bearer token is entered in the UI and is not read from the environment file.

Azure DevOps integration testing is a separate loop. Build `make package-dev`, privately install that development VSIX once, then run `make dev-azdo`. The installed manifest loads current source from the local HTTPS server, so ordinary source changes need only a browser refresh. Manifest changes require rebuilding and updating the development VSIX. This mode calls Tempough directly, so the API must allow the extension origin through CORS.

## Engineering principles

- Keep the extension small and straightforward.
- Prefer browser and Azure DevOps platform features over new dependencies.
- Add abstractions only when they solve a current need.
- Keep daily development independent of Azure DevOps.
- Treat Azure DevOps deployment as integration verification, not the development loop.

## AI-assisted development

AI tools have been used to develop this project and may assist with maintenance. AI-generated changes require human review and must pass `make verify`.

Keep changes small and aligned with the ADRs. Never share credentials or unsanitized production data with an LLM. Verify API assumptions before implementation.
