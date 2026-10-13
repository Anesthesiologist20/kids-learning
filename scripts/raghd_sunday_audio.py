#!/usr/bin/env python3
"""Generate the stable ElevenLabs MP3 clips for Raghd's Sunday assessment."""
import json, os, pathlib, time, urllib.request, urllib.error
VOICE_ID="WQhVGGVQ8EhNpBYHFE8c"  # Layla - Buttery smooth, calm & versatile (English American)
CLIPS={
"intro":"Hello Raghd! Let's practice together for your Sunday assessment.",
"letter-name":"This is capital N and small n. The letter N.",
"letter-sound":"N says nnn. Nnn, nnn, nest!",
"word-nest":"Nest. N is for nest.",
"word-nose":"Nose. N is for nose.",
"word-net":"Net. N is for net.",
"word-nurse":"Nurse. N is for nurse.",
"word-nut":"Nut. N is for nut.",
"word-nine":"Nine. N is for nine.",
"living":"Living things.",
"nonliving":"Non-living things.",
"can-move":"Living things can move.",
"can-grow":"Living things can grow.",
"can-eat":"Living things can eat and drink.",
"can-breathe":"Living things can breathe.",
"can-feel":"Living things can feel.",
"can-babies":"Animals can give birth or lay eggs.",
"need-food":"Living things need food.",
"need-water":"Living things need water.",
"need-home":"Living things need a home.",
"number-1":"One.",
"number-2":"Two.",
"number-3":"Three.",
"number-4":"Four.",
"number-5":"Five.",
"number-6":"Six.",
"question-living":"Look at the picture. Is it living or non-living?",
"question-letters":"Which one is the letter N?",
"question-count":"Count the pictures. What number do you see?",
"say-first":"Look, think, and say the answer out loud. Then tap to check!",
"great":"Well done, Raghd! Keep going!",
"try-again":"Good try. Let's practice one more time.",
"finish":"Amazing work, Raghd! You are ready for your assessment!"
}
def generate(name,phrase,key):
    out=pathlib.Path("raghd/audio/sunday-"+name+".mp3")
    data=json.dumps({"text":phrase,"model_id":"eleven_multilingual_v2","voice_settings":{"stability":0.55,"similarity_boost":0.78,"style":0.12,"speed":0.86,"use_speaker_boost":True}}).encode()
    for attempt in range(3):
        req=urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/"+VOICE_ID+"?output_format=mp3_44100_128",data=data,headers={"xi-api-key":key,"Content-Type":"application/json","Accept":"audio/mpeg"},method="POST")
        try:
            with urllib.request.urlopen(req,timeout=95) as response: raw=response.read()
            if len(raw)<700 or not(raw[:3]==b"ID3" or (len(raw)>2 and raw[0]==255 and raw[1]&224==224)):
                raise ValueError("Invalid MP3")
            out.write_bytes(raw);print("Generated",out,len(raw),flush=True);return
        except (urllib.error.URLError,ValueError) as exc:
            if attempt==2:raise RuntimeError("Failed "+name+": "+str(exc)) from exc
            time.sleep(3+4*attempt)
def main():
    key=os.environ.get("ELEVENLABS_API_KEY","").strip()
    if not key:raise SystemExit("Missing ELEVENLABS_API_KEY Actions secret")
    print("Replacing all 33 previous recordings with English Layla, not Amy Cartwright.",flush=True)
    pathlib.Path("raghd/audio").mkdir(parents=True,exist_ok=True)
    for name,phrase in CLIPS.items():generate(name,phrase,key)
    print("Ready: "+str(len(CLIPS))+" audio clips",flush=True)
if __name__=="__main__":main()

# Touch trigger: republish Sunday clips with safe rebase on GitHub Actions.
