#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
WORKSPACE_DIR=$(dirname "$(dirname "$SCRIPT_DIR")")
HOOK_SOURCE="$SCRIPT_DIR/git-hooks/post-commit"
REPOS="home personal devnotes reanotes lifenotes cats"

for repo in $REPOS; do
  git_dir="$WORKSPACE_DIR/$repo/.git"
  target="$git_dir/hooks/post-commit"
  [ -d "$git_dir/hooks" ] || continue

  if [ -f "$target" ] && ! grep -q "sync-timeline" "$target"; then
    echo "Skipped $repo: existing post-commit hook is not managed by sync-timeline."
    continue
  fi

  cp "$HOOK_SOURCE" "$target"
  chmod +x "$target"
  echo "Installed sync-timeline post-commit hook: $repo"
done
