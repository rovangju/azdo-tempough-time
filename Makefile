.DEFAULT_GOAL := help

.PHONY: help setup doctor dev dev-azdo test lint verify build package package-dev clean

help:
	@printf '%s\n' \
	  'Tempough Azure DevOps extension' \
	  '' \
	  '  make setup        Install locked npm dependencies' \
	  '  make doctor       Check the local toolchain' \
	  '  make dev          Start the HTTP mock development host' \
	  '  make dev-azdo     Start the HTTPS Azure DevOps development host' \
	  '  make test         Run tests once' \
	  '  make lint         Run ESLint and TypeScript checks' \
	  '  make verify       Run lint, tests, and build' \
	  '  make build        Build static extension assets' \
	  '  make package      Create the private release VSIX' \
	  '  make package-dev  Create the localhost-backed development VSIX' \
	  '  make clean        Remove generated output' \
	  '' \
	  'Local UI: http://localhost:5173/' \
	  'Real API:  Set VITE_TEMPOUGH_API_ROOT in .env.local, run make dev, then open /?api=real'

setup:
	npm ci

doctor:
	@node -e 'const major=Number(process.versions.node.split(".")[0]); if (major !== 24) { console.error(`Node 24 required; found $${process.versions.node}`); process.exit(1); } console.log(`Node $${process.versions.node}`)'
	@npm --version
	@node -e 'require("fs").accessSync("node_modules/.bin/vite")' || (printf '%s\n' 'Dependencies missing. Run make setup.' && exit 1)

dev:
	npm run dev -- --open '/'

dev-azdo:
	AZDO_HTTPS=1 npm run dev

test:
	npm test

lint:
	npm run lint
	npm run typecheck

verify: lint test build

build:
	npm run build

package: verify
	@mkdir -p artifacts
	npx tfx-cli extension create --manifest-globs vss-extension.json --overrides-file configs/release.json --output-path artifacts/tempough-time.vsix

package-dev: verify
	@mkdir -p artifacts
	npx tfx-cli extension create --manifest-globs vss-extension.json --overrides-file configs/dev.json --output-path artifacts/tempough-time-dev.vsix

clean:
	rm -rf dist coverage artifacts
