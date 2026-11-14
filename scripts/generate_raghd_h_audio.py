#!/usr/bin/env python3
"""Real Kokoro Bella/Heart MP3 recordings for Raghd's letter H lesson."""
from pathlib import Path
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path("raghd/letter-h/audio")
VOICES = {"bella": "af_bella", "heart": "af_heart"}
CLIPS = {
    "intro": "Hello, Raghd! Let's learn the letter H together!",
    "letter-name": "This is the letter H. Capital H, small h.",
    "letter-sound": "H makes a soft breathy h sound. H, h, hat!",
    "word-hat": "Hat.",
    "word-hen": "Hen.",
    "word-hand": "Hand.",
    "word-horse": "Horse.",
    "word-house": "House.",
    "word-honey": "Honey.",
    "sentence-hat": "This is a hat.",
    "sentence-hen": "This is a hen.",
    "sentence-hand": "This is a hand.",
    "sentence-horse": "This is a horse.",
    "sentence-house": "This is a house.",
    "sentence-honey": "This is honey.",
}

def main():
    import torch
    torch.set_num_threads(2)
    pipeline = KPipeline(lang_code="a")
    for label, voice in VOICES.items():
        folder = ROOT / label
        folder.mkdir(parents=True, exist_ok=True)
        for key, utterance in CLIPS.items():
            dest = folder / f"{key}.mp3"
            if dest.exists() and dest.stat().st_size > 600:
                continue
            pieces = [np.asarray(audio) for _, _, audio in pipeline(utterance, voice=voice, speed=1.0)]
            if not pieces:
                raise RuntimeError(f"Missing synthesized audio: {label}/{key}")
            with tempfile.TemporaryDirectory() as tmp:
                wav = Path(tmp) / "source.wav"
                sf.write(wav, np.concatenate(pieces), 24000)
                subprocess.run(
                    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                     "-i", str(wav), "-ac", "1", "-ar", "24000",
                     "-codec:a", "libmp3lame", "-qscale:a", "5", str(dest)],
                    check=True
                )
            if dest.stat().st_size <= 600:
                raise RuntimeError(f"Corrupt recording: {dest}")
            print("Created", dest, flush=True)
    expected = [ROOT / voice / f"{key}.mp3" for voice in VOICES for key in CLIPS]
    missing = [str(path) for path in expected if not path.is_file() or path.stat().st_size <= 600]
    if missing:
        raise RuntimeError(f"Missing H clips: {missing}")
    print(f"Validated {len(expected)} real Kokoro recordings.", flush=True)

if __name__ == "__main__":
    main()
