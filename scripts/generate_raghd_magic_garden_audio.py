#!/usr/bin/env python3
"""Render Raghd's Magic Garden with free offline Kokoro speech (Bella and Heart)."""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "experimental" / "raghd-magic-garden" / "audio"
LINES = [
    "Bunny finds a magic seed.",
    "Kitty comes to say hello.",
    "They put the seed in the soil.",
    "Kitty gives it some water.",
    "A tiny green plant grows.",
    "Look! A big pink flower!",
    "The flower makes a rainbow.",
    "Bunny and Kitty dance with joy!",
]
VOICES = {"bella": "af_bella", "heart": "af_heart"}

def main():
    import torch
    torch.set_num_threads(2)
    engine = KPipeline(lang_code="a", device="cpu")
    for short, voice in VOICES.items():
        folder = DEST / short
        folder.mkdir(parents=True, exist_ok=True)
        for i, words in enumerate(LINES, 1):
            out = folder / f"scene-{i:02d}.mp3"
            if out.is_file() and out.stat().st_size > 1000:
                print("Already exists:", out.relative_to(ROOT), flush=True)
                continue
            clips = [np.asarray(audio, dtype=np.float32).reshape(-1)
                     for _, _, audio in engine(words, voice=voice, speed=1.0)]
            if not clips or not all(len(a) > 0 for a in clips):
                raise RuntimeError(f"No speech produced for {voice} scene {i}")
            signal = np.concatenate(clips)
            with tempfile.TemporaryDirectory() as tmp:
                wave = Path(tmp) / "clip.wav"
                sf.write(wave, signal, 24000, subtype="PCM_16")
                subprocess.run([
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                    "-i", str(wave), "-ac", "1", "-ar", "24000",
                    "-codec:a", "libmp3lame", "-b:a", "64k", str(out)
                ], check=True)
            if out.stat().st_size < 1000:
                raise RuntimeError("Invalid output: " + str(out))
            print("Created", out.relative_to(ROOT), out.stat().st_size, flush=True)
    expected = [DEST / v / f"scene-{i:02d}.mp3" for v in VOICES for i in range(1, 9)]
    assert len(expected) == 16 and all(p.is_file() and p.stat().st_size > 1000 for p in expected)
    print("Verified all 16 MP3 files.", flush=True)

if __name__ == "__main__":
    main()
