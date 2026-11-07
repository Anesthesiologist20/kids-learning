"use strict";
const $=id=>document.getElementById(id);
const ART={
hat:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#fff0e5"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">👒</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>',
hen:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#fff3e4"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">🐔</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>',
hand:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#fff2eb"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">✋</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>',
horse:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#fff1e7"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">🐎</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>',
house:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#edf9f5"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">🏠</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>',
honey:'<rect x="0" y="0" width="260" height="190" rx="26" fill="#fff8db"/><circle cx="36" cy="36" r="13" fill="#ffffffa8"/><circle cx="228" cy="155" r="18" fill="#ffdaeba8"/><circle cx="212" cy="32" r="9" fill="#f0b4c088"/><text x="130" y="144" text-anchor="middle" font-size="125" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">🍯</text><path d="M30 140l7-13 7 13 13 7-13 7-7 13-7-13-13-7zM218 50l4-8 4 8 8 4-8 4-4 8-4-8-8-4z" fill="#f5bf80"/>'
};
const WORDS=[
{id:"hat",name:"Hat",color:"#fff0e5",sentence:"This is my hat."},
{id:"hen",name:"Hen",color:"#fff3e4",sentence:"The hen is happy."},
{id:"hand",name:"Hand",color:"#fff2eb",sentence:"This is my hand."},
{id:"horse",name:"Horse",color:"#fff1e7",sentence:"I see a horse."},
{id:"house",name:"House",color:"#edf9f5",sentence:"This is a house."},
{id:"honey",name:"Honey",color:"#fff8db",sentence:"Honey is sweet."}
];
const KEY="raghd-letter-h-garden-v1";
const blank=()=>({learned:[],best:{listen:0,picture:0},voice:"bella",speed:"0.78",sessions:{listen:null,picture:null}});
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");if(!p||typeof p!=="object")return blank();return {...blank(),...p,best:{...blank().best,...p.best},sessions:{...blank().sessions,...p.sessions},learned:Array.isArray(p.learned)?p.learned:[]}}catch{return blank()}}
let state=load(),mode="listen",tab="learn",audio=null,toastTimer=null;
const lookup=id=>WORDS.find(w=>w.id===id);
function store(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}updateStats()}
function bestAll(){return Math.max(state.best.listen||0,state.best.picture||0)}
function updateStats(){$("learnedStat").textContent=state.learned.length+" / 6";$("starStat").textContent=state.learned.length+(state.best.listen||0)+(state.best.picture||0);$("bestStat").textContent=bestAll()?bestAll()+" / 12":"—"}
function art(id){return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration" viewBox="0 0 260 190">'+ART[id]+"</svg>"}
function toast(s){const e=$("toast");e.textContent=s;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),2400)}
function celebrate(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;for(let i=0;i<14;i++){let s=document.createElement("span");s.className="confetti";s.textContent=["🌼","⭐","🌸","✨"][i%4];s.style.setProperty("--x",Math.random()*100+"vw");s.style.setProperty("--d",(2+Math.random()*2)+"s");document.body.append(s);setTimeout(()=>s.remove(),4200)}}
function play(key){
  // Free on-device English TTS: works on iPhone/iPad without paid voice services.
  const synth=window.speechSynthesis;
  if(!synth){$("audioStatus").textContent="Audio isn't supported on this device.";return;}
  synth.cancel();
  const w=key.startsWith("word-")?lookup(key.slice(5)):key.startsWith("sentence-")?lookup(key.slice(9)):null;
  const phrase=key==="letter-name"?"H":key==="letter-sound"?"h, h, hat":(w?(key.startsWith("sentence-")?w.sentence:w.name):"H");
  const utter=new SpeechSynthesisUtterance(phrase);utter.lang="en-US";
  const all=synth.getVoices().filter(v=>/^en/i.test(v.lang));
  const distinct=all.filter((v,i)=>all.findIndex(k=>k.name===v.name)===i);
  if(distinct.length)utter.voice=state.voice==="heart"?(distinct[1]||distinct[0]):distinct[0];
  utter.rate=Number(state.speed)<1?0.73:0.96;
  utter.pitch=state.voice==="heart"?0.96:1.13;
  $("audioStatus").textContent="🔊 Listen, then say it!";
  utter.onend=()=>{$("audioStatus").textContent="🌷 Your turn! Say it aloud."};
  utter.onerror=e=>{if(e.error!=="interrupted"&&e.error!=="canceled")$("audioStatus").textContent="🔈 Tap Listen again to retry."};
  synth.speak(utter);
}
function wordsView(){$("words").innerHTML=WORDS.map(w=>'<article class="word-card '+(state.learned.includes(w.id)?"learned":"")+'"><span class="sticker">'+(state.learned.includes(w.id)?"⭐":"🌷")+'</span><div class="illustration" style="--tile:'+w.color+'" data-word="'+w.id+'">'+art(w.id)+'</div><div class="word-body"><strong>'+w.name+'</strong><small>'+w.sentence+'</small><div class="word-actions"><button type="button" class="primary" data-hear="'+w.id+'">🔊 Word</button><button type="button" class="softbtn" data-sentence="'+w.id+'">🎧 Sentence</button></div></div></article>').join("");
 $("words").querySelectorAll("[data-word],[data-hear]").forEach(e=>e.addEventListener("click",()=>{const id=e.dataset.word||e.dataset.hear;play("word-"+id);learn(id)}));
 $("words").querySelectorAll("[data-sentence]").forEach(e=>e.addEventListener("click",()=>{const id=e.dataset.sentence;play("sentence-"+id);learn(id)}))}
