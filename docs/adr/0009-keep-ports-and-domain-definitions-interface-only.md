# 9. Keep ports and domain definitions interface-only

Date: 2026-08-21

## Status

Accepted

## Context

Ports define boundaries between application behavior and external adapters. Domain definitions describe the data exchanged across those
boundaries. Adding runtime behavior to either location would blur these responsibilities and could bypass normal test coverage.

## Decision

Keep `src/ports` and `src/domain.ts` interface-only. They may contain type-only imports and exported interfaces. Place executable behavior
in application code or adapters.

Enforce this boundary through linting.

## Consequences

Ports and domain definitions can be excluded from runtime coverage without hiding executable code. Adding runtime behavior to these
locations fails verification and requires an explicit architecture change.
