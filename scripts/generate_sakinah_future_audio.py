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

STORIES = json.loads("[[\"Smartphones ... tablets ... Wi-Fi ... Sometimes we think it’s impossible to live without these things.\",\"Can you imagine your life without technology?\",\"Would it be easier or more difficult?\"],[\"Have you ever lived for a week without technology?\",\"Now, try to imagine what new technology is coming.\",\"What inventions do you want to see?\",\"Look at these ideas.\"],[\"Maybe!\",\"When you buy something online, your things have to travel by truck to get to your house.\",\"This takes time (normally two or three days).\"],[\"Soon, people might use drones—small flying robots—called octocopters.\",\"These drones can carry objects up to two kilograms.\",\"They can bring you the items you buy only 30 minutes after you pay for them!\"],[\"Maybe not!\",\"Some car manufacturers are building cars that drive themselves.\",\"These cars use special sensors, which can detect other cars and make decisions.\"],[\"You can just sit back and enjoy the ride!\",\"Even today, many cars can park without a driver.\",\"In some places, you can already catch a taxi with no driver!\"],[\"Did you know that in the U.S.A. there is a fake city where you can test cars with no drivers?!\",\"It’s called Mcity.\",\"It has fake sidewalks, fake buildings, fake traffic lights, and robots crossing the road!\"],[\"In this environment, the software in driverless cars communicates with other cars and with traffic lights.\",\"This kind of communication could stop road accidents in the future.\"],[\"Can you think of any problems with drones?\",\"Have you ever been on a bus or train with no driver?\",\"Where?\"]]")
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
            outfile = outdir / f"future-book-v2-s{scene_number}-{number:02d}.mp3"
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
