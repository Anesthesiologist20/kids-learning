#!/usr/bin/env python3
"""One-time, zero paid API calls, Kokoro-82M voice generator for Raghd's Week 7.
Kokoro model and voices are Apache-2.0 licensed. Output is committed as MP3 clips.
"""
from __future__ import annotations
import os, subprocess, tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

OUT = Path("raghd/week7/audio/kokoro")
VOICES = {"bella":"af_bella", "heart":"af_heart", "sarah":"af_sarah"}
CLIPS = {
 "intro": "Hello Raghd! Welcome to our animal kingdom! We will learn, count, and play. Are you ready?",
 "letter-c": "This is capital C. This is small c. C, c.",
 "c-sound": "C makes the kuh sound, as in cat. C, cat!",
 "cat": "Cat. C is for Cat. Cat.",
 "cup": "Cup. C is for Cup. Cup.",
 "candle": "Candle. C is for Candle. Candle.",
 "cow": "Cow. C is for Cow. Cow.",
 "clock": "Clock. C is for Clock. Clock.",
 "crown": "Crown. C is for Crown. Crown.",
 "seven": "Seven! One, two, three, four, five, six, seven. Seven chicks!",
 "pet": "Who has a pet at home? I have a pet!",
 "needs": "What do pets need? Pets need food, clean water, and a safe home.",
 "farmer": "Who takes care of farm animals? A farmer takes care of farm animals.",
 "turtle-shell": "Turtle! A turtle has a shell.",
 "sheep-wool": "Sheep! A sheep has soft wool.",
 "bird-feathers": "Bird! A bird has feathers.",
 "fish-scales": "Fish! A fish has scales.",
 "vocab-cat": "Cat.",
 "vocab-cup": "Cup.",
 "vocab-candle": "Candle.",
 "vocab-cow": "Cow.",
 "vocab-clock": "Clock.",
 "vocab-crown": "Crown.",
 "vocab-seven": "Seven.",
 "vocab-turtle": "Turtle.",
 "vocab-sheep": "Sheep.",
 "vocab-bird": "Bird.",
 "vocab-fish": "Fish.",
 "vocab-shell": "Shell.",
 "vocab-wool": "Wool.",
 "vocab-feathers": "Feathers.",
 "vocab-scales": "Scales.",
 "vocab-food": "Food.",
 "vocab-water": "Water.",
 "vocab-home": "Home.",
 "vocab-candy": "Candy.",
 "vocab-soda": "Soda.",
 "question-1":"What is this animal? Look carefully.",
 "question-2":"What is this? Look carefully.",
 "question-3":"What is this? Look carefully.",
 "question-4":"What animal is this?",
 "question-5":"What is this?",
 "question-6":"What is this?",
 "question-7":"Find the big letter C.",
 "question-8":"How many chicks can you see?",
 "question-9":"What covers a turtle?",
 "question-10":"What covers a sheep?",
 "question-11":"What covers a bird?",
 "question-12":"What covers a fish?",
 "question-13":"Who takes care of farm animals?",
 "question-14":"What does a pet need?",
 "question-15":"A cow is a what?",
 "question-16":"Which word starts with the letter C?"
}
def make_one(pipeline: KPipeline, voice: str, key: str, phrase: str) -> bool:
    folder = OUT / voice
    folder.mkdir(parents=True, exist_ok=True)
    destination = folder / f"{key}.mp3"
    if destination.exists() and destination.stat().st_size > 300:
        return False
    chunks = [np.asarray(audio) for _, _, audio in pipeline(phrase, voice=VOICES[voice], speed=1.0)]
    if not chunks:
        raise RuntimeError(f"Kokoro returned no sound for {key} ({voice})")
    samples = np.concatenate(chunks)
    with tempfile.TemporaryDirectory() as directory:
        wave = Path(directory) / "clip.wav"
        sf.write(wave, samples, 24000)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wave),
            "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-qscale:a", "5", str(destination)], check=True)
    if destination.stat().st_size < 200:
        raise RuntimeError(f"Bad recording for {key} ({voice})")
    print(f"generated {voice}/{key}: {destination.stat().st_size} bytes", flush=True)
    return True

def main():
    import torch
    torch.set_num_threads(2)
    pipeline=KPipeline(lang_code="a")
    created=0
    for voice in VOICES:
        for key, phrase in CLIPS.items():
            try:
                created+=bool(make_one(pipeline,voice,key,phrase))
            except Exception as exc:
                print(f"FAILED {voice}/{key}: {exc}",flush=True)
                raise
    files=list(OUT.glob("*/*.mp3"))
    required=len(VOICES)*len(CLIPS)
    print(f"{created} new MP3 clips; {len(files)}/{required} total",flush=True)
    if len(files)<required:
        raise RuntimeError("Missing generated clips")
if __name__=="__main__":
    main()
