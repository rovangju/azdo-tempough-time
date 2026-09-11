#!/usr/bin/env bash

set -euo pipefail

project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT

mkdir -p "$test_root/artifacts"
touch "$test_root/artifacts/tempough-time.vsix"

run_test() {
  local tag=$1
  local release_exists=$2
  local expected=$3
  local log_file="$test_root/${tag//[^[:alnum:]]/_}.log"

  (
    cd "$test_root"
    GH_BIN="$project_root/test/mock-gh.sh" GH_LOG="$log_file" GH_RELEASE_EXISTS="$release_exists" \
      "$project_root/scripts/publish-release.sh" "$tag"
  )

  actual=$(tr '\n' ' ' < "$log_file")
  [[ "$actual" == "$expected" ]]
}

run_test 'v0.1.5.9999' false 'release create v0.1.5.9999 artifacts/tempough-time.vsix --generate-notes '
run_test 'v0.1.5.8001' false 'release create v0.1.5.8001 artifacts/tempough-time.vsix --generate-notes --prerelease '
run_test 'v0.1.5.8001' true 'release upload v0.1.5.8001 artifacts/tempough-time.vsix --clobber '
