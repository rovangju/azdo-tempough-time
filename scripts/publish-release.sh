#!/usr/bin/env bash

set -euo pipefail

tag=${TAG:?TAG is required}
artifact_path=${ARTIFACT_PATH:?ARTIFACT_PATH is required}
prerelease=${PRERELEASE:?PRERELEASE is required}
gh_bin=${GH_BIN:-gh}

if [[ ! -f $artifact_path ]]; then
  printf 'VSIX artifact does not exist: %s\n' "$artifact_path" >&2
  exit 1
fi

if [[ $prerelease != true && $prerelease != false ]]; then
  printf 'PRERELEASE must be true or false\n' >&2
  exit 1
fi

if "$gh_bin" release view "$tag" >/dev/null 2>&1; then
  # Workflow reruns replace the asset without creating a second release.
  "$gh_bin" release upload "$tag" "$artifact_path" --clobber
  exit 0
fi

if [[ $prerelease == true ]]; then
  # The version classifier marks development, beta, and RC releases as prereleases.
  "$gh_bin" release create "$tag" "$artifact_path" --generate-notes --prerelease
else
  # The version classifier reserves final releases for normal GitHub Releases.
  "$gh_bin" release create "$tag" "$artifact_path" --generate-notes
fi
