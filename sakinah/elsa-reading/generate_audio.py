#!/usr/bin/env python3
"""Create local Kokoro Bella/Heart recordings for Sakinah's ELSA reading.
No browser synthesized voices, paid services or personal keys are used.
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent
lesson = json.loads((ROOT / "lesson.json").read_text(encoding="utf-8"))
pipeline = KPipeline(lang_code="a")

def slug(term):
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", term.lower()))

def clean(text):
    return (text.replace("°", " degrees ").replace("′", " minutes ")
            .replace("″", " seconds ").replace("’", "'")
            .replace("“", '"').replace("”", '"').replace("—", ", "))

def write_audio(text, filename, voice):
    if filename.exists() and filename.stat().st_size > 300:
        return
    filename.parent.mkdir(parents=True, exist_ok=True)
    chunks = []
    for _, _, audio in pipeline(clean(text), voice=voice, speed=1.0):
        sample = np.asarray(audio, dtype=np.float32)
        if sample.size:
            chunks.append(sample)
    if not chunks:
        raise RuntimeError(f"No audio generated for {filename}: {text}")
    samples = np.concatenate(chunks)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "clip.wav"
        sf.write(wav, samples, 24000)
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                        "-i", str(wav), "-ar", "24000", "-ac", "1",
                        "-codec:a", "libmp3lame", "-q:a", "5", str(filename)],
                       check=True)
    print(f"Created {filename.relative_to(ROOT)} ({len(samples)/24000:.1f}s)", flush=True)

for folder, voice in (("bella", "af_bella"), ("heart", "af_heart")):
    out = ROOT / "audio" / folder
    for word in lesson["words"]:
        if word.get("src"):
            continue  # These five exact headwords already have original Kokoro clips.
        write_audio(word["term"], out / ("word-" + slug(word["term"]) + ".mp3"), voice)
    for section in lesson["sections"]:
        for line in section["lines"]:
            parts = line["parts"]
            write_audio(" ".join(parts), out / (line["id"] + ".mp3"), voice)
            for i, part in enumerate(parts, 1):
                write_audio(part, out / (f"{line['id']}-{i}.mp3"), voice)
print("Finished Bella and Heart recordings.")
