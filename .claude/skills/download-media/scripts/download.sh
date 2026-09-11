#!/usr/bin/env bash
# Download media from any yt-dlp-supported URL. Prints "DOWNLOADED: <path>" on success.
set -euo pipefail

URL=""
AUDIO_ONLY=0
MAX_HEIGHT=""
AS_IS=0
OUTDIR="${CLAUDE_SCRATCHPAD_DIR:-${TMPDIR:-/tmp}}/downloads"

while [ $# -gt 0 ]; do
  case "$1" in
    --audio) AUDIO_ONLY=1; shift ;;
    --as-is) AS_IS=1; shift ;;
    --max-height) MAX_HEIGHT="$2"; shift 2 ;;
    --out) OUTDIR="$2"; shift 2 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) URL="$1"; shift ;;
  esac
done

[ -n "$URL" ] || { echo "usage: download.sh <URL> [--audio] [--max-height N] [--as-is] [--out DIR]" >&2; exit 2; }

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
else
  # Prefer H.264 video in an mp4 container. VP9 or AV1 inside mp4 plays as a
  # black screen with sound in QuickTime, iOS and the stock Windows player, so
  # a slightly lower-bitrate H.264 stream beats an unplayable better one.
  HEIGHT_FILTER=""
  [ -n "$MAX_HEIGHT" ] && HEIGHT_FILTER="[height<=$MAX_HEIGHT]"
  ARGS+=(--merge-output-format mp4 -f "bv*[vcodec^=avc1]$HEIGHT_FILTER+ba/b[vcodec^=avc1]$HEIGHT_FILTER/bv*$HEIGHT_FILTER+ba/b$HEIGHT_FILTER/bv*+ba/b")
fi

rm -f "$OUTDIR/.last"
yt-dlp "${ARGS[@]}" -o "$OUTDIR/%(title).120B-%(id)s.%(ext)s" "$URL" >&2

FILE="$(tail -n 1 "$OUTDIR/.last" 2>/dev/null || true)"
[ -n "$FILE" ] && [ -f "$FILE" ] || { echo "download produced no file" >&2; exit 1; }

# Instagram and YouTube sometimes only offer VP9 or AV1, so the format
# preference above is not always honoured. Transcode when that happens.
if [ "$AUDIO_ONLY" -eq 0 ] && [ "$AS_IS" -eq 0 ] && command -v ffmpeg >/dev/null 2>&1; then
  # ffprobe is not shipped with the pip-installed ffmpeg, so read the codec
  # off ffmpeg's own stream banner instead.
  # ffmpeg -i with no output file always exits non-zero, which pipefail would
  # otherwise turn into a silent early exit, so swallow its status.
  VCODEC="$({ ffmpeg -hide_banner -i "$FILE" 2>&1 || true; } | sed -n 's/.*Stream.*Video: \([a-z0-9]*\).*/\1/p' | head -n 1)"
  case "${VCODEC:-}" in
    ""|h264|avc1) ;;
    *)
      echo "re-encoding $VCODEC to h264 for player compatibility" >&2
      CONVERTED="${FILE%.*}-h264.mp4"
      if ffmpeg -v error -y -i "$FILE" -c:v libx264 -preset medium -crf 20 \
           -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$CONVERTED" >&2; then
        rm -f "$FILE"
        FILE="$CONVERTED"
      fi
      ;;
  esac
fi

yt-dlp --no-playlist --no-warnings --print "%(title)s | %(duration_string)s" "$URL" 2>/dev/null || true
du -h "$FILE" | cut -f1
echo "DOWNLOADED: $FILE"
