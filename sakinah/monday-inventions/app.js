"use strict";
const byId = id => document.getElementById(id);
const all = selector => Array.from(document.querySelectorAll(selector));
const storageKey = "sakinah-monday-inventions-v1";
let saved;
try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { saved = {}; }
function indexIn(value, length) { return Number.isInteger(value) && value >= 0 && value < length ? value : 0; }
function flags(value, count) { return Array.from({length:count}, (_, i) => value?.[i] === true); }
const preferences = {
  voice: saved.voice === "heart" ? "heart" : "bella",
  speed: ["extra","slow","normal"].includes(saved.speed) ? saved.speed : "slow"
};
const positions = { words:indexIn(saved.positions?.words,words.length), talk:indexIn(saved.positions?.talk,lines.length+1) };
const ready = { words:flags(saved.ready?.words,words.length), talk:flags(saved.ready?.talk,lines.length) };
function makeQuiz(prior = {}) {
  return {
    index:indexIn(prior?.index, words.length), finished:prior?.finished === true,
    answers:words.map((w,i) => w.options.includes(prior?.answers?.[i]) ? prior.answers[i] : null),
    marked:flags(prior?.marked, words.length)
  };
}
let quiz = makeQuiz(saved.quiz);
let tab = ["words","book","talk"].includes(saved.tab) ? saved.tab : "talk";
let inQuiz = tab === "words" && saved.inQuiz === true;
const notebook = byId("notebook"), bookDone = byId("book-done");
notebook.value = typeof saved.notes === "string" ? saved.notes.slice(0,2000) : "";
bookDone.checked = saved.bookDone === true;
function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ ...preferences, positions, ready, quiz, tab, inQuiz, notes:notebook.value, bookDone:bookDone.checked }));
    return true;
  } catch { return false; }
}
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text, className, action) {
  const node = el("button", text, className);
  node.type = "button";
  node.addEventListener("click",action);
  return node;
}
function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("class","ico"); svg.setAttribute("aria-hidden","true");
  const use = document.createElementNS("http://www.w3.org/2000/svg","use");
  use.setAttribute("href","#i-"+name); svg.append(use);
  return svg;
}
const model = createReadingPlayer(preferences, () => {}, {
  database:"sakinah-inventions-recordings-v1", timings:false,
  rates:{extra:.67, slow:.82, normal:1}, sampleLabel:() => "the example"
});
byId("voice").value = preferences.voice;
byId("speed").value = preferences.speed;
byId("voice").onchange = e => { preferences.voice = e.target.value; save(); model.changeVoice(); };
byId("speed").onchange = e => { preferences.speed = e.target.value; save(); model.changeRate(); };

