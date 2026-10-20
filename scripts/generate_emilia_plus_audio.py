#!/usr/bin/env python3
"""Produce reusable AI audio for the separate Emilia Reading Plus page."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "aboud/emilia-plus-audio-manifest.json").read_text(encoding="utf-8"))

if len(sys.argv) != 2 or sys.argv[1] not in manifest["voices"]:
    raise SystemExit("Usage: generate_emilia_plus_audio.py bella|heart|sarah")
voice = sys.argv[1]
out = ROOT / "aboud/audio/emilia-plus" / voice
out.mkdir(parents=True, exist_ok=True)
pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
lines = manifest["lines"]
assert len(lines) == len({line["id"] for line in lines}), "Duplicate audio ID"
for i, line in enumerate(lines, 1):
    name = line["id"]
    assert name and all(ch.isascii() and (ch.islower() or ch.isdigit() or ch == "-") for ch in name), name
    target = out / f"{name}.mp3"
    if target.is_file() and target.stat().st_size > 1000:
        continue
    clips = []
    for _, _, waveform in pipeline(line["text"], voice=manifest["voices"][voice], speed=manifest["speed"]):
        a = np.asarray(waveform, dtype=np.float32).reshape(-1)
        if a.size:
            clips.append(a)
            clips.append(np.zeros(1200, dtype=np.float32))
    if not clips:
        raise RuntimeError(f"No audio created: {name}")
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "clip.wav"
        sf.write(wav, np.concatenate(clips), 24000, subtype="PCM_16")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(wav), "-ac", "1", "-b:a", "96k", str(target)], check=True)
    if target.stat().st_size <= 1000:
        raise RuntimeError(f"Audio file empty: {name}")
    if i % 20 == 0:
        print(f"{voice}: {i}/{len(lines)}", flush=True)
assert all((out / f"{x['id']}.mp3").stat().st_size > 1000 for x in lines)
print(f"Verified {len(lines)} short AI MP3 files for {voice}", flush=True)
