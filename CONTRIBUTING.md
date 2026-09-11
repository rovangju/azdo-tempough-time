# Contributing

See the [README](README.md) for setup, development, and verification instructions.

Before opening a pull request:

- Keep changes focused and consistent with the project's principals and [architecture decisions](docs/adr).
- Add or update tests when behavior changes.
- Update documentation when requirements or workflows change.
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.
- Use version tags and deployment versions as established by the [versioning architecture decision](docs/adr/0010-use-tagged-release-identifiers-and-numeric-deployment-versions.md).
- Package only with `make package VERSION=vX.Y.Z[-dev.N|-beta.N|-rc.N]`; every generated VSIX has a derived four-component Azure DevOps
  version.
- Run `make verify` and make sure it succeed.
- Never include credentials, tokens, or unsanitized production data.
