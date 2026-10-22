(()=>{
"use strict";
const $=id=>document.getElementById(id);
const scenes=[
{img:"weekend/images/01_Happy_Friday_Morning.jpg",line:"It is Friday! Tom wakes up with a big smile.",name:"Happy Friday",emoji:"🌞"},
{img:"weekend/images/02_Family_Breakfast.jpg",line:"Tom eats a tasty breakfast and drinks orange juice.",name:"Breakfast",emoji:"🥣"},
{img:"weekend/images/03_Wash_the_Car.jpg",line:"Tom helps Dad wash the blue car.",name:"Wash the Car",emoji:"🚙"},
{img:"weekend/images/04_Ride_a_Bike.jpg",line:"Tom rides his bike. His dog runs beside him.",name:"Bike Ride",emoji:"🚲"},
{img:"weekend/images/05_Play_Football.jpg",line:"Tom plays football with his friends.",name:"Football Fun",emoji:"⚽"},
{img:"weekend/images/06_Pizza_with_Family.jpg",line:"Tom shares pizza with his family. Yum!",name:"Pizza Dinner",emoji:"🍕"},
{img:"weekend/images/07_Movie_Night.jpg",line:"Tom and his sister watch a funny movie.",name:"Movie Night",emoji:"🎬"},
{img:"weekend/images/08_Read_a_Book.jpg",line:"Before bed, Tom reads his favorite book.",name:"Reading Time",emoji:"📚"},
{img:"weekend/images/09_Bake_Cookies.jpg",line:"On Saturday, Tom helps Mom bake cookies.",name:"Baking Cookies",emoji:"🍪"},
{img:"weekend/images/10_Visit_Grandparents.jpg",line:"Tom visits his grandparents. They give him big hugs.",name:"Grandparents",emoji:"👵"},
{img:"weekend/images/11_Fly_a_Kite.jpg",line:"At sunset, Tom flies a colorful kite.",name:"Fly a Kite",emoji:"🪁"},
{img:"weekend/images/12_Good_Night.jpg",line:"Tom goes to bed. What a wonderful weekend!",name:"Good Night",emoji:"🌙"}
];
const vocab={
friday:{arabic:"الجمعة",english:"The first day of the weekend",example:"On Friday, I play."},
saturday:{arabic:"السبت",english:"The second day of the weekend",example:"Saturday is a fun day."},
weekend:{arabic:"عطلة نهاية الأسبوع",english:"Friday and Saturday",example:"I love the weekend."},
breakfast:{arabic:"الفطور",english:"Food in the morning",example:"I eat breakfast."},
wash:{arabic:"يغسل",english:"Clean with water",example:"I wash the car."},
bike:{arabic:"دراجة",english:"A bicycle",example:"I ride my bike."},
football:{arabic:"كرة القدم",english:"A ball game",example:"I play football."},
pizza:{arabic:"بيتزا",english:"A round tasty food",example:"We eat pizza."},
movie:{arabic:"فيلم",english:"A story we watch",example:"We watch a movie."},
book:{arabic:"كتاب",english:"Something we read",example:"I read a book."},
cookies:{arabic:"بسكويت",english:"Small sweet baked treats",example:"We bake cookies."},
grandparents:{arabic:"الأجداد",english:"Grandma and Grandpa",example:"I love my grandparents."},
kite:{arabic:"طائرة ورقية",english:"A toy that flies on a string",example:"I fly a kite."}
};
const questions=[
{q:"What day is it when Tom wakes up?",a:"friday"},
{q:"What does Tom eat in the morning?",a:"breakfast"},
{q:"What does Tom help Dad do?",a:"wash"},
{q:"What does Tom ride?",a:"bike"},
{q:"What does Tom play?",a:"football"},
{q:"What tasty food does Tom share?",a:"pizza"},
{q:"What do Tom and his sister watch?",a:"movie"},
{q:"What does Tom read before bed?",a:"book"},
{q:"What do Tom and Mom bake?",a:"cookies"},
{q:"Who does Tom visit?",a:"grandparents"},
{q:"What does Tom fly at sunset?",a:"kite"},
{q:"What do Friday and Saturday make together?",a:"weekend"}
];
const voices=["bella","heart","sarah","nicole","sky"];
const speeds=["0.75","1","1.15"];
const storageKey="kids-learning-weekend-12-2026";
const initial={done:[],flags:[],passed:[],last:0,voice:"bella",speed:"1",mute:false,completed:false,listenCompleted:false};
let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey))||{}}catch{}
const s={...initial,...saved};
for(const key of ["done","flags","passed"])s[key]=[...new Set(Array.isArray(s[key])?s[key].filter(x=>Number.isInteger(x)&&x>=0&&x<12):[])];
if(!voices.includes(s.voice))s.voice="bella";
if(!speeds.includes(String(s.speed)))s.speed="1";
let scene=Number.isInteger(s.last)?Math.max(0,Math.min(11,s.last)):0;
let mode="manual",textMode="hidden",selectedMode="manual";
let audio=null,playing=false,sequence=0,pending=null,toastTimeout=null,readerOpen=false,showingSheet=false;
let currentQuestionWrong=false,firstTry=0,runCorrect=0,runStart=0;
let lastSwipe=0,gestureX=null,gestureY=null,allowAuto=true;
const audioFile=(voice,key)=>"audio/weekend/"+voice+"/"+key+".mp3";
const store=()=>{try{localStorage.setItem(storageKey,JSON.stringify(s))}catch{}};
const cap=x=>x[0].toUpperCase()+x.slice(1);
const status=txt=>{$("status").textContent=txt};
const msg=(txt,ms=1350)=>{
 clearTimeout(toastTimeout);$("message").textContent=txt;$("message").hidden=false;
 toastTimeout=setTimeout(()=>{$("message").hidden=true},ms);
};
const glyph=(symbol,node="tap-echo")=>{
 const x=$(node);x.textContent=symbol;x.classList.remove("show");void x.offsetWidth;x.classList.add("show");
};
function cancel(){
 sequence++;
 if(pending!==null){clearTimeout(pending);pending=null;}
 if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null;}
 playing=false;
}
function schedule(fn,ms){
 const ticket=sequence;
 pending=setTimeout(()=>{pending=null;if(ticket===sequence&&readerOpen)fn()},ms);
}
function progress(){
 $("stars").textContent="⭐ "+s.done.length;
 $("home-progress").textContent="⭐ "+s.done.length+"/12 practiced";
 const dots=$("dots");dots.replaceChildren();
 scenes.forEach((sc,i)=>{
 const dot=document.createElement("span");
 dot.className="dot"+(i===scene?" active":"")+(s.done.includes(i)?" done":"")+(s.flags.includes(i)?" flagged":"");
 dot.title="Scene "+(i+1);
 dots.append(dot);
 });
}
function keywordButton(word){
 const b=document.createElement("button");
 b.type="button";b.className="key-word";b.textContent=word;
 b.setAttribute("aria-label","Learn the word "+word);
 b.addEventListener("click",()=>showSheet("word",word.toLowerCase()));
 return b;
}
function renderCaption(){
 const cap=$("caption");cap.replaceChildren();
 if(textMode==="hidden"){cap.hidden=true;return;}
 cap.hidden=false;
 if(textMode==="keywords"){
  const keys=[...new Set((scenes[scene].line.toLowerCase().match(/\b(friday|saturday|weekend|breakfast|wash|bike|football|pizza|movie|book|cookies|grandparents|kite)\b/g)||[]))];
  keys.forEach((w,i)=>{if(i)cap.append("  ·  ");cap.append(keywordButton(capitalizeWord(w)))});
  return;
 }
 const bits=scenes[scene].line.split(/\b(friday|saturday|weekend|breakfast|wash|bike|football|pizza|movie|book|cookies|grandparents|kite)\b/gi);
 for(const bit of bits){if(vocab[bit.toLowerCase()])cap.append(keywordButton(bit));else cap.append(document.createTextNode(bit));}
}
function capitalizeWord(w){return w.charAt(0).toUpperCase()+w.slice(1);}
let pictureTicket=0;
function cleanPicture(index){return Promise.resolve(scenes[index].img);}

