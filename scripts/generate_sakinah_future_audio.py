#!/usr/bin/env python3
"""Generate free offline-ready Kokoro MP3 for Sakinah's 9-scene technology reading."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

STORIES = json.loads("[[\"We use smartphones, tablets, and Wi-Fi.\",\"Technology helps us every day.\",\"Can you imagine life without technology?\"],[\"We can buy things online.\",\"A truck can bring our shopping.\",\"This can take two or three days.\"],[\"A drone is a small flying robot.\",\"It can carry a box to your home.\",\"Some drones can carry two kilograms.\"],[\"One day, drones may deliver our shopping.\",\"A small order could arrive in 30 minutes.\",\"But strong wind can be a problem.\"],[\"Some cars can drive themselves.\",\"These cars do not need a driver.\",\"You can sit back and enjoy the ride!\"],[\"Driverless cars have special sensors.\",\"Sensors can detect other cars.\",\"The car uses this information to make decisions.\"],[\"Mcity is a test city in the USA.\",\"It has fake roads and traffic lights.\",\"People test driverless cars there.\"],[\"Car software can share information.\",\"Cars can communicate with traffic lights.\",\"This could help prevent accidents.\"],[\"What problems can a drone have?\",\"Would you ride in a car with no driver?\",\"What new invention would you like to see?\"]]")
VOICES = {"heart": "af_heart", "bella": "af_bella", "sarah": "af_sarah"}
ROOT = Path(__file__).resolve().parents[1]
assert len(STORIES) == 9 and sum(map(len, STORIES)) == 27


def generate(name: str):
    if name not in VOICES:
        raise ValueError("Choose heart, bella, or sarah")
    outdir = ROOT / "sakinah" / "audio" / "kokoro" / name
    outdir.mkdir(parents=True, exist_ok=True)
    pipeline = KPipeline(lang_code="a")
    files = []
    for scene_number, sentences in enumerate(STORIES, 1):
        for number, sentence in enumerate(sentences, 1):
            outfile = outdir / f"future-s{scene_number}-{number:02d}.mp3"
            files.append(outfile)
            if outfile.exists() and outfile.stat().st_size > 1000:
                print("Already recorded:", outfile.name, flush=True)
                continue
            chunks = [
                np.asarray(audio, dtype=np.float32).reshape(-1)
                for _, _, audio in pipeline(sentence, voice=VOICES[name], speed=1.0)
            ]
            chunks = [c for c in chunks if c.size]
            if not chunks:
                raise RuntimeError(f"No audio created for {outfile.name}: {sentence}")
            with tempfile.TemporaryDirectory() as folder:
                wav = Path(folder) / "voice.wav"
                sf.write(wav, np.concatenate(chunks), 24000, subtype="PCM_16")
                subprocess.run(
                    ["ffmpeg", "-nostdin", "-y", "-loglevel", "error",
                     "-i", str(wav), "-ar", "24000", "-ac", "1",
                     "-codec:a", "libmp3lame", "-qscale:a", "6", str(outfile)],
                    check=True,
                )
            if outfile.stat().st_size < 1000:
                raise RuntimeError(f"Invalid recording: {outfile}")
            print("Created:", outfile.name, outfile.stat().st_size, flush=True)
    assert len(files) == 27
    assert all(f.is_file() and f.stat().st_size > 1000 for f in files)
    print(f"Verified all {len(files)} {name} sentence recordings.", flush=True)


if __name__ == "__main__":
    generate(sys.argv[1] if len(sys.argv) > 1 else "heart")
