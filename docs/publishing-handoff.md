# Publishing handoff

The release identity is `ITNobody.tempough-time`. The initial release is a free, private, cloud-only extension. The development identity remains separate as `ITNobody.tempough-time-dev`.

## Before private upload

- Create or verify the `ITNobody` publisher in the Visual Studio Marketplace publishing portal.
- Complete the publisher profile and accept the Marketplace Publisher Agreement.
- Confirm ITNobody has permission to distribute every packaged image and dependency.
- Run `make package` and upload `artifacts/tempough-time.vsix` as a new Azure DevOps extension.
- Keep the extension private and share it only with selected Azure DevOps organizations.
- Install and test the release VSIX in a shared organization before any public submission.

## Before public release

- Create the durable public repository.
- Add manifest `repository`, `links.support`, and `links.privacypolicy` URLs after the repository URL is known.
- Configure Marketplace Q&A to use the repository's GitHub Issues page.
- Create and publish a monitored support and privacy contact address, then add it to `PRIVACY.md`.
- Replace the temporary support wording in `OVERVIEW.md`.
- Review the Marketplace overview, privacy policy, icon, screenshot, and trademark disclaimer.
- Decide whether the first public release should carry the `Preview` gallery flag.
- Set `public` to `true` only after the public-release items are complete.

## Release rules

- Increment `version` in `vss-extension.json` for every Marketplace update.
- Keep development and release extension IDs separate.
- Never commit Marketplace tokens, Tempough API tokens, or organization-specific secrets.
- Supply publishing credentials through environment variables and fail without prompting when publishing automation is added.
