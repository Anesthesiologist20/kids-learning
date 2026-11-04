"use strict";
const $=id=>document.getElementById(id);
const ART={
cat:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#eef0ff\"/><path d=\"M0 130Q60 83 120 128Q190 80 260 130V190H0Z\" fill=\"#b9bbdf\"/><circle cx=\"214\" cy=\"36\" r=\"20\" fill=\"#ffddad\"/><path d=\"M0 160Q125 139 260 163V190H0Z\" fill=\"#859cc1\"/><path d=\"M189 149q49-37 30-77\" fill=\"none\" stroke=\"#8c91a6\" stroke-width=\"18\" stroke-linecap=\"round\"/><ellipse cx=\"124\" cy=\"126\" rx=\"61\" ry=\"53\" fill=\"#b7b9c8\"/><ellipse cx=\"115\" cy=\"138\" rx=\"38\" ry=\"39\" fill=\"#fff7f1\"/><path d=\"M84 80L79 28L117 61Q139 54 165 59L194 27L189 87Z\" fill=\"#888c9e\"/><path d=\"M90 72L87 47L112 66M168 67L185 47L182 74\" fill=\"#f5b0b8\"/><ellipse cx=\"137\" cy=\"86\" rx=\"56\" ry=\"45\" fill=\"#a1a6b7\"/><path d=\"M105 79Q135 63 147 85Q163 61 173 88Q176 115 150 130L119 130Q89 111 105 79\" fill=\"#fff8f3\"/><ellipse cx=\"115\" cy=\"97\" rx=\"5\" ry=\"8\" fill=\"#4d5269\"/><ellipse cx=\"160\" cy=\"95\" rx=\"5\" ry=\"8\" fill=\"#4d5269\"/><path d=\"M132 114l14 0-7 7Z\" fill=\"#ce8597\"/><path d=\"M140 123q-9 11-17 2m17-2q9 11 17 2\" stroke=\"#9e6f7e\" fill=\"none\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M107 113L73 104m34 15-34 1m91-7 28-11m-28 17 30 1\" stroke=\"#f5f1eb\" stroke-width=\"2\" stroke-linecap=\"round\"/><ellipse cx=\"101\" cy=\"167\" rx=\"23\" ry=\"12\" fill=\"#fff7f3\"/><ellipse cx=\"154\" cy=\"167\" rx=\"22\" ry=\"12\" fill=\"#fff7f3\"/><circle cx=\"34\" cy=\"165\" r=\"5\" fill=\"#e6b6cc\"/><circle cx=\"47\" cy=\"167\" r=\"3\" fill=\"#f0cf9b\"/>",
cow:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#e8f2ff\"/><circle cx=\"212\" cy=\"38\" r=\"18\" fill=\"#ffe1a6\"/><path d=\"M0 121q50-47 95-12t90-4t75 8V190H0Z\" fill=\"#b5c9b5\"/><path d=\"M0 147Q110 118 260 148V190H0Z\" fill=\"#83bb91\"/><ellipse cx=\"135\" cy=\"122\" rx=\"77\" ry=\"42\" fill=\"#fffaf0\" stroke=\"#d1cfca\" stroke-width=\"2\"/><path d=\"M97 95q39-5 37 25q-20 7-38-4q-8-8 1-21m78 1q28 3 24 25q-19 13-37-2q-6-13 13-23\" fill=\"#606678\"/><rect x=\"88\" y=\"142\" width=\"18\" height=\"37\" rx=\"7\" fill=\"#eee6e2\"/><rect x=\"160\" y=\"143\" width=\"18\" height=\"36\" rx=\"7\" fill=\"#eee6e2\"/><path d=\"M190 106q32-7 34 19\" fill=\"none\" stroke=\"#626675\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M49 76Q27 42 53 52L78 66M103 65q34-29 37-7l-29 28\" fill=\"#eeb7c5\"/><path d=\"M56 56L60 44l13 18m42-4 12-13 2 19\" stroke=\"#ded1ac\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><ellipse cx=\"80\" cy=\"93\" rx=\"51\" ry=\"45\" fill=\"#fff9ef\" stroke=\"#d3cfcb\" stroke-width=\"2\"/><ellipse cx=\"60\" cy=\"91\" rx=\"7\" ry=\"10\" fill=\"#333c53\"/><ellipse cx=\"98\" cy=\"91\" rx=\"7\" ry=\"10\" fill=\"#333c53\"/><ellipse cx=\"80\" cy=\"119\" rx=\"35\" ry=\"25\" fill=\"#f4b9c6\"/><ellipse cx=\"68\" cy=\"118\" rx=\"4\" ry=\"6\" fill=\"#a96b80\"/><ellipse cx=\"91\" cy=\"118\" rx=\"4\" ry=\"6\" fill=\"#a96b80\"/><path d=\"M75 133q5 5 10 0\" fill=\"none\" stroke=\"#ae6a7c\" stroke-width=\"2.4\"/><path d=\"M16 169l6-10 6 10m204-7 7-13 7 13\" stroke=\"#6baf78\" stroke-width=\"5\" fill=\"none\"/>",
crown:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#ece9ff\"/><path d=\"M0 120Q50 78 110 116Q188 65 260 125V190H0Z\" fill=\"#b7aacd\"/><circle cx=\"211\" cy=\"40\" r=\"23\" fill=\"#fce4ba\"/><ellipse cx=\"132\" cy=\"157\" rx=\"100\" ry=\"23\" fill=\"#6f7393\"/><ellipse cx=\"131\" cy=\"150\" rx=\"88\" ry=\"21\" fill=\"#424b73\"/><path d=\"M59 117L56 63L94 90L132 38L167 90L209 64L201 119Q133 146 59 117Z\" fill=\"#f8c86d\" stroke=\"#ad824a\" stroke-width=\"5\" stroke-linejoin=\"round\"/><path d=\"M59 109q72 18 143 0v23q-72 21-143-1Z\" fill=\"#d69d50\" stroke=\"#ad824a\" stroke-width=\"3\"/><path d=\"M62 114q67 16 137 0\" fill=\"none\" stroke=\"#fff5ca\" stroke-width=\"3\"/><circle cx=\"56\" cy=\"62\" r=\"8\" fill=\"#ffe1a0\" stroke=\"#ad824a\" stroke-width=\"2\"/><circle cx=\"132\" cy=\"37\" r=\"9\" fill=\"#ffe1a0\" stroke=\"#ad824a\" stroke-width=\"2\"/><circle cx=\"210\" cy=\"63\" r=\"8\" fill=\"#ffe1a0\" stroke=\"#ad824a\" stroke-width=\"2\"/><path d=\"M130 83l15 15-15 17-15-17Z\" fill=\"#7ab6dc\" stroke=\"#f9f3d8\" stroke-width=\"3\"/><circle cx=\"92\" cy=\"105\" r=\"9\" fill=\"#d778a4\" stroke=\"#fff5d9\" stroke-width=\"3\"/><circle cx=\"168\" cy=\"105\" r=\"9\" fill=\"#86c9b6\" stroke=\"#fff5d9\" stroke-width=\"3\"/><circle cx=\"117\" cy=\"124\" r=\"3\" fill=\"#fff4ca\"/><circle cx=\"142\" cy=\"124\" r=\"3\" fill=\"#fff4ca\"/><path d=\"M40 34l5 9 9 4-9 5-5 8-4-8-9-5 9-4ZM220 85l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#ffe5aa\"/>",
candle:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#efeafa\"/><path d=\"M0 128q65-40 130-10q60-30 130 0V190H0Z\" fill=\"#b6b3d7\"/><circle cx=\"213\" cy=\"33\" r=\"18\" fill=\"#f9d3aa\"/><rect x=\"0\" y=\"153\" width=\"260\" height=\"37\" fill=\"#bca4a0\"/><ellipse cx=\"130\" cy=\"157\" rx=\"79\" ry=\"20\" fill=\"#7b829b\"/><ellipse cx=\"130\" cy=\"149\" rx=\"68\" ry=\"13\" fill=\"#e7d8bc\"/><rect x=\"90\" y=\"66\" width=\"81\" height=\"86\" rx=\"13\" fill=\"#fff0dd\" stroke=\"#d2bba7\" stroke-width=\"3\"/><ellipse cx=\"130\" cy=\"66\" rx=\"41\" ry=\"12\" fill=\"#fff8ee\" stroke=\"#d2bba7\" stroke-width=\"3\"/><ellipse cx=\"130\" cy=\"69\" rx=\"33\" ry=\"7\" fill=\"#e7d3bc\"/><path d=\"M130 66V40\" stroke=\"#75636a\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M129 18Q153 42 131 54Q113 49 121 36Z\" fill=\"#ffad55\"/><path d=\"M129 26q12 16 1 23q-9-7-1-23\" fill=\"#fff2a6\"/><path d=\"M105 117q12-18 23 1q-9 17-23-1m25-18q16-16 25 1q-12 15-25-1\" fill=\"#ecb5b6\"/><path d=\"M116 114q10-18 11-33m14 19q-1 20 13 30\" stroke=\"#7f9c84\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"118\" cy=\"112\" r=\"4\" fill=\"#e4a978\"/><circle cx=\"145\" cy=\"102\" r=\"4\" fill=\"#e4a978\"/><path d=\"M26 30l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#ffdfb7\"/>",
clock:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#edf0ff\"/><path d=\"M0 123q55-35 110-14q67-35 150 2V190H0Z\" fill=\"#c6bfd7\"/><circle cx=\"213\" cy=\"39\" r=\"21\" fill=\"#ffdfb3\"/><rect x=\"0\" y=\"162\" width=\"260\" height=\"28\" fill=\"#a9a4aa\"/><path d=\"M77 77L54 56q-12-15 7-25q20-9 42 11l13 28M176 72l22-28q15-19 28-9q16 13 0 30l-28 19\" fill=\"#797b99\" stroke=\"#626681\" stroke-width=\"4\"/><path d=\"M86 164l-12 18m109-18 12 18\" stroke=\"#5d657f\" stroke-width=\"12\" stroke-linecap=\"round\"/><circle cx=\"133\" cy=\"108\" r=\"75\" fill=\"#6f7894\" stroke=\"#59637e\" stroke-width=\"5\"/><circle cx=\"133\" cy=\"108\" r=\"62\" fill=\"#fff4df\" stroke=\"#c7bda9\" stroke-width=\"4\"/><circle cx=\"133\" cy=\"108\" r=\"5\" fill=\"#6b6876\"/><path d=\"M133 108L100 87M133 108l34-37\" stroke=\"#464f69\" stroke-width=\"7\" stroke-linecap=\"round\"/><g stroke=\"#8a8185\" stroke-width=\"3\"><path d=\"M133 53v10M133 153v10M79 108h10M177 108h10M104 65l5 8M157 145l6 8M88 80l8 5M170 130l9 6M163 65l-5 8M109 145l-6 8M177 80l-8 5M96 130l-8 6\"/></g><circle cx=\"63\" cy=\"43\" r=\"4\" fill=\"#f4b8a2\"/><circle cx=\"214\" cy=\"105\" r=\"5\" fill=\"#e5c6e2\"/>",
cup:"<rect width=\"260\" height=\"190\" rx=\"25\" fill=\"#ecebff\"/><path d=\"M0 127q68-34 128-9q65-34 132 2V190H0Z\" fill=\"#b7b2d3\"/><circle cx=\"213\" cy=\"39\" r=\"20\" fill=\"#ffe2b8\"/><rect x=\"0\" y=\"155\" width=\"260\" height=\"35\" fill=\"#c9b4ae\"/><ellipse cx=\"128\" cy=\"157\" rx=\"87\" ry=\"17\" fill=\"#a89ca5\"/><path d=\"M80 83H168V133q-4 26-43 27q-42-1-45-27Z\" fill=\"#fff3e4\" stroke=\"#bba9a8\" stroke-width=\"4\"/><path d=\"M167 95q45-2 38 28q-5 21-38 16\" fill=\"none\" stroke=\"#eadccb\" stroke-width=\"16\"/><path d=\"M167 95q45-2 38 28q-5 21-38 16\" fill=\"none\" stroke=\"#a8a0ad\" stroke-width=\"3\"/><ellipse cx=\"124\" cy=\"83\" rx=\"44\" ry=\"12\" fill=\"#fff7ec\" stroke=\"#baacaa\" stroke-width=\"3\"/><ellipse cx=\"125\" cy=\"83\" rx=\"36\" ry=\"7\" fill=\"#ae806a\"/><path d=\"M103 64q-14-12 0-25m27 25q-13-15 0-28m24 28q14-14 1-28\" fill=\"none\" stroke=\"#fff8ef\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"116\" cy=\"119\" r=\"13\" fill=\"#e4a8b5\"/><circle cx=\"134\" cy=\"130\" r=\"11\" fill=\"#f2c3b1\"/><circle cx=\"114\" cy=\"119\" r=\"5\" fill=\"#f9e8c0\"/><circle cx=\"132\" cy=\"130\" r=\"4\" fill=\"#f8e8d1\"/><path d=\"M124 135q-9 13-19 14m19-14q17 11 27 4\" stroke=\"#7ea88a\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/>"
};
const WORDS=[
  {
    "id": "cat",
    "name": "Cat",
    "color": "#edf0ff",
    "sentence": "The cat is cute."
  },
  {
    "id": "cow",
    "name": "Cow",
    "color": "#e8f7ed",
    "sentence": "The cow is on the farm."
  },
  {
    "id": "crown",
    "name": "Crown",
    "color": "#f2ebff",
    "sentence": "This is a crown."
  },
  {
    "id": "candle",
    "name": "Candle",
    "color": "#fff1e7",
    "sentence": "This is a candle."
  },
  {
    "id": "clock",
    "name": "Clock",
    "color": "#e8efff",
    "sentence": "This is a clock."
  },
  {
    "id": "cup",
    "name": "Cup",
    "color": "#fff0ef",
    "sentence": "This is my cup."
  }
];
const KEY="raghd-letter-c-garden-v1";
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
function play(key){if(audio){audio.pause();audio=null;}const voice=state.voice==="heart"?"heart":"bella";const audioKey=key==="letter-name"?"letter-c":key==="letter-sound"?"c-sound":key.startsWith("word-")?"vocab-"+key.slice(5):key;const a=new Audio("week7/audio/kokoro/"+voice+"/"+audioKey+".mp3?v=20261021-2");a.preload="auto";a.playbackRate=Number(state.speed)||0.78;audio=a;$("audioStatus").textContent="";a.onplaying=()=>{$("audioStatus").textContent="🔊 "+voice+" • Listen and repeat!";};a.onended=()=>{if(audio===a)$("audioStatus").textContent="🌷 Your turn! Say it aloud.";};a.onerror=()=>{if(audio===a)$("audioStatus").textContent="🔈 Recording unavailable. Please reconnect and try again.";};a.play().catch(()=>{if(audio===a)$("audioStatus").textContent="Tap Listen again to play the recording.";});}
function wordsView(){$("words").innerHTML=WORDS.map(w=>'<article class="word-card '+(state.learned.includes(w.id)?"learned":"")+'"><span class="sticker">'+(state.learned.includes(w.id)?"⭐":"🌷")+'</span><div class="illustration" style="--tile:'+w.color+'" data-word="'+w.id+'">'+art(w.id)+'</div><div class="word-body"><strong>'+w.name+'</strong><small>'+w.sentence+'</small><div class="word-actions"><button type="button" class="primary" data-hear="'+w.id+'">🔊 Word</button><button type="button" class="softbtn" data-sentence="'+w.id+'">🔁 Again</button></div></div></article>').join("");
 $("words").querySelectorAll("[data-word],[data-hear]").forEach(e=>e.addEventListener("click",()=>{const id=e.dataset.word||e.dataset.hear;play("word-"+id);learn(id)}));
 $("words").querySelectorAll("[data-sentence]").forEach(e=>e.addEventListener("click",()=>{const id=e.dataset.sentence;play("word-"+id);learn(id)}))}
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
function renderRewards(){const total=state.learned.length+(state.best.listen||0)+(state.best.picture||0);$("awardHeading").textContent=total>=25?"Superstar Raghd! 🌟":state.learned.length===6?"A lovely word gardener! 🌸":"Keep growing, Raghd!";$("awardMessage").textContent="You have earned "+total+" stars. You know "+state.learned.length+" of our six C words!";
 const badges=[["🌱","First sprout","Learn one word",state.learned.length>=1],["🌷","Word bouquet","Learn all six words",state.learned.length===6],["🎧","Listening hero","Score 6+ in Hear & Pick",state.best.listen>=6],["🖼️","Picture detective","Score 6+ in Look & Pick",state.best.picture>=6],["🏆","C champion","Score 12/12 in any game",bestAll()===12],["👑","Garden queen","Score 10+ in both games",state.best.listen>=10&&state.best.picture>=10]];
 $("badges").innerHTML=badges.map(b=>'<div class="badge-card '+(b[3]?"":"locked")+'"><div>'+b[0]+'</div><b>'+b[1]+'</b><small>'+b[2]+'</small></div>').join("")}
