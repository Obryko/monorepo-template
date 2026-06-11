#!/usr/bin/env bash
set -euo pipefail

# Run from repo root regardless of caller CWD
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SCOPE="${1:-}"
APP_NAME="${2:-}"

if [[ -z "$SCOPE" || -z "$APP_NAME" ]]; then
  echo "Usage: ./scripts/rename.sh <new-scope> <new-app-name>"
  echo "Example: ./scripts/rename.sh myorg my-project"
  echo ""
  echo "  <new-scope>    npm scope without @, e.g. 'myorg'"
  echo "  <new-app-name> app name used in paths and display, e.g. 'my-project'"
  exit 1
fi

# Strip leading @ if provided
SCOPE="${SCOPE#@}"

# Validate inputs: lowercase alphanumerics with optional dashes (npm-compatible).
# Prevents Perl regex injection and malformed replacements.
NAME_RE='^[a-z0-9][a-z0-9-]*$'
if [[ ! "$SCOPE" =~ $NAME_RE ]]; then
  echo "Error: <new-scope> must match $NAME_RE (got: '$SCOPE')"
  exit 1
fi
if [[ ! "$APP_NAME" =~ $NAME_RE ]]; then
  echo "Error: <new-app-name> must match $NAME_RE (got: '$APP_NAME')"
  exit 1
fi

echo "Renaming: @monorepo-template/* → @${SCOPE}/*"
echo "Renaming: monorepo-template → ${APP_NAME}"
echo ""

find . \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.pnpm-store/*" \
  -not -path "*/.claude/*" \
  \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yml" -o -name "*.yaml" -o -name "*.md" -o -name "*.env.example" -o -name "Dockerfile" \) \
  -exec perl -i -pe \
    "s{\@monorepo-template/}{\@${SCOPE}/}g; s{monorepo-template}{${APP_NAME}}g" {} +

echo "Running pnpm install to regenerate lockfile..."
pnpm install

echo ""
echo "Done! Review changes with: git diff"
echo "Then commit: git add -A && git commit -m 'chore: rename to @${SCOPE}/${APP_NAME}'"
