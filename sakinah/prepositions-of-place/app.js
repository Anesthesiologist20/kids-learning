"use strict";

const byId = id => document.getElementById(id);
const activity = byId("activity");
const player = byId("player");
const storageKey = "sakinah.prepositions-of-place.v1";
const speeds = {extra: {label:"Extra slow", rate:.66}, slow: {label:"Slow", rate:.83}, normal: {label:"Normal", rate:1}};
const tints = ["#f4e5b9", "#e1ead7", "#f2ddcd", "#dde9e1", "#f5e7c6", "#dde6e4", "#efdfcc"];
const roundKeys = Object.keys(placeRounds);
const own = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key);
function safeIndex(value,length) { return Number.isInteger(value) && value >= 0 && value < length ? value : 0; }
function freshRound() { return {index:0, answers:{}, flags:{}, finished:false}; }
function readState() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { saved = {}; }
  const state = {
    word:safeIndex(saved.word,placeWords.length), example:0, arabic:saved.arabic === true,
    voice:saved.voice === "bella" ? "bella" : "heart",
    speed:own(speeds,saved.speed) ? saved.speed : "slow",
    route:typeof saved.route === "string" ? saved.route : "learn", rounds:{}
  };
  state.example = safeIndex(saved.example,placeWords[state.word].examples.length);
  for (const key of roundKeys) {
    const raw = saved.rounds?.[key] || {};
    const round = freshRound();
    const qs = placeRounds[key].questions;
    round.index = safeIndex(raw.index,qs.length);
    round.finished = raw.finished === true;
    for (const q of qs) {
      if (q.options.includes(raw.answers?.[q.id])) round.answers[q.id] = raw.answers[q.id];
      if (raw.flags?.[q.id] === true) round.flags[q.id] = true;
    }
    state.rounds[key] = round;
  }
  return state;
}
const state = readState();
function save() {
  try { localStorage.setItem(storageKey,JSON.stringify(state)); } catch { /* The current session still works. */ }
}
const icon = (id) => '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-'+id+'"/></svg>';
function esc(text) {
  return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
const titleCase = text => text[0].toUpperCase() + text.slice(1);
let mode = "learn", activeRound = "", reviewing = false, missedOnly = false, activeClip = "", audioTicket = 0, noticeTimer;
function showNotice(message) {
  clearTimeout(noticeTimer);
  byId("notice").textContent = message;
  noticeTimer = setTimeout(()=>{byId("notice").textContent="";},3500);
}

function audioButton(clip,label) {
  return '<button type="button" class="audio-link audio-trigger" data-audio="'+clip+'" aria-pressed="false">'+icon("sound")+esc(label)+'</button>';
}
function updateAudioButtons() {
  document.querySelectorAll(".audio-trigger").forEach(button => {
    const active = !!activeClip && button.dataset.audio === activeClip;
    button.classList.toggle("playing",active);
    button.setAttribute("aria-pressed",String(active));
    const symbol = button.querySelector("use");
    if (symbol) symbol.setAttribute("href",active ? "#i-pause" : "#i-sound");
  });
}
function silence() {
  ++audioTicket;
  player.pause();
  activeClip = "";
  updateAudioButtons();
}
async function playClip(id) {
  if (activeClip === id) { silence(); return; }
  silence();
  const ticket = audioTicket;
  activeClip = id;
  player.src = "audio/"+state.voice+"/"+id+".mp3";
  player.defaultPlaybackRate = speeds[state.speed].rate;
  player.playbackRate = speeds[state.speed].rate;
  player.preservesPitch = true;
  updateAudioButtons();
  try { await player.play(); }
  catch {
    if (ticket !== audioTicket) return;
    silence();
    showNotice("This recording could not play. Tap Listen to try again.");
  }
}
player.addEventListener("ended",silence);
player.addEventListener("loadedmetadata",()=>{player.playbackRate=speeds[state.speed].rate;});
function updateSoundSettings() {
  byId("sound-label").textContent = titleCase(state.voice)+" · "+speeds[state.speed].label;
  document.querySelector('input[name="voice"][value="'+state.voice+'"]').checked = true;
  document.querySelector('input[name="speed"][value="'+state.speed+'"]').checked = true;
}

function picture(id,description,tint) {
  return '<div class="scene" style="--tint:'+tint+'"><img src="pictures/'+id+'.webp" alt="'+esc(description)+'" width="720" height="450" decoding="async"></div>';
}
function highlighted(line,phrase) {
  const start = line.toLowerCase().search(new RegExp("\\b"+phrase+"\\b","i"));
  if (start < 0) return esc(line);
  return esc(line.slice(0,start))+'<mark>'+esc(line.slice(start,start+phrase.length))+'</mark>'+esc(line.slice(start+phrase.length));
}
const complete = q => esc(q.stem).replace("___","<mark>"+esc(q.answer)+"</mark>");
function guideView() {
  const w = placeWords[state.word];
  const example = w.examples[state.example];
  const last = state.word === placeWords.length-1;
  const list = placeWords.map((item,i)=>{
    const selected=i===state.word;
    return '<button class="word-button'+(selected?' current':'')+'" data-word="'+i+'" aria-pressed="'+selected+'"><span class="word-dot"></span>'+titleCase(item.word)+(selected?icon("right"):"")+'</button>';
  }).join("");
  const exampleButtons = w.examples.length === 1 ? "" : '<div class="example-switch" aria-label="Choose example">'+w.examples.map((_,i)=>
    '<button data-example="'+i+'" aria-label="Example '+(i+1)+'" aria-pressed="'+(i===state.example)+'">'+(i+1)+'</button>').join("")+'</div>';
  const dots = '<span class="dots" aria-hidden="true">'+placeWords.map((_,i)=>'<i'+(i===state.word?' class="current"':'')+'></i>').join("")+'</span>';
  return '<div class="guide-layout"><aside class="word-list"><h2>Word bank</h2><div class="words">'+list+'</div></aside>'+
    '<article class="lesson-card" aria-label="Word card"><div class="lesson-body">'+picture(example.scene,example.description,tints[state.word])+
    '<div class="definition"><div class="eyebrow">Word '+(state.word+1)+' of '+placeWords.length+'</div>'+
    '<h2>'+titleCase(w.word)+'</h2><p>'+esc(w.meaning)+'</p><div class="word-tools">'+audioButton("word-"+w.id,"Hear word")+
    '<button type="button" class="lang-toggle" data-action="arabic" aria-label="Arabic meaning" aria-pressed="'+state.arabic+'"><span lang="ar">بالعربي</span></button></div>'+
    (state.arabic?'<div class="ar-meaning" dir="rtl" lang="ar">'+esc(w.arabic)+'</div>':'')+
    '<div class="example"><div class="example-top"><span class="eyebrow">Teacher’s example</span>'+exampleButtons+'</div>'+
    '<p class="example-line">'+highlighted(example.line,w.word)+'</p>'+audioButton(example.scene,"Hear sentence")+
    '</div></div></div><div class="lesson-nav"><button class="line-btn" data-word="'+(state.word-1)+'" '+(state.word===0?"disabled":"")+'>'+icon("left")+'Previous</button>'+dots+
    (last?'<a class="primary" href="#practice">Try school practice '+icon("arrow")+'</a>':'<button class="primary" data-word="'+(state.word+1)+'">Next word '+icon("arrow")+'</button>')+
    '</div></article></div>';
}

function roundStatus(key) {
  const current = state.rounds[key];
  const answered = Object.keys(current.answers).length;
  if (current.finished) return "See my result";
  return answered || current.index || Object.keys(current.flags).length ? "Resume round" : "Start round";
}
function roundsView() {
  return '<div class="section-heading"><div><h2>Competition rounds</h2><p>Choose a round. Check your answers when you finish.</p></div></div>'+
    '<div class="rounds">'+["pictures","clues"].map((key,i)=>{
      const round = placeRounds[key];
      const artwork = i===0?'<img src="pictures/cat-door.webp" width="720" height="450" alt="" style="height:auto">':icon("search");
      const description = i===0 ? "Look at each picture and choose the missing words." : "Read the clues and work out where each thing is.";
      return '<article class="round-card"><div><div class="eyebrow">10 questions</div><h3>'+round.title+'</h3><p>'+description+'</p>'+
        '<a class="primary" href="#competition/'+key+'">'+roundStatus(key)+' '+icon("arrow")+'</a></div><div class="round-art" aria-hidden="true">'+artwork+'</div></article>';
    }).join("")+'</div>';
}
function questionMap(key,index) {
  const round = placeRounds[key], current = state.rounds[key];
  const showChecks = round.type==="practice" || current.finished;
  const count = Object.keys(current.answers).length;
  const numbers = round.questions.map((q,i)=>{
    const picked=current.answers[q.id];
    const status=picked ? (showChecks ? (picked===q.answer?"right":"wrong") : "answered") : "";
    const flagged=!!current.flags[q.id];
    const statusText = ({right:"correct",wrong:"incorrect",answered:"answered"})[status] || "unanswered";
    return '<button data-jump="'+i+'" class="'+status+(flagged?" marked":"")+(i===index?" current":"")+'" aria-label="Question '+(i+1)+', '+statusText+(flagged?', flagged':'')+'" '+(i===index?'aria-current="step"':'')+'>'+(i+1)+'</button>';
  }).join("");
  const foot = current.finished ? "Review any question." : "Tap a number to return. A flag marks a question to review.";
  return '<aside class="question-map"><div class="map-title-row"><h3 class="map-heading">Question map</h3><span class="map-count">'+count+'/'+round.questions.length+' answered</span></div>'+
    '<div class="map-grid">'+numbers+'</div><p class="map-caption">'+foot+'</p>'+
    (current.finished?'<button class="line-btn map-end" data-action="score">Back to score</button>':'<button class="line-btn map-end" data-action="finish">Finish round</button>')+'</aside>';
}
function currentFeedback(q,picked,showKey,finished) {
  if (!showKey) return '<div class="feedback" aria-live="polite">'+(picked?'Answer saved. You can change it before finishing.':'')+'</div>';
  if (!picked && !finished) return '<div class="feedback" aria-live="polite"></div>';
  const lead = !picked ? "Unanswered." : picked === q.answer ? "Correct!" : "Look again.";
  return '<div class="feedback'+(picked===q.answer?'':' miss')+'" aria-live="polite"><strong>'+lead+'</strong><span class="completed-sentence">'+complete(q)+'</span></div>';
}
function quizView(key) {
  const round=placeRounds[key], current=state.rounds[key], items=round.questions, i=current.index, q=items[i];
  const showKey = round.type==="practice" || current.finished;
  const picked=current.answers[q.id], lock=current.finished || (showKey && !!picked);
  const heading = round.type==="practice" ? "Look at the picture. Choose the word or phrase that fits." : "Choose one answer. You can review it before finishing.";
  const visual = q.scene ? picture(q.scene,q.description,tints[i%tints.length]) :
    '<div class="clue-card"><div class="eyebrow">'+icon("search")+' Read the clue</div><blockquote>'+esc(q.clue)+'</blockquote></div>';
  const choices = q.options.map((option,j)=>{
    let style="", indicator="";
    if (lock && showKey && (picked || current.finished)) {
      if (option===q.answer){style="correct";indicator=icon("check");}
      else if (option===picked){style="wrong";indicator=icon("close");}
    } else if(option===picked){style="selected";indicator=icon("check");}
    return '<button class="option '+style+'" data-choice="'+j+'" aria-pressed="'+(option===picked)+'" '+(lock?'aria-disabled="true"':'')+'><span class="letter" aria-hidden="true">'+String.fromCharCode(65+j)+'</span>'+esc(option)+indicator+'</button>';
  }).join("");
  const flagged = !!current.flags[q.id];
  const flag = current.finished ? (flagged?'<span class="flag-btn">'+icon("flag")+'Flagged</span>':'') :
    '<button data-action="flag" class="flag-btn" aria-pressed="'+flagged+'">'+icon("flag")+(flagged?'Flagged':'Flag')+'</button>';
  const forward = i < items.length-1 ? '<button class="primary" data-jump="'+(i+1)+'">Next '+icon("arrow")+'</button>' :
    '<button class="primary" data-action="'+(current.finished?"score":"finish")+'">'+(current.finished?"Back to score":"Finish round")+' '+icon("check")+'</button>';
  return '<div class="section-heading"><div><h2>'+round.title+'</h2><p>'+(current.finished?'Review your answers.':heading)+'</p></div>'+
    (round.type==="competition"?'<a class="text-link" href="#competition">'+icon("left")+'Rounds</a>':'')+'</div>'+
    '<div class="quiz-layout"><article class="question-card"><div class="question-top"><span class="question-kicker">Question '+(i+1)+' of '+items.length+'</span>'+flag+'</div>'+
    '<div class="progress-line" aria-hidden="true"><span style="--progress:'+(100*Object.keys(current.answers).length/items.length)+'%"></span></div>'+
    '<div class="question-body">'+visual+'<div class="question-text"><h3>'+esc(q.stem).replace("___",'<span class="blank" aria-label="blank">___</span>')+'</h3>'+
    audioButton(q.id,q.clue?"Hear clue & question":"Hear question")+'<div class="answers" role="group" aria-label="Answer choices">'+choices+'</div></div></div>'+
    currentFeedback(q,picked,showKey,current.finished)+'<div class="quiz-actions"><button class="line-btn" data-jump="'+(i-1)+'" '+(!i?'disabled':'')+'>'+icon("left")+'Previous</button>'+forward+'</div></article>'+
    questionMap(key,i)+'</div>';
}

function scoreView(key) {
  const round=placeRounds[key], current=state.rounds[key], qs=round.questions;
  const answered=Object.keys(current.answers).length;
  const correct=qs.filter(q=>current.answers[q.id]===q.answer).length;
  const wrong=answered-correct, blank=qs.length-answered, perfect=correct===qs.length;
  const rows=qs.map((q,i)=>{
    const picked=current.answers[q.id], right=picked===q.answer;
    if (missedOnly && right) return "";
    const tag=right?"Correct":picked?"Incorrect":"Unanswered";
    return '<li><span class="review-number">'+(i+1)+'.</span><div><p>'+complete(q)+'</p>'+
      (!right?'<small>'+(picked?'Your choice was <b>'+esc(picked)+'</b>.':'You left this question blank.')+'</small>':'')+
      '<button class="text-link" data-review="'+i+'">'+(q.scene?"See picture":"See clue")+' '+icon("right")+'</button></div>'+
      '<span class="status-pill '+(right?"":picked?"wrong":"blank")+'">'+(current.flags[q.id]?icon("flag")+' ':'')+tag+'</span></li>';
  }).join("");
  return '<article class="results"><div class="score-summary"><div class="score-ring" aria-label="'+correct+' out of '+qs.length+'">'+correct+' / '+qs.length+'</div><div><div class="eyebrow">'+round.title+'</div>'+
    '<h2>'+(perfect?'Full marks, Sakinah!':'Your results')+'</h2><div class="score-counts"><span>'+correct+' correct</span><span>'+wrong+' incorrect</span><span>'+blank+' unanswered</span></div></div>'+
    '</div><div class="btn-row"><button class="soft-btn" data-action="restart">Start again</button><a class="primary" href="#competition">'+(key==="school"?"Try a competition":"Choose a round")+' '+icon("arrow")+'</a></div>'+
    '<div class="review-title"><h3>Answer review</h3>'+(!perfect?'<button class="line-btn" data-action="filter" aria-pressed="'+missedOnly+'">'+(missedOnly?'Show all answers':'Show missed only')+'</button>':'')+'</div>'+
    '<ol class="review-list">'+rows+'</ol></article>';
}
function render() {
  document.body.classList.toggle("active-round",!!activeRound);
  document.querySelectorAll("[data-mode]").forEach(link=>{
    if (link.dataset.mode===mode) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
  if(mode==="learn") activity.innerHTML=guideView();
  else if(!activeRound) activity.innerHTML=roundsView();
  else if(state.rounds[activeRound].finished && !reviewing) activity.innerHTML=scoreView(activeRound);
  else activity.innerHTML=quizView(activeRound);
  updateAudioButtons();
}
function navigate() {
  const requested=location.hash.slice(1) || state.route;
  const route=["learn","practice","competition","competition/pictures","competition/clues"].includes(requested)?requested:"learn";
  mode=route.split("/")[0];
  activeRound=mode==="practice"?"school":route.split("/")[1]||"";
  reviewing=false; missedOnly=false; silence(); state.route=route; save(); render();
}
function focusControl(selector) {
  activity.querySelector(selector)?.focus({preventScroll:true});
}
function goToQuestion(index) {
  if (!activeRound || !Number.isInteger(index) || index<0 || index>=placeRounds[activeRound].questions.length) return;
  silence();
  state.rounds[activeRound].index=index;
  save(); render();
  const question=activity.querySelector(".question-card");
  if (question && question.getBoundingClientRect().top < -12) question.scrollIntoView({block:"start"});
}
function finishRound() {
  if(!activeRound) return;
  silence(); state.rounds[activeRound].finished=true; reviewing=false; missedOnly=false; save(); render();
  if(activity.getBoundingClientRect().top<0) activity.scrollIntoView({block:"start"});
}
function requestFinish() {
  const count=placeRounds[activeRound].questions.length-Object.keys(state.rounds[activeRound].answers).length;
  if (!count) { finishRound(); return; }
  byId("finish-note").textContent="You have "+count+" unanswered "+(count===1?"question":"questions")+". You can return to the round or see your score now.";
  byId("finish-dialog").showModal();
}
activity.addEventListener("click",event=>{
  const button=event.target.closest("button");
  if(!button || button.disabled || button.hasAttribute("data-audio")) return;
  const d=button.dataset;
  if (own(d,"word")) {
    const index=Number(d.word);
    if(index<0 || index>=placeWords.length) return;
    silence(); state.word=index; state.example=0; save(); render(); focusControl('.word-button[data-word="'+index+'"]'); return;
  }
  if(own(d,"example")) {
    silence(); state.example=safeIndex(Number(d.example),placeWords[state.word].examples.length); save(); render(); focusControl('[data-example="'+state.example+'"]'); return;
  }
  if(d.action==="arabic") { state.arabic=!state.arabic; save(); render(); focusControl('[data-action="arabic"]'); return; }
  if(!activeRound) return;
  const current=state.rounds[activeRound], round=placeRounds[activeRound], q=round.questions[current.index];
  if(own(d,"choice")) {
    if(current.finished || (round.type==="practice" && current.answers[q.id])) return;
    const selected=q.options[Number(d.choice)];
    if(!selected) return;
    current.answers[q.id]=selected; save(); render(); focusControl('[data-choice="'+d.choice+'"]'); return;
  }
  if(own(d,"jump")) { goToQuestion(Number(d.jump)); return; }
  if(own(d,"review")) { reviewing=true; goToQuestion(Number(d.review)); return; }
  if(d.action==="flag" && !current.finished) {
    if(current.flags[q.id]) delete current.flags[q.id]; else current.flags[q.id]=true;
    save(); render(); focusControl('[data-action="flag"]'); return;
  }
  if(d.action==="finish" && !current.finished) { requestFinish(); return; }
  if(d.action==="score") { reviewing=false; silence(); render(); if(activity.getBoundingClientRect().top<0)activity.scrollIntoView({block:"start"}); return; }
  if(d.action==="filter") { missedOnly=!missedOnly; render(); focusControl('[data-action="filter"]'); return; }
  if(d.action==="restart" && current.finished) {
    state.rounds[activeRound]=freshRound(); reviewing=false; missedOnly=false; silence(); save(); render();
    if(activity.getBoundingClientRect().top<0) activity.scrollIntoView({block:"start"});
  }
});

document.addEventListener("click",event=>{
  const clipTrigger=event.target.closest("[data-audio]");
  if(clipTrigger) { playClip(clipTrigger.dataset.audio); return; }
  const close=event.target.closest("[data-close]");
  if(close) close.closest("dialog").close();
});
byId("open-sound").addEventListener("click",()=>{ updateSoundSettings(); byId("sound-settings").showModal(); });
byId("sound-settings").addEventListener("change",event=>{
  const target=event.target;
  if(target.name==="voice" && ["heart","bella"].includes(target.value)) { silence(); state.voice=target.value; }
  if(target.name==="speed" && own(speeds,target.value)) { state.speed=target.value; player.playbackRate=speeds[state.speed].rate; }
  updateSoundSettings(); save();
});
byId("sound-settings").addEventListener("close",silence);
for (const dialog of document.querySelectorAll("dialog")) dialog.addEventListener("click",event=>{
  if(event.target!==dialog) return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
});
byId("confirm-finish").addEventListener("click",()=>{byId("finish-dialog").close(); finishRound();});
if(document.fullscreenEnabled && document.documentElement.requestFullscreen){
  byId("expand").hidden=false;
  byId("expand").addEventListener("click",async()=>{
    try { if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { showNotice("Full screen is unavailable in this window."); }
  });
  document.addEventListener("fullscreenchange",()=>{
    const label=document.fullscreenElement?"Exit full screen":"Full screen";
    byId("expand").setAttribute("aria-label",label); byId("expand").title=label;
  });
}
document.querySelector(".skip").addEventListener("click",event=>{
  event.preventDefault(); activity.focus({preventScroll:true}); activity.scrollIntoView({block:"start"});
});
window.addEventListener("hashchange",navigate);
window.addEventListener("pagehide",silence);
updateSoundSettings();
navigate();
if("serviceWorker" in navigator && location.pathname.startsWith("/kids-learning/")) {
  window.addEventListener("load",()=>navigator.serviceWorker.register("../../sw.js",{scope:"../../"}).catch(()=>{}));
}
