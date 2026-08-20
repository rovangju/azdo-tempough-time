# Contributing

The Makefile is the entry point for setup, local development, verification, and packaging.

Daily development uses the standalone HTTP mock host. Azure DevOps integration uses the same application through a thin host adapter and an
HTTPS development server. The development VSIX must be privately installed once before using that integration loop. Run the verification
workflow before packaging.

Real API development uses `/?api=real` and the Vite proxy to avoid localhost CORS. Copy `.env.example` to ignored `.env.local` and set the
API root. Do not place tokens in environment files.

Publishing is intentionally deferred. Packaging produces VSIX artifacts for later upload or automation.
