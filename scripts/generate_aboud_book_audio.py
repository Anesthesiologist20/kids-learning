#!/usr/bin/env python3
"""Generate Aboud's Book of Adventures audio using free Kokoro Bella and Heart.
Run by GitHub Actions. Reads lesson text directly from index.html so audio stays in sync.
"""
from __future__ import annotations
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / "experimental" / "book-of-adventures" / "index.html"
DEST = LESSON.parent / "audio"

source = LESSON.read_text(encoding="utf-8")
vocab_match = re.search(r"const vocabulary=(\[[\s\S]*?\]);\s*const pages=", source)
questions_match = re.search(r"const base=(\[[\s\S]*?\])\s*\.map\(", source)
assert vocab_match is not None and questions_match is not None, "Could not locate quiz data in lesson"
vocabulary = json.loads(vocab_match.group(1))
questions = json.loads(questions_match.group(1))
scene_texts = re.findall(r"sentences:(\[[^\]]+\])", source)
pages = [json.loads(part) for part in scene_texts]
assert len(vocabulary) == 16, f"Expected 16 words, got {len(vocabulary)}"
assert len(pages) == 4, f"Expected 4 story pages, got {len(pages)}"
assert len(questions) == 24, f"Expected 24 questions, got {len(questions)}"

jobs = []
for index, row in enumerate(vocabulary, 1):
    jobs.append((f"word-{index:02d}", row[0]))
for page_index, sentences in enumerate(pages, 1):
    for line_index, sentence in enumerate(sentences, 1):
        jobs.append((f"sentence-{page_index:02d}-{line_index:02d}", sentence))
for index, row in enumerate(questions, 1):
    jobs.append((f"question-{index:02d}", row[0]))
assert len(jobs) == 53, f"Unexpected jobs: {len(jobs)}"

pipeline = KPipeline(lang_code="a", device="cpu")
for voice in ("af_bella", "af_heart"):
    voice_dir = DEST / voice
    voice_dir.mkdir(parents=True, exist_ok=True)
    for i, (name, spoken) in enumerate(jobs, 1):
        out = voice_dir / (name + ".mp3")
        if out.exists() and out.stat().st_size > 1000:
            continue
        if spoken == "WHOOSH!":
            spoken = "Whoosh!"
        clips = [np.asarray(audio, dtype=np.float32) for _, _, audio in pipeline(spoken, voice=voice, speed=1.0)]
        if not clips:
            raise RuntimeError(f"Nothing synthesized: {voice} {name}: {spoken!r}")
        signal = np.concatenate(clips)
        if signal.size < 300:
            raise RuntimeError(f"Too short audio: {voice} {name}")
        with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            sf.write(wav.name, signal, 24000, subtype="PCM_16")
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                "-i", wav.name, "-ac", "1", "-ar", "24000",
                "-codec:a", "libmp3lame", "-b:a", "48k", str(out),
            ], check=True)
        print(f"{voice} {i}/{len(jobs)} {name}: {out.stat().st_size} bytes", flush=True)
print(f"Successfully generated {len(jobs) * 2} Kokoro MP3 files", flush=True)
