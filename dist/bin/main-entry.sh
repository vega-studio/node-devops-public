#!/bin/bash

SCRIPT_PATH=$(dirname "$(readlink -f "$0")")
PATH_TSCONFIG="${SCRIPT_PATH}/../tsconfig.json"
PATH_MAIN="${SCRIPT_PATH}/main.ts"

# See if PATH_MAIN exists, if not change it over to .js extension
if [ ! -f "$PATH_MAIN" ]; then
  PATH_MAIN="${SCRIPT_PATH}/main.js"
fi

if [ -z "$NODE_OPTIONS" ]; then
  export NODE_OPTIONS="--max_old_space_size=8192"
fi

bun run "${PATH_MAIN}" "$@"
