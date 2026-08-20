# 4. Use two local development modes

Date: 2026-08-20

## Status

Accepted

## Context

Most work needs a simple browser loop. Azure DevOps iframe testing requires HTTPS and a private development extension.

## Decision

Use HTTP with a mock host for normal development. Proxy real API calls through Vite to avoid localhost CORS. Use a separate HTTPS command for Azure DevOps integration testing.

## Consequences

Source changes do not require extension updates. Manifest changes require repackaging the development VSIX.
