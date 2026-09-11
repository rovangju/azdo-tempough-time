#!/usr/bin/env bash

set -euo pipefail

tag=${1:?usage: scripts/publish-release.sh vX.Y.Z.REVISION}
gh_bin=${GH_BIN:-gh}

if [[ ! $tag =~ ^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.([1-9][0-9]*)$ ]]; then
  printf 'tag must be vMAJOR.MINOR.PATCH.REVISION\n' >&2
  exit 1
fi

revision=${BASH_REMATCH[4]}

if (( revision > 9999 )); then
  printf 'revision must be between 1 and 9999\n' >&2
  exit 1
fi

shopt -s nullglob
assets=(artifacts/*.vsix)

if (( ${#assets[@]} != 1 )); then
  printf 'expected exactly one VSIX artifact, found %d\n' "${#assets[@]}" >&2
  exit 1
fi

if "$gh_bin" release view "$tag" >/dev/null 2>&1; then
  # Workflow reruns replace the asset without creating a second release.
  "$gh_bin" release upload "$tag" "${assets[0]}" --clobber
  exit 0
fi

if (( revision < 9999 )); then
  # Mark development, beta, and release-candidate bands as GitHub prereleases.
  "$gh_bin" release create "$tag" "${assets[0]}" --generate-notes --prerelease
else
  # The final-release band creates a normal release for users to download.
  "$gh_bin" release create "$tag" "${assets[0]}" --generate-notes
fi
