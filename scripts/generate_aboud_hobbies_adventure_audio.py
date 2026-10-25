#!/usr/bin/env python3
from pathlib import Path
import subprocess,tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline
BASE=Path(__file__).resolve().parents[1]; OUT=BASE/'experimental'/'aboud-hobbies-adventure'/'audio'
VOICES={'bella':'af_bella','heart':'af_heart','sarah':'af_sarah'}
SCENES=[
["Aboud wakes up on Saturday.","He is excited to try his favorite hobbies."],
["First, Aboud plays football with his friends.","He kicks the ball and scores a goal!"],
["Next, Aboud puts on his helmet.","He rides his blue bike along a safe path."],
["At the park, Aboud meets more children.","They take turns on the swings."],
["After lunch, Aboud builds a tall tower with colorful blocks.","He loves to create new things."],
["Aboud draws a sunny park and paints it with bright colors.","He feels proud of his picture."],
["Later, Aboud plays a fun game with his cousins.","They laugh and help one another."],
["At sunset, Aboud smiles.","Football, cycling, drawing, and playing with friends make his day special!"]]
WORDS="hobby football friends kick goal helmet bike ride park children turns swings build blocks tower draw paint colors game cousins laugh cycling favorite proud create".split()
QUESTIONS=["What is Aboud excited to do?","What does Aboud kick?","What does Aboud wear to ride safely?","What do the children do?","What does Aboud build?","What does Aboud paint?","Who plays with Aboud?","What makes Aboud happy?"]
CLIPS={f"scene-{i:02}-{j:02}":line for i,pair in enumerate(SCENES,1) for j,line in enumerate(pair,1)}
CLIPS.update({f"word-{w}":w+"." for w in WORDS})
CLIPS.update({f"question-{i:02}":q for i,q in enumerate(QUESTIONS,1)})
CLIPS['preview']="Hello, Aboud! Let us discover your amazing hobbies!"
assert len(CLIPS)==50
def main():
 import torch
 torch.set_num_threads(2)
 pipe=KPipeline(lang_code='a')
 for name,voice in VOICES.items():
  folder=OUT/name;folder.mkdir(parents=True,exist_ok=True)
  for key,phrase in CLIPS.items():
   target=folder/(key+'.mp3')
   if target.exists() and target.stat().st_size>800:continue
   chunks=[]
   for _,_,wave in pipe(phrase,voice=voice,speed=1):
    a=np.asarray(wave,dtype=np.float32).reshape(-1)
    if a.size:chunks.extend((a,np.zeros(1400,dtype=np.float32)))
   if not chunks:raise RuntimeError('No audio for '+key)
   with tempfile.TemporaryDirectory() as tmp:
    wav=Path(tmp)/'clip.wav';sf.write(wav,np.concatenate(chunks),24000,subtype='PCM_16')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(target)],check=True)
   if target.stat().st_size<800:raise RuntimeError('Bad MP3 '+str(target))
 expected=[OUT/v/(k+'.mp3') for v in VOICES for k in CLIPS]
 assert len(expected)==150 and all(p.exists() and p.stat().st_size>800 for p in expected)
 print('Verified 150 clips')
if __name__=='__main__':main()