function slideForLine(index) { return slides.findIndex(s => index >= s.first && index <= s.last); }
function showLine(index) { positions[tab] = index; save(); renderReader(); }
function setReadyAppearance() {
  const complete = tab === "talk" && positions.talk === lines.length;
  const on = !complete && ready[tab][positions[tab]];
  byId("ready-button").hidden = complete;
  byId("ready-button").setAttribute("aria-pressed",String(Boolean(on)));
  byId("ready-button").querySelector("span").textContent = on ? "Ready ✓" : "Mark ready";
  const total = ready[tab].length, number = ready[tab].filter(Boolean).length;
  byId("ready-count").textContent = number + " / " + total + " ready";
  byId("progress-bar").style.width = (number/total*100) + "%";
}
function drawRail() {
  const target = byId("jump-list"), index = positions[tab];
  target.replaceChildren();
  if (tab === "words") {
    target.className = "word-list";
    words.forEach((w,i) => {
      const link = button((ready.words[i] ? "✓ " : "") + w.word, "word-link", () => showLine(i));
      if (i === index) link.setAttribute("aria-current","true");
      target.append(link);
    });
  } else {
    target.className = "talk-list";
    slides.forEach((s,i) => {
      const link = button(undefined, "talk-link", () => showLine(s.first));
      const number = el("span",String(i+1).padStart(2,"0"),"ordinal");
      number.setAttribute("aria-hidden","true");
      link.append(number,el("span",s.cue),el("span",`${s.first+1}–${s.last+1}`,"line-range"));
      if (i === slideForLine(index)) link.setAttribute("aria-current","true");
      target.append(link);
    });
  }
  const full = tab === "talk" && index === lines.length;
  byId("rail-action").replaceChildren(icon(tab === "words" ? "edit" : "book"), document.createTextNode(tab === "words" ? "Try the word challenge" : full ? "Practise one line" : "Read the whole talk"));
}
function renderReader() {
  const isWord = tab === "words", index = positions[tab], full = !isWord && index === lines.length;
  const body = byId("reading-body"); body.replaceChildren();
  let activeId;
  if (isWord) {
    const w = words[index]; activeId = "word-" + (index+1);
    byId("card-label").textContent = "Word card";
    const example = el("p",w.example,"example");
    const sampleId = "example-"+(index+1);
    const play = button(undefined,"",() => model.sample(sampleId));
    play.dataset.sample = sampleId; play.setAttribute("aria-label","Listen to the example sentence"); play.append(icon("speaker"));
    example.append(play);
    body.append(el("h3",w.word,"word-head"),el("p",w.meaning,"definition"),example);
  } else if (full) {
    activeId = "whole-talk"; byId("card-label").textContent = "Full script";
    const list = el("ol",undefined,"all-lines"); lines.forEach(line => list.append(el("li",line))); body.append(list);
  } else {
    activeId = "line-"+(index+1); byId("card-label").textContent = slides[slideForLine(index)].cue;
    body.append(el("h3",lines[index]));
  }
  byId("counter").textContent = full ? "All 10 lines" : `${index+1} / 10`;
  byId("prev").disabled = index === 0;
  byId("next").disabled = full || (isWord && index === words.length-1);
  byId("next").replaceChildren(document.createTextNode(!isWord && index === lines.length-1 ? "Full script" : "Next"),icon("right"));
  setReadyAppearance(); drawRail(); model.selectItem(activeId);
}
byId("ready-button").onclick = () => {
  const index = positions[tab]; ready[tab][index] = !ready[tab][index]; save(); setReadyAppearance(); drawRail();
};
byId("prev").onclick = () => showLine(positions[tab]-1);
byId("next").onclick = () => showLine(positions[tab]+1);
byId("rail-action").onclick = () => {
  if (tab === "words") { inQuiz = true; setTab("words",true,true); }
  else showLine(positions.talk === lines.length ? 0 : lines.length);
};
function setTab(nextTab, useQuiz = false, scroll = false) {
  model.suspend();
  if (nextTab !== "talk" && clockEnd) pauseClock();
  tab = nextTab; inQuiz = nextTab === "words" && useQuiz; save();
  all("[data-tab]").forEach(item => {
    const active = item.dataset.tab === tab;
    item.setAttribute("aria-selected",String(active)); item.tabIndex = active ? 0 : -1;
    if (item.dataset.tab === "words") item.setAttribute("aria-controls",inQuiz ? "quiz" : "study");
  });
  byId("quiz").hidden = !inQuiz; byId("book").hidden = tab !== "book";
  byId("study").hidden = tab === "book" || inQuiz;
  if (inQuiz) renderQuiz();
  else if (tab !== "book") {
    const isWord = tab === "words";
    byId("study").setAttribute("aria-labelledby","tab-"+tab);
    byId("section-kicker").textContent = isWord ? "Student’s Book · Page 60" : "Speaking practice";
    byId("section-title").textContent = isWord ? "Words to know" : "My one-minute talk";
    byId("rail-title").textContent = isWord ? "Word list" : "Talk outline";
    byId("timer-box").hidden = isWord;
    renderReader();
  }
  if (scroll) byId("lessons").scrollIntoView({behavior:"instant",block:"start"});
}
all("[data-tab]").forEach(node => {
  node.onclick = () => setTab(node.dataset.tab);
  node.onkeydown = e => {
    const tabs = all("[data-tab]"), at = tabs.indexOf(node);
    const dest = {ArrowLeft:(at+2)%3,ArrowRight:(at+1)%3,Home:0,End:2}[e.key];
    if (dest === undefined) return;
    e.preventDefault(); tabs[dest].focus(); setTab(tabs[dest].dataset.tab);
  };
});
byId("start-talk").onclick = () => setTab("talk",false,true);
byId("from-book-words").onclick = byId("back-words").onclick = () => setTab("words",false,true);
function updateNotes() { byId("save-status").textContent = save() ? "Saved on this device" : "Kept in this tab"; }
notebook.oninput = bookDone.onchange = updateNotes;
if (notebook.value || bookDone.checked) byId("save-status").textContent = "Saved on this device";

