# 10. Use numeric versioned artifacts

Date: 2026-09-10

## Status

Accepted

Supersedes [ADR 0008](0008-use-semantic-versioning.md)

## Context

The Azure DevOps extension manifest supports numeric three- and four-component versions. Azure DevOps extension versions must increase
for every update and a published version cannot be modified or reused.

The project needs a repeatable package process that cannot produce an unversioned artifact and can distinguish development from release
artifacts without translating a separate versioning scheme.

## Decision

Git tags are the authoritative release identifiers and use the Azure DevOps four-component numeric version format:

- `vX.Y.Z.R`

Every package uses the tag version directly after removing its leading `v`. The final `R` component identifies its channel:

| Tag | Extension identity | Deployment version |
| --- | --- | --- |
| `vX.Y.Z.1` through `vX.Y.Z.999` | `ITNobody.tempough-time-dev` | `X.Y.Z.1` through `X.Y.Z.999` (development) |
| `vX.Y.Z.1000` through `vX.Y.Z.4999` | `ITNobody.tempough-time` | `X.Y.Z.1000` through `X.Y.Z.4999` (beta) |
| `vX.Y.Z.5000` through `vX.Y.Z.9998` | `ITNobody.tempough-time` | `X.Y.Z.5000` through `X.Y.Z.9998` (release candidate) |
| `vX.Y.Z.9999` | `ITNobody.tempough-time` | `X.Y.Z.9999` (final) |

The committed `vss-extension.json` has the required `0.0.0.1` placeholder version. It is not a release version. The supported package
command requires a tag and overrides the placeholder with the tag's deployment version.

`dev` packages use the development extension identity. `beta`, `rc`, and final packages use the release extension identity so prerelease
testing exercises the package that will be deployed.

## Consequences

Every artifact has a four-component numeric Azure DevOps version. The package command is the only supported way to create an artifact;
direct TFX packaging without its tag-derived override is unsupported.

The numeric bands preserve ordering for the release extension identity:

```text
X.Y.Z.1001 < X.Y.Z.5001 < X.Y.Z.9999 < X.Y.(Z + 1).1001
```

Create the final tag only after beta and release-candidate iteration for that release core is complete. Once `X.Y.Z.9999` is published,
no further `X.Y.Z.R` release deployment version can be published to that extension identity.

Marketplace publishing remains a separate concern. This decision governs artifact construction and versioning only.