function enableCanvas(id){const c=$(id),g=c.getContext("2d");let active=false,last=null;function resize(){const r=c.getBoundingClientRect();if(!r.width)return;const d=Math.min(window.devicePixelRatio||1,2);const old=document.createElement("canvas");old.width=c.width;old.height=c.height;if(old.width)old.getContext("2d").drawImage(c,0,0);c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);g.setTransform(d,0,0,d,0,0);g.lineWidth=7;g.lineCap="round";g.lineJoin="round";g.strokeStyle="#a775d9";if(old.width)g.drawImage(old,0,0,r.width,r.height)}function at(e){const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}c.addEventListener("pointerdown",e=>{e.preventDefault();resizeIfNeeded();c.setPointerCapture(e.pointerId);active=true;last=at(e);g.beginPath();g.moveTo(last.x,last.y)});c.addEventListener("pointermove",e=>{if(!active)return;e.preventDefault();let p=at(e);g.lineTo(p.x,p.y);g.stroke();last=p});for(const n of ["pointerup","pointercancel","lostpointercapture"])c.addEventListener(n,()=>{active=false});function resizeIfNeeded(){if(!c.width)resize()}window.addEventListener("resize",resize);resize();return()=>g.clearRect(0,0,c.width,c.height)}
const wipeBig=enableCanvas("canvasBig"),wipeSmall=enableCanvas("canvasSmall");
$("erase").onclick=()=>{wipeBig();wipeSmall();toast("✨ Ready to write again!")};
$("soundC").onclick=()=>play("letter-name");$("soundCc").onclick=()=>play("letter-sound");
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
