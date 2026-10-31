#!/usr/bin/env python3
"""Generate free Kokoro recordings for Sakinah's lightweight technology reader."""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "sakinah" / "technology-future-reading.html"
VOICES = {"heart": "af_heart", "bella": "af_bella", "sarah": "af_sarah"}

def load_lines():
    html = PAGE.read_text(encoding="utf-8")
    match = re.search(r'<script type="application/json" id="story-data">(.*?)</script>', html, re.S)
    if not match:
        raise ValueError("Missing inline story-data JSON")
    scenes = json.loads(match.group(1))
    assert len(scenes) == 9, len(scenes)
    assert sum(len(x["lines"]) for x in scenes) == 27
    return scenes

def render(voice_name):
    if voice_name not in VOICES:
        raise ValueError("Voice must be heart, bella, or sarah")
    scenes = load_lines()
    target = ROOT / "sakinah" / "audio" / "kokoro" / voice_name
    target.mkdir(parents=True, exist_ok=True)
    pipeline = KPipeline(lang_code="a")
    count = 0
    for scene_idx, scene in enumerate(scenes, 1):
        for line_idx, line in enumerate(scene["lines"], 1):
            path = target / f"future-s{scene_idx}-{line_idx:02d}.mp3"
            if path.exists() and path.stat().st_size > 1000:
                print("skip", path.name, flush=True)
                count += 1
                continue
            waves = [np.asarray(audio, dtype=np.float32).reshape(-1)
                     for _, _, audio in pipeline(line, voice=VOICES[voice_name], speed=0.95)]
            waves = [w for w in waves if w.size]
            if not waves:
                raise RuntimeError(f"Kokoro generated empty speech for {path}")
            with tempfile.TemporaryDirectory() as tmp:
                wav = Path(tmp) / "line.wav"
                sf.write(wav, np.concatenate(waves), 24000, subtype="PCM_16")
                subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", str(wav),
                                "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame",
                                "-qscale:a", "6", str(path)], check=True)
            if path.stat().st_size < 1000:
                raise RuntimeError(f"Audio is too small: {path}")
            print("created", path.name, path.stat().st_size, flush=True)
            count += 1
    if count != 27:
        raise RuntimeError(f"Expected 27 lines, rendered {count}")
    print(f"Verified {count} clips for {voice_name}", flush=True)

if __name__ == "__main__":
    render(sys.argv[1] if len(sys.argv) > 1 else "heart")
