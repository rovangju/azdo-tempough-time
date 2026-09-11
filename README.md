# Tempough Time Tracking

An Azure DevOps extension for creating enriched [Tempough](https://tempough.com/) time entries from a work item.

> See the [Azure DevOps Marketplace Overview](OVERVIEW.md) for more details.

![GitHub License](https://img.shields.io/github/license/rovangju/azdo-tempough-time)

---

## Development

The project requires Node.js, npm, and Make.

Run `make setup` to install dependencies. Use the Makefile as the entry point for development, verification, and packaging, etc.

### Standalone Development

Run `make dev` for the normal development loop. This opens a standalone UI with a mocked Azure DevOps work item and Tempough API.

The mock environment several API scenarios (e.g.: success, authentication failure, validation failure, network failure, etc. UI, validation,
storage, and error handling can therefore be developed without Azure DevOps or the Tempough API.

### Live API Development

API requests are routed through the Vite proxy to avoid browser CORS restrictions. You need to configure the endpoint the proxy will route
to.

Copy `.env.example` to the ignored `.env.local` file and set `VITE_TEMPOUGH_API_ROOT`, or run:

```sh
echo 'VITE_TEMPOUGH_API_ROOT=https://foo.bar/api/v1' > .env.local
```

Run `make dev`, and go to `/?api=real`.

> [!NOTE]
> The connection test validates the proxy target and token, but it does not verify that the Tempough API accepts requests directly from a
browser.

### Azure DevOps Integration and Deployment

Most development does not require an Azure DevOps organization or a Marketplace upload.
See [Azure DevOps integration and deployment](docs/azure-devops-integration-and-deployment.md) for testing within Azure DevOps or building
and deploying a release.

### Verification

Run `make verify` before submitting changes. It runs linting, type checking, tests, and ensures proper build. To create a VSIX, run
`make package VERSION=vX.Y.Z[-dev.N|-beta.N|-rc.N]`.

---

## Engineering Principles

- Keep changes minimal and intentional.
- Favor a fast local development loop with few external dependencies.
- Add abstractions only when they solve a current need.
- Treat Azure DevOps deployment as integration verification, not the normal development loop.

> [!NOTE]
> Architecture decisions are documented in [`docs/adr`](docs/adr/).

---

## AI-assisted Development

AI tools may assist with project development and maintenance. AI-generated changes require human review, must pass `make verify`, and should
receive appropriate manual testing.

Keep changes small and consistent with the project's architecture decisions and engineering principles. Never share credentials or
unsanitized production data with an LLM. Verify API assumptions before implementation.