function draw(){
 const sc=scenes[scene],ticket=++pictureTicket;
 const art=$("scene-art"),bg=$("scene-bg"),wordPanel=$("vocab-stage");
 wordPanel.hidden=scene!==8;
 art.hidden=scene===12;
 if(scene===12){
  art.src="";
  cleanPicture(0).then(url=>{if(ticket===pictureTicket)bg.src=url});
 }else{
  art.style.opacity="0";
  art.alt=sc.name+" illustration without the printed sentence banner";
  cleanPicture(scene).then(url=>{
   if(ticket!==pictureTicket)return;
   art.src=url;bg.src=url;art.style.opacity="1";
  });
 }
 $("scene-number").textContent=(scene+1)+" / 9";
 $("touch-left").disabled=scene===0;
 $("touch-right").disabled=scene===12;
 s.last=scene;store();progress();renderCaption();
}
function goto(n,autoplay=false){
 const target=Math.max(0,Math.min(11,n));
 cancel();
 scene=target;draw();
 if(target===12){status("⭐ Magic words! Tap Aa or 🎤 to review.");if(mode==="auto"){endAdventure()}else if(mode==="listen"){endAdventure()}return;}
 status("Scene "+(target+1)+" of 12");
 if(autoplay&&mode==="auto")startSceneAudio(()=>afterSceneAudio());
 else if(autoplay&&mode==="listen")startSceneAudio(()=>listenNext());
}
function soundError(){
 playing=false;
 status("🔊 Can't play this voice. Tap the middle to retry.");
 if(mode==="auto"&&scene<12){
  msg("Audio unavailable — choose a word with More → Question",2300);
 }
}
function playAudio(key,onFinish){
 cancel();
 const ticket=sequence;
 try{
  audio=new Audio(audioFile(s.voice,key));
  audio.preload="auto";
  audio.playbackRate=Number(s.speed);
  audio.onplaying=()=>{if(sequence===ticket){playing=true;status("🔊 "+cap(s.voice)+" is reading…")}};
  audio.onended=()=>{if(ticket!==sequence)return;audio=null;playing=false;status("🌟 Your turn!");if(onFinish)onFinish();};
  audio.onerror=()=>{if(ticket===sequence)soundError()};
  const promise=audio.play();
  if(promise&&promise.catch)promise.catch(()=>{if(ticket===sequence)soundError()});
 }catch{soundError();}
}
function startSceneAudio(done){
 if(scene===12){playWordSequence();return;}
 playAudio("scene-"+String(scene+1).padStart(2,"0"),done);
}
function playWordSequence(){
 const list=["friday","saturday","weekend","breakfast","wash","bike","football","pizza","movie","book","cookies","grandparents","kite"];
 let idx=0;
 const step=()=>{
  if(idx>=list.length){status("⭐ All four words!");return;}
  const w=list[idx++];playAudio("word-"+w,step);
 };
 step();
}
function centerTap(){
 if(mode==="self"){msg("🌱 Read aloud yourself! Tap Aa to see the words.");return;}
 if(audio){
   if(playing){audio.pause();playing=false;status("⏸ Paused");glyph("⏸");}
   else{audio.play().then(()=>{playing=true;status("▶ Reading")}).catch(soundError);glyph("▶");}
   return;
 }
 if(scene===12)playWordSequence();
 else startSceneAudio(mode==="auto"?()=>afterSceneAudio():mode==="listen"?()=>listenNext():null);
 glyph("🔊");
}
function leftTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene>0){goto(scene-1);glyph("⬅");}
}
function rightTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene<12){goto(scene+1);glyph("➡");}
}
function afterSceneAudio(){if(mode!=="auto"||scene>11)return;schedule(()=>ask(),580);}
function listenNext(){if(mode!=="listen")return;schedule(()=>{if(scene<11)goto(scene+1,true);else endAdventure()},750);}
function earn(){
 if(scene===12)return;
 const newStar=!s.done.includes(scene);
 if(newStar){s.done.push(scene);s.done.sort((a,b)=>a-b);glyph("⭐","celebrate");}
 store();progress();
 if(newStar)msg("🌟 Great job! One more star!");
 else msg("✅ Already practiced!");
}
function toggleFlag(){
 if(scene===12)return;
 if(s.flags.includes(scene)){s.flags=s.flags.filter(i=>i!==scene);msg("✅ Red flag removed");}
 else{s.flags.push(scene);s.flags.sort((a,b)=>a-b);msg("🚩 Saved for review");}
 store();progress();
}
function ask(){
 if(scene>=12)return;
 cancel();closeSheet();
 currentQuestionWrong=false;
 $("quiz").hidden=false;
 $("question").textContent=questions[scene].q;
 $("feedback").textContent="Choose the best word.";
 const opts=$("answers");opts.replaceChildren();
 const choices=Object.keys(vocab).filter(x=>x!==questions[scene].a).sort(()=>Math.random()-.5).slice(0,3);choices.push(questions[scene].a);
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 choices.forEach(word=>{
  const b=document.createElement("button");b.textContent=cap(word);
  b.addEventListener("click",()=>{
   if($("quiz").hidden)return;
   if(word!==questions[scene].a){
    currentQuestionWrong=true;b.classList.add("bad");b.disabled=true;
    $("feedback").textContent="💡 Try again. You can do it!";
    return;
   }
   b.classList.add("good");
   opts.querySelectorAll("button").forEach(x=>x.disabled=true);
   $("feedback").textContent="✅ Brilliant! You earned a star!";
   runCorrect++;
   if(!currentQuestionWrong)firstTry++;
   if(!s.passed.includes(scene))s.passed.push(scene);
   earn();store();
   schedule(()=>{
    $("quiz").hidden=true;
    if(mode==="auto"){if(scene<11)goto(scene+1,true);else endAdventure();}
    else msg("🌟 Nice work!");
   },950);
  });
  opts.append(b);
 });
}
function endAdventure(){
 cancel();
 if(mode==="auto"){s.completed=s.done.length===12;store();}
 if(mode==="listen"){s.listenCompleted=true;store();}
 progress();
 $("quiz").hidden=true;$("complete").hidden=false;
 $("summary").textContent=mode==="auto"
  ?"⭐ "+runCorrect+" scenes answered · 🎯 "+firstTry+" correct on the first try. Your progress is saved!"
  :"You listened to all 12 story scenes. Wonderful work!";
 status("🏆 Adventure complete!");
 glyph("🏆","celebrate");
}
function closeComplete(){$("complete").hidden=true;mode="manual";status("Tap left / middle / right to explore.");}
function start(choice){
 selectedMode=choice;mode=choice;
 $("reader").hidden=false;readerOpen=true;$("sheet").hidden=true;showingSheet=false;
 $("quiz").hidden=true;$("complete").hidden=true;
 textMode=choice==="self"?"full":"hidden";
 firstTry=0;runCorrect=0;runStart=0;
 document.body.style.overflow="hidden";
 goto(choice==="auto"||choice==="listen"?0:scene,false);
 if(choice==="auto"||choice==="listen"){
  // Start playback inside the user's direct click interaction for mobile browser permission.
  startSceneAudio(choice==="auto"?afterSceneAudio:listenNext);
 }else status(choice==="self"?"🌱 Read the sentence yourself.":"Tap left / center / right. Press Aa for words.");
 try{if($("reader").requestFullscreen&&!document.fullscreenElement){const p=$("reader").requestFullscreen();if(p&&p.catch)p.catch(()=>{});}}catch{}
}
function closeReader(){
 cancel();readerOpen=false;mode="manual";
 $("reader").hidden=true;document.body.style.overflow="";
 closeSheet();$("quiz").hidden=true;$("complete").hidden=true;
 if(document.fullscreenElement){document.exitFullscreen().catch(()=>{})}
 store();progress();
}
function textCycle(){
 textMode=textMode==="hidden"?"full":textMode==="full"?"keywords":"hidden";
 renderCaption();
 msg(textMode==="hidden"?"🙈 Text hidden":textMode==="full"?"📖 Full sentence":"✨ Key words");
}
function closeSheet(){$("sheet").hidden=true;showingSheet=false}
function cell(label,fn,chosen=false){
 const b=document.createElement("button");b.type="button";b.textContent=label;
 if(chosen)b.classList.add("selected");
 b.addEventListener("click",fn);return b;
}
function sectionButtons(list){
 const group=document.createElement("div");group.className="sheet-items";
 list.forEach(([label,fn,chosen])=>group.append(cell(label,fn,chosen)));
 return group;
}
function showSheet(kind="more",detail){
 if(!readerOpen)return;
 cancel();
 $("sheet").hidden=false;showingSheet=true;
 const root=$("sheet-content");root.replaceChildren();
 const h=$("sheet-title");
 const para=txt=>{const p=document.createElement("p");p.className="sheet-copy";p.textContent=txt;root.append(p);};
 const buttonRow=items=>root.append(sectionButtons(items));
 if(kind==="more"){
  h.textContent="✨ Story Tools";
  para("All options stay here so your picture fills the screen.");
  buttonRow([
   ["⭐ I Practiced",()=>{earn();closeSheet()}],
   [s.flags.includes(scene)?"✅ Remove Flag":"🚩 Red Flag",()=>{toggleFlag();showSheet("more")}],
   ["🎯 Quick Question",()=>{closeSheet();ask()}],
   ["🗺 Adventure Map",()=>showSheet("map")],
   ["🚩 Review Flags",()=>showSheet("flags")],
   ["🏅 My Badges",()=>showSheet("badges")],
   ["🎤 Voice & Speed",()=>showSheet("voice")],
   ["📖 Text Settings",()=>showSheet("text")],
   ["🚀 Auto Adventure",()=>{closeSheet();mode="auto";firstTry=0;runCorrect=0;goto(0,true)}],
   ["🎧 Listen Only",()=>{closeSheet();mode="listen";goto(0,true)}],
   ["🌱 Read Myself",()=>{closeSheet();mode="self";textMode="full";renderCaption();status("Read it aloud!") }]
  ]);
 }else if(kind==="text"){
  h.textContent="Aa Text Display";
  para("The picture always stays large. Choose what appears over it.");
  buttonRow([
   ["🙈 Hidden",()=>{textMode="hidden";renderCaption();closeSheet();}],
   ["📖 Full Sentence",()=>{textMode="full";renderCaption();closeSheet();}],
   ["✨ Key Words",()=>{textMode="keywords";renderCaption();closeSheet();}]
  ]);
 }else if(kind==="voice"){
  h.textContent="🎤 Choose Your Teacher";
  para("Free Kokoro AI recordings — no paid service, no browser speech.");
  const select=document.createElement("select");
  select.setAttribute("aria-label","Teacher voice");
  voices.forEach(v=>{const op=document.createElement("option");op.value=v;op.textContent=cap(v);select.append(op)});
  select.value=s.voice;
  select.addEventListener("change",()=>{s.voice=select.value;store();msg("🎤 "+cap(s.voice)+" selected")});
  root.append(select);
  para("Reading speed");
  buttonRow(speeds.map((v,i)=>[["🐢 Slow","▶ Normal","🐇 Fast"][i],()=>{s.speed=v;store();showSheet("voice")},s.speed===v]));
  const test=document.createElement("button");test.className="primary";test.textContent="🔊 Test Voice";test.style.marginTop="12px";
  test.addEventListener("click",()=>{closeSheet();playAudio("scene-01")});root.append(test);
 }else if(kind==="word"&&vocab[detail]){
  h.textContent="🌟 Learn a Word";
  const obj=vocab[detail];
  const title=document.createElement("div");title.className="word-definition";title.textContent=cap(detail);root.append(title);
  const ar=document.createElement("div");ar.className="word-arabic";ar.lang="ar";ar.textContent=obj.arabic;root.append(ar);
  para(obj.english);
  const ex=document.createElement("p");ex.className="word-example";ex.textContent=obj.example;root.append(ex);
  const listen=document.createElement("button");listen.className="primary";listen.textContent="🔊 Listen to "+detail;
  listen.addEventListener("click",()=>playAudio("word-"+detail));root.append(listen);
 }else if(kind==="flags"){
  h.textContent="🚩 Review My Flags";
  if(!s.flags.length)para("No flags yet. Tap More → Red Flag on a tricky scene.");
  s.flags.forEach(i=>{
   const b=document.createElement("button");b.className="flag-item";b.type="button";
   const img=document.createElement("img");img.src=scenes[i].img;img.alt="";
   const p=document.createElement("p");p.textContent="🚩 Scene "+(i+1);
   const small=document.createElement("small");small.textContent=scenes[i].line;p.append(small);b.append(img,p);
   b.addEventListener("click",()=>{closeSheet();goto(i)});
   root.append(b);
  });
 }else if(kind==="map"){
  h.textContent="🗺 My Adventure Map";
  para("🌟 Practiced · 🚩 Review · Tap a scene to jump.");
  const grid=document.createElement("div");grid.className="map-grid";
  scenes.forEach((sc,i)=>{
   const b=document.createElement("button");b.className="map-item"+(i===scene?" active":"")+(s.done.includes(i)?" done":"");
   const img=document.createElement("img");img.src=sc.img;img.alt="";
   const label=document.createElement("p");label.textContent=(i+1)+". "+sc.name+(s.done.includes(i)?" ⭐":"")+(s.flags.includes(i)?" 🚩":"");
   b.append(img,label);b.addEventListener("click",()=>{closeSheet();mode="manual";goto(i)});grid.append(b);
  });
  root.append(grid);
 }else if(kind==="badges"){
  h.textContent="🏅 My Magic Badges";
  const badges=[
   ["🌱","First Step",s.done.length>=1,"Practice a scene"],
   ["⭐","Star Reader",s.done.length===12,"Practice 8 scenes"],
   ["🚩","Brave Learner",s.flags.length>0,"Mark a hard scene"],
   ["🎯","Word Wizard",s.passed.length>=4,"Answer 4 challenges"],
   ["🚀","Adventure Explorer",s.completed,"Complete Auto Adventure"],
   ["🎧","Story Listener",s.listenCompleted,"Complete Listen Only"]
  ];
  const grid=document.createElement("div");grid.className="badge-grid";
  badges.forEach(([emoji,name,has,description])=>{
   const card=document.createElement("div");card.className="badge"+(has?" unlocked":"");
   const ic=document.createElement("span");ic.textContent=has?emoji:"🔒";
   const nameEl=document.createElement("b");nameEl.textContent=name;
   const help=document.createElement("small");help.textContent=description;
   card.append(ic,nameEl,help);grid.append(card);
  });root.append(grid);
 }
}

