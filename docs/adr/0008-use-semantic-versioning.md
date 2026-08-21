# 8. Use Semantic Versioning

Date: 2026-08-20

## Status

Accepted

## Context

Consistent version numbers help contributors and users understand the scope of a release.

## Decision

Use [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) for extension releases. The version in `vss-extension.json` is the
authoritative extension version.

## Consequences

Release changes are expected to include an appropriate SemVer version update. Released versions are not reused or modified.
