"use strict";
const $ = id => document.getElementById(id);
const $$ = q => Array.from(document.querySelectorAll(q));
const STORE = "sakinah-elsa-page62-v1";
let state;
try {state = JSON.parse(localStorage.getItem(STORE)) || {};} catch {state = {};}
state.voice = state.voice === "heart" ? "heart" : "bella";
state.speed = state.speed === "slow" ? "slow" : "extra";
state.answers = state.answers || {};
state.ready = state.ready || {};
state.section = state.section || "p1";
const save = () => {try {localStorage.setItem(STORE, JSON.stringify(state));} catch {}};
let lesson, lines=[], current=0, currentView="words", glossary=null, vocab=new Map(), matcher=null, audio = new Audio(), playToken=0;
let recording=null, recorded=new Map(), ownPlaying=null, dbPromise;
function button(label, cls) {let b=document.createElement("button");b.type="button";b.textContent=label;b.className=cls||"";return b;}
function make(tag, cls, content) {let e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e;}
function slug(t) {return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function persist() {save();}
function audioPath(item) {
 if(item.word) {
   if(item.word.src) return "../monday-inventions/audio/"+state.voice+"/word-"+item.word.src+".mp3";
   return "audio/"+state.voice+"/word-"+slug(item.word.term)+".mp3";
 }
 const id=item.line.id + (item.part===undefined?"":"-"+(item.part+1));
 return "audio/"+state.voice+"/"+id+".mp3";
}
function stopSound() {
 playToken++;
 audio.pause();
 audio.removeAttribute("src");
 ownPlaying?.pause();
 ownPlaying=undefined;
 $$("#reading-sentence .chunk").forEach(e=>e.classList.remove("on"));
 $("now-playing").hidden=true;
}
function listen(items, label, target) {
 if(recording) {$("media-status").textContent="Stop your recording first.";return;}
 stopSound();
 if(!items.length)return;
 const token=playToken, rate=state.speed==="extra" ? 0.76 : 0.93;
 let index=0;
 $("now-playing").hidden=false;
 function step(){
  if(token!==playToken)return;
  if(index===items.length){$("now-playing").hidden=true;return;}
  const item=items[index++], src=audioPath(item);
  $("now-text").textContent=state.voice.toUpperCase()+" · "+label+" · "+index+"/"+items.length;
  $$("#reading-sentence .chunk").forEach(e=>e.classList.remove("on"));
  if(item.line && lines[current] && lines[current].id===item.line.id && item.part!==undefined){
   const span=$('#reading-sentence [data-part="'+item.part+'"]');
   if(span) span.classList.add("on");
  }
  audio.src=src;
  audio.preservesPitch=true;
  if("webkitPreservesPitch" in audio) audio.webkitPreservesPitch=true;
  audio.playbackRate=rate;
  audio.onended=()=>{if(token===playToken)setTimeout(step,270)};
  audio.onerror=()=>failed();
  audio.play().catch(failed);
 }
 function failed(){
  if(token!==playToken)return;
  stopSound();
  const text="This Bella/Heart recording is not available yet. Other lesson activities still work.";
  if(target)target.textContent=text; else $("media-status").textContent=text;
 }
 step();
}
function getWord(term) {return vocab.get(term.toLowerCase());}
function rich(text) {
 const fragment=document.createDocumentFragment();
 if(!matcher){fragment.append(document.createTextNode(text));return fragment;}
 let from=0;
 for(const match of text.matchAll(matcher)) {
  fragment.append(document.createTextNode(text.slice(from,match.index)));
  const word=make("button","hotword",match[0]);
  word.type="button";word.dataset.word=match[0];word.setAttribute("aria-label","Meaning of "+match[0]);
  fragment.append(word);from=match.index+match[0].length;
 }
 fragment.append(document.createTextNode(text.slice(from)));
 return fragment;
}
function openGloss(surface) {
 const entry=getWord(surface);if(!entry)return;
 glossary=entry;
 $("gloss-title").textContent=surface;
 $("gloss-en").textContent=entry.en;
 $("gloss-ar").textContent=entry.ar;
 $("gloss-status").textContent="";
 $("gloss").showModal();
}
function wordCard(word, core) {
 const c=make("article","vocab-card"+(core?" featured":""));
 c.append(make("div","vocab-word",word.term),make("p","vocab-en",word.en),make("div","vocab-ar",word.ar));
 const actions=make("div","vocab-controls"), sound=button("🔊 Listen","sound-btn");
 sound.addEventListener("click",()=>listen([{word}],word.term,$("gloss-status")));
 const tag=make("span","source-tag",core?"★ BOOK WORD":"STORY WORD");
 actions.append(sound,tag);c.append(actions);
 c.addEventListener("click",event=>{if(event.target.closest("button"))return;openGloss(word.term)});
 c.style.cursor="pointer";
 return c;
}
function showWords() {
 $("core-words").replaceChildren(...lesson.words.filter(w=>w.src).map(w=>wordCard(w,true)));
 $("extra-words").replaceChildren(...lesson.words.filter(w=>!w.src).map(w=>wordCard(w,false)));
}
function selectView(view) {
 if(!["words","read","whole","quiz"].includes(view))return;
 currentView=view;
 $$("#study [data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===view)));
 for(let id of ["words","read","whole","quiz"])$(id).hidden=id!==view;
 stopSound();
 if(recording)stopRecord();
 if(view==="read")showLine(current,false);
 window.scrollTo({top:Math.max(0,$("study").offsetTop-14),behavior:"smooth"});
}
function showLine(index, scroll=true) {
 if(index<0||index>=lines.length)return;
 current=index;let line=lines[index];
 $("section-title").textContent=line.section.label;
 $("section-caption").textContent=line.section.id==="intro"?"ELSA'S FILE · 2036":"STUDENT'S BOOK · PAGE 62";
 $("counter").textContent=(current+1)+" / "+lines.length;
 $("reading-sentence").replaceChildren();
 line.parts.forEach((t,i)=>{if(i)$("reading-sentence").append(document.createTextNode(" "));const span=make("span","chunk");span.dataset.part=i;span.append(rich(t));$("reading-sentence").append(span)});
 const parts=$("parts");parts.replaceChildren();
 line.parts.forEach((part,i)=>{
  const b=button("","part-btn");
  b.append(make("strong","",String(i+1).padStart(2,"0")),make("span","",part));
  b.addEventListener("click",()=>listen([{line,part:i}],"Part "+(i+1),$("media-status")));
  parts.append(b);
 });
 $$("[data-section]").forEach(b=>b.setAttribute("aria-current",String(b.dataset.section===line.section.id)));
 $("prev").disabled=index===0;$("next").disabled=index===lines.length-1;
 $("mark-ready").setAttribute("aria-pressed",String(Boolean(state.ready[line.id])));
 $("mark-ready").textContent=state.ready[line.id]?"✓ Ready for class":"✓ Mark ready";
 $("media-status").textContent="Listen first, then record your own reading.";
 stopSound();
 loadOwnRecording(line.id).then(blob=>{if(lines[current].id!==line.id)return;const okay=!!blob;$("replay-line").disabled=!okay;if(okay)$("media-status").textContent="Your recorded voice is saved. Tap My voice."});
 state.line=line.id;state.section=line.section.id;persist();
 if(scroll)document.querySelector(".reading-card").scrollIntoView({behavior:"smooth",block:"start"});
}
function buildContents(){
 const root=$("section-buttons");root.replaceChildren();
 lesson.sections.forEach(section=>{
  const b=button(section.label);b.dataset.section=section.id;
  b.addEventListener("click",()=>showLine(lines.findIndex(x=>x.section.id===section.id)));
  root.append(b);
 });
}
function buildWhole(){
 const root=$("whole-text");root.replaceChildren();
 lesson.sections.forEach(section=>{
  const block=make("section","full-section");
  const header=make("h3","",section.label);
  const listenSection=button("🔊 Listen to section","small-action");
  listenSection.addEventListener("click",()=>listen(lines.filter(l=>l.section.id===section.id).flatMap(l=>l.parts.map((_,i)=>({line:l,part:i}))),section.label));
  block.append(header,listenSection);
  section.lines.forEach(base=>{
   const l=lines.find(x=>x.id===base.id);
   const p=make("div","full-line");
   l.parts.forEach((part,i)=>{if(i)p.append(document.createTextNode(" "));p.append(rich(part))});
   const practice=button("Practise →");
   practice.addEventListener("click",()=>{selectView("read");showLine(lines.indexOf(l))});
   p.append(practice);block.append(p);
  });root.append(block);
 });
}
function choiceOrder(i) {
 const shift=(i*7+2)%3;
 return [0,1,2].map(j=>(j+shift)%3);
}
let wrongOnly=false;
function renderScore(){
 const answered=Object.keys(state.answers).filter(k=>lesson.quiz[Number(k)]).length;
 let correct=lesson.quiz.reduce((n,q,i)=>n+(state.answers[i]===q.c?1:0),0);
 const stars=correct>=12?3:correct>=8?2:correct>=4?1:0;
 $("scorebar").innerHTML="";
 $("scorebar").append(make("strong","",correct+" / "+lesson.quiz.length+" correct · "+answered+" answered"),make("span","medal","⭐".repeat(stars)+"☆".repeat(3-stars)));
}
function buildQuiz(){
 const root=$("questions");root.replaceChildren();
 lesson.quiz.forEach((q,i)=>{
  const chosen=state.answers[i], wrong=chosen!==undefined&&chosen!==q.c;
  if(wrongOnly&&!wrong)return;
  const card=make("article","quiz-card");
  card.append(make("h3","",(i+1)+". "+q.q));
  const choices=make("div","choices");
  for(const original of choiceOrder(i)){
   const b=button(q.a[original],"choice"+(chosen===original?" chosen":""));
   b.addEventListener("click",()=>{state.answers[i]=original;persist();buildQuiz();renderScore()});
   choices.append(b);
  }
  card.append(choices);
  if(chosen!==undefined){
   const right=chosen===q.c;
   card.append(make("p","feedback "+(right?"right":"wrong"),(right?"✓ Correct! ":"✗ Try again. ")+q.why));
  }
  root.append(card);
 });
 if(!root.children.length)root.append(make("p","head-note",wrongOnly?"No mistakes to review. Great work!":"No questions."));
 renderScore();
}
function openDb(){
 if(!("indexedDB" in window))return Promise.reject(new Error("Unavailable"));
 if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
  const request=indexedDB.open("sakinah-elsa-recordings-v1",1);
  request.onupgradeneeded=()=>request.result.createObjectStore("clips");
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
 return dbPromise;
}
async function loadOwnRecording(id){
 if(recorded.has(id))return recorded.get(id);
 try {const db=await openDb();const blob=await new Promise((resolve,reject)=>{
  const r=db.transaction("clips").objectStore("clips").get(id);
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
 });if(blob)recorded.set(id,blob);return blob;}catch{return null}
}
async function storeRecording(id,blob){
 recorded.set(id,blob);
 try{const db=await openDb();await new Promise((resolve,reject)=>{
  const tx=db.transaction("clips","readwrite");
  tx.objectStore("clips").put(blob,id);
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
 });}catch{$("media-status").textContent="Recording works now; this browser could not save it for another session.";}
}
async function stopRecord() {
 if(!recording)return;
 const rec=recording;recording=null;
 if(rec.timer)clearInterval(rec.timer);
 $("record-line").textContent="🎙️ Record";
 if(rec.rec.state!=="inactive")rec.rec.stop();
}
async function recordLine() {
 if(recording){stopRecord();return;}
 stopSound();
 if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){
  $("media-status").textContent="Microphone recording needs Chrome or Safari with microphone access.";return;
 }
 const id=lines[current].id;
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const types=["audio/webm;codecs=opus","audio/mp4","audio/webm"];
  const type=types.find(t=>MediaRecorder.isTypeSupported(t));
  const rec=new MediaRecorder(stream,type?{mimeType:type}:undefined),chunks=[];
  recording={rec,id,stream};
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  rec.onstop=async()=>{
   stream.getTracks().forEach(t=>t.stop());
   if(!chunks.length)return;
   const blob=new Blob(chunks,{type:rec.mimeType||chunks[0].type});
   await storeRecording(id,blob);
   if(lines[current].id===id){$("replay-line").disabled=false;$("media-status").textContent="Saved! Tap My voice to hear yourself.";}
  };
  rec.start();
  $("record-line").textContent="■ Stop recording";
  $("media-status").textContent="Recording… Read aloud, then press Stop.";
 }catch(err){$("media-status").textContent=err.name==="NotAllowedError"?"Allow the microphone in your browser settings.":"Microphone unavailable."}
}
async function replayOwn(){
 stopSound();
 const id=lines[current].id, blob=await loadOwnRecording(id);
 if(!blob)return;
 const url=URL.createObjectURL(blob);
 const player=new Audio(url);ownPlaying=player;
 player.onended=()=>{URL.revokeObjectURL(url);ownPlaying=undefined};
 player.onerror=()=>{URL.revokeObjectURL(url);ownPlaying=undefined};
 $("media-status").textContent="Playing your reading…";
 player.play().catch(()=>{$("media-status").textContent="Could not replay your recording.";URL.revokeObjectURL(url)});
}
function events(){
 $$("#study [data-view]").forEach(b=>b.addEventListener("click",()=>selectView(b.dataset.view)));
 $$("#study [data-voice]").forEach(b=>b.addEventListener("click",()=>{
  state.voice=b.dataset.voice;persist();
  $$("#study [data-voice]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.voice===state.voice)));
  stopSound();
 }));
 $$("#study [data-speed]").forEach(b=>b.addEventListener("click",()=>{
  state.speed=b.dataset.speed;persist();
  $$("#study [data-speed]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.speed===state.speed)));
  stopSound();
 }));
 $("start-read").addEventListener("click",()=>selectView("read"));
 $("prev").addEventListener("click",()=>showLine(current-1));
 $("next").addEventListener("click",()=>showLine(current+1));
 $("mark-ready").addEventListener("click",()=>{const id=lines[current].id;state.ready[id]=!state.ready[id];persist();showLine(current,false)});
 $("listen-line").addEventListener("click",()=>listen([{line:lines[current]}],"ELSA reading",$("media-status")));
 $("record-line").addEventListener("click",recordLine);
 $("replay-line").addEventListener("click",replayOwn);
 $("listen-all").addEventListener("click",()=>listen(lines.filter(l=>l.section.id!=="intro").flatMap(l=>l.parts.map((_,i)=>({line:l,part:i}))),"Whole page"));
 $("stop-audio").addEventListener("click",stopSound);
 $("wrong-only").addEventListener("click",()=>{wrongOnly=!wrongOnly;$("wrong-only").textContent=wrongOnly?"Show all questions":"Review mistakes";buildQuiz()});
 $("reset-quiz").addEventListener("click",()=>{state.answers={};wrongOnly=false;$("wrong-only").textContent="Review mistakes";persist();buildQuiz()});
 document.addEventListener("click",e=>{const target=e.target.closest("[data-word]");if(target)openGloss(target.dataset.word)});
 $("close-gloss").addEventListener("click",()=>$("gloss").close());
 $("gloss").addEventListener("click",e=>{if(e.target===$("gloss"))$("gloss").close()});
 $("say-gloss").addEventListener("click",()=>{if(glossary)listen([{word:glossary}],glossary.term,$("gloss-status"))});
 $("gloss").addEventListener("close",stopSound);
 window.addEventListener("pagehide",()=>{stopSound();if(recording)stopRecord()});
}
async function main(){
 const r=await fetch("lesson.json",{cache:"no-cache"});
 if(!r.ok)throw new Error("Lesson data unavailable");
 lesson=await r.json();
 lines=lesson.sections.flatMap(section=>section.lines.map(line=>({...line,section})));
 for(const entry of lesson.words){
  vocab.set(entry.term.toLowerCase(),entry);
  for(const form of entry.forms||[])vocab.set(form.toLowerCase(),entry);
 }
 matcher=new RegExp("\\b("+Array.from(vocab.keys()).sort((a,b)=>b.length-a.length).join("|")+")\\b","gi");
 showWords();buildContents();buildWhole();buildQuiz();events();
 $$("#study [data-voice]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.voice===state.voice)));
 $$("#study [data-speed]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.speed===state.speed)));
 current=Math.max(0,lines.findIndex(l=>l.id===state.line));
 if(!state.line)current=lines.findIndex(l=>l.id==="p1a");
 showLine(current,false);
 $("load-msg").hidden=true;
 selectView("words");
}
main().catch(e=>{$("load-msg").textContent="Could not load the lesson. Please refresh this page. ("+e.message+")";});
