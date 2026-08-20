# 3. Separate host and storage adapters

Date: 2026-08-20

## Status

Accepted

## Context

Daily development should not require Azure DevOps, but deployed behavior needs its SDK and extension data service.

## Decision

Keep Azure DevOps behind work-item host and settings-store interfaces. Use mock host data and browser storage in standalone mode. Use the SDK and user-scoped extension data in Azure DevOps.

## Consequences

The form and Tempough client are shared. Development and release extension IDs have separate server-backed settings.