$("home-voice").value=s.voice;$("home-speed").value=s.speed;
$("home-voice").addEventListener("change",e=>{s.voice=e.target.value;store()});
$("home-speed").addEventListener("change",e=>{s.speed=e.target.value;store()});
document.querySelectorAll("[data-start]").forEach(btn=>btn.addEventListener("click",()=>{
 selectedMode=btn.dataset.start;
 document.querySelectorAll("[data-start]").forEach(x=>x.classList.toggle("selected",x===btn));
 $("start-btn").textContent=selectedMode==="auto"?"🚀 Begin Adventure":selectedMode==="listen"?"🎧 Start Listening":selectedMode==="self"?"🌱 Read Myself":"▶ Start Reading";
}));
$("start-btn").addEventListener("click",()=>start(selectedMode));
$("close").addEventListener("click",closeReader);
$("text-mode").addEventListener("click",textCycle);
$("voice-toggle").addEventListener("click",()=>showSheet("voice"));
$("more").addEventListener("click",()=>showSheet("more"));
$("sheet-close").addEventListener("click",closeSheet);
$("touch-left").addEventListener("click",()=>{if(Date.now()<lastSwipe)return;leftTap()});
$("touch-middle").addEventListener("click",()=>{if(Date.now()<lastSwipe)return;centerTap()});
$("touch-right").addEventListener("click",()=>{if(Date.now()<lastSwipe)return;rightTap()});
$("again").addEventListener("click",()=>{closeComplete();mode="auto";firstTry=0;runCorrect=0;goto(0,true)});
$("review").addEventListener("click",()=>{closeComplete();showSheet("flags")});
$("done").addEventListener("click",closeComplete);
$("canvas").addEventListener("touchstart",e=>{
 if(e.touches.length!==1||showingSheet||!$("quiz").hidden)return;
 gestureX=e.touches[0].clientX;gestureY=e.touches[0].clientY;
},{passive:true});
$("canvas").addEventListener("touchend",e=>{
 if(gestureX===null||gestureY===null)return;
 const dx=e.changedTouches[0].clientX-gestureX,dy=e.changedTouches[0].clientY-gestureY;
 gestureX=null;gestureY=null;
 if(Math.abs(dy)>80&&Math.abs(dy)>Math.abs(dx)){lastSwipe=Date.now()+350;if(dy<0)textMode="full";else textMode="hidden";renderCaption();msg(dy<0?"📖 Sentence shown":"🙈 Text hidden");}
 else if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)){lastSwipe=Date.now()+350;if(dx>0)leftTap();else rightTap();}
},{passive:true});
document.addEventListener("keydown",e=>{
 if(!readerOpen)return;
 if(e.key==="Escape"){if(!$("sheet").hidden)closeSheet();else if(!$("complete").hidden)closeComplete();else if(!$("quiz").hidden){$("quiz").hidden=true;mode="manual";}else closeReader();return;}
 if(!$("sheet").hidden||!$("quiz").hidden||!$("complete").hidden)return;
 if(e.key==="ArrowLeft")leftTap();else if(e.key==="ArrowRight")rightTap();
 else if(e.key===" "){e.preventDefault();centerTap();}
});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&audio&&playing){audio.pause();playing=false;status("⏸ Paused while away.")}});
document.addEventListener("fullscreenchange",()=>{if(readerOpen&&!document.fullscreenElement){}});
progress();draw();
})();
