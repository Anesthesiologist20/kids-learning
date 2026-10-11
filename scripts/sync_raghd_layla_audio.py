#!/usr/bin/env python3
"""Sync the latest Layla TTS clips into Raghd's existing audio paths."""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.elevenlabs.io/v1"
CLIPS = {
    "I": "raghd/audio/i-letter.mp3",
    "Ice cream": "raghd/audio/i-icecream.mp3",
    "Iron": "raghd/audio/i-iron.mp3",
    "Ink": "raghd/audio/i-ink.mp3",
    "Island": "raghd/audio/i-island.mp3",
    "Insect": "raghd/audio/i-insect.mp3",
    "Ill": "raghd/audio/i-ill.mp3",
    "P": "raghd/audio/p-letter.mp3",
    "Pencil": "raghd/audio/p-pencil.mp3",
    "Pancake": "raghd/audio/p-pancake.mp3",
    "Potato": "raghd/audio/p-potato.mp3",
    "Pig": "raghd/audio/p-pig.mp3",
    "Plane": "raghd/audio/p-plane.mp3",
    "Popcorn": "raghd/audio/p-popcorn.mp3",
}

def request(url, api_key):
    req = urllib.request.Request(url, headers={"xi-api-key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            return response.read(), response.headers.get("Content-Type", "")
    except urllib.error.HTTPError as exc:
        detail = exc.read(500).decode("utf-8", "replace")
        raise RuntimeError(f"ElevenLabs returned HTTP {exc.code}: {detail}") from exc

def normalized(value):
    return re.sub(r"[^a-z0-9]+", "", (value or "").casefold())

def main():
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    voice_id = os.environ.get("LAYLA_VOICE_ID", "").strip()
    source = os.environ.get("ELEVENLABS_SOURCE", "TTS").strip()
    if not api_key:
        raise RuntimeError("Missing ELEVENLABS_API_KEY GitHub secret.")
    if not voice_id:
        raise RuntimeError("Enter Layla's exact voice ID in the workflow run form.")
    if source not in {"TTS", "Flows"}:
        raise RuntimeError("Source must be TTS or Flows.")

    found = {}
    cursor = None
    while True:
        params = {"source": source, "voice_id": voice_id, "page_size": "1000", "sort_direction": "desc"}
        if cursor:
            params["start_after_history_item_id"] = cursor
        raw, _ = request(API + "/history?" + urllib.parse.urlencode(params), api_key)
        page = json.loads(raw)
        items = page.get("history", [])
        for item in items:
            key = normalized(item.get("text"))
            for expected in CLIPS:
                if key == normalized(expected) and expected not in found:
                    found[expected] = item
        if len(found) == len(CLIPS) or not page.get("has_more") or not items:
            break
        next_cursor = page.get("last_history_item_id")
        if not next_cursor or next_cursor == cursor:
            break
        cursor = next_cursor

    missing = [label for label in CLIPS if label not in found]
    if missing:
        raise RuntimeError(
            "No exact, recent Layla history match for: " + ", ".join(missing) +
            ". Nothing was written. Check voice ID/source and ensure the clip text is exactly the word or letter."
        )

    # Download all clips before replacing any checked-in asset.
    downloaded = {}
    for label, item in found.items():
        item_id = urllib.parse.quote(item["history_item_id"], safe="")
        audio, content_type = request(f"{API}/history/{item_id}/audio", api_key)
        if not audio or not (content_type.startswith("audio/") or audio[:3] == b"ID3" or audio[:2] == b"\xff\xfb"):
            raise RuntimeError(f"Audio download did not look like a valid audio file for {label}. Nothing was written.")
        downloaded[CLIPS[label]] = audio

    for path, audio in downloaded.items():
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(audio)
    print(f"Downloaded and staged {len(downloaded)} Layla clips.")
    for label, path in CLIPS.items():
        print(f"{label} -> {path} (history item {found[label]['history_item_id']})")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Sync failed: {exc}", file=sys.stderr)
        sys.exit(1)
