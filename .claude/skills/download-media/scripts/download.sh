#!/usr/bin/env bash
# Download media from any yt-dlp-supported URL. Prints "DOWNLOADED: <path>" on success.
set -euo pipefail

URL=""
AUDIO_ONLY=0
MAX_HEIGHT=""
OUTDIR="${CLAUDE_SCRATCHPAD_DIR:-${TMPDIR:-/tmp}}/downloads"

while [ $# -gt 0 ]; do
  case "$1" in
    --audio) AUDIO_ONLY=1; shift ;;
    --max-height) MAX_HEIGHT="$2"; shift 2 ;;
    --out) OUTDIR="$2"; shift 2 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) URL="$1"; shift ;;
  esac
done

[ -n "$URL" ] || { echo "usage: download.sh <URL> [--audio] [--max-height N] [--out DIR]" >&2; exit 2; }

command -v yt-dlp >/dev/null 2>&1 || pip install -q yt-dlp >&2

# ffmpeg lets yt-dlp merge the best separate video and audio streams, and is
# required for --audio. Without it we silently fall back to a lower-quality
# pre-muxed stream, so try to install it, but do not fail the download if we cannot.
if ! command -v ffmpeg >/dev/null 2>&1; then
  pip install -q imageio-ffmpeg >&2 || true
  FFMPEG_BIN="$(python3 -c 'import imageio_ffmpeg,sys; sys.stdout.write(imageio_ffmpeg.get_ffmpeg_exe())' 2>/dev/null || true)"
  if [ -n "$FFMPEG_BIN" ] && [ -x "$FFMPEG_BIN" ]; then
    mkdir -p "$OUTDIR/.bin"
    ln -sf "$FFMPEG_BIN" "$OUTDIR/.bin/ffmpeg"
    export PATH="$OUTDIR/.bin:$PATH"
  fi
fi

mkdir -p "$OUTDIR"

ARGS=(--no-playlist --restrict-filenames --no-warnings --print-to-file after_move:filepath "$OUTDIR/.last")
if [ "$AUDIO_ONLY" -eq 1 ]; then
  ARGS+=(-x --audio-format mp3 --audio-quality 0)
elif [ -n "$MAX_HEIGHT" ]; then
  ARGS+=(-f "bestvideo[height<=$MAX_HEIGHT]+bestaudio/best[height<=$MAX_HEIGHT]/best")
fi

rm -f "$OUTDIR/.last"
yt-dlp "${ARGS[@]}" -o "$OUTDIR/%(title).120B-%(id)s.%(ext)s" "$URL" >&2

FILE="$(tail -n 1 "$OUTDIR/.last" 2>/dev/null || true)"
[ -n "$FILE" ] && [ -f "$FILE" ] || { echo "download produced no file" >&2; exit 1; }

yt-dlp --no-playlist --no-warnings --print "%(title)s | %(duration_string)s" "$URL" 2>/dev/null || true
du -h "$FILE" | cut -f1
echo "DOWNLOADED: $FILE"
