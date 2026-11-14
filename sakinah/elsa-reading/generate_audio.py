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
import torch
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent
lesson = json.loads((ROOT / "lesson.json").read_text(encoding="utf-8"))
torch.set_num_threads(2)  # Proven faster and steadier on GitHub-hosted CPU runners.
pipeline = KPipeline(lang_code="a")

def slug(term):
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", term.lower()))

def clean(text):
    return (text.replace("°", " degrees ").replace("′", " minutes ")
            .replace("″", " seconds ").replace("’", "'")
            .replace("“", '"').replace("”", '"').replace("—", ", "))

def write_audio(text, filename, voice):
    if filename.exists() and filename.stat().st_size > 600:
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
    if filename.stat().st_size <= 600:
        raise RuntimeError(f"Empty or corrupt recording: {filename}")
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

expected = []
for folder in ("bella", "heart"):
    for word in lesson["words"]:
        if not word.get("src"):
            expected.append(ROOT / "audio" / folder / ("word-" + slug(word["term"]) + ".mp3"))
    for section in lesson["sections"]:
        for line in section["lines"]:
            expected.append(ROOT / "audio" / folder / (line["id"] + ".mp3"))
            for i, _ in enumerate(line["parts"], 1):
                expected.append(ROOT / "audio" / folder / (f"{line['id']}-{i}.mp3"))
missing = [str(f) for f in expected if not f.exists() or f.stat().st_size <= 600]
if missing:
    raise RuntimeError(f"ELSA Bella/Heart audio incomplete: {missing[:10]} (total {len(missing)})")
print(f"Validated all {len(expected)} Bella and Heart recordings.", flush=True)

