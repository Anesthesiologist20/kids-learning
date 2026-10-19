#!/usr/bin/env python3
"""Generate one Kokoro AI voice per GitHub Actions matrix job.

No paid API or secrets required. Every Listen control maps to one short MP3.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "sakinah/adjective-audio-manifest.json"

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: generate_adjective_audio.py bella|heart|sarah")
    voice = sys.argv[1]
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if voice not in manifest["voices"]:
        raise SystemExit("Unknown voice")
    folder = ROOT / "sakinah/audio/adjective" / voice
    folder.mkdir(parents=True, exist_ok=True)
    entries = manifest["lines"]
    unique_ids = {entry["id"] for entry in entries}
    assert len(unique_ids) == len(entries), "Duplicate audio IDs"
    print(f"Generate {len(entries)} short files with voice {voice}", flush=True)
    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    for n, entry in enumerate(entries, start=1):
        name = entry["id"]
        if not name or not all(c.isascii() and (c.islower() or c.isdigit() or c == "-") for c in name):
            raise ValueError("Unsafe audio ID: " + name)
        text = entry["text"].strip()
        if not text:
            raise ValueError("Empty line: " + name)
        target = folder / (name + ".mp3")
        if target.exists() and target.stat().st_size > 1000:
            continue
        parts = []
        for _, _, samples in pipeline(text, voice=manifest["voices"][voice], speed=float(manifest.get("speed", 1))):
            array = np.asarray(samples, dtype=np.float32).reshape(-1)
            if array.size:
                parts.append(array)
                parts.append(np.zeros(1440, dtype=np.float32))
        if not parts:
            raise RuntimeError("No sound synthesized for " + name)
        with tempfile.TemporaryDirectory() as temp:
            wav = Path(temp) / "clip.wav"
            sf.write(wav, np.concatenate(parts), 24000, subtype="PCM_16")
            subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                 "-i", str(wav), "-ac", "1", "-b:a", "96k", str(target)],
                check=True,
            )
        if target.stat().st_size <= 1000:
            raise RuntimeError("Invalid MP3: " + name)
        if n % 20 == 0 or n == len(entries):
            print(f"{voice}: {n}/{len(entries)} clips complete", flush=True)
    present = list(folder.glob("*.mp3"))
    missing = [entry["id"] for entry in entries if not (folder / (entry["id"]+".mp3")).is_file()]
    assert not missing, f"Missing audio: {missing}"
    assert len(present) >= len(entries), "Not all MP3s produced"
    print(f"Verified {len(entries)} short {voice} AI voice MP3 recordings", flush=True)

if __name__ == "__main__":
    main()
