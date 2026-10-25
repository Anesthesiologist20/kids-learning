(()=>{
"use strict";
const $=id=>document.getElementById(id);
const scenes=[{"img":"images/01.webp","line":"Aboud wakes up on Saturday. He is excited to try his favorite hobbies.","name":"My Hobby Day","emoji":"🌞"},{"img":"images/02.webp","line":"First, Aboud plays football with his friends. He kicks the ball and scores a goal!","name":"Football Time","emoji":"⚽"},{"img":"images/03.webp","line":"Next, Aboud puts on his helmet. He rides his blue bike along a safe path.","name":"Bike Ride","emoji":"🚲"},{"img":"images/04.webp","line":"At the park, Aboud meets more children. They take turns on the swings.","name":"At the Playground","emoji":"🛝"},{"img":"images/05.webp","line":"After lunch, Aboud builds a tall tower with colorful blocks. He loves to create new things.","name":"Building Fun","emoji":"🧱"},{"img":"images/06.webp","line":"Aboud draws a sunny park and paints it with bright colors. He feels proud of his picture.","name":"Drawing a Picture","emoji":"🎨"},{"img":"images/07.webp","line":"Later, Aboud plays a fun game with his cousins. They laugh and help one another.","name":"Games and Friends","emoji":"🎮"},{"img":"images/08.webp","line":"At sunset, Aboud smiles. Football, cycling, drawing, and playing with friends make his day special!","name":"My Favorite Hobby","emoji":"🌟"}];
const vocab={"hobby":{"arabic":"هواية","english":"An activity you enjoy in your free time","example":"Football is my hobby."},"football":{"arabic":"كرة القدم","english":"A game played by kicking a ball","example":"I play football."},"friends":{"arabic":"أصدقاء","english":"People you like to play with","example":"My friends are kind."},"kick":{"arabic":"يركل","english":"To hit a ball with your foot","example":"I kick the ball."},"goal":{"arabic":"هدف","english":"A point scored in football","example":"He scores a goal."},"helmet":{"arabic":"خوذة","english":"A hard hat that protects your head","example":"Wear a helmet."},"bike":{"arabic":"دراجة","english":"A vehicle with two wheels","example":"I ride my bike."},"ride":{"arabic":"يركب","english":"To travel on a bicycle or horse","example":"I ride safely."},"park":{"arabic":"منتزه","english":"An outdoor place with grass and trees","example":"We play in the park."},"children":{"arabic":"أطفال","english":"Young people","example":"The children play."},"turns":{"arabic":"أدوار","english":"Chances to do something one after another","example":"We take turns."},"swings":{"arabic":"أراجيح","english":"Playground seats that move back and forth","example":"We play on the swings."},"build":{"arabic":"يبني","english":"To make something by putting pieces together","example":"I build a tower."},"blocks":{"arabic":"مكعبات","english":"Small pieces used for building","example":"I use colorful blocks."},"tower":{"arabic":"برج","english":"A tall structure","example":"My tower is tall."},"draw":{"arabic":"يرسم","english":"To make a picture with a pencil","example":"I draw a picture."},"paint":{"arabic":"يلوّن","english":"To make a picture with paint","example":"I paint the sky."},"colors":{"arabic":"ألوان","english":"Different shades like blue and yellow","example":"I love bright colors."},"game":{"arabic":"لعبة","english":"An activity with rules for fun","example":"We play a game."},"cousins":{"arabic":"أبناء العم أو الخال","english":"Children of your uncle or aunt","example":"My cousins visit us."},"laugh":{"arabic":"يضحك","english":"To make a happy sound","example":"We laugh together."},"cycling":{"arabic":"ركوب الدراجات","english":"Riding a bicycle for fun or sport","example":"Cycling is fun."},"favorite":{"arabic":"مفضّل","english":"Liked more than others","example":"Football is my favorite hobby."},"proud":{"arabic":"فخور","english":"Feeling pleased about what you did","example":"I feel proud."},"create":{"arabic":"يبتكر","english":"To make something new","example":"I create a picture."}};
const questions=[{"q":"What is Aboud excited to do?","answer":"Try his hobbies","choices":["Try his hobbies","Do homework","Go to sleep"]},{"q":"What does Aboud kick?","answer":"A ball","choices":["A ball","A book","A bicycle"]},{"q":"What does Aboud wear to ride safely?","answer":"A helmet","choices":["A helmet","A hat","A scarf"]},{"q":"What do the children do?","answer":"Take turns","choices":["Take turns","Go shopping","Watch a film"]},{"q":"What does Aboud build?","answer":"A tower","choices":["A tower","A bridge","A kite"]},{"q":"What does Aboud paint?","answer":"A sunny park","choices":["A sunny park","A spaceship","A snowy mountain"]},{"q":"Who plays with Aboud?","answer":"His cousins","choices":["His cousins","His teacher","His doctor"]},{"q":"What makes Aboud happy?","answer":"His hobbies","choices":["His hobbies","The rain","An exam"]}];
const voices=["bella","heart","sarah"];
const speeds=["0.8","1"];
const storageKey="kids-learning-aboud-hobbies-8-v1";
const initial={done:[],flags:[],passed:[],mistakes:[],last:0,voice:"bella",speed:"1",mute:false,completed:false,listenCompleted:false,textPreference:"during",fitWhole:false};
let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey))||{}}catch{}
const s={...initial,...saved};
for(const key of ["done","flags","passed","mistakes"])s[key]=[...new Set(Array.isArray(s[key])?s[key].filter(x=>Number.isInteger(x)&&x>=0&&x<8):[])];
if(!voices.includes(s.voice))s.voice="bella";
if(!speeds.includes(String(s.speed)))s.speed="1";
let scene=Number.isInteger(s.last)?Math.max(0,Math.min(7,s.last)):0;
if(!["during","full","hidden","keywords"].includes(s.textPreference))s.textPreference="during";
let mode="manual",textMode=s.textPreference,selectedMode="manual";
let textDuringVisible=false,captionHideTimer=null;
const sceneFocusY=[50,50,50,50,50,50,50,50];
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
 $("home-progress").textContent="⭐ "+s.done.length+"/8 practiced";
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
  const keys=[...new Set((scenes[scene].line.toLowerCase().match(/\b(hobby|football|friends|kick|goal|helmet|bike|ride|park|children|turns|swings|build|blocks|tower|draw|paint|colors|game|cousins|laugh|cycling|favorite|proud|create)\b/g)||[]))];
  keys.forEach((w,i)=>{if(i)cap.append("  ·  ");cap.append(keywordButton(capitalizeWord(w)))});
  return;
 }
 const bits=scenes[scene].line.split(/\b(hobby|football|friends|kick|goal|helmet|bike|ride|park|children|turns|swings|build|blocks|tower|draw|paint|colors|game|cousins|laugh|cycling|favorite|proud|create)\b/gi);
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
 if(scene===8){
  art.src="";
  cleanPicture(0).then(url=>{if(ticket===pictureTicket)bg.src=url});
 }else{
  art.style.opacity="0";
  art.alt=sc.name+" illustration without the printed sentence banner";
  cleanPicture(scene).then(url=>{
   if(ticket!==pictureTicket)return;
   art.onerror=()=>{art.onerror=null;const fallback=illustrationFallback(sc);art.src=fallback;bg.src=fallback;status("📸 Unable to load this picture.");};
   bg.onerror=()=>{bg.onerror=null;bg.src=illustrationFallback(sc);};
   art.src=url;bg.src=url;art.style.opacity="1";
  });
 }
 $("scene-number").textContent=(scene+1)+" / 8";
 $("touch-left").disabled=scene===0;
 $("touch-right").disabled=scene===7;
 s.last=scene;store();progress();renderCaption();
}
function goto(n,autoplay=false){
 const target=Math.max(0,Math.min(7,n));
 cancel();
 scene=target;draw();
 if(target===8){status("⭐ Magic words! Tap Aa or 🎤 to review.");if(mode==="auto"){endAdventure()}else if(mode==="listen"){endAdventure()}return;}
 status("Scene "+(target+1)+" of 8");
 if(autoplay&&mode==="auto")startSceneAudio(()=>afterSceneAudio());
 else if(autoplay&&mode==="listen")startSceneAudio(()=>listenNext());
}
function soundError(){
 playing=false;textDuringVisible=false;renderCaption();
 status("🔊 Can't play this voice. Tap the middle to retry.");
 if(mode==="auto"&&scene<8){
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
 const list=["hobby","football","friends","kick","goal","helmet","bike","ride","park","children","turns","swings","build","blocks","tower","draw","paint","colors","game","cousins","laugh","cycling","favorite","proud","create"];
 let idx=0;
 const step=()=>{
  if(idx>=list.length){status("⭐ All hobby words!");return;}
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
 if(scene===8)playWordSequence();
 else startSceneAudio(mode==="auto"?()=>afterSceneAudio():mode==="listen"?()=>listenNext():null);
 glyph("🔊");
}
function leftTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene>0){goto(scene-1);glyph("⬅");}
}
function rightTap(){
 if(mode==="auto"||mode==="listen"){mode="manual";msg("📖 Manual reading");}
 if(scene<7){goto(scene+1);glyph("➡");}
}
function afterSceneAudio(){if(mode!=="auto"||scene>7)return;schedule(()=>ask(),580);}
function listenNext(){if(mode!=="listen")return;schedule(()=>{if(scene<7)goto(scene+1,true);else endAdventure()},750);}
function earn(){
 if(scene===8)return;
 const newStar=!s.done.includes(scene);
 if(newStar){s.done.push(scene);s.done.sort((a,b)=>a-b);glyph("⭐","celebrate");}
 store();progress();
 if(newStar)msg("🌟 Great job! One more star!");
 else msg("✅ Already practiced!");
}
function toggleFlag(){
 if(scene===8)return;
 if(s.flags.includes(scene)){s.flags=s.flags.filter(i=>i!==scene);msg("✅ Red flag removed");}
 else{s.flags.push(scene);s.flags.sort((a,b)=>a-b);msg("🚩 Saved for review");}
 store();progress();
}
function ask(){
 if(scene>=8)return;
 cancel();closeSheet();
 currentQuestionWrong=false;
 $("quiz").hidden=false;
 $("question").textContent=questions[scene].q;
 $("feedback").textContent="Choose the best word.";
 const opts=$("answers");opts.replaceChildren();
 const choices=questions[scene].choices.slice();
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 choices.forEach(word=>{
  const b=document.createElement("button");b.textContent=cap(word);
  b.addEventListener("click",()=>{
   if($("quiz").hidden)return;
   if(word!==questions[scene].answer){
    currentQuestionWrong=true;if(!s.mistakes.includes(scene)){s.mistakes.push(scene);store();}b.classList.add("bad");b.disabled=true;
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
    if(mode==="auto"){if(scene<7)goto(scene+1,true);else endAdventure();}
    else msg("🌟 Nice work!");
   },950);
  });
  opts.append(b);
 });
}
function endAdventure(){
 cancel();
 if(mode==="auto"){s.completed=s.done.length===8;store();}
 if(mode==="listen"){s.listenCompleted=true;store();}
 progress();
 $("quiz").hidden=true;$("complete").hidden=false;
 $("summary").textContent=mode==="auto"
  ?"⭐ "+runCorrect+" scenes answered · 🎯 "+firstTry+" correct on the first try. Your progress is saved!"
  :"You listened to all 8 story scenes. Wonderful work!";
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
   ["🧩 Review Mistakes",()=>showSheet("mistakes")],
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
  buttonRow(speeds.map((v,i)=>[["🐢 Slow","▶ Normal"][i],()=>{s.speed=v;store();showSheet("voice")},s.speed===v]));
  const test=document.createElement("button");test.className="primary";test.textContent="🔊 Test Voice";test.style.marginTop="12px";
  test.addEventListener("click",()=>{closeSheet();playAudio("preview")});root.append(test);
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
 }else if(kind==="mistakes"){
  h.textContent="🧩 My Tricky Questions";
  if(!s.mistakes.length)para("No mistakes yet. Keep exploring!");
  s.mistakes.forEach(i=>{
   const b=document.createElement("button");b.className="flag-item";b.type="button";
   const im=document.createElement("img");im.src=scenes[i].img;im.alt="";
   const p=document.createElement("p");p.textContent="🧩 Scene "+(i+1);
   const small=document.createElement("small");small.textContent=questions[i].q;p.append(small);b.append(im,p);
   b.addEventListener("click",()=>{closeSheet();mode="manual";goto(i);ask()});root.append(b);
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
   ["⭐","Hobby Explorer",s.done.length===8,"Practice all 10 scenes"],
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
$("question-listen").addEventListener("click",()=>playAudio("question-"+String(scene+1).padStart(2,"0")));
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
