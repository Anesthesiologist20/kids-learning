import json,subprocess,tempfile
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro import KPipeline
root=Path(__file__).resolve().parents[1]/'aboud/healthy-eating'
jobs=json.loads((root/'audio-text.json').read_text())
pipeline=KPipeline(lang_code='a',device='cpu')
for voice in ['af_heart']:
 dest=root/'audio'/voice;dest.mkdir(parents=True,exist_ok=True)
 for name,text in jobs.items():
  out=dest/(name+'.mp3')
  if out.exists() and out.stat().st_size>1000:continue
  clips=[np.asarray(a,dtype=np.float32) for _,_,a in pipeline(text,voice=voice,speed=0.65)]
  if not clips:raise RuntimeError(name)
  with tempfile.NamedTemporaryFile(suffix='.wav') as f:
   sf.write(f.name,np.concatenate(clips),24000)
   subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f.name,'-codec:a','libmp3lame','-b:a','64k',str(out)],check=True)
  print(voice,name,flush=True)
 assert len(list(dest.glob('*.mp3')))==len(jobs)
