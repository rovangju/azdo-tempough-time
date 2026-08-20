.DEFAULT_GOAL := help

.PHONY: help setup doctor dev dev-azdo test lint verify build package package-dev clean

help:
	@printf '%s\n\n' 'Tempough Azure DevOps extension'
	@awk 'BEGIN { FS = ":.*## " } /^[[:alnum:]_-]+:.*## / { printf "  make %-12s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf '\n%s\n%s\n' \
	  'Local UI: http://localhost:5173/' \
	  'Real API:  Set VITE_TEMPOUGH_API_ROOT in .env.local, run make dev, then open /?api=real'

setup: ## Install locked npm dependencies
	npm ci

doctor: ## Check the local toolchain
	@node -e 'const major=Number(process.versions.node.split(".")[0]); if (major !== 24) { console.error(`Node 24 required; found $${process.versions.node}`); process.exit(1); } console.log(`Node $${process.versions.node}`)'
	@npm --version
	@node -e 'require("fs").accessSync("node_modules/.bin/vite")' || (printf '%s\n' 'Dependencies missing. Run make setup.' && exit 1)

dev: ## Start the HTTP mock development host
	npm run dev -- --open '/'

dev-azdo: ## Start the HTTPS Azure DevOps development host
	AZDO_HTTPS=1 npm run dev

test: ## Run tests once
	npm test

lint: ## Run ESLint and TypeScript checks
	npm run lint
	npm run typecheck

verify: lint test build ## Run lint, tests, and build

build: ## Build static extension assets
	npm run build

package: verify ## Create the private release VSIX
	@mkdir -p artifacts
	npx tfx-cli extension create --manifest-globs vss-extension.json --overrides-file configs/release.json --output-path artifacts/tempough-time.vsix

package-dev: verify ## Create the localhost-backed development VSIX
	@mkdir -p artifacts
	npx tfx-cli extension create --manifest-globs vss-extension.json --overrides-file configs/dev.json --output-path artifacts/tempough-time-dev.vsix

clean: ## Remove generated output
	rm -rf dist coverage artifacts
