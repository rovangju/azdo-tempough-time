#!/usr/bin/env bash

set -euo pipefail

tag=${1:?usage: scripts/publish-release.sh vX.Y.Z[-dev.N|-beta.N|-rc.N]}
gh_bin=${GH_BIN:-gh}

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

case "$tag" in
  *-dev.*|*-beta.*|*-rc.*)
    # Mark non-final tag channels as prereleases in GitHub.
    "$gh_bin" release create "$tag" "${assets[0]}" --generate-notes --prerelease
    ;;
  *)
    # Stable tags create normal releases so users can find their VSIX easily.
    "$gh_bin" release create "$tag" "${assets[0]}" --generate-notes
    ;;
esac
