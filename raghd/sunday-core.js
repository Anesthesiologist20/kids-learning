(()=>{"use strict";
const $=id=>document.getElementById(id);
const words=[["Nest","🪺","word-nest"],["Nose","👃","word-nose"],["Net","🥅","word-net"],["Nurse","👩‍⚕️","word-nurse"],["Nut","🥜","word-nut"],["Nine","9️⃣","word-nine"]];
const properties=[
 ["🐦","Move","Living things can move.","can-move"],
 ["🌱","Grow","Living things can grow.","can-grow"],
 ["🐰🥕","Eat and drink","Living things can eat and drink.","can-eat"],
 ["🐶🌬️","Breathe","Living things can breathe.","can-breathe"],
 ["🐣🥚","Give birth or lay eggs","Living things can give birth or lay eggs.","slide-06"],
 ["🐈❤️","Feel","Living things can feel.","can-feel"]
];
const needs=[["🍎","Food","need-food"],["🌬️","Air","need-air"],["🏡","Home","need-home"]];
const names=["One","Two","Three","Four","Five","Six"];
const voiceKey="raghd-sunday-voice-v2",rateKey="raghd-sunday-rate-v2",version="v=20261013c";
let voice="layla",rate="0.95",playback=null;
try{voice=localStorage.getItem(voiceKey)==="amy"?"amy":"layla";rate=["0.85","0.95","1"].includes(localStorage.getItem(rateKey))?localStorage.getItem(rateKey):"0.95"}catch(e){}
function showVoice(){
 document.querySelectorAll("[data-voice]").forEach(b=>{const sel=b.dataset.voice===voice;b.classList.toggle("active",sel);b.setAttribute("aria-pressed",String(sel));});
 $("audio-rate").value=rate;
 $("voice-now").textContent="🎧 Now playing: "+(voice==="amy"?"Amy • Natural and Sweet":"Layla • Calm and Gentle")+". You can switch anytime.";
}
window.raghdAudio=function(key){
 if(playback){playback.pause();playback.currentTime=0;}
 const warning=$("warning");warning.classList.remove("show");warning.style.display="none";
 const src="audio/sunday-"+voice+"-"+key+".mp3?"+version;
 playback=new Audio(src);playback.preload="auto";playback.playbackRate=Number(rate);
 const started=playback.play();
 if(started&&started.catch)started.catch(()=>{
   warning.classList.add("show");warning.style.display="block";
   warning.textContent="🔊 This ElevenLabs recording is not available yet. Please refresh the page after the audio publish completes.";
 });
};
document.addEventListener("click",e=>{const b=e.target.closest("[data-audio]");if(b)window.raghdAudio(b.dataset.audio);});
document.querySelectorAll("[data-voice]").forEach(b=>b.onclick=()=>{
 voice=b.dataset.voice;try{localStorage.setItem(voiceKey,voice)}catch(e){}showVoice();window.raghdAudio("intro");
});
$("audio-rate").onchange=e=>{rate=e.target.value;try{localStorage.setItem(rateKey,rate)}catch(e){}if(playback)playback.playbackRate=Number(rate);showVoice();};
$("sample-voice").onclick=()=>window.raghdAudio("intro");showVoice();

$("word-list").innerHTML=words.map(w=>'<div class="word"><div class="iconbig">'+w[1]+'</div><strong>'+w[0]+'</strong><button class="btn light" data-audio="'+w[2]+'">🔊 Listen & repeat</button></div>').join("");
$("property-list").innerHTML=properties.map((p,i)=>'<div class="oral" id="property-'+i+'"><div class="visual">'+p[0]+'</div><small>SAY IT FIRST</small><strong>'+p[1]+'</strong><p>'+p[2]+'</p><button class="btn light" data-property="'+i+'">👀 Show & hear</button></div>').join("");
document.querySelectorAll("[data-property]").forEach(b=>b.onclick=()=>{
 const n=+b.dataset.property,c=$("property-"+n);c.classList.add("reveal");b.textContent="🔊 Repeat the sentence";window.raghdAudio(properties[n][3]);
});
$("need-list").innerHTML=needs.map(n=>'<div class="need"><div class="iconbig">'+n[0]+'</div><strong>'+n[1]+'</strong><button class="btn green" data-audio="'+n[2]+'">🔊 Hear full sentence</button></div>').join("");
$("number-list").innerHTML=names.map((n,i)=>'<div class="num"><strong>'+(i+1)+'</strong><div class="stars">'+"⭐".repeat(i+1)+'</div><span>'+n+'</span><button class="btn" data-audio="number-'+(i+1)+'">🔊 '+n+'</button></div>').join("");

let completed={};
try{completed=JSON.parse(localStorage.getItem("raghd-sunday-lessons")||"{}")}catch(e){}
function progress(){const sum=["n","science","math"].filter(k=>completed[k]).length;$("progress-bar").style.width=(sum*100/3)+"%";$("progress-text").textContent=sum+" / 3";document.querySelectorAll("[data-complete]").forEach(b=>{if(completed[b.dataset.complete])b.textContent="✅ Finished!";});}
document.querySelectorAll("[data-complete]").forEach(b=>b.onclick=()=>{
 completed[b.dataset.complete]=true;try{localStorage.setItem("raghd-sunday-lessons",JSON.stringify(completed))}catch(e){}
 progress();window.raghdAudio("great");
});progress();

const oralDeck=properties.map(p=>[p[0],p[2],p[3],"oral-question"]).concat(needs.map(n=>[n[0],"Living things need "+n[1].toLowerCase()+".",n[2],"oral-needs"]));
let oral=0,shown=false;
let mastered=new Set();
try{const saved=JSON.parse(localStorage.getItem("raghd-sunday-oral-v2")||"[]");if(Array.isArray(saved))mastered=new Set(saved.filter(x=>Number.isInteger(x)&&x>=0&&x<oralDeck.length));}catch(e){}
function showOral(){
 $("oral-number").textContent="Picture "+(oral+1)+" / "+oralDeck.length;
 $("oral-pic").textContent=oralDeck[oral][0];
 $("oral-text").textContent=shown?oralDeck[oral][1]:"What can it do or need?";
 $("oral-text").className="answer"+(shown?"":" hidden");
 $("oral-reveal").textContent=shown?"🔊 Hear again":"👀 Reveal & listen";
 $("oral-mastery").textContent=mastered.size+" / "+oralDeck.length+" pictures spoken with confidence";
 $("oral-mastered").textContent=mastered.has(oral)?"✅ Said it!":"⭐ I said it!";
}
$("oral-reveal").onclick=()=>{shown=true;showOral();window.raghdAudio(oralDeck[oral][2]);};
$("oral-prev").onclick=()=>{oral=(oral+oralDeck.length-1)%oralDeck.length;shown=false;showOral();};
$("oral-next").onclick=()=>{oral=(oral+1)%oralDeck.length;shown=false;showOral();};
$("oral-mastered").onclick=()=>{mastered.add(oral);try{localStorage.setItem("raghd-sunday-oral-v2",JSON.stringify([...mastered]))}catch(e){}if(mastered.size===oralDeck.length)window.raghdAudio("finish");else window.raghdAudio("great");showOral();};
$("oral-repeat").onclick=()=>{shown=false;showOral();window.raghdAudio("oral-ready");};
$("oral-question").onclick=()=>window.raghdAudio(oralDeck[oral][3]);showOral();

// A tactile writing board: one pointer writes, two fingers can scroll the whole page.
function drawing(id){
 const c=$(id),g=c.getContext("2d"),touches=new Map();let drawingNow=false,last=null,mid=null;
 function setup(){
  const b=c.getBoundingClientRect(),old=document.createElement("canvas");
  old.width=c.width;old.height=c.height;if(old.width&&old.height)old.getContext("2d").drawImage(c,0,0);
  const ratio=Math.min(2,window.devicePixelRatio||1);c.width=Math.max(1,Math.round(b.width*ratio));c.height=Math.max(1,Math.round(b.height*ratio));
  g.setTransform(ratio,0,0,ratio,0,0);g.strokeStyle="#795dbe";g.lineWidth=5;g.lineJoin="round";g.lineCap="round";
  if(old.width&&old.height)g.drawImage(old,0,0,old.width,old.height,0,0,b.width,b.height);
 }
 function pt(e){const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
 function average(){let y=0;touches.forEach(p=>y+=p.y);return y/touches.size;}
 c.addEventListener("pointerdown",e=>{
  if(e.cancelable)e.preventDefault();c.setPointerCapture?.(e.pointerId);
  const p=pt(e);touches.set(e.pointerId,p);
  if(touches.size===1){
   drawingNow=true;last=p;g.beginPath();g.arc(p.x,p.y,2.5,0,Math.PI*2);g.fillStyle="#795dbe";g.fill();
  }else{drawingNow=false;last=null;mid=average();}
 });
 c.addEventListener("pointermove",e=>{
  if(!touches.has(e.pointerId))return;if(e.cancelable)e.preventDefault();
  const p=pt(e);touches.set(e.pointerId,p);
  if(touches.size>=2){const now=average();if(mid!==null)window.scrollBy(0,mid-now);mid=now;return;}
  if(!drawingNow||!last)return;
  g.beginPath();g.moveTo(last.x,last.y);g.lineTo(p.x,p.y);g.stroke();last=p;
 });
 function end(e){touches.delete(e.pointerId);drawingNow=false;last=null;mid=touches.size>=2?average():null;}
 c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);
 window.addEventListener("resize",setup);setup();
 return ()=>g.clearRect(0,0,c.width,c.height);
}
const clearN=drawing("write-N"),clearn=drawing("write-n"),clearNum=drawing("write-number");
$("clear-letters").onclick=()=>{clearN();clearn();};
let digit=1;
function setDigit(){clearNum();$("digit-ghost").textContent=String(digit);$("digit-label").textContent="Write number "+digit;$("digit-speak").textContent="🔊 "+names[digit-1];}
$("digit-prev").onclick=()=>{digit=(digit+4)%6+1;setDigit();window.raghdAudio("number-"+digit);};
$("digit-next").onclick=()=>{digit=digit%6+1;setDigit();window.raghdAudio("number-"+digit);};
$("digit-speak").onclick=()=>window.raghdAudio("number-"+digit);
$("clear-number").onclick=clearNum;

// Letter hunt: six actual N/n targets, no misleading praise for wrong letters.
const huntSource=["N","h","n","M","N","u","P","n","N","m","n","H"];
let huntFound=new Set(),huntOrder=[];
function makeHunt(){
 huntFound.clear();huntOrder=huntSource.map((letter,i)=>({letter,id:i})).sort(()=>Math.random()-.5);
 $("letter-hunt").innerHTML=huntOrder.map((v,i)=>'<button type="button" data-hunt="'+i+'">'+v.letter+'</button>').join("");
 $("hunt-feedback").textContent="Find all 6 hidden N letters! ✨";
}
$("letter-hunt").onclick=e=>{
 const b=e.target.closest("[data-hunt]");if(!b)return;const i=+b.dataset.hunt,value=huntOrder[i];if(huntFound.has(value.id))return;
 if(value.letter==="N"||value.letter==="n"){
  huntFound.add(value.id);b.className="found";b.disabled=true;
  $("hunt-feedback").textContent=huntFound.size===6?"🏆 Amazing! You caught every N!":"⭐ Nice! "+huntFound.size+" of 6 found.";
  if(huntFound.size===6)window.raghdAudio("great");
 }else{b.className="miss";$("hunt-feedback").textContent="Not this one. Find a big N or a small n!";window.raghdAudio("try-again");}
};
$("hunt-reset").onclick=()=>{makeHunt();window.raghdAudio("n-spot");};makeHunt();

const sortDeck=[["🐶","Dog","living"],["🪑","Chair","nonliving"],["🌳","Tree","living"],["🚗","Car","nonliving"],["🐠","Fish","living"],["🧸","Teddy bear","nonliving"],["🧒","Child","living"],["🪨","Rock","nonliving"],["🦋","Butterfly","living"],["🚲","Bicycle","nonliving"],["🌼","Flower","living"],["📚","Books","nonliving"]];
let sortAt=0,sortOk=false;
function renderSort(){
 const item=sortDeck[sortAt];$("sort-picture").textContent=item[0];$("sort-label").textContent=item[1];
 $("sort-progress").textContent=(sortAt+1)+" / "+sortDeck.length;$("sort-feedback").textContent="Say it out loud, then choose a basket.";
 $("sort-next").disabled=true;sortOk=false;document.querySelectorAll("[data-sort]").forEach(b=>{b.disabled=false;b.classList.remove("selected","correct","wrong");});
}
document.querySelectorAll("[data-sort]").forEach(b=>b.onclick=()=>{
 if(sortOk)return;
 if(b.dataset.sort===sortDeck[sortAt][2]){
  sortOk=true;b.classList.add("correct");$("sort-feedback").textContent="✅ Correct! "+sortDeck[sortAt][1]+" is "+(sortOk?sortDeck[sortAt][2]:"")+".";
  $("sort-next").disabled=false;window.raghdAudio(sortDeck[sortAt][2]==="living"?"living":"nonliving");
 }else{$("sort-feedback").textContent="Try again! Think: is it alive?";window.raghdAudio("try-again");}
});
$("sort-next").onclick=()=>{sortAt=(sortAt+1)%sortDeck.length;renderSort();};renderSort();

const countDeck=[{n:3,emoji:"🍎"},{n:1,emoji:"🐦"},{n:5,emoji:"🌼"},{n:2,emoji:"🍓"},{n:6,emoji:"⭐"},{n:4,emoji:"🐠"}];
let countAt=0,countOk=false;
function renderCount(){
 const item=countDeck[countAt];$("count-pictures").textContent=item.emoji.repeat(item.n);
 const others=[1,2,3,4,5,6].filter(n=>n!==item.n);
 const options=[item.n,others[(countAt+1)%5],others[(countAt+3)%5]].sort((a,b)=>a-b);
 $("count-choices").innerHTML=options.map(n=>'<button type="button" class="btn" data-count="'+n+'">'+n+'</button>').join("");
 $("count-progress").textContent=(countAt+1)+" / "+countDeck.length;$("count-feedback").textContent="Count carefully. Which number?";
 $("count-next").disabled=true;countOk=false;
}
$("count-choices").onclick=e=>{
 const b=e.target.closest("[data-count]");if(!b||countOk)return;
 if(+b.dataset.count===countDeck[countAt].n){
  countOk=true;b.classList.add("correct");$("count-feedback").textContent="✅ Yes, "+names[countDeck[countAt].n-1]+"!";
  $("count-next").disabled=false;window.raghdAudio("number-"+countDeck[countAt].n);
 }else{b.classList.add("wrong");$("count-feedback").textContent="Try again. Point and count!";window.raghdAudio("try-again");}
};
$("count-next").onclick=()=>{countAt=(countAt+1)%countDeck.length;renderCount();};renderCount();
})();
