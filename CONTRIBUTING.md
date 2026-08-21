# Contributing

See the [README](README.md) for setup, development, and verification instructions.

Before opening a pull request:

- Keep changes focused and consistent with the project's principals and [architecture decisions](docs/adr).
- Add or update tests when behavior changes.
- Update documentation when requirements or workflows change.
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.
- Follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for release versions, as established by the [architecture
  decision](docs/adr/0008-use-semantic-versioning.md).
- Run `make verify` and make sure it succeed.
- Never include credentials, tokens, or unsanitized production data.
