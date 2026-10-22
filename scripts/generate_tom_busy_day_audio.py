#!/usr/bin/env python3
"""Generate free, reusable Kokoro neural voices for Tom's Busy Day.
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
OUTPUT = ROOT / "experimental" / "audio" / "tom"
VOICES = {
    "bella": "af_bella",
    "heart": "af_heart",
    "sarah": "af_sarah",
    "nicole": "af_nicole",
    "sky": "af_sky",
}
LINES = {
    "scene-01": "Tom always wakes up early.",
    "scene-02": "He always brushes his teeth.",
    "scene-03": "He usually goes to school with his dad.",
    "scene-04": "Tom usually listens in class.",
    "scene-05": "He sometimes eats fruit at school.",
    "scene-06": "After school, he usually does his homework.",
    "scene-07": "He sometimes plays football with his friends.",
    "scene-08": "Tom never watches TV at night. He sleeps early and feels good.",
    "word-always": "Always. Always means every time. I always brush my teeth.",
    "word-usually": "Usually. Usually means most of the time. I usually go to school.",
    "word-sometimes": "Sometimes. Sometimes means on some days. I sometimes play football.",
    "word-never": "Never. Never means not at any time. I never watch TV at night.",
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
