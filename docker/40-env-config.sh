#!/bin/sh
set -e

FILE="/usr/share/nginx/html/env-config.js"

{
  printf 'window.__ENV__ = {\n'
  env | grep '^VITE_' | sort | while IFS='=' read -r key value; do
    escaped=$(printf '%s' "$value" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')
    printf '  "%s": "%s",\n' "$key" "$escaped"
  done
  printf '};\n'
} > "$FILE"

echo "env-config.js written"