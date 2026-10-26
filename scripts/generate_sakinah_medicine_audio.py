#!/usr/bin/env python3
"""Generate fixed Kokoro Heart and Bella recordings for Sakinah's medicine reading."""
from pathlib import Path
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro import KPipeline

LESSONS = [
    [
        "Sometimes doctors need to see",
        "inside a person to see what’s wrong.",
        "This is because lots of medical problems",
        "are only visible from the inside",
        "of a person’s body.",
        "When they look inside,",
        "doctors can identify illnesses and broken bones.",
    ],
    [
        "Technology makes it possible",
        "to take clear pictures",
        "of the inside of our bodies.",
        "This helps doctors decide",
        "what problem their patients have.",
        "Doctors use X-rays and scans",
        "to identify problems.",
    ],
    [
        "Technology can help us",
        "when something goes wrong in the body.",
        "For example, when people can’t hear well,",
        "they can use a hearing aid.",
        "If someone’s heart is not working well,",
        "they can get a pacemaker.",
        "Ventilators help people breathe.",
        "Technology can also help people",
        "who lose a limb—",
        "it’s possible to get an artificial one.",
    ],
]
VOICES = {"heart": "af_heart", "bella": "af_bella"}
ROOT = Path(__file__).resolve().parents[1]


def generate(voice_name: str):
    if voice_name not in VOICES:
        raise ValueError("Use 'heart' or 'bella'")
    pipeline = KPipeline(lang_code="a")
    directory = ROOT / "sakinah" / "audio" / "kokoro" / voice_name
    directory.mkdir(parents=True, exist_ok=True)
    produced = []
    for paragraph, lines in enumerate(LESSONS, start=1):
        for index, phrase in enumerate(lines, start=1):
            path = directory / f"medicine-p{paragraph}-{index:02d}.mp3"
            produced.append(path)
            if path.exists() and path.stat().st_size > 1000:
                print("Already exists:", path.name, flush=True)
                continue
            pcm = [
                np.asarray(wave, dtype=np.float32).reshape(-1)
                for _, _, wave in pipeline(phrase.replace("—", ", "), voice=VOICES[voice_name], speed=0.95)
            ]
            pcm = [w for w in pcm if w.size]
            if not pcm:
                raise RuntimeError(f"Kokoro returned no audio for {path}")
            with tempfile.TemporaryDirectory() as t:
                wav = Path(t) / "speech.wav"
                sf.write(wav, np.concatenate(pcm), 24000, subtype="PCM_16")
                subprocess.run(
                    ["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", str(wav),
                     "-ar", "24000", "-ac", "1", "-codec:a", "libmp3lame", "-qscale:a", "5", str(path)],
                    check=True,
                )
            if path.stat().st_size <= 1000:
                raise RuntimeError(f"Invalid audio: {path}")
            print("Created:", path.relative_to(ROOT), path.stat().st_size, flush=True)
    assert len(produced) == 24
    assert all(p.exists() and p.stat().st_size > 1000 for p in produced)
    print(f"Verified {len(produced)} {voice_name} recordings", flush=True)


if __name__ == "__main__":
    generate(sys.argv[1] if len(sys.argv) > 1 else "heart")
