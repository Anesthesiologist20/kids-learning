#!/usr/bin/env python3
"""Sakinah's Journey to Space: free Kokoro Bella/Heart/Sarah MP3 generation."""
from pathlib import Path
import subprocess, tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline
ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/'experimental'/'sakinah-space-journey'/'audio'
VOICES={'bella':'af_bella','heart':'af_heart','sarah':'af_sarah'}
SCENES=[
 ['Sakinah looks through her telescope at the stars.','She dreams of a journey into space.'],
 ['She packs her space book and a small rocket toy.','Her adventure is about to begin.'],
 ['At the space center, Sakinah meets a friendly robot.','She puts on her astronaut suit.'],
 ['The rocket engines roar as the countdown ends.','Sakinah blasts off into space!'],
 ['Inside the spacecraft, everything begins to float.','Sakinah laughs in microgravity.'],
 ['Sakinah sees Earth through the window.','Our blue planet looks beautiful from orbit.'],
 ['On the Moon, Sakinah takes gentle bouncing steps.','She explores a dusty crater.'],
 ['The spacecraft passes Saturn and its amazing rings.','Sakinah spots a field of asteroids.'],
 ['In her imaginary space garden, Sakinah meets a kind alien.','She learns that friendship can begin with a smile.'],
 ['Back at home, Sakinah draws her space adventure.','She hopes to become a scientist one day.'],
]
WORDS='stars telescope dream space journey rocket planet robot astronaut launch countdown gravity float earth orbit moon crater explore saturn rings asteroids alien imaginary scientist adventure friendship'.split()
QUESTIONS=[
 'What does Sakinah use to look at the stars?',
 'What does Sakinah pack?',
 'Who meets Sakinah at the space center?',
 'What happens when the countdown ends?',
 'Why do things float inside the spacecraft?',
 'What does Sakinah see from orbit?',
 'What does Sakinah explore on the Moon?',
 'Which planet has rings?',
 'Is the alien a real discovery in this story?',
 'What does Sakinah dream of becoming?'
]
CLIPS={f'scene-{i:02d}-{j:02d}':line for i,pair in enumerate(SCENES,1) for j,line in enumerate(pair,1)}
CLIPS.update({f'word-{w}':w.title()+'.' for w in WORDS})
CLIPS.update({f'question-{i:02d}':q for i,q in enumerate(QUESTIONS,1)})
CLIPS['preview']='Hello, Sakinah! Welcome to your amazing journey into space!'
assert len(CLIPS)==57
def main():
 import torch
 torch.set_num_threads(2)
 pipeline=KPipeline(lang_code='a')
 for label,voice in VOICES.items():
  folder=OUTPUT/label
  folder.mkdir(parents=True,exist_ok=True)
  for name,line in CLIPS.items():
   dest=folder/(name+'.mp3')
   if dest.exists() and dest.stat().st_size>800:continue
   chunks=[]
   for _,_,wave in pipeline(line,voice=voice,speed=1.0):
    values=np.asarray(wave,dtype=np.float32).reshape(-1)
    if values.size:chunks.extend((values,np.zeros(1500,dtype=np.float32)))
   if not chunks:raise RuntimeError('Empty Kokoro audio: '+name)
   with tempfile.TemporaryDirectory() as temp:
    wav=Path(temp)/'voice.wav'
    sf.write(wav,np.concatenate(chunks),24000,subtype='PCM_16')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-ac','1','-ar','24000','-codec:a','libmp3lame','-b:a','64k',str(dest)],check=True)
   if dest.stat().st_size<=800:raise RuntimeError('Invalid MP3: '+str(dest))
   print('Created',dest.relative_to(ROOT),flush=True)
 expected=[OUTPUT/v/(n+'.mp3') for v in VOICES for n in CLIPS]
 assert len(expected)==171 and all(p.exists() and p.stat().st_size>800 for p in expected)
 print('PASS: 171 Sakinah Kokoro recordings generated',flush=True)
if __name__=='__main__':main()
