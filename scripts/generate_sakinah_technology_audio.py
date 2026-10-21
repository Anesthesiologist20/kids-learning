from pathlib import Path
import subprocess
import tempfile
import soundfile as sf
import numpy as np
from kokoro import KPipeline

STORIES = [
 ["Hi Sara,","How are you?","I went to a technology museum yesterday.","I saw a big robot next to the door.","It was amazing and very smart.","The robot could talk and dance.","I played with a small robot on the table.","It was a fun day!","Do you like robots?","Your friend, Sakinah"],
 ["Hi Sara,","How are you?","Yesterday, I went to a technology store.","I saw a beautiful smart watch on the table.","It was small and pink.","It can tell the time and count my steps.","I really liked it!","Do you have a smart watch?","Your friend, Sakinah"]
]
VOICES={"bella":"af_bella","heart":"af_heart","sarah":"af_sarah"}
pipeline=KPipeline(lang_code="a")
for folder,voice in VOICES.items():
    target=Path("sakinah/audio/kokoro")/folder
    target.mkdir(parents=True,exist_ok=True)
    for story_num,lines in enumerate(STORIES,1):
        for i,line in enumerate(lines,1):
            out=target/f"technology-email-{story_num}-{i:02d}.mp3"
            if out.exists() and out.stat().st_size>1000:
                print("skip",out)
                continue
            chunks=[audio for _,_,audio in pipeline(line,voice=voice,speed=1.0)]
            if not chunks:
                raise RuntimeError(f"No speech generated for {out}")
            data=np.concatenate([np.asarray(chunk) for chunk in chunks])
            with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
                sf.write(tmp.name,data,24000)
                subprocess.run(["ffmpeg","-nostdin","-y","-loglevel","error","-i",tmp.name,"-codec:a","libmp3lame","-qscale:a","5",str(out)],check=True)
            if out.stat().st_size<1000: raise RuntimeError(f"Bad audio {out}")
            print(out, out.stat().st_size)
