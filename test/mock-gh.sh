#!/usr/bin/env bash

printf '%s\n' "$@" > "$GH_LOG"

if [[ "$1 $2" == 'release view' && "${GH_RELEASE_EXISTS:-false}" != true ]]; then
  exit 1
fi
