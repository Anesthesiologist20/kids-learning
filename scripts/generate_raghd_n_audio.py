#!/usr/bin/env python3
"""Generate Raghd's N words in two zero-cost, offline-ready Kokoro voices."""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

OUT=Path("raghd/letter-n/audio")
VOICES={"bella":"af_bella","heart":"af_heart"}
CLIPS={
 "letter-name":"The letter N. Big N, little n.",
 "letter-sound":"N makes the nnn sound. Nnn, nnn, nurse.",
 "word-nurse":"Nurse.",
 "word-nose":"Nose.",
 "word-nap":"Nap.",
 "word-night":"Night.",
 "word-nail":"Nail.",
 "word-nest":"Nest.",
 "sentence-nurse":"This is a nurse.",
 "sentence-nose":"This is my nose.",
 "sentence-nap":"Time for a nap.",
 "sentence-night":"It is night.",
 "sentence-nail":"This is a nail.",
 "sentence-nest":"A bird has a nest.",
}
def main():
    import torch
    torch.set_num_threads(2)
    pipeline=KPipeline(lang_code="a")
    for label,voice in VOICES.items():
        folder=OUT/label
        folder.mkdir(parents=True,exist_ok=True)
        for key,phrase in CLIPS.items():
            dest=folder/(key+".mp3")
            if dest.is_file() and dest.stat().st_size>500:
                continue
            pieces=[np.asarray(chunk) for _,_,chunk in pipeline(phrase,voice=voice,speed=1.0)]
            if not pieces: raise RuntimeError(f"No samples generated for {label}/{key}")
            with tempfile.TemporaryDirectory() as tmp:
                wav=Path(tmp)/"clip.wav"
                sf.write(wav,np.concatenate(pieces),24000)
                subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-ac","1","-ar","24000","-codec:a","libmp3lame","-qscale:a","5",str(dest)],check=True)
            if dest.stat().st_size<500:raise RuntimeError(f"Invalid audio: {dest}")
            print("Generated",dest,flush=True)
    expected=[OUT/v/(k+".mp3") for v in VOICES for k in CLIPS]
    bad=[str(f) for f in expected if not f.exists() or f.stat().st_size<500]
    if bad:raise RuntimeError("Missing files: "+str(bad))
    print(f"Validated {len(expected)} Kokoro MP3 clips.",flush=True)
if __name__=="__main__": main()
