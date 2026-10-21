#!/usr/bin/env python3
"""Generate free Kokoro MP3 recordings for A Day in My Life."""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

OUT=Path("experimental/audio/kokoro")
VOICES={"bella":"af_bella","heart":"af_heart","sarah":"af_sarah"}
LINES=[
"I brush my teeth in the morning.",
"I go to school with my dad.",
"I see the school and my friends.",
"I enjoy my class.",
"I come back home from school.",
"I eat my lunch.",
"I do my homework.",
"I play football.",
"I take a shower.",
"I pray Maghrib.",
"I have my dinner.",
"I go to sleep."
]
def main():
    import torch
    torch.set_num_threads(2)
    pipeline=KPipeline(lang_code="a")
    for voice,model_voice in VOICES.items():
        folder=OUT/voice
        folder.mkdir(parents=True,exist_ok=True)
        for number,line in enumerate(LINES,1):
            target=folder/f"scene-{number:02}.mp3"
            if target.exists() and target.stat().st_size>300:
                continue
            chunks=[np.asarray(audio) for _,_,audio in pipeline(line,voice=model_voice,speed=1.0)]
            if not chunks:
                raise RuntimeError(f"Empty audio: {voice}/{number}")
            with tempfile.TemporaryDirectory() as temp:
                wav=Path(temp)/"audio.wav"
                sf.write(wav,np.concatenate(chunks),24000)
                subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-ac","1","-ar","24000","-codec:a","libmp3lame","-qscale:a","5",str(target)],check=True)
            if target.stat().st_size<300:
                raise RuntimeError(f"Bad audio: {target}")
            print(target,flush=True)
    expected=[OUT/voice/f"scene-{n:02}.mp3" for voice in VOICES for n in range(1,13)]
    assert all(p.exists() and p.stat().st_size>300 for p in expected)
    print(f"Verified {len(expected)} recordings")
if __name__=="__main__":
    main()
