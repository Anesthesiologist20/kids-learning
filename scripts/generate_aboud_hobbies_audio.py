#!/usr/bin/env python3
"""Generate Aboud hobby story voices with free Kokoro TTS."""
from pathlib import Path
import subprocess,tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'experimental'/'aboud-hobby-adventure'/'audio'
VOICES={'bella':'af_bella','heart':'af_heart','sarah':'af_sarah'}
SCENES=[
"Aboud is a happy boy. He loves trying different hobbies.",
"Aboud plays football at the park. He runs fast and kicks the ball.",
"Aboud rides his bicycle with a helmet. He enjoys the fresh air.",
"Aboud plays with his friends. They share toys and take turns.",
"Aboud draws a colorful picture. His imagination makes him smile.",
"Aboud reads a book about space. Every page brings a new adventure.",
"Aboud looks at birds and trees. He loves exploring nature.",
"Aboud is proud of his hobbies. Learning and playing make every day special!"
]
WORDS="hobbies different football kicks bicycle helmet friends share draws imagination reads adventure exploring nature proud special".split()
QUESTIONS=[
"What does Aboud love?",
"What does Aboud kick?",
"What does Aboud wear on his head?",
"What do Aboud and his friends do?",
"What does Aboud make?",
"What is Aboud's book about?",
"What does Aboud look at?",
"How do hobbies make Aboud feel?"
]
CLIPS={f'scene-{i:02d}':t for i,t in enumerate(SCENES,1)}
CLIPS.update({f'word-{w}':w+'.' for w in WORDS})
CLIPS.update({f'question-{i:02d}':q for i,q in enumerate(QUESTIONS,1)})
assert len(CLIPS)==32
def main():
 import torch
 torch.set_num_threads(2)
 pipe=KPipeline(lang_code='a')
 for label,voice in VOICES.items():
  directory=OUT/label;directory.mkdir(parents=True,exist_ok=True)
  for name,phrase in CLIPS.items():
   dest=directory/(name+'.mp3')
   if dest.exists() and dest.stat().st_size>800:continue
   chunks=[]
   for _,_,wave in pipe(phrase,voice=voice,speed=1.0):
    samples=np.asarray(wave,dtype=np.float32).reshape(-1)
    if samples.size:chunks += [samples,np.zeros(1500,dtype=np.float32)]
   if not chunks:raise RuntimeError('Empty audio '+name)
   with tempfile.TemporaryDirectory() as tmp:
    wav=Path(tmp)/'sound.wav';sf.write(wav,np.concatenate(chunks),24000,subtype='PCM_16')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(dest)],check=True)
   print('Created',dest.relative_to(ROOT),flush=True)
 expected=[OUT/v/(n+'.mp3') for v in VOICES for n in CLIPS]
 assert len(expected)==96 and all(p.exists() and p.stat().st_size>800 for p in expected)
 print('Verified 96 Kokoro recordings')
if __name__=='__main__': main()
