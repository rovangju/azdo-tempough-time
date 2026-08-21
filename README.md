# Tempough Time Tracking

An Azure DevOps extension for creating enriched [Tempough](https://tempough.com/) time entries from a work item.

See the [Marketplace overview](OVERVIEW.md) for product details.

## Development

The project requires Node.js, npm, and Make.

Run `make setup` to install dependencies. Use the Makefile as the entry point for development, verification, and packaging.

### Standalone development

Run `make dev` for the normal development loop. This opens a standalone UI with a mocked Azure DevOps work item and Tempough API.

The mock environment supports success, authentication failure, validation failure, server failure, and network failure scenarios. UI,
validation, storage, and error handling can therefore be developed without Azure DevOps or a Tempough backend.

### Real API development

Copy `.env.example` to the ignored `.env.local` file and set `VITE_TEMPOUGH_API_ROOT`:

```sh
cp .env.example .env.local
```

Run `make dev`, then open `http://localhost:5173/?api=real`.

Enter the API token in the UI. Do not put tokens in environment files.

Real API requests are routed through the Vite proxy to avoid browser CORS restrictions. The connection test validates the proxy target and
token, but it does not verify that the Tempough API accepts requests directly from a browser.

### Azure DevOps integration and deployment

Most development does not require an Azure DevOps organization or a Marketplace upload. See [Azure DevOps integration and
deployment](docs/azure-devops-integration-and-deployment.md) when testing the extension inside a work item or building and deploying a
release.

### Verification

Run `make verify` before submitting changes. It runs linting, type checking, tests, and a production build.

## Engineering principles

- Keep changes minimal and intentional.
- Favor a fast local development loop with few external dependencies.
- Add abstractions only when they solve a current need.
- Treat Azure DevOps deployment as integration verification, not the normal development loop.

Architecture decisions are documented in [`docs/adr`](docs/adr/).

## AI-assisted development

AI tools may assist with project development and maintenance. AI-generated changes require human review, must pass `make verify`, and
should receive appropriate manual testing.

Keep changes small and consistent with the project's architecture decisions and engineering principles. Never share credentials or
unsanitized production data with an LLM. Verify API assumptions before implementation.
