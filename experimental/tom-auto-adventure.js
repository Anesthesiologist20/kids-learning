/* Tom's Magic Story V3 — Auto Adventure. No browser speech synthesis. */
(function(){
"use strict";
if(typeof slides==="undefined"||typeof state==="undefined"||typeof magicImmersive!=="function"||typeof save!=="function")return;
const $id=id=>document.getElementById(id);
const zoom=$id("zoom-dialog"),frame=zoom&&zoom.querySelector(".zoom-dialog"),media=zoom&&zoom.querySelector(".zoom-media");
const foot=document.querySelector(".foot-actions"),head=zoom&&zoom.querySelector(".zoom-head");
if(!zoom||!frame||!media||!foot||!head||$id("auto-adventure-start"))return;
const prompts=[
 {q:"Which word means EVERY TIME?",a:"always"},
 {q:"Tom brushes his teeth every day. He ____ brushes them.",a:"always"},
 {q:"Which word means MOST DAYS?",a:"usually"},
 {q:"Tom listens in class on most days. He ____ listens.",a:"usually"},
 {q:"Which word means ON SOME DAYS?",a:"sometimes"},
 {q:"Tom does homework on most school days. He ____ does it.",a:"usually"},
 {q:"Which word means ON SOME DAYS?",a:"sometimes"},
 {q:"Which word means NOT AT ANY TIME?",a:"never"}
];
const wordKeys=["always","usually","sometimes","never"];
const make=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n};
const btn=(className,text,onClick)=>{const b=make("button",className,text);b.type="button";b.addEventListener("click",onClick);return b};
const enterBtn=btn("btn green","🚀 Auto Adventure",startAdventure);enterBtn.id="auto-adventure-start";
enterBtn.title="Listen, answer, collect stars, and move to the next scene automatically.";
foot.append(enterBtn);
const zoomEntry=btn("magic-mini","🚀 Auto Adventure",startAdventure);zoomEntry.id="auto-adventure-zoom";
head.insertBefore(zoomEntry,$id("close-zoom"));
const control=make("div","auto-control");control.id="auto-control";control.hidden=true;
const step=make("span","auto-step","🚀 Auto Adventure · 1/8");
const info=make("span","auto-info","Listen to the story!");
info.setAttribute("aria-live","polite");
const controls=make("div","auto-buttons");
const pauseBtn=btn("magic-mini","⏸ Pause",togglePause);
const replayBtn=btn("magic-mini","🔁 Hear Again",replayScene);
const nextQuestionBtn=btn("magic-mini","📖 Go to Question",presentQuestion);
const quitBtn=btn("magic-mini auto-exit","✕ Exit",()=>stopAdventure(true));
nextQuestionBtn.hidden=true;
controls.append(pauseBtn,replayBtn,nextQuestionBtn,quitBtn);
control.append(step,info,controls);
head.insertAdjacentElement("afterend",control);
const card=make("section","auto-question");card.id="auto-question";card.hidden=true;
card.setAttribute("aria-label","Auto Adventure question");
const qLabel=make("span","auto-question-label","🎯 QUICK CHALLENGE");
const question=make("h2","auto-question-title","");
const options=make("div","auto-choices");
const feedback=make("p","auto-feedback","");
feedback.setAttribute("aria-live","polite");
card.append(qLabel,question,options,feedback);
media.append(card);
const finale=make("section","auto-finale");finale.id="auto-finale";finale.hidden=true;
const trophy=make("div","auto-trophy","🏆✨");
const finalTitle=make("h2","","Super Adventurer!");
const finalMessage=make("p","","");
const finalActions=make("div","auto-finale-actions");
finalActions.append(
 btn("btn green","🔄 Play Again",()=>{stopAdventure(false);startAdventure(0)}),
 btn("btn secondary","📚 Review Words",()=>{stopAdventure(true);}),
 btn("btn secondary","🏅 My Badges",()=>{
  stopAdventure(true);
  const b=$id("extra-main-map");if(b)b.scrollIntoView({block:"start",behavior:"smooth"});
 }));
finale.append(trophy,finalTitle,finalMessage,finalActions);media.append(finale);
let active=false,phase="off",resumePhase="reading",token=0,timeout=null,internalNavigation=false;
let runAnswered=0,runFirstTry=0,runStartedAt=0;
let incorrectScenes=new Set();
let currentAudio=null;
function clearTimeoutSafe(){if(timeout!==null){clearTimeout(timeout);timeout=null;}}
function cancelPending(){token++;clearTimeoutSafe();stop();currentAudio=null;}
function hideOverlays(){
 card.hidden=true;finale.hidden=true;
 if($id("magic-challenge"))$id("magic-challenge").hidden=true;
 if($id("magic-review-pane"))$id("magic-review-pane").hidden=true;
 if($id("magic-finale"))$id("magic-finale").hidden=true;
 zoom.querySelectorAll(".magic-extra-pane").forEach(p=>p.hidden=true);
}
function navigate(n){internalNavigation=true;try{slide(n)}finally{internalNavigation=false;}}
function setMessage(message){info.textContent=message;}
function updateUi(){
 const visible=active;
 control.hidden=!visible;
 frame.classList.toggle("auto-active",visible);
 step.textContent="🚀 Auto Adventure · "+Math.min(current+1,8)+"/8 · ⭐ "+state.done.length+"/8";
 pauseBtn.textContent=phase==="paused"?"▶ Resume":"⏸ Pause";
 pauseBtn.disabled=phase==="finished";
 replayBtn.disabled=phase==="finished";
 nextQuestionBtn.hidden=phase!=="reading";
 zoomEntry.hidden=visible;
 enterBtn.textContent=visible?"🚀 Adventure Playing":"🚀 Auto Adventure";
}
function stopAdventure(showStatus){
 if(!active)return;
 active=false;phase="off";cancelPending();hideOverlays();frame.classList.remove("auto-active");
 control.hidden=true;zoomEntry.hidden=false;
 enterBtn.textContent="🚀 Auto Adventure";
 if(showStatus)status("⭐ Adventure stopped. Your stars and progress are saved.");
}
function startAdventure(startAt){
 if(active)stopAdventure(false);
 if(!zoom.classList.contains("show"))magicImmersive();
 else frame.classList.remove("focus-mode");
 hideOverlays();
 const scene=Number.isInteger(startAt)?startAt:(current===8?0:current);
 runStartedAt=scene;runAnswered=0;runFirstTry=0;incorrectScenes=new Set();
 active=true;phase="reading";resumePhase="reading";
 navigate(Math.max(0,Math.min(7,scene)));updateUi();
 readScene();
}
function audioUnavailable(){
 if(!active||phase!=="reading")return;
 nextQuestionBtn.hidden=false;
 setMessage("🔊 Audio unavailable? Tap Hear Again or Go to Question.");
}
function readScene(){
 if(!active)return;
 cancelPending();hideOverlays();
 phase="reading";resumePhase="reading";
 updateUi();setMessage("👂 Listen to the teacher, then answer!");
 const scene=current,serial=token;
 const audioName="scene-"+String(scene+1).padStart(2,"0");
 try{play(audioName)}catch{audioUnavailable();return;}
 const audio=playing;
 if(!audio){audioUnavailable();return;}
 currentAudio=audio;
 audio.addEventListener("ended",()=>{
  if(!active||phase!=="reading"||token!==serial||scene!==current||currentAudio!==audio)return;
  setMessage("⭐ Great listening! Ready for a question?");
  timeout=setTimeout(()=>{timeout=null;if(active&&phase==="reading"&&token===serial)presentQuestion()},550);
 },{once:true});
 audio.addEventListener("error",()=>{if(active&&token===serial&&phase==="reading")audioUnavailable()},{once:true});
 timeout=setTimeout(()=>{
  timeout=null;
  if(!active||phase!=="reading"||token!==serial)return;
  if(audio.error||(audio.paused&&audio.currentTime===0))audioUnavailable();
 },2100);
}
function shuffle(array){
 const items=array.slice();
 for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
 return items;
}
function presentQuestion(){
 if(!active||current>7||phase==="finished")return;
 cancelPending();phase="question";resumePhase="question";
 card.hidden=false;finale.hidden=true;updateUi();
 setMessage("🎯 Choose the correct answer to win your star!");
 const prompt=prompts[current];
 question.textContent=prompt.q;feedback.textContent="";
 const fragment=document.createDocumentFragment();
 shuffle(wordKeys).forEach(word=>{
  const option=btn("auto-choice",word,()=>selectAnswer(word,option));
  fragment.append(option);
 });
 options.replaceChildren(fragment);
}
function selectAnswer(word,button){
 if(!active||phase!=="question")return;
 const scene=current,prompt=prompts[scene];
 if(word!==prompt.a){
  incorrectScenes.add(scene);
  button.classList.add("wrong");
  feedback.textContent="💡 Try again! Look for the word that matches the clue.";
  return;
 }
 phase="transition";cancelPending();
 button.classList.add("correct");
 options.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.textContent===prompt.a)b.classList.add("correct");});
 runAnswered++;if(!incorrectScenes.has(scene))runFirstTry++;
 feedback.textContent="✅ Great job! You earned a star! 🌟";
 setMessage("🌟 Well done! Next scene is coming…");
 const alreadyDone=state.done.includes(scene);
 if([1,3,5,7].includes(scene))state.challenges[scene]=true;
 if(!alreadyDone){internalNavigation=true;try{$id("mark").click()}finally{internalNavigation=false;}}
 else magicBurst("🌟");
 state.autoAdventureLastScene=scene;save();
 magicSync();updateUi();
 const serial=token;
 timeout=setTimeout(()=>{
  timeout=null;if(!active||phase!=="transition"||serial!==token)return;
  advance();
 },1250);
}
function advance(){
 if(!active)return;
 card.hidden=true;
 if(current>=7){finishAdventure();return;}
 navigate(current+1);readScene();
}
function finishAdventure(){
 if(!active)return;
 cancelPending();phase="finished";resumePhase="reading";
 navigate(8);hideOverlays();
 state.autoAdventureCompleted=state.done.length>=8;
 state.autoAdventureBest=Math.max(Number(state.autoAdventureBest)||0,runFirstTry);
 save();magicSync();
 $id("magic-finale").hidden=true;
 finale.hidden=false;
 updateUi();
 const label=runStartedAt>0?"You completed the last "+runAnswered+" scenes!":"You finished Tom's Magic Story!";
 finalMessage.textContent=label+" ⭐ "+runAnswered+" scenes practiced in this adventure. 🎯 "+runFirstTry+" correct on the first try. Your progress is saved!";
 setMessage("🏆 Adventure complete!");
 if(!state.muteCelebration)magicChime();
}
function togglePause(){
 if(!active||phase==="finished")return;
 if(phase==="paused"){
  phase=resumePhase;updateUi();
  if(phase==="question")presentQuestion();
  else if(phase==="transition")advance();
  else readScene();
  return;
 }
 resumePhase=phase;cancelPending();phase="paused";
 setMessage("⏸ Paused. Your progress is safe.");updateUi();
 card.classList.add("auto-question-paused");
}
function replayScene(){
 if(!active||phase==="finished")return;
 card.classList.remove("auto-question-paused");
 readScene();
}
const previousSlide=slide;
slide=function(n){
 if(active&&!internalNavigation)stopAdventure(true);
 return previousSlide(n);
};
const previousCloseZoom=closeZoom;
closeZoom=function(){if(active)stopAdventure(false);return previousCloseZoom()};
$id("close-zoom").addEventListener("click",()=>stopAdventure(false));
zoom.addEventListener("click",e=>{
 if(e.target===zoom&&active)stopAdventure(false);
});
document.addEventListener("fullscreenchange",()=>{
 if(active&&!zoom.classList.contains("show"))stopAdventure(false);
});
document.addEventListener("keydown",event=>{
 if(event.key==="Escape"&&active&&!$id("word-dialog").classList.contains("show"))stopAdventure(false);
},true);
updateUi();
})();