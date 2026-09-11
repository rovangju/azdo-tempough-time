# 10. Use tagged release identifiers and numeric deployment versions

Date: 2026-09-10

## Status

Accepted

Supersedes [ADR 0008](0008-use-semantic-versioning.md)

## Context

The Azure DevOps extension manifest supports numeric three- and four-component versions. It does not document support for Semantic
Versioning prerelease identifiers such as `-beta.1` and `-rc.1`. Azure DevOps extension versions must increase for every update and a
published version cannot be modified or reused.

The project needs recognizable prerelease tags, deployable Azure DevOps versions, and a repeatable package process that cannot produce an
unversioned artifact.

## Decision

Git tags are the authoritative release identifiers. They use Semantic Versioning release cores and one of these forms:

- `vX.Y.Z-dev.N`
- `vX.Y.Z-beta.N`
- `vX.Y.Z-rc.N`
- `vX.Y.Z`

Every package derives an Azure DevOps deployment version in the form `X.Y.Z.REVISION`:

| Tag | Extension identity | Deployment version |
| --- | --- | --- |
| `vX.Y.Z-dev.N` | `ITNobody.tempough-time-dev` | `X.Y.Z.N`, where `N` is 1 through 999 |
| `vX.Y.Z-beta.N` | `ITNobody.tempough-time` | `X.Y.Z.(1000 + N)`, where `N` is 1 through 3999 |
| `vX.Y.Z-rc.N` | `ITNobody.tempough-time` | `X.Y.Z.(5000 + N)`, where `N` is 1 through 4998 |
| `vX.Y.Z` | `ITNobody.tempough-time` | `X.Y.Z.9999` |

The committed `vss-extension.json` has the required `0.0.0.1` placeholder version. It is not a release version. The supported package
command requires a tag and overrides the placeholder with the derived deployment version.

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
no further `X.Y.Z` prerelease or final deployment version can be published to that extension identity.

Marketplace publishing remains a separate concern. This decision governs artifact construction and versioning only.
