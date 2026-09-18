#!/usr/bin/env bash

set -euo pipefail

tag=${TAG:?TAG is required}
artifact_path=${ARTIFACT_PATH:?ARTIFACT_PATH is required}
prerelease=${PRERELEASE:?PRERELEASE is required}
target_commit=${TARGET_COMMIT:?TARGET_COMMIT is required}
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
  # Create a draft so maintainers can review generated notes before publishing.
  "$gh_bin" release create "$tag" "$artifact_path" --draft --generate-notes --prerelease --target "$target_commit"
else
  # Final releases are also drafted to prevent automatic publication.
  "$gh_bin" release create "$tag" "$artifact_path" --draft --generate-notes --target "$target_commit"
fi