function learn(id){if(!state.learned.includes(id)){state.learned.push(id);store();toast("⭐ New word! Well done, Raghd!");wordsView()}}
function shuffle(xs){const a=[...xs];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function makeSession(){return{questions:shuffle([...WORDS.map(w=>w.id),...WORDS.map(w=>w.id)]).map(id=>({id,options:shuffle([id,...shuffle(WORDS.filter(w=>w.id!==id).map(w=>w.id)).slice(0,2)])})),answers:{},index:0,finished:false}}
function validSession(s){return s&&Array.isArray(s.questions)&&s.questions.length===12&&s.questions.every(q=>lookup(q.id)&&Array.isArray(q.options)&&q.options.length===3)}
function session(){if(!validSession(state.sessions[mode])){state.sessions[mode]=makeSession();store()}return state.sessions[mode]}
function picked(s,i){return Object.prototype.hasOwnProperty.call(s.answers,String(i))}
function score(s){return s.questions.filter((q,i)=>s.answers[i]===q.id).length}
function answered(s){return s.questions.filter((q,i)=>picked(s,i)).length}
function showTab(name){tab=name;document.querySelectorAll("[data-tab]").forEach(b=>{b.classList.toggle("selected",b.dataset.tab===name);b.setAttribute("aria-current",b.dataset.tab===name?"page":"false")});for(const id of ["learn","games","write","prizes"])$(id).hidden=!(id===(name==="listen"||name==="picture"?"games":name));if(name==="listen"||name==="picture"){mode=name;renderQuiz()}if(name==="prizes")renderRewards();window.scrollTo({top:Math.max(0,document.querySelector(".tabs").getBoundingClientRect().top+window.scrollY-12),behavior:"smooth"})}
function renderQuiz(){const s=session(),q=s.questions[s.index],w=lookup(q.id),done=picked(s,s.index),gameIsListen=mode==="listen";$("gameBadge").textContent=gameIsListen?"02 • HEAR & PICK":"03 • LOOK & PICK";$("gameHeading").textContent=gameIsListen?"Listen carefully! 🎧":"Look at the picture! 🌼";$("gameInstruction").textContent=gameIsListen?"Tap the sound. Which word do you hear?":"Look at the picture. Which word matches?";$("gameCount").textContent="Question "+(s.index+1)+" of 12";$("gameScore").textContent="⭐ "+score(s)+" correct";$("progressFill").style.width=(answered(s)*100/12)+"%";
 $("questionMap").innerHTML=s.questions.map((item,i)=>'<button type="button" data-map="'+i+'" aria-label="Question '+(i+1)+'" class="'+(i===s.index?"here ":"")+(picked(s,i)?s.answers[i]===item.id?"good":"bad":"")+'">'+(i+1)+'</button>').join("");
 $("questionMap").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{s.index=Number(b.dataset.map);store();renderQuiz()}));
 $("questionArea").innerHTML=gameIsListen?'<div class="prompt"><div class="prompt-title">What word do you hear?</div><div class="sound-object" aria-hidden="true">🔊</div><button type="button" class="primary listen-btn" id="playPrompt">🔊 Listen again</button></div>':'<div class="prompt"><div class="prompt-title">What is in the picture?</div><div class="picture-object" style="--tile:'+w.color+'">'+art(w.id)+'</div></div>';
 if(gameIsListen)$("playPrompt").onclick=()=>play("word-"+w.id);
 $("choices").innerHTML=q.options.map(id=>'<button type="button" data-choice="'+id+'" '+(done?"disabled":"")+' class="'+(done&&id===q.id?"correct":done&&s.answers[s.index]===id&&id!==q.id?"wrong":"")+'">'+lookup(id).name+'</button>').join("");
 $("choices").querySelectorAll("button").forEach(b=>b.onclick=()=>answer(b.dataset.choice));
 $("feedback").textContent=done?(s.answers[s.index]===q.id?"🌟 Fantastic! That is "+w.name+".":"💗 You are learning! The word is "+w.name+"."):"";
 $("nextQuestion").disabled=s.index===11;$("prevQuestion").disabled=s.index===0;
 $("results").hidden=!s.finished;
 if(s.finished)renderResult(s)}
