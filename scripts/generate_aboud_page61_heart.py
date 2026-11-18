#!/usr/bin/env python3
"""Generate standalone page 61 sentence and word clips using Kokoro af_heart at 0.72x."""
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "aboud/page61-heart-manifest.json").read_text(encoding="utf-8"))
DEST = ROOT / "aboud/audio/page61-heart"
DEST.mkdir(parents=True, exist_ok=True)

assert DATA["voice"] == "af_heart"
assert abs(float(DATA["speed"]) - 0.72) < 0.001
assert len(DATA["vocabulary"]) >= 11 and len(DATA["questions"]) >= 11

jobs = []
for story in DATA["stories"]:
    for i, text in enumerate(story["sentences"], 1):
        jobs.append((f"sentence-{story['id']}-{i:02d}", text))
for item in DATA["vocabulary"]:
    jobs.append((f"word-{item['id']}", item["word"]))

assert len(jobs) == len({name for name, _ in jobs}), "Repeated audio file names"
pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
for index, (name, text) in enumerate(jobs, 1):
    dest = DEST / (name + ".mp3")
    if dest.exists() and dest.stat().st_size > 1200:
        continue
    pieces = []
    for _, _, waveform in pipeline(text, voice="af_heart", speed=0.72):
        a = np.asarray(waveform, dtype=np.float32).reshape(-1)
        if a.size:
            pieces.append(a)
            pieces.append(np.zeros(2400, dtype=np.float32))
    if not pieces:
        raise RuntimeError(f"No speech produced for {name}")
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "voice.wav"
        sf.write(str(wav), np.concatenate(pieces), 24000, subtype="PCM_16")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                        "-i", str(wav), "-ac", "1", "-ar", "24000",
                        "-codec:a", "libmp3lame", "-b:a", "64k", str(dest)], check=True)
    assert dest.stat().st_size > 1200, dest
    print(f"{index}/{len(jobs)} {dest.name} ({dest.stat().st_size} bytes)", flush=True)

for name, _ in jobs:
    assert (DEST / (name + ".mp3")).stat().st_size > 1200
print(f"Validated {len(jobs)} Heart MP3 files at Extra Slow (0.72x)", flush=True)
