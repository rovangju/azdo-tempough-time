# Contributing

The Makefile is the entry point for setup, local development, verification, and packaging.

Daily development uses the standalone HTTP mock host. Azure DevOps integration uses the same application through a thin host adapter and an
HTTPS development server. The development VSIX must be privately installed once before using that integration loop. Run the verification
workflow before packaging.

Real API development uses the Vite proxy to avoid browser CORS. Copy `.env.example` to ignored `.env.local` and set the API root, then use
either `/?api=real` in the standalone host or `make dev-azdo`. Do not place tokens in environment files. The connection `Test` will always
succeed through this proxy and does not verify direct browser access to the configured API root.

Publishing is intentionally deferred. Packaging produces VSIX artifacts for later upload or automation.