function answer(id){const s=session();if(s.finished||picked(s,s.index))return;const q=s.questions[s.index];s.answers[s.index]=id;store();if(id===q.id){toast("⭐ Wonderful, Raghd!");celebrate();if(mode==="picture")play("word-"+q.id)}else{toast("💗 Great try! Keep learning.");play("word-"+q.id)}if(answered(s)===12){finish(false)}else renderQuiz()}
function finish(manual=true){const s=session();if(answered(s)<12){if(manual){const i=s.questions.findIndex((_,i)=>!picked(s,i));s.index=i;store();renderQuiz();toast("🌼 "+(12-answered(s))+" more questions to go!")}return}s.finished=true;const newScore=score(s);if(newScore>(state.best[mode]||0))state.best[mode]=newScore;store();renderQuiz();celebrate();}
function renderResult(s){const pts=score(s);$("results").innerHTML='<div class="giant">'+(pts>=10?"🏆":"🌻")+'</div><h3>Great job, Raghd!</h3><p>You got <b>'+pts+' of 12</b> correct! ⭐</p><p>'+(pts===12?"A perfect garden of stars!":pts>=8?"You are becoming a word champion!":"Your garden grows every time you practise!")+'</p><button type="button" class="primary" id="retry">🔄 Play a new round</button>';
 $("retry").onclick=()=>resetGame();}
function resetGame(){const s=session();if(answered(s)>0&&!s.finished&&!window.confirm("Start a new round? Your current answers will be replaced."))return;state.sessions[mode]=makeSession();store();renderQuiz();toast("🌷 A fresh adventure!")}
function renderRewards(){const total=state.learned.length+(state.best.listen||0)+(state.best.picture||0);$("awardHeading").textContent=total>=25?"Superstar Raghd! 🌟":state.learned.length===6?"A lovely word gardener! 🌸":"Keep growing, Raghd!";$("awardMessage").textContent="You have earned "+total+" stars. You know "+state.learned.length+" of our six H words!";
 const badges=[["🌱","First sprout","Learn one word",state.learned.length>=1],["🌷","Word bouquet","Learn all six words",state.learned.length===6],["🎧","Listening hero","Score 6+ in Hear & Pick",state.best.listen>=6],["🌙","Picture detective","Score 6+ in Look & Pick",state.best.picture>=6],["🏆","H champion","Score 12/12 in any game",bestAll()===12],["👑","Garden queen","Score 10+ in both games",state.best.listen>=10&&state.best.picture>=10]];
 $("badges").innerHTML=badges.map(b=>'<div class="badge-card '+(b[3]?"":"locked")+'"><div>'+b[0]+'</div><b>'+b[1]+'</b><small>'+b[2]+'</small></div>').join("")}
function enableCanvas(id){const c=$(id),g=c.getContext("2d");let active=false,last=null;function resize(){const r=c.getBoundingClientRect();if(!r.width)return;const d=Math.min(window.devicePixelRatio||1,2);const old=document.createElement("canvas");old.width=c.width;old.height=c.height;if(old.width)old.getContext("2d").drawImage(c,0,0);c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);g.setTransform(d,0,0,d,0,0);g.lineWidth=7;g.lineCap="round";g.lineJoin="round";g.strokeStyle="#a775d9";if(old.width)g.drawImage(old,0,0,r.width,r.height)}function at(e){const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}c.addEventListener("pointerdown",e=>{e.preventDefault();resizeIfNeeded();c.setPointerCapture(e.pointerId);active=true;last=at(e);g.beginPath();g.moveTo(last.x,last.y)});c.addEventListener("pointermove",e=>{if(!active)return;e.preventDefault();let p=at(e);g.lineTo(p.x,p.y);g.stroke();last=p});for(const n of ["pointerup","pointercancel","lostpointercapture"])c.addEventListener(n,()=>{active=false});function resizeIfNeeded(){if(!c.width)resize()}window.addEventListener("resize",resize);resize();return()=>g.clearRect(0,0,c.width,c.height)}
const wipeBig=enableCanvas("canvasBig"),wipeSmall=enableCanvas("canvasSmall");
$("erase").onclick=()=>{wipeBig();wipeSmall();toast("✨ Ready to write again!")};
$("soundH").onclick=()=>play("letter-name");$("soundHh").onclick=()=>play("letter-sound");
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go)));
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
$("voiceSelect").value=state.voice;$("speedSelect").value=state.speed;
$("voiceSelect").onchange=e=>{state.voice=e.target.value;store();play("letter-name")};
$("speedSelect").onchange=e=>{state.speed=e.target.value;store();play("letter-name")};
$("testVoice").onclick=()=>play("letter-name");
$("prevQuestion").onclick=()=>{let s=session();if(s.index>0){s.index--;store();renderQuiz()}};
$("nextQuestion").onclick=()=>{let s=session();if(s.index<11){s.index++;store();renderQuiz();if(mode==="listen"&&!picked(s,s.index))play("word-"+s.questions[s.index].id)}};
$("finishGame").onclick=()=>finish(true);
$("fullscreen").onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{})};
wordsView();updateStats();
if(state.sessions?.listen?.finished&&state.sessions?.picture?.finished)renderRewards();
