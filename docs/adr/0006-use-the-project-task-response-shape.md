# 6. Use the project-task response shape

Date: 2026-08-20

## Status

Accepted

## Context

The OpenAPI document incorrectly describes `GET /projects/{id}/tasks/` as returning a project. A real response was supplied.

## Decision

Model the endpoint from the sanitized captured response. Submit `taskId`, ignore `phaseId`, and use `taskBillableDefault` for `billable`.

## Consequences

The assignment `id` must not be confused with `taskId`. Recheck this model if the API contract is corrected.
