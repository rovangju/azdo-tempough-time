# 5. Use manifest overrides

Date: 2026-08-20

## Status

Accepted

## Context

Development and release packages need different IDs and asset origins without duplicate manifests.

## Decision

Use one base manifest with TFX development and release override files.

## Consequences

Only the development package has a localhost `baseUri`. Release assets are bundled in the VSIX.
