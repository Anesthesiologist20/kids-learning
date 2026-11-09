"""Build the two recorded voices for the page-61 reader from its displayed text."""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[1] / "sakinah" / "sci-fi-reading"

def clips(lesson):
    for section in lesson["sections"]:
        for line in section["lines"]:
            parts = line["parts"]
            yield line["id"], " ".join(parts)
            if len(parts) > 1:
                for index, part in enumerate(parts, 1):
                    yield f'{line["id"]}-{index}', part
    for entry in lesson["readingWords"]:
        for term in [entry["term"], *entry.get("forms", [])]:
            yield "word-" + re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-"), term

def spoken(text):
    return (text.replace("150", "one hundred and fifty")
                .replace("62–65", "sixty-two to sixty-five")
                .replace("(sci-fi)", ", sci-fi,")
                .replace("“", "").replace("”", ""))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path)
    parser.add_argument("voices", type=Path)
    args = parser.parse_args()
    lesson = json.loads((ROOT / "lesson.json").read_text())
    plan = list(clips(lesson))
    if len({name for name, _ in plan}) != len(plan):
        raise ValueError("Duplicate clip name")
    kokoro = Kokoro(str(args.model), str(args.voices))
    for voice in ("bella", "heart"):
        folder = ROOT / "audio" / voice
        folder.mkdir(parents=True, exist_ok=True)
        for number, (name, text) in enumerate(plan, 1):
            audio, rate = kokoro.create(spoken(text), voice=f"af_{voice}", speed=0.78, lang="en-us")
            samples = np.asarray(audio, dtype="<f4").ravel()
            if len(samples) < rate * 0.16 or not np.isfinite(samples).all() or np.max(np.abs(samples)) < 0.02:
                raise ValueError(f"Invalid recording for {voice}/{name}")
            dest = folder / (name + ".mp3")
            subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y",
                            "-f","f32le","-ar",str(rate),"-ac","1","-i","pipe:0",
                            "-codec:a","libmp3lame","-b:a","64k",str(dest)],
                           input=samples.tobytes(),check=True)
            if dest.stat().st_size < 900:
                raise ValueError(f"Empty recording {dest}")
            if number % 25 == 0 or number == len(plan):
                print(f"{voice}: {number}/{len(plan)}", flush=True)

if __name__ == "__main__":
    main()
