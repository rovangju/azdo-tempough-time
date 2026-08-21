# 2. Use React, TypeScript, and Vite

Date: 2026-08-20

## Status

Accepted

## Context

The extension needs a lightweight UI, fast local iteration, static production assets, and focused tests.

## Decision

Use React, TypeScript, Vite, npm, Vitest, MSW, and plain CSS.

## Consequences

Vite is build tooling only. Application code must not depend on Vite-specific APIs without a concrete need.
