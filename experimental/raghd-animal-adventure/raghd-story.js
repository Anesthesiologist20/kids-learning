(()=>{
"use strict";
const $=id=>document.getElementById(id);
const scenes=[
{"img":"images/01.webp","line":"Raghd sees many animals at the park. What a lovely day!","name":"A New Adventure","emoji":"🌿"},
{"img":"images/02.webp","line":"The rabbit can hop on the grass. It has soft fur.","name":"The Hopping Rabbit","emoji":"🐰"},
{"img":"images/03.webp","line":"The fish can swim in the pond. It has shiny scales.","name":"The Swimming Fish","emoji":"🐟"},
{"img":"images/04.webp","line":"The blue bird can fly in the sky. It has beautiful feathers.","name":"The Flying Bird","emoji":"🐦"},
{"img":"images/05.webp","line":"The snake can slither on the sand. It has smooth scales.","name":"The Slithering Snake","emoji":"🐍"},
{"img":"images/06.webp","line":"The horse can run fast. Raghd watches it run!","name":"The Running Horse","emoji":"🐎"},
{"img":"images/07.webp","line":"The sheep has soft wool. Raghd says, It is fluffy!","name":"Soft Wool","emoji":"🐑"},
{"img":"images/08.webp","line":"The bird has colorful feathers. Raghd sees a blue feather.","name":"Colorful Feathers","emoji":"🪶"},
{"img":"images/09.webp","line":"The turtle has a hard shell. The fish have shiny scales.","name":"Shells and Scales","emoji":"🐢"},
{"img":"images/10.webp","line":"Raghd smiles at all the animals. They move in different ways!","name":"Animal Friends","emoji":"🌟"}
];
const vocab={
animals:{"arabic":"حيوانات","english":"Living creatures like rabbits and birds","example":"I love animals."},
park:{"arabic":"حديقة","english":"A place to enjoy trees and grass","example":"We go to the park."},
rabbit:{"arabic":"أرنب","english":"An animal with long ears","example":"The rabbit can hop."},
hop:{"arabic":"يقفز","english":"Move with small jumps","example":"I can hop."},
fur:{"arabic":"فرو","english":"Soft hair covering some animals","example":"The rabbit has fur."},
fish:{"arabic":"سمكة","english":"An animal living in water","example":"Fish can swim."},
swim:{"arabic":"يسبح","english":"Move through water","example":"The fish can swim."},
scales:{"arabic":"حراشف","english":"Thin plates covering many fish and reptiles","example":"The fish has scales."},
bird:{"arabic":"طائر","english":"An animal with feathers and a beak","example":"The bird can fly."},
fly:{"arabic":"يطير","english":"Move in the air using wings","example":"Birds can fly."},
feathers:{"arabic":"ريش","english":"The light covering on birds","example":"Birds have feathers."},
snake:{"arabic":"ثعبان","english":"A long animal without legs","example":"The snake can slither."},
slither:{"arabic":"يزحف","english":"Move along the ground without legs","example":"Snakes slither."},
horse:{"arabic":"حصان","english":"A large animal with four legs","example":"A horse can run."},
run:{"arabic":"يجري","english":"Move fast on feet","example":"I can run."},
sheep:{"arabic":"خروف","english":"A farm animal with wool","example":"Sheep have wool."},
wool:{"arabic":"صوف","english":"Soft thick covering on sheep","example":"The sheep has wool."},
fluffy:{"arabic":"منفوش","english":"Very soft and puffy","example":"The sheep is fluffy."},
turtle:{"arabic":"سلحفاة","english":"An animal protected by a hard shell","example":"The turtle is slow."},
shell:{"arabic":"درع صلب","english":"A hard covering that protects an animal","example":"The turtle has a shell."}
};
const questions=[
{"q":"Where does Raghd see animals?","a":"park"},
{"q":"How does the rabbit move?","a":"hop"},
{"q":"What covers the fish?","a":"scales"},
{"q":"How does the bird move?","a":"fly"},
{"q":"How does the snake move?","a":"slither"},
{"q":"How does the horse move?","a":"run"},
{"q":"What covers the sheep?","a":"wool"},
{"q":"What covers the bird?","a":"feathers"},
{"q":"What covers the turtle?","a":"shell"},
{"q":"What does Raghd love?","a":"animals"}
];
const voices=["bella","heart","sarah"];
const speeds=["0.8","1"];
const storageKey="kids-learning-raghd-animal-10-v1";
const initial={done:[],flags:[],passed:[],last:0,voice:"bella",speed:"1",mute:false,completed:false,listenCompleted:false,textPreference:"during",fitWhole:false};
let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey))||{}}catch{}
const s={...initial,...saved};
for(const key of ["done","flags","passed"])s[key]=[...new Set(Array.isArray(s[key])?s[key].filter(x=>Number.isInteger(x)&&x>=0&&x<10):[])];
if(!voices.includes(s.voice))s.voice="bella";
if(!speeds.includes(String(s.speed)))s.speed="1";
let scene=Number.isInteger(s.last)?Math.max(0,Math.min(9,s.last)):0;
if(!["during","full","hidden","keywords"].includes(s.textPreference))s.textPreference="during";
let mode="manual",textMode=s.textPreference,selectedMode="manual";
let textDuringVisible=false,captionHideTimer=null;
const sceneFocusY=[48,50,50,43,50,49,45,50,51,49];
let audio=null,playing=false,sequence=0,pending=null,toastTimeout=null,readerOpen=false,showingSheet=false;
let currentQuestionWrong=false,firstTry=0,runCorrect=0,runStart=0;
let lastSwipe=0,gestureX=null,gestureY=null,allowAuto=true;
const audioFile=(voice,key)=>"audio/"+voice+"/"+key+".mp3";
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
 if(captionHideTimer!==null){clearTimeout(captionHideTimer);captionHideTimer=null;}
 if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null;}
 playing=false;textDuringVisible=false;
 if(readerOpen)renderCaption();
}
function schedule(fn,ms){
 const ticket=sequence;
 pending=setTimeout(()=>{pending=null;if(ticket===sequence&&readerOpen)fn()},ms);
}
function progress(){
 $("stars").textContent="⭐ "+s.done.length;
 $("home-progress").textContent="⭐ "+s.done.length+"/10 practiced";
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
 if(textMode==="hidden"||(textMode==="during"&&!textDuringVisible)){cap.hidden=true;return;}
 cap.hidden=false;
 if(textMode==="keywords"){
  const keys=[...new Set((scenes[scene].line.toLowerCase().match(/\b(animals|park|rabbit|hop|fur|fish|swim|scales|bird|fly|feathers|snake|slither|horse|run|sheep|wool|fluffy|turtle|shell)\b/g)||[]))];
  keys.forEach((w,i)=>{if(i)cap.append("  ·  ");cap.append(keywordButton(capitalizeWord(w)))});
  return;
 }
 const bits=scenes[scene].line.split(/\b(animals|park|rabbit|hop|fur|fish|swim|scales|bird|fly|feathers|snake|slither|horse|run|sheep|wool|fluffy|turtle|shell)\b/gi);
 for(const bit of bits){if(vocab[bit.toLowerCase()])cap.append(keywordButton(bit));else cap.append(document.createTextNode(bit));}
}
function capitalizeWord(w){return w.charAt(0).toUpperCase()+w.slice(1);}
let pictureTicket=0;
function cleanPicture(index){return Promise.resolve(scenes[index].img);}
function illustrationFallback(sc){
 const safe=sc.name.replace(/[&<>"]/g,"");
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 990"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#bfeeff"/><stop offset="1" stop-color="#ffe5aa"/></linearGradient></defs><rect width="1120" height="990" fill="url(#g)"/><circle cx="965" cy="138" r="85" fill="#fff6ad"/><circle cx="175" cy="210" r="80" fill="#ffffff65"/><text x="560" y="490" font-size="260" dominant-baseline="middle" text-anchor="middle">'+sc.emoji+'</text><text x="560" y="725" font-size="65" font-family="Arial,sans-serif" font-weight="bold" fill="#25466a" text-anchor="middle">'+safe+'</text></svg>';
 return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}

function draw(){
 const sc=scenes[scene],ticket=++pictureTicket;
 $("reader").style.setProperty("--scene-focus-y",sceneFocusY[scene]+"%");
 $("reader").classList.toggle("fit-whole",Boolean(s.fitWhole));
 const art=$("scene-art"),bg=$("scene-bg"),wordPanel=$("vocab-stage");
 wordPanel.hidden=true;
 art.hidden=false;
 if(scene===10){
  art.src="";
  cleanPicture(0).then(url=>{if(ticket===pictureTicket)bg.src=url});
 }else{
  art.style.opacity="0";
  art.alt=sc.name+" illustration without the printed sentence banner";
  cleanPicture(scene).then(url=>{
   if(ticket!==pictureTicket)return;
   art.onerror=()=>{art.onerror=null;const fallback=illustrationFallback(sc);art.src=fallback;bg.src=fallback;status("📸 Upload the 12 pictures to see the full story.");};
   bg.onerror=()=>{bg.onerror=null;bg.src=illustrationFallback(sc);};
   art.src=url;bg.src=url;art.style.opacity="1";
  });
 }
 $("scene-number").textContent=(scene+1)+" / 10";
 $("touch-left").disabled=scene===0;
 $("touch-right").disabled=scene===9;
 s.last=scene;store();progress();renderCaption();
}
function goto(n,autoplay=false){
 const target=Math.max(0,Math.min(9,n));
 cancel();
 scene=target;draw();
 if(target===10){status("⭐ Magic words! Tap Aa or 🎤 to review.");if(mode==="auto"){endAdventure()}else if(mode==="listen"){endAdventure()}return;}
 status("Scene "+(target+1)+" of 12");
 if(autoplay&&mode==="auto")startSceneAudio(()=>afterSceneAudio());
 else if(autoplay&&mode==="listen")startSceneAudio(()=>listenNext());
}
function soundError(){
 playing=false;textDuringVisible=false;renderCaption();
 status("🔊 Can't play this voice. Tap the middle to retry.");
 if(mode==="auto"&&scene<10){
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
  audio.onplaying=()=>{
    if(sequence!==ticket)return;
    playing=true;
    if(key.startsWith("scene-")){
      if(captionHideTimer!==null){clearTimeout(captionHideTimer);captionHideTimer=null;}
      textDuringVisible=true;renderCaption();
    }
    status("🔊 "+cap(s.voice)+" is reading…");
  };
  audio.onended=()=>{
    if(ticket!==sequence)return;
    audio=null;playing=false;status("🌟 Your turn!");
    if(key.startsWith("scene-")){
      captionHideTimer=setTimeout(()=>{
        captionHideTimer=null;textDuringVisible=false;
        if(readerOpen)renderCaption();
      },1550);
    }
    if(onFinish)onFinish();
  };
  audio.onerror=()=>{if(ticket===sequence)soundError()};
  const promise=audio.play();
  if(promise&&promise.catch)promise.catch(()=>{if(ticket===sequence)soundError()});
 }catch{soundError();}
}
function startSceneAudio(done){
 const id=String(scene+1).padStart(2,"0");
 playAudio("scene-"+id+"-01",()=>playAudio("scene-"+id+"-02",done));
}
function playWordSequence(){
 const list=["animals","park","rabbit","hop","fur","fish","swim","scales","bird","fly","feathers","snake","slither","horse","run","sheep","wool","fluffy","turtle","shell"];
 let idx=0;
 const step=()=>{
  if(idx>=list.length){status("⭐ All four words!");return;}
  const w=list[idx++];playAudio("word-"+w,step);
 };
 step();
}
function centerTap(){
 if(mode==="self")msg("🌱 Listen and practice reading!");
 if(audio){
   if(playing){audio.pause();playing=false;status("⏸ Paused");glyph("⏸");}
   else{audio.play().then(()=>{playing=true;status("▶ Reading")}).catch(soundError);glyph("▶");}
   return;
 }
 if(scene===10)playWordSequence();
 else startSceneAudio(mode==="auto"?()=>afterSceneAudio():mode==="listen"?()=>listenNext():null);
 glyph("🔊");
}
function leftTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene>0){goto(scene-1);glyph("⬅");}
}
function rightTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene<9){goto(scene+1);glyph("➡");}
}
function afterSceneAudio(){if(mode!=="auto"||scene>11)return;schedule(()=>ask(),580);}
function listenNext(){if(mode!=="listen")return;schedule(()=>{if(scene<9)goto(scene+1,true);else endAdventure()},750);}
function earn(){
 if(scene===10)return;
 const newStar=!s.done.includes(scene);
 if(newStar){s.done.push(scene);s.done.sort((a,b)=>a-b);glyph("⭐","celebrate");}
 store();progress();
 if(newStar)msg("🌟 Great job! One more star!");
 else msg("✅ Already practiced!");
}
function toggleFlag(){
 if(scene===10)return;
 if(s.flags.includes(scene)){s.flags=s.flags.filter(i=>i!==scene);msg("✅ Red flag removed");}
 else{s.flags.push(scene);s.flags.sort((a,b)=>a-b);msg("🚩 Saved for review");}
 store();progress();
}
function ask(){
 if(scene>=10)return;
 cancel();closeSheet();
 currentQuestionWrong=false;
 $("quiz").hidden=false;
 $("question").textContent=questions[scene].q;
 $("feedback").textContent="Choose the best word.";
 const opts=$("answers");opts.replaceChildren();
 const choices=Object.keys(vocab).filter(x=>x!==questions[scene].a).sort(()=>Math.random()-.5).slice(0,2);choices.push(questions[scene].a);
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
    if(mode==="auto"){if(scene<9)goto(scene+1,true);else endAdventure();}
    else msg("🌟 Nice work!");
   },950);
  });
  opts.append(b);
 });
}
function endAdventure(){
 cancel();
 if(mode==="auto"){s.completed=s.done.length===10;store();}
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
 textMode=choice==="self"?"full":s.textPreference;
 textDuringVisible=false;
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
function setTextMode(next){
 textMode=next;
 s.textPreference=next;store();
 renderCaption();
 $("text-mode").classList.toggle("mode-always",next==="full");
 $("text-mode").classList.toggle("mode-during",next==="during");
 $("text-mode").setAttribute("aria-label",next==="during"?"Text shown during reading; tap for always visible":next==="full"?"Text always visible; tap to hide":"Text hidden; tap for during-reading subtitles");
 msg(next==="hidden"?"🙈 Text hidden":next==="full"?"📖 Text always visible":next==="during"?"🎬 Subtitles while reading":"✨ Key words");
}
function textCycle(){
 const next=textMode==="during"?"full":textMode==="full"?"hidden":"during";
 setTextMode(next);
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
   [s.fitWhole?"🎬 Fill the Screen":"🖼 Show Full Image",()=>{
     s.fitWhole=!s.fitWhole;store();
     $("reader").classList.toggle("fit-whole",Boolean(s.fitWhole));
     msg(s.fitWhole?"🖼 Whole picture, no cropping":"🎬 Picture fills the screen");
     closeSheet();
   }],
   ["🚀 Auto Adventure",()=>{closeSheet();mode="auto";firstTry=0;runCorrect=0;goto(0,true)}],
   ["🎧 Listen Only",()=>{closeSheet();mode="listen";goto(0,true)}],
   ["🌱 Read Myself",()=>{closeSheet();mode="self";textMode="full";renderCaption();status("Read it aloud!") }]
  ]);
 }else if(kind==="text"){
  h.textContent="Aa Text Display";
  para("Like movie subtitles: appear while the teacher reads, then fade out. Tap Aa to cycle between these three modes.");
  buttonRow([
   ["🎬 During Reading",()=>{setTextMode("during");closeSheet();},textMode==="during"],
   ["📖 Always Visible",()=>{setTextMode("full");closeSheet();},textMode==="full"],
   ["🙈 Hidden",()=>{setTextMode("hidden");closeSheet();},textMode==="hidden"],
   ["✨ Key Words Only",()=>{setTextMode("keywords");closeSheet();},textMode==="keywords"]
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
   ["⭐","Star Reader",s.done.length===10,"Practice 8 scenes"],
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

const coverPhoto=document.querySelector(".cover img");
coverPhoto.addEventListener("error",()=>{coverPhoto.onerror=null;coverPhoto.src=illustrationFallback(scenes[0]);});
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
document.addEventListener("visibilitychange",()=>{if(document.hidden&&audio&&playing){audio.pause();playing=false;status("⏸ Paused while away.");}});
document.addEventListener("fullscreenchange",()=>{if(readerOpen&&!document.fullscreenElement){}});
progress();draw();
})();