function correct(i) { return words[i].answer || words[i].word; }
function renderMap() {
  const map = byId("quiz-map"); map.replaceChildren();
  words.forEach((w,i) => {
    const a = quiz.answers[i], status = !a ? "unanswered" : a === correct(i) ? "correct" : "incorrect";
    const b = button(String(i+1),status + (quiz.index === i && !quiz.finished ? " selected" : "") + (quiz.marked[i] ? " marked" : ""), () => { quiz.index=i; save(); renderQuiz(); });
    b.disabled=quiz.finished; b.setAttribute("aria-label",`Question ${i+1}, ${status}${quiz.marked[i] ? ", marked for review" : ""}`); map.append(b);
  });
  byId("quiz-count").textContent = `${quiz.answers.filter(Boolean).length} / ${words.length} answered`;
  byId("quiz-finish").hidden = quiz.finished;
}
function renderQuiz() {
  renderMap(); const box = byId("quiz-card"); box.replaceChildren();
  if (quiz.finished) {
    const score = words.filter((w,i) => quiz.answers[i] === correct(i)).length;
    box.append(el("p","Quiz result","eyebrow"),el("h3",`${score} / ${words.length} correct`));
    const missed = words.map((w,i) => i).filter(i => quiz.answers[i] !== correct(i) || quiz.marked[i]);
    if (missed.length) {
      box.append(el("p","Words to review")); const list=el("ul",undefined,"quiz-results");
      missed.forEach(i => { const li=el("li",`${i+1}. ${words[i].question}`);li.append(el("small",`Your answer: ${quiz.answers[i] || "Unanswered"} · Correct answer: ${correct(i)}`));list.append(li); });box.append(list);
    } else box.append(el("p","You know all ten words."));
    const actions=el("div",undefined,"actions");actions.append(button("Start a new quiz","primary",() => {quiz=makeQuiz();save();renderQuiz();}),button("Back to word cards","outline",() => setTab("words",false,true)));box.append(actions);return;
  }
  const i=quiz.index,w=words[i],a=quiz.answers[i];
  const meta=el("div",undefined,"quiz-meta"),mark=button(quiz.marked[i] ? "★ Marked" : "☆ Mark for review","linkbtn",()=>{quiz.marked[i]=!quiz.marked[i];save();renderQuiz();});mark.setAttribute("aria-pressed",String(quiz.marked[i]));
  meta.append(el("span",`Question ${i+1} / ${words.length}`),mark);box.append(meta,el("h3",w.question));
  const options=el("div",undefined,"choice-list");
  w.options.forEach((choice,j) => {
    const state = !a ? "" : choice === correct(i) ? " correct" : choice === a ? " incorrect" : "";
    const option=button(undefined,"choice"+state,()=>{if(quiz.answers[i])return;quiz.answers[i]=choice;save();renderQuiz();});
    option.disabled=Boolean(a); option.append(el("b",String.fromCharCode(65+j)),el("span",choice));options.append(option);
  });box.append(options);
  const note=el("p",a ? (a === correct(i) ? "Correct! " : `The answer is “${correct(i)}”. `)+w.meaning : "Choose one answer.","quiz-note");note.setAttribute("role","status");box.append(note);
  const nav=el("div",undefined,"actions");const previous=button("Previous","outline",()=>{quiz.index--;save();renderQuiz();});previous.disabled=i===0;
  nav.append(previous,button(i===words.length-1 ? "End quiz" : "Next question","primary",()=>{if(i===words.length-1)finishQuiz();else{quiz.index++;save();renderQuiz();}}));box.append(nav);
}
function finishQuiz() { quiz.finished=true;save();renderQuiz(); }
byId("quiz-finish").onclick=finishQuiz;

