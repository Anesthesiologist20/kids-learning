#!/usr/bin/env python3
"""Raghd Animal Adventure: three Kokoro voices, 123 MP3s."""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/'experimental'/'raghd-animal-adventure'/'audio'
VOICES={'bella':'af_bella','heart':'af_heart','sarah':'af_sarah'}
SCENES=[
 ['Raghd sees many animals at the park.','What a lovely day!'],
 ['The rabbit can hop on the grass.','It has soft fur.'],
 ['The fish can swim in the pond.','It has shiny scales.'],
 ['The blue bird can fly in the sky.','It has beautiful feathers.'],
 ['The snake can slither on the sand.','It has smooth scales.'],
 ['The horse can run fast.','Raghd watches it run!'],
 ['The sheep has soft wool.','Raghd says, It is fluffy!'],
 ['The bird has colorful feathers.','Raghd sees a blue feather.'],
 ['The turtle has a hard shell.','The fish have shiny scales.'],
 ['Raghd smiles at all the animals.','They move in different ways!']
]
WORDS='animals park rabbit hop fur fish swim scales bird fly feathers snake slither horse run sheep wool fluffy turtle shell'.split()
CLIPS={f'scene-{i:02d}-{j:02d}':line for i,pair in enumerate(SCENES,1) for j,line in enumerate(pair,1)}
CLIPS.update({f'word-{word}':word.capitalize()+'.' for word in WORDS})
CLIPS['preview']='Hello, Raghd! Let us explore how animals move and what covers their bodies!'
assert len(CLIPS)==41
def main():
 import torch
 torch.set_num_threads(2)
 pipeline=KPipeline(lang_code='a')
 for label,kvoice in VOICES.items():
  folder=OUTPUT/label
  folder.mkdir(parents=True,exist_ok=True)
  for name,words in CLIPS.items():
   output=folder/(name+'.mp3')
   if output.exists() and output.stat().st_size>800:continue
   chunks=[]
   for _,_,wave in pipeline(words,voice=kvoice,speed=1.0):
    a=np.asarray(wave,dtype=np.float32).reshape(-1)
    if a.size:chunks.extend((a,np.zeros(1700,dtype=np.float32)))
   if not chunks:raise RuntimeError('Kokoro audio missing: '+name)
   with tempfile.TemporaryDirectory() as tmp:
    wav=Path(tmp)/'clip.wav'
    sf.write(wav,np.concatenate(chunks),24000,subtype='PCM_16')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-ac','1','-ar','24000','-codec:a','libmp3lame','-b:a','64k',str(output)],check=True)
   if output.stat().st_size<=800:raise RuntimeError('Invalid MP3 '+str(output))
   print('Created',output.relative_to(ROOT),flush=True)
 expected=[OUTPUT/v/(n+'.mp3') for v in VOICES for n in CLIPS]
 assert len(expected)==123 and all(p.exists() and p.stat().st_size>800 for p in expected)
 print('Verified 123 MP3s',flush=True)
if __name__=='__main__':main()
