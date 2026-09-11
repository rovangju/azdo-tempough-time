# Azure DevOps integration and deployment

Use this workflow to test the extension inside an Azure DevOps work item or deploy a packaged release. Normal application development uses
the standalone environment described in the [README](../README.md).

The development and release extensions have separate identities:

- Development: `ITNobody.tempough-time-dev`
- Release: `ITNobody.tempough-time`

## Azure DevOps integration testing

The development VSIX loads the extension from the local HTTPS development server. (A VSIX is the package uploaded to the Visual Studio
Marketplace to distribute an Azure DevOps extension; see Microsoft's [package and publish extensions
guide](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops).)

### First-time setup

1. Create or verify the `ITNobody` publisher in the [Visual Studio Marketplace publishing
   portal](https://marketplace.visualstudio.com/manage/createpublisher?managePageRedirect=true).
2. Copy `.env.example` to `.env.local` and set `VITE_TEMPOUGH_API_ROOT` to the real API root.
3. Run `make package VERSION=v0.1.5-dev.1` to create `artifacts/tempough-time-dev.vsix`.
4. Upload the VSIX as a private Azure DevOps extension in the Marketplace.
5. Share it with the test Azure DevOps organization and install it in that organization.
6. Run `make dev-azdo`.
7. Open an Azure DevOps work item and find **Log time to Tempough**.

The development server uses a local HTTPS certificate. If the extension does not load, open
`https://localhost:5173/work-item-form.html` directly and allow the certificate. Also allow access to localhost or local network resources
if the browser requests permission.

### Development loop

The development manifest points Azure DevOps to the local server. Ordinary source changes require only a browser refresh. Manifest changes
require a new development tag, a rebuilt development VSIX, and an update in the Marketplace.

API requests use the Vite proxy during local integration testing. `VITE_TEMPOUGH_API_ROOT` determines the proxy destination. The API root
saved in extension settings is used when the packaged release runs without the development proxy.

## Build a release

Run `make package VERSION=v0.1.5` to verify the project, build the static extension assets, and create
`artifacts/tempough-time.vsix`. Unlike the development package, the release VSIX contains the built application and does not depend on the
local development server.

Use a release tag to select every packaged version. The package command derives a four-component Azure DevOps deployment version; see the
[versioning architecture decision](adr/0010-use-tagged-release-identifiers-and-numeric-deployment-versions.md).

## Package artifacts

Every supported package uses a version tag and derives the Azure DevOps deployment version from its release channel:

| Tag | Artifact | Deployment version |
| --- | --- | --- |
| `v0.1.5-dev.1` | `tempough-time-dev.vsix` | `0.1.5.1` |
| `v0.1.5-beta.1` | `tempough-time.vsix` | `0.1.5.1001` |
| `v0.1.5-rc.1` | `tempough-time.vsix` | `0.1.5.5001` |
| `v0.1.5` | `tempough-time.vsix` | `0.1.5.9999` |

Run the same command locally that GitHub Actions runs for a pushed version tag:

```sh
make package VERSION=v0.1.5-rc.1
```

The package command does not start a local server. `make dev-azdo` is required only to use the installed development extension because that
extension loads its assets from `https://localhost:5173`.

Pushing a `v*` tag runs the package workflow, creates a GitHub Release, and attaches the generated VSIX as a durable release asset. The
transient GitHub Actions artifact is retained for 7 days. The workflow does not publish to the Marketplace.

## Deploy a private release

1. Complete the publisher profile and accept the Marketplace Publisher Agreement.
2. Confirm that ITNobody has permission to distribute every packaged image and dependency.
3. Run `make package VERSION=v0.1.5`.
4. Upload `artifacts/tempough-time.vsix` through the Marketplace publisher portal.
5. Keep the extension private and share it only with selected Azure DevOps organizations.
6. Install and test the release in a shared organization.

## Prepare a public release

Before making the Marketplace listing public:

- Create the durable public repository.
- Add manifest `repository`, `links.support`, and `links.privacypolicy` URLs after the repository URL is known.
- Configure Marketplace Q&A to use the repository's GitHub Issues page.
- Publish a monitored support and privacy contact address, then add it to `PRIVACY.md`.
- Replace the temporary support wording in `OVERVIEW.md`.
- Review the Marketplace overview, privacy policy, icon, screenshot, and trademark disclaimer.
- Decide whether the first public release should carry the `Preview` gallery flag.
- Set `public` to `true` only after the public-release items are complete.

## Release safeguards

- Keep development and release extension IDs separate.
- Never commit Marketplace tokens, Tempough API tokens, or organization-specific secrets.
- Supply publishing credentials through environment variables and fail without prompting when publishing automation is added.
