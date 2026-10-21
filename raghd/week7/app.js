"use strict";
const $=id=>document.getElementById(id);
const WORDS=[
{id:"cat",name:"Cat",emoji:"🐱",sentence:"C is for Cat."},
{id:"cup",name:"Cup",emoji:"☕",sentence:"C is for Cup."},
{id:"candle",name:"Candle",emoji:"🕯️",sentence:"C is for Candle."},
{id:"cow",name:"Cow",emoji:"🐄",sentence:"C is for Cow."},
{id:"clock",name:"Clock",emoji:"⏰",sentence:"C is for Clock."},
{id:"crown",name:"Crown",emoji:"👑",sentence:"C is for Crown."}
];
const COVERS=[
{animal:"Turtle",emoji:"🐢",cover:"Shell",desc:"A turtle has a hard shell.",audio:"turtle-shell"},
{animal:"Sheep",emoji:"🐑",cover:"Wool",desc:"A sheep has soft wool.",audio:"sheep-wool"},
{animal:"Bird",emoji:"🐦",cover:"Feathers",desc:"A bird has feathers.",audio:"bird-feathers"},
{animal:"Fish",emoji:"🐠",cover:"Scales",desc:"A fish has scales.",audio:"fish-scales"}
];
const QUESTIONS=[
{emoji:"🐱",text:"What is this?",choices:["Cat","Cow","Cup"],right:0,why:"C is for Cat."},
{emoji:"☕",text:"What is this?",choices:["Candle","Cup","Clock"],right:1,why:"C is for Cup."},
{emoji:"🕯️",text:"What is this?",choices:["Crown","Candle","Cow"],right:1,why:"C is for Candle."},
{emoji:"🐄",text:"What animal is this?",choices:["Cow","Fish","Dog"],right:0,why:"C is for Cow."},
{emoji:"⏰",text:"What is this?",choices:["Cup","Clock","Cat"],right:1,why:"C is for Clock."},
{emoji:"👑",text:"What is this?",choices:["Crown","Clock","Candle"],right:0,why:"C is for Crown."},
{emoji:"🔠",text:"Find the BIG letter C.",choices:["G","C","O"],right:1,why:"Capital C is C."},
{emoji:"🐣🐣🐣🐣🐣🐣🐣",text:"How many chicks?",choices:["6","8","7"],right:2,why:"There are seven chicks."},
{emoji:"🐢",text:"What covers a turtle?",choices:["Wool","Shell","Feathers"],right:1,why:"A turtle has a shell."},
{emoji:"🐑",text:"What covers a sheep?",choices:["Wool","Scales","Shell"],right:0,why:"A sheep has wool."},
{emoji:"🐦",text:"What covers a bird?",choices:["Scales","Wool","Feathers"],right:2,why:"A bird has feathers."},
{emoji:"🐠",text:"What covers a fish?",choices:["Scales","Feathers","Wool"],right:0,why:"A fish has scales."},
{emoji:"👩‍🌾🐮",text:"Who takes care of farm animals?",choices:["A baker","A farmer","A doctor"],right:1,why:"A farmer takes care of farm animals."},
{emoji:"🐶💧",text:"What does a pet need?",choices:["Candy","Water","Soda"],right:1,why:"Pets need clean water."},
{emoji:"🐮",text:"A cow is a ...",choices:["Farm animal","Toy","Fish"],right:0,why:"A cow is a farm animal."},
{emoji:"🐱",text:"Which word starts with C?",choices:["Dog","Fish","Cat"],right:2,why:"Cat starts with C."}
];
const blank=()=>({learned:[],covers:[],chicks:[],petDone:false,numberDone:false,quizAnswers:{},quizFinished:false,best:null});
const KEY="raghd-week7-animal-kingdom-v1";
function load(){try{let v=JSON.parse(localStorage.getItem(KEY)||"null");if(!v||typeof v!=="object")return blank();return {...blank(),...v,learned:Array.isArray(v.learned)?v.learned:[],covers:Array.isArray(v.covers)?v.covers:[],chicks:Array.isArray(v.chicks)?v.chicks:[],quizAnswers:v.quizAnswers&&typeof v.quizAnswers==="object"?v.quizAnswers:{}}}catch(e){return blank()}}
let state=load(),currentWord=0,currentQuestion=0,traceSymbol="C",activeAudio=null,toastTimer=null,petSelections=new Set();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}stats()}
function correctCount(){return QUESTIONS.filter((q,i)=>Number(state.quizAnswers[i])===q.right).length}
function answeredCount(){return QUESTIONS.filter((q,i)=>Object.prototype.hasOwnProperty.call(state.quizAnswers,i)).length}
function stars(){return state.learned.length+state.covers.length+(state.numberDone?2:0)+(state.petDone?2:0)+correctCount()}
function stats(){$("starCount").textContent=stars();$("wordCount").textContent=state.learned.length+" / 6";$("scoreStat").textContent=state.best===null?"—":state.best+" / 16"}
function toast(msg){let el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800)}
function celebrate(){if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;const emojis=["⭐","🌸","✨","💛","🌟"];for(let i=0;i<22;i++){const s=document.createElement("span");s.className="confetti";s.textContent=emojis[i%emojis.length];s.style.setProperty("--x",Math.random()*100+"vw");s.style.setProperty("--dur",(2+Math.random()*1.4)+"s");s.style.animationDelay=Math.random()*.4+"s";document.body.appendChild(s);setTimeout(()=>s.remove(),4200)}}
function playSuccess(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A();for(const [i,f] of [523,659,784].entries()){let o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,c.currentTime+i*.12);g.gain.exponentialRampToValueAtTime(.06,c.currentTime+i*.12+.025);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+i*.12+.2);o.connect(g).connect(c.destination);o.start(c.currentTime+i*.12);o.stop(c.currentTime+i*.12+.22)}setTimeout(()=>c.close().catch(()=>{}),1000)}catch(e){}}
function win(msg){toast(msg);playSuccess();celebrate()}
function openTab(id){document.querySelectorAll(".section").forEach(s=>s.hidden=s.id!==id);document.querySelectorAll(".tab").forEach(b=>{b.classList.toggle("active",b.dataset.tab===id);b.setAttribute("aria-current",b.dataset.tab===id?"page":"false")});if(id==="letter"){requestAnimationFrame(()=>resizeCanvas())}if(id==="games")renderQuiz();if(id==="rewards")renderRewards();window.scrollTo({top:document.querySelector(".tabs").offsetTop,behavior:"smooth"})}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.tab)));
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{if(b.textContent.includes("Trace 7")){traceSymbol="7";syncTraceButtons()}openTab(b.dataset.open)}));
function soundStatus(message,bad=false){$("audioStatus").textContent=message;$("audioStatus").classList.toggle("error",bad)}
function stopAudio(){if(activeAudio){activeAudio.pause();activeAudio.removeAttribute("src");activeAudio.load();activeAudio=null}}
function say(key){stopAudio();let voice=$("voice").value,speed=Number($("speed").value);const audio=new Audio("audio/kokoro/"+encodeURIComponent(voice)+"/"+encodeURIComponent(key)+".mp3");activeAudio=audio;audio.playbackRate=speed;audio.onplaying=()=>soundStatus("🔊 "+voice+" is reading. Listen and repeat!");audio.onended=()=>{if(activeAudio===audio)soundStatus("🌷 Your turn! Say it aloud.")};audio.onerror=()=>{if(activeAudio===audio)soundStatus("Kokoro voice recording for this item hasn't been uploaded yet. No browser voice is used.",true)};audio.play().catch(()=>{if(activeAudio===audio)soundStatus("Audio unavailable. This lesson never switches to browser speech.",true)})}
$("testVoice").onclick=()=>say("intro");$("stopVoice").onclick=()=>{stopAudio();soundStatus("⏹ Stopped.")};
document.querySelectorAll("[data-say]").forEach(b=>b.addEventListener("click",()=>say(b.dataset.say)));
$("voice").onchange=()=>{stopAudio();soundStatus("Teacher: "+$("voice").selectedOptions[0].textContent+". Press ▶ Try voice.")};
$("speed").onchange=()=>{if(activeAudio)activeAudio.playbackRate=Number($("speed").value)};
window.addEventListener("pagehide",stopAudio);
function renderWords(){
$("wordTiles").innerHTML="";
WORDS.forEach((w,i)=>{const b=document.createElement("button");b.innerHTML="<span aria-hidden='true'>"+w.emoji+"</span>"+w.name+(state.learned.includes(w.id)?" ✓":"");b.classList.toggle("selected",i===currentWord);b.setAttribute("aria-pressed",String(i===currentWord));b.onclick=()=>pickWord(i);$("wordTiles").appendChild(b)});
const w=WORDS[currentWord];$("wordEmoji").textContent=w.emoji;$("wordTitle").textContent=w.name;$("wordSentence").textContent=w.sentence;$("wordPosition").textContent="WORD "+(currentWord+1)+" / 6";
}
function pickWord(i){currentWord=(i+WORDS.length)%WORDS.length;let w=WORDS[currentWord];if(!state.learned.includes(w.id)){state.learned.push(w.id);save();if(state.learned.length===6)win("🏆 You found all six C words!")}renderWords()}
$("wordListen").onclick=()=>say(WORDS[currentWord].id);
$("wordNext").onclick=()=>pickWord(currentWord+1);
let canvas=$("writeCanvas"),ctx=canvas.getContext("2d"),drawing=false,last=null;
function syncTraceButtons(){[["traceCapital","C"],["traceSmall","c"],["traceSeven","7"]].forEach(([id,s])=>$(id).classList.toggle("active",traceSymbol===s))}
function drawGuides(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.save();ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold "+Math.min(h*.75,w*.42)+"px system-ui";ctx.fillStyle="#e3d6fa";ctx.fillText(traceSymbol,w/2,h/2+1);ctx.strokeStyle="#b0add6";ctx.lineWidth=1.7;ctx.setLineDash([9,8]);ctx.strokeText(traceSymbol,w/2,h/2+1);ctx.restore()}
function resizeCanvas(){if(!$("letter")||$("letter").hidden)return;const b=canvas.getBoundingClientRect();if(b.width<5)return;const d=Math.min(devicePixelRatio||1,2.5);canvas.width=Math.max(1,Math.round(b.width*d));canvas.height=Math.round(b.height*d);ctx.setTransform(d,0,0,d,0,0);ctx.lineCap="round";ctx.lineJoin="round";drawGuides()}
[["traceCapital","C"],["traceSmall","c"],["traceSeven","7"]].forEach(([id,s])=>$(id).onclick=()=>{traceSymbol=s;syncTraceButtons();drawGuides()});
$("clearDraw").onclick=()=>{drawGuides();toast("Fresh page! Try again ✏️")};
$("saveDraw").onclick=()=>{const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download="raghd-write-"+(traceSymbol==="7"?"7":traceSymbol==="C"?"big-c":"small-c")+".png";a.click();toast("🌟 Your handwriting picture is ready!")};
function point(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener("pointerdown",e=>{e.preventDefault();drawing=true;last=point(e);canvas.setPointerCapture?.(e.pointerId);ctx.fillStyle="#a54f89";ctx.beginPath();ctx.arc(last.x,last.y,3.4,0,Math.PI*2);ctx.fill()});
canvas.addEventListener("pointermove",e=>{if(!drawing)return;e.preventDefault();let p=point(e);ctx.beginPath();ctx.strokeStyle="#ad4a83";ctx.lineWidth=6;ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p});
["pointerup","pointercancel","lostpointercapture"].forEach(t=>canvas.addEventListener(t,()=>drawing=false));
window.addEventListener("resize",()=>{if(!$("letter").hidden)resizeCanvas()});
function renderChicks(){$("chicks").innerHTML="";for(let i=0;i<7;i++){const b=document.createElement("button");b.className="chick"+(state.chicks.includes(i)?" tapped":"");b.textContent="🐥";b.setAttribute("aria-label","Chick "+(i+1));b.setAttribute("aria-pressed",String(state.chicks.includes(i)));b.onclick=()=>{if(state.chicks.includes(i))return;state.chicks.push(i);save();renderChicks();if(state.chicks.length===7)win("🐥 1, 2, 3, 4, 5, 6, 7! Great counting!")};$("chicks").appendChild(b)}$("chickProgress").textContent=state.chicks.length+" of 7"}
$("resetChicks").onclick=()=>{state.chicks=[];save();renderChicks();toast("Let's count again!")};
function renderNumberChoices(){$("numberChoices").innerHTML="";[5,6,7,8].forEach(n=>{let b=document.createElement("button");b.className="number-pick"+(state.numberDone&&n===7?" good":"");b.textContent=n;b.onclick=()=>{if(state.numberDone)return;if(n===7){state.numberDone=true;save();renderNumberChoices();$("numberFeedback").innerHTML='<div class="feedback">🌟 Seven! You got it!</div>';win("🎉 Seven is correct!")}else{$("numberFeedback").innerHTML='<div class="feedback bad">Try again. Count the chicks slowly! 🐣</div>';b.classList.add("bad")}};$("numberChoices").appendChild(b)})}
function renderCovers(){$("coverTiles").innerHTML="";COVERS.forEach(c=>{let b=document.createElement("button"),revealed=state.covers.includes(c.animal);b.className="cover-tile"+(revealed?" revealed":"");b.innerHTML='<span class="icon" aria-hidden="true">'+c.emoji+'</span><b>'+c.animal+'</b><small>'+(revealed?c.cover:"Tap to discover ✨")+"</small>";b.onclick=()=>{if(!state.covers.includes(c.animal)){state.covers.push(c.animal);save();if(state.covers.length===4)win("🌱 Animal coverings explorer!")}renderCovers();say(c.audio)};$("coverTiles").appendChild(b)})}
const PET_OPTIONS=[["🥣","Food",true],["💧","Water",true],["🏠","A home",true],["🍭","Candy",false],["🥤","Soda",false]];
function renderPets(){$("petChoices").innerHTML="";PET_OPTIONS.forEach(([emoji,label])=>{let b=document.createElement("button");b.className="option"+(petSelections.has(label)?" selected":"");b.textContent=emoji+" "+label;b.setAttribute("aria-pressed",String(petSelections.has(label)));b.onclick=()=>{if(petSelections.has(label))petSelections.delete(label);else petSelections.add(label);renderPets()};$("petChoices").appendChild(b)})}
$("checkPet").onclick=()=>{const good=["Food","Water","A home"];let okay=petSelections.size===3&&good.every(x=>petSelections.has(x));if(okay){state.petDone=true;save();$("petFeedback").innerHTML='<div class="feedback">🐶 Thank you! Food, water and a safe home keep the pet happy.</div>';win("💗 You're a wonderful pet helper!")}else{$("petFeedback").innerHTML='<div class="feedback bad">Try again! A pet needs food, water and a safe home.</div>'}};
$("resetPet").onclick=()=>{petSelections.clear();$("petFeedback").innerHTML="";renderPets()};
function renderQuiz(){
$("questionCounter").textContent="Question "+(currentQuestion+1)+" of "+QUESTIONS.length;
$("quizProgressLabel").textContent=answeredCount()+" answered";
$("quizBar").style.width=(100*answeredCount()/QUESTIONS.length)+"%";
$("questionMap").innerHTML="";
QUESTIONS.forEach((q,i)=>{const b=document.createElement("button");b.textContent=i+1;let chosen=state.quizAnswers[i],answered=Object.prototype.hasOwnProperty.call(state.quizAnswers,i);b.className=(answered?(Number(chosen)===q.right?"good":"bad"):"")+(i===currentQuestion?" now":"");b.setAttribute("aria-label","Question "+(i+1)+(answered?(Number(chosen)===q.right?", correct":", incorrect"):", unanswered"));b.onclick=()=>{currentQuestion=i;renderQuiz()};$("questionMap").appendChild(b)});
const q=QUESTIONS[currentQuestion],done=Object.prototype.hasOwnProperty.call(state.quizAnswers,currentQuestion),choice=state.quizAnswers[currentQuestion];const body=$("quizBody");body.innerHTML="";
const e=document.createElement("div");e.className="center";e.style.fontSize=q.emoji.length>10?"clamp(1.5rem,4vw,3rem)":"clamp(5rem,10vw,7rem)";e.style.margin="8px 0";e.textContent=q.emoji;body.appendChild(e);
const title=document.createElement("h3");title.className="task center";title.textContent=q.text;body.appendChild(title);
const listen=document.createElement("div");listen.className="center space";const speak=document.createElement("button");speak.className="smallbtn";speak.textContent="🔊 Listen to question";speak.onclick=()=>say("question-"+(currentQuestion+1));listen.appendChild(speak);body.appendChild(listen);
const grid=document.createElement("div");grid.className="options";q.choices.forEach((txt,i)=>{let b=document.createElement("button");b.className="option"+(done&&i===q.right?" good":"")+(done&&i===Number(choice)&&i!==q.right?" bad":"");b.textContent=txt;b.disabled=done;b.onclick=()=>{if(Object.prototype.hasOwnProperty.call(state.quizAnswers,currentQuestion))return;state.quizAnswers[currentQuestion]=i;save();if(i===q.right){playSuccess();toast("✅ Yes! "+q.why)}else{toast("🌷 Almost! "+q.why)}renderQuiz()};grid.appendChild(b)});body.appendChild(grid);
if(done){const f=document.createElement("div");f.className="feedback"+(Number(choice)===q.right?"":" bad");f.textContent=(Number(choice)===q.right?"✅ Correct! ":"🌷 Correct answer: "+q.choices[q.right]+". ")+q.why;body.appendChild(f)}
$("prevQuestion").disabled=currentQuestion===0;$("nextQuestion").disabled=currentQuestion===QUESTIONS.length-1;
if(!state.quizFinished){$("quizResults").innerHTML=""}else renderResults()}
$("prevQuestion").onclick=()=>{currentQuestion=Math.max(0,currentQuestion-1);renderQuiz()};
$("nextQuestion").onclick=()=>{currentQuestion=Math.min(QUESTIONS.length-1,currentQuestion+1);renderQuiz()};
function renderResults(){const holder=$("quizResults");if(!state.quizFinished){holder.innerHTML="";return}const correct=correctCount(),unanswered=QUESTIONS.length-answeredCount();holder.innerHTML="";
const summary=document.createElement("div");summary.className="panel sun center";summary.innerHTML='<div class="trophy">🏆</div><h2>'+correct+' / 16 Correct!</h2><p>'+(correct===16?"Amazing, Raghd! Perfect safari!":"Every try helps you learn. Let's review!")+'</p><p class="intro">'+unanswered+' unanswered · '+(answeredCount()-correct)+' mistakes</p>';
const buttons=document.createElement("div");buttons.className="row";buttons.style.justifyContent="center";const repeat=document.createElement("button");repeat.className="btn mint";repeat.textContent="🎯 Practise tricky questions";repeat.onclick=retryMistakes;buttons.appendChild(repeat);const trophies=document.createElement("button");trophies.className="btn alt";trophies.textContent="⭐ My Stars";trophies.onclick=()=>openTab("rewards");buttons.appendChild(trophies);summary.appendChild(buttons);holder.appendChild(summary);
const review=document.createElement("div");review.className="panel";review.innerHTML="<h3>📋 Answer Review</h3>";
QUESTIONS.forEach((q,i)=>{let d=document.createElement("div");d.className="reviewitem";let done=Object.prototype.hasOwnProperty.call(state.quizAnswers,i);let correct=done&&Number(state.quizAnswers[i])===q.right;let span=document.createElement("span");span.innerHTML="<b>"+(correct?"✅":"❌")+" "+(i+1)+". "+q.text+"</b><br><small>"+(done?"Your answer: "+q.choices[state.quizAnswers[i]]:"Unanswered")+"</small><br><small>Correct: "+q.choices[q.right]+"</small>";let b=document.createElement("button");b.className="smallbtn";b.textContent="Go to question";b.onclick=()=>{currentQuestion=i;renderQuiz();$("quizBody").scrollIntoView({behavior:"smooth",block:"center"})};d.append(span,b);review.appendChild(d)});holder.appendChild(review)}
function retryMistakes(){let old={...state.quizAnswers};state.quizAnswers={};QUESTIONS.forEach((q,i)=>{if(Object.prototype.hasOwnProperty.call(old,i)&&Number(old[i])===q.right)state.quizAnswers[i]=old[i]});state.quizFinished=false;currentQuestion=QUESTIONS.findIndex((q,i)=>!Object.prototype.hasOwnProperty.call(state.quizAnswers,i));if(currentQuestion<0)currentQuestion=0;save();renderQuiz();toast("🌷 Let's practise the tricky ones!")}
$("finishQuiz").onclick=()=>{state.quizFinished=true;state.best=Math.max(state.best===null?0:state.best,correctCount());save();renderQuiz();if(correctCount()===16)win("🏆 PERFECT SAFARI! All 16 correct!");$("quizResults").scrollIntoView({behavior:"smooth",block:"start"})};
$("newQuiz").onclick=()=>{if(answeredCount()>0&&!confirm("Start a new quiz? Your previous answers will reset (best score stays saved)."))return;state.quizAnswers={};state.quizFinished=false;currentQuestion=0;save();renderQuiz();toast("New safari! You can do it!")};
function renderRewards(){const names=[["📚","C Word Collector",state.learned.length===6],["🐥","7 Chick Counter",state.chicks.length===7],["🐢","Animal Scientist",state.covers.length===4],["🐶","Kind Pet Helper",state.petDone],["🎯","Quiz Explorer",answeredCount()===16],["🏆","Safari Superstar",state.best===16]];const unlocked=names.filter(x=>x[2]).length;$("rewardHeading").textContent=unlocked>=5?"You're a superstar, Raghd! ⭐":"Keep exploring, Raghd!";$("rewardDescription").textContent=unlocked+" of 6 badges unlocked · "+stars()+" stars collected.";const holder=$("badges");holder.innerHTML="";names.forEach(([emoji,label,yes])=>{let d=document.createElement("div");d.className="badgecard"+(yes?"":" locked");d.innerHTML="<i>"+emoji+"</i><b>"+label+"</b><p class='hint'>"+(yes?"Unlocked! 🌟":"Keep practising 🔒")+"</p>";holder.appendChild(d)});$("learnedWords").innerHTML="";WORDS.forEach(w=>{let span=document.createElement("span");span.className="pill";span.textContent=w.emoji+" "+w.name+(state.learned.includes(w.id)?" ⭐":"");$("learnedWords").appendChild(span)})}
stats();renderWords();renderChicks();renderNumberChoices();renderCovers();renderPets();renderQuiz();renderRewards();syncTraceButtons();
