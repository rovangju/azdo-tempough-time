.DEFAULT_GOAL := help

.PHONY: help setup dev dev-azdo test coverage lint verify build package require-version clean

help:
	@printf '%s\n\n' 'Tempough Azure DevOps extension'
	@awk 'BEGIN { FS = ":.*## " } /^[[:alnum:]_-]+:.*## / { printf "  make %-12s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf '\n%s\n%s\n' \
	  'Local UI: http://localhost:5173/' \
	  'Real API:  Set VITE_TEMPOUGH_API_ROOT in .env.local, run make dev, then open /?api=real'

setup: ## Install locked npm dependencies
	npm ci

dev: ## Start the HTTP mock development host
	npm run dev -- --open '/'

dev-azdo: ## Start the HTTPS Azure DevOps development host
	AZDO_HTTPS=1 npm run dev

test: ## Run tests once
	npm test

coverage: ## Run tests and generate a coverage report
	npm test -- --coverage

lint: ## Run ESLint and TypeScript checks
	npm run lint
	npm run typecheck

verify: lint coverage build ## Run lint, coverage-gated tests, and build

build: ## Build static extension assets
	npm run build

package: require-version verify ## Create a tagged development or release VSIX (VERSION=vX.Y.Z[-dev.N|-beta.N|-rc.N])
	node scripts/package.mjs "$(VERSION)"

require-version:
	@test -n "$(VERSION)" || (printf '%s\n' 'VERSION is required, for example: make package VERSION=v0.1.5-rc.1' >&2; exit 1)

clean: ## Remove generated output
	rm -rf dist coverage artifacts
