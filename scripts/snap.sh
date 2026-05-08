#!/usr/bin/env bash
# Capture screenshots of the QPrep UI using headless Chrome.
# Usage: scripts/snap.sh [base-url]
# Default base-url: https://qprep-chi.vercel.app
set -euo pipefail

BASE="${1:-https://qprep-chi.vercel.app}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_DIR=".ui-snapshots"
WIDTH=1440
HEIGHT=2400  # tall viewport to capture most page content without scroll-stitching

ROUTES=(
  "home:/"
  "questions:/questions"
  "playlists:/playlists"
  "question-detail:/questions/two-dice-sum-seven"
  "playlist-detail:/playlists/researcher-foundations"
)

mkdir -p "$OUT_DIR"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at: $CHROME" >&2
  exit 1
fi

echo "Snapshotting $BASE → $OUT_DIR/ ($WIDTH x $HEIGHT)"
for entry in "${ROUTES[@]}"; do
  name="${entry%%:*}"
  path="${entry#*:}"
  url="${BASE}${path}"
  out="$OUT_DIR/${name}.png"
  echo "  · $name  ←  $url"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --no-sandbox \
    --window-size="${WIDTH},${HEIGHT}" \
    --screenshot="$out" \
    "$url" \
    >/dev/null 2>&1
done

echo "Done. PNGs in $OUT_DIR/"
ls -1 "$OUT_DIR"
