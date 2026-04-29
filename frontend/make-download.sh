#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$ROOT_DIR/dist-download"
ZIP_NAME="pushandpray-frontend.zip"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
zip -r "$OUT_DIR/$ZIP_NAME" \
  . \
  -x "node_modules/*" "dist/*" "dist-download/*" ".git/*"

echo "Created: $OUT_DIR/$ZIP_NAME"
