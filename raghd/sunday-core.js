(()=>{"use strict";
const $=id=>document.getElementById(id);
const words=[["Nest","🪺","word-nest"],["Nose","👃","word-nose"],["Net","🥅","word-net"],["Nurse","👩‍⚕️","word-nurse"],["Nut","🥜","word-nut"],["Nine","9️⃣","word-nine"]];
const properties=[
["🐦","Move","Living things can move.","can-move"],
["🌱","Grow","Living things can grow.","can-grow"],
["🐰🥕","Eat and drink","Living things can eat and drink.","can-eat"],
["🐶🌬️","Breathe","Living things can breathe.","can-breathe"],
["🐈❤️","Feel","Living things can feel.","can-feel"],
["🐣🥚","Have babies","Animals can give birth or lay eggs.","can-babies"]];
const needs=[["🍎","Food","need-food"],["💧","Water","need-water"],["🏡","Home","need-home"]];
const names=["One","Two","Three","Four","Five","Six"];
let playback=null;
window.raghdAudio=function(key){
 if(playback){playback.pause();playback.currentTime=0}
 playback=new Audio("audio/sunday-"+key+".mp3");
 playback.playbackRate=.92;
 const started=playback.play();
 if(started&&started.catch)started.catch(()=>{const w=$("warning");w.style.display="block";w.textContent="🔊 ElevenLabs MP3 recordings are not available yet. Check the GitHub audio workflow.";});
};
document.addEventListener("click",e=>{const b=e.target.closest("[data-audio]");if(b)window.raghdAudio(b.dataset.audio)});
$("word-list").innerHTML=words.map(w=>'<div class="word"><div class="iconbig">'+w[1]+'</div><strong>'+w[0]+'</strong><button class="btn light" data-audio="'+w[2]+'">🔊 Listen</button></div>').join("");
$("property-list").innerHTML=properties.map((p,i)=>'<div class="oral" id="property-'+i+'"><div class="visual">'+p[0]+'</div><small>SAY IT FIRST</small><strong>'+p[1]+'</strong><p>'+p[2]+'</p><button class="btn light" data-property="'+i+'">👀 Show answer</button></div>').join("");
document.querySelectorAll("[data-property]").forEach(b=>b.onclick=()=>{let n=+b.dataset.property,c=$("property-"+n);c.classList.add("reveal");b.textContent="🔊 Hear again";window.raghdAudio(properties[n][3]);});
$("need-list").innerHTML=needs.map(n=>'<div class="need"><div class="iconbig">'+n[0]+'</div><strong>'+n[1]+'</strong><button class="btn green" data-audio="'+n[2]+'">🔊 Listen</button></div>').join("");
$("number-list").innerHTML=names.map((n,i)=>'<div class="num"><strong>'+(i+1)+'</strong><div class="stars">'+"⭐".repeat(i+1)+'</div><span>'+n+'</span><button class="btn" data-audio="number-'+(i+1)+'">🔊 '+n+'</button></div>').join("");
let completed={};try{completed=JSON.parse(localStorage.getItem("raghd-sunday-lessons")||"{}")}catch(e){}
function progress(){const sum=["n","science","math"].filter(k=>completed[k]).length;$("progress-bar").style.width=(sum*100/3)+"%";$("progress-text").textContent=sum+" / 3";document.querySelectorAll("[data-complete]").forEach(b=>{if(completed[b.dataset.complete])b.textContent="✅ Finished!";});}
document.querySelectorAll("[data-complete]").forEach(b=>b.onclick=()=>{completed[b.dataset.complete]=true;try{localStorage.setItem("raghd-sunday-lessons",JSON.stringify(completed))}catch(e){}progress();window.raghdAudio("great");});
progress();
let oral=0,shown=false;
const oralDeck=properties.map(p=>[p[0],p[2],p[3]]).concat(needs.map(n=>[n[0],"Living things need "+n[1].toLowerCase()+".",n[2]]));
function showOral(){$("oral-number").textContent="Picture "+(oral+1)+" / "+oralDeck.length;$("oral-pic").textContent=oralDeck[oral][0];$("oral-text").textContent=shown?oralDeck[oral][1]:"What can it do or need?";$("oral-text").className="answer"+(shown?"":" hidden");$("oral-reveal").textContent=shown?"🔊 Hear it again":"👀 Show the answer";}
$("oral-reveal").onclick=()=>{shown=true;showOral();window.raghdAudio(oralDeck[oral][2]);};
$("oral-prev").onclick=()=>{oral=(oral+oralDeck.length-1)%oralDeck.length;shown=false;showOral();};
$("oral-next").onclick=()=>{oral=(oral+1)%oralDeck.length;shown=false;showOral();};
showOral();
function drawing(id){
 const c=$(id),g=c.getContext("2d"),touches=new Map();let on=false,last=null,mid=null;
 function setup(){const r=c.getBoundingClientRect();let ratio=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(r.width*ratio);c.height=Math.round(r.height*ratio);g.setTransform(ratio,0,0,ratio,0,0);g.strokeStyle="#795dbe";g.lineWidth=5;g.lineJoin="round";g.lineCap="round";}
 function pt(e){const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
 function average(){let y=0;touches.forEach(p=>y+=p.y);return y/touches.size;}
 c.addEventListener("pointerdown",e=>{e.preventDefault();c.setPointerCapture(e.pointerId);const p=pt(e);touches.set(e.pointerId,p);if(touches.size===1){on=true;last=p;g.beginPath();g.arc(p.x,p.y,2.6,0,Math.PI*2);g.fillStyle="#795dbe";g.fill();}else{on=false;last=null;mid=average();}});
 c.addEventListener("pointermove",e=>{if(!touches.has(e.pointerId))return;e.preventDefault();const p=pt(e);touches.set(e.pointerId,p);if(touches.size>=2){let now=average();if(mid!==null)window.scrollBy(0,mid-now);mid=now;return;}if(!on||!last)return;g.beginPath();g.moveTo(last.x,last.y);g.lineTo(p.x,p.y);g.stroke();last=p;});
 function end(e){touches.delete(e.pointerId);on=false;last=null;mid=touches.size>1?average():null;}
 c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);setup();
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
})();
