#!/usr/bin/env python3
"""Generate free, reusable Kokoro neural voices for Tom's Happy Weekend.
No ElevenLabs account, paid API, or browser synthesis is used.
Run: python scripts/generate_tom_busy_day_audio.py
"""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "experimental" / "audio" / "weekend"
VOICES = {
    "bella": "af_bella",
    "heart": "af_heart",
    "sarah": "af_sarah",
    "nicole": "af_nicole",
    "sky": "af_sky",
}
LINES = {
    "scene-01": "It is Friday! Tom wakes up with a big smile.",
    "scene-02": "Tom eats a tasty breakfast and drinks orange juice.",
    "scene-03": "Tom helps Dad wash the blue car.",
    "scene-04": "Tom rides his bike. His dog runs beside him.",
    "scene-05": "Tom plays football with his friends.",
    "scene-06": "Tom shares pizza with his family. Yum!",
    "scene-07": "Tom and his sister watch a funny movie.",
    "scene-08": "Before bed, Tom reads his favorite book.",
    "scene-09": "On Saturday, Tom helps Mom bake cookies.",
    "scene-10": "Tom visits his grandparents. They give him big hugs.",
    "scene-11": "At sunset, Tom flies a colorful kite.",
    "scene-12": "Tom goes to bed. What a wonderful weekend!",
    "word-friday": "Friday. Friday is a weekend day.",
    "word-saturday": "Saturday. Saturday is a weekend day.",
    "word-weekend": "Weekend. Friday and Saturday make the weekend.",
    "word-breakfast": "Breakfast. The morning meal.",
    "word-wash": "Wash. Clean something with water.",
    "word-bike": "Bike. A bicycle we ride.",
    "word-football": "Football. I play football with friends.",
    "word-pizza": "Pizza. We eat pizza with our family.",
    "word-movie": "Movie. We watch a funny movie.",
    "word-book": "Book. I read my favorite book.",
    "word-cookies": "Cookies. I help Mom bake cookies.",
    "word-grandparents": "Grandparents. Grandma and Grandpa.",
    "word-kite": "Kite. A colorful toy that flies in the wind.",
}

def main():
    import torch
    torch.set_num_threads(2)
    pipeline = KPipeline(lang_code="a")
    for label, kokoro_voice in VOICES.items():
        folder = OUTPUT / label
        folder.mkdir(parents=True, exist_ok=True)
        for name, line in LINES.items():
            target = folder / (name + ".mp3")
            if target.exists() and target.stat().st_size > 800:
                print("Keeping", target.relative_to(ROOT), flush=True)
                continue
            parts = []
            for _, _, waveform in pipeline(line, voice=kokoro_voice, speed=0.96):
                values = np.asarray(waveform, dtype=np.float32).reshape(-1)
                if values.size:
                    parts.append(values)
                    parts.append(np.zeros(1400, dtype=np.float32))
            if not parts:
                raise RuntimeError("No audio generated for " + str(target))
            with tempfile.TemporaryDirectory() as tmp:
                wav = Path(tmp) / "clip.wav"
                sf.write(wav, np.concatenate(parts), 24000, subtype="PCM_16")
                subprocess.run([
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-i", str(wav), "-ac", "1", "-ar", "24000",
                    "-codec:a", "libmp3lame", "-b:a", "64k", str(target)
                ], check=True)
            if target.stat().st_size <= 800:
                raise RuntimeError("Invalid output: " + str(target))
            print("Created", target.relative_to(ROOT), flush=True)
    expected = [OUTPUT / voice / (name + ".mp3") for voice in VOICES for name in LINES]
    missing = [str(f) for f in expected if not f.exists() or f.stat().st_size <= 800]
    assert not missing, "Missing/broken files: " + ", ".join(missing)
    print("Verified", len(expected), "MP3 recordings across", len(VOICES), "voices", flush=True)

if __name__ == "__main__":
    main()
