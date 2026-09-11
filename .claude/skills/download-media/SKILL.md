---
name: download-media
description: Download a video or audio track from a URL (YouTube, Instagram, TikTok, X/Twitter, Facebook, Reddit, Vimeo, SoundCloud, and anything else yt-dlp supports). Use whenever the user pastes a media link and asks to download it, save it, grab it, get the mp3/mp4, or just sends a link with no other instruction. Handles installing yt-dlp and ffmpeg, picks the best quality, and delivers the file back to the user.
---

# download-media

Give it a URL, get the file back. No other input required.

## Steps

1. Run the helper script with the URL:

   ```bash
   .claude/skills/download-media/scripts/download.sh "<URL>"
   ```

   Options, all optional:
   - `--audio` — extract audio only, as mp3.
   - `--as-is` — keep the original codec, skipping the H.264 conversion below.
   - `--max-height N` — cap video height (e.g. `--max-height 720`) for a smaller file.
   - `--out DIR` — output directory. Defaults to the session scratchpad.

   The script installs `yt-dlp` and `ffmpeg` if missing, then prints `DOWNLOADED: <path>` as its last line.

   It also keeps the result playable everywhere. Instagram and YouTube often serve VP9 or AV1 inside an mp4 container, which QuickTime, iOS and the stock Windows player render as a black screen with sound. The script asks for H.264 first and transcodes when only VP9 or AV1 is on offer, so the path it prints is always something the user can actually watch.

2. Send the file to the user with `SendUserFile`, using the path from that line. Set `display` to `attach` for media files.

3. Report the title, duration, and size in one or two sentences. Do not paste the yt-dlp log.

## Rules

- Never ask the user which format or quality they want. Default to best available and only adjust if they said so.
- One link means one download. If the URL is a playlist or channel, download only the single item unless the user asked for the whole list; the script already passes `--no-playlist`.
- If the file exceeds roughly 100 MB, re-run with `--max-height 720` rather than sending a very large file, and say that you did.

## When it fails

Read the actual error before reacting.

- **Login required / private / age-restricted** — the content is not publicly reachable. Say so plainly and stop. Do not attempt to bypass the restriction.
- **HTTP 403 or "unable to download webpage"** — usually the extractor is stale. Run `pip install -U yt-dlp` once and retry.
- **Unsupported URL** — check whether the page merely embeds the media, and if so pass the embedded source URL instead.
- **User reports a black screen** — the file is a codec the player cannot decode. Confirm with `ffmpeg -i <file>`; if the video stream is not h264, transcode it and resend.
