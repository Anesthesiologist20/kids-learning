#!/usr/bin/env python3
"""Generate reusable Kokoro AI MP3s for Sakinah. No API key and no browser speech."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
manifest_path = ROOT / (sys.argv[1] if len(sys.argv) > 1 else "sakinah/voice-manifest.json")
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
output = ROOT / "sakinah/audio/kokoro"
output.mkdir(parents=True, exist_ok=True)
pipeline = KPipeline(lang_code="a")
speed = float(manifest.get("voice_speed", 0.86))
assert 0.5 <= speed <= 1.5, "Invalid voice speed"

for label, kokoro_voice in manifest["voices"].items():
    if not (label.isalnum() and kokoro_voice.startswith("af_")):
        raise ValueError("Unrecognized voice configuration")
    dest = output / label
    dest.mkdir(parents=True, exist_ok=True)
    for entry in manifest["lines"]:
        name = entry["id"]
        if not name.replace("-", "").isalnum():
            raise ValueError("Invalid audio file name")
        text = entry["text"].strip()
        target = dest / f"{name}.mp3"
        if not text:
            raise ValueError("Empty lesson text")
        print(f"Generating {target.relative_to(ROOT)}: {text}", flush=True)
        chunks = []
        for _graphemes, _phonemes, waveform in pipeline(text, voice=kokoro_voice, speed=speed):
            audio = np.asarray(waveform, dtype=np.float32).reshape(-1)
            if audio.size:
                chunks.append(audio)
                chunks.append(np.zeros(2400, dtype=np.float32))
        if not chunks:
            raise RuntimeError(f"No audio returned: {name}")
        with tempfile.TemporaryDirectory() as tempdir:
            wav = Path(tempdir) / "speech.wav"
            sf.write(wav, np.concatenate(chunks), 24000, subtype="PCM_16")
            subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                 "-i", str(wav), "-ac", "1", "-b:a", "96k", str(target)],
                check=True,
            )
        if target.stat().st_size < 1000:
            raise RuntimeError(f"Audio too short: {target}")
print("All AI lesson audio generated successfully.", flush=True)