let remaining=60000, clockEnd=0, interval=0;
function drawClock() {
  const milliseconds = clockEnd ? Math.max(0,clockEnd-Date.now()) : remaining;
  if (clockEnd && !milliseconds) {remaining=0;clockEnd=0;clearInterval(interval);byId("clock-status").textContent="One minute is up.";}
  const sec=Math.ceil(milliseconds/1000), value=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
  all("[data-time]").forEach(node=>{ if(node.textContent!==value)node.textContent=value; });
  all("[data-clock]").forEach(node=>{node.textContent=clockEnd ? "Pause" : remaining===0 ? "Try again" : remaining===60000 ? "Start timer" : "Resume";});
}
function pauseClock() { remaining=Math.max(0,clockEnd-Date.now());clockEnd=0;clearInterval(interval);drawClock(); }
all("[data-clock]").forEach(b=>b.onclick=()=>{
  if(clockEnd){pauseClock();return;}
  if(remaining===0) remaining=60000;
  clockEnd=Date.now()+remaining;byId("clock-status").textContent="Timer started.";drawClock();interval=setInterval(drawClock,200);
});
all("[data-reset]").forEach(b=>b.onclick=()=>{clearInterval(interval);clockEnd=0;remaining=60000;drawClock();byId("clock-status").textContent="Timer reset.";});

const dialog=byId("presentation"), slideShell=dialog.querySelector(".slide-shell");
let slide=0, showNotes=false, opener;
function renderSlide() {
  const s=slides[slide];byId("slide-cue").textContent=s.cue;byId("slide-title").textContent=s.title;
  const img=byId("slide-image");img.src="images/"+s.image+".webp";img.alt=s.alt;img.parentNode.dataset.image=s.image;
  byId("slide-no").textContent=`${slide+1} / ${slides.length}`;
  byId("previous-slide").disabled=slide===0;byId("next-slide").disabled=slide===slides.length-1;
  byId("slide-notes").replaceChildren(...lines.slice(s.first,s.last+1).map(line=>el("p",line)));
  byId("slide-notes").hidden=!showNotes;
  byId("notes-toggle").textContent=showNotes ? "Hide notes" : "Show notes";
  byId("notes-toggle").setAttribute("aria-pressed",String(showNotes));
}
all("[data-open-slides]").forEach(b=>b.onclick=()=>{
  model.suspend();opener=b;slide=0;showNotes=false;renderSlide();
  if(typeof dialog.showModal === "function")dialog.showModal();else dialog.setAttribute("open","");
  document.body.classList.add("showing-slides");byId("close-slides").focus();
});
function finishSlides() {document.body.classList.remove("showing-slides");if(document.fullscreenElement===slideShell)document.exitFullscreen().catch(()=>{});if(clockEnd)pauseClock();opener?.focus();}
function closeSlides() { if(typeof dialog.close === "function")dialog.close();else{dialog.removeAttribute("open");finishSlides();} }
dialog.addEventListener("close",finishSlides);byId("close-slides").onclick=closeSlides;
byId("screen").hidden=typeof slideShell.requestFullscreen!=="function"||!document.fullscreenEnabled;
byId("screen").onclick=()=>{const change=document.fullscreenElement ? document.exitFullscreen() : slideShell.requestFullscreen();change?.catch(()=>{});};
document.addEventListener("fullscreenchange",()=>byId("screen").setAttribute("aria-label",document.fullscreenElement ? "Exit full screen" : "Enter full screen"));
function moveSlide(amount) {const next=Math.max(0,Math.min(slides.length-1,slide+amount));if(next!==slide){slide=next;renderSlide();}}
byId("previous-slide").onclick=()=>moveSlide(-1);byId("next-slide").onclick=()=>moveSlide(1);
byId("notes-toggle").onclick=()=>{showNotes=!showNotes;renderSlide();};
dialog.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();moveSlide(e.key==="ArrowLeft" ? -1 : 1);}else if(e.key==="Escape" && typeof dialog.close!=="function")closeSlides();});
let touchStart;
byId("slide-stage").addEventListener("touchstart",e=>{touchStart=e.touches.length===1 ? [e.touches[0].clientX,e.touches[0].clientY] : null;},{passive:true});
byId("slide-stage").addEventListener("touchend",e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart[0],dy=t.clientY-touchStart[1];if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)moveSlide(dx<0 ? 1 : -1);touchStart=null;},{passive:true});
setTab(tab,inQuiz);drawClock();
