(function(){
"use strict";
// Optional learning layer for Tom's Magic Story V3. The original story remains intact.
if(typeof state==="undefined" || typeof slides==="undefined" || typeof magicSync!=="function")return;
const sceneNames=["Morning Magic","Brush & Shine","School Journey","Classroom Explorer","Lunch Break","Homework Hero","Football Fun","Sleepy Time","Word Treasure"];
const keys=["always","usually","sometimes","never"];
state.listeningBest=Number.isInteger(state.listeningBest)?Math.max(0,Math.min(4,state.listeningBest)):0;
state.flagEver=Boolean(state.flagEver||state.flags.length);
function el(tag,cls,label){const node=document.createElement(tag);if(cls)node.className=cls;if(label!==undefined)node.textContent=label;return node}
function button(cls,label,handler){const b=el("button",cls,label);b.type="button";b.addEventListener("click",handler);return b}
const stage=document.querySelector(".stage");
const mapSection=el("section","journey-section");
mapSection.id="journey-section";
mapSection.setAttribute("aria-label","My Adventure Map");
const mapHeader=el("div","journey-header");
const mapIntro=el("div");
mapIntro.append(el("h2","","🗺️ My Adventure Map"),el("p","","Choose a scene. Collect stars, and revisit your red flags!"));
const badgeCount=el("span","journey-badge-count","🏅 0 Badges");badgeCount.id="extra-badge-counter";
mapHeader.append(mapIntro,button("btn secondary","🏅 My Badges",()=>openPane("badges")),badgeCount);
const mapGrid=el("div","journey-grid");mapGrid.id="extra-main-map";
mapSection.append(mapHeader,mapGrid);
stage.insertAdjacentElement("afterend",mapSection);
const foot=document.querySelector(".foot-actions");
foot.append(button("btn secondary","🗺️ Adventure Map",()=>mapSection.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"})),
 button("btn green","👂 Listening Game",()=>openPane("listen")));
const fullActions=document.querySelector(".magic-actions");
fullActions.append(button("btn secondary","🗺️ Map",()=>openPane("map")),button("btn green","👂 Listen Game",()=>openPane("listen")));
const host=document.querySelector(".zoom-dialog");
function pane(id,title){
 const node=el("section","magic-extra-pane");node.id="extra-"+id+"-pane";node.hidden=true;node.setAttribute("aria-label",title);
 const head=el("div","extra-pane-head");head.append(el("h2","",title),button("magic-mini","✕ Close",closePanes));
 node.append(head);host.append(node);return node;
}
const mapPane=pane("map","🗺️ Tom's Adventure Map");
const mapNote=el("p","extra-hint","⭐ Completed     🚩 Review later     ✨ Current scene");
const zoomMap=el("div","journey-grid extra-map-grid");zoomMap.id="extra-zoom-map";
mapPane.append(mapNote,zoomMap,button("btn green","🏅 See My Badges",()=>openPane("badges")));
const listenPane=pane("listen","👂 Sound Detective");
const listenInfo=el("p","extra-hint","Listen to the teacher, then choose the word you hear.");
const listenProgress=el("div","extra-listen-progress");
const listenPrompt=el("h3","extra-listen-question","Which word do you hear?");
const listenPlay=button("btn extra-listen-play","🔊 Listen to the word",playListening);
const listenOptions=el("div","extra-listen-choices");
const listenFeedback=el("p","extra-listen-feedback","");
listenFeedback.setAttribute("aria-live","polite");
const listenResult=el("div","extra-listen-result");listenResult.hidden=true;
listenPane.append(listenInfo,listenProgress,listenPrompt,listenPlay,listenOptions,listenFeedback,listenResult);
const badgesPane=pane("badges","🏅 My Magic Badges");
const badgesInfo=el("p","extra-hint","Your achievements stay saved on this device.");
const badgeGrid=el("div","extra-badge-grid");
badgesPane.append(badgesInfo,badgeGrid,button("btn secondary","🗺️ Back to Map",()=>openPane("map")));
const panes={map:mapPane,listen:listenPane,badges:badgesPane};
let activePane=null,listenOrder=[],listenAt=0,listenScore=0,listenWrong=false,listenCompleted=false,listenTimer=null;
function closePanes(){Object.values(panes).forEach(p=>p.hidden=true);activePane=null;stop();if(listenTimer){clearTimeout(listenTimer);listenTimer=null;}}
function openPane(name){
 if(!document.getElementById("zoom-dialog").classList.contains("show"))showZoom();
 const review=document.getElementById("magic-review-pane"),challenge=document.getElementById("magic-challenge"),finale=document.getElementById("magic-finale");
 review.hidden=true;challenge.hidden=true;finale.hidden=true;
 Object.values(panes).forEach(p=>p.hidden=true);
 const target=panes[name];target.hidden=false;activePane=name;
 if(name==="map")renderMap();
 if(name==="badges")renderBadges();
 if(name==="listen")startListening();
 target.querySelector(".extra-pane-head button").focus();
}
function mapTile(i,inFullscreen){
 const done=state.done.includes(i),flag=state.flags.includes(i),active=current===i;
 const card=button("journey-tile"+(done?" tile-done":"")+(flag?" tile-flag":"")+(active?" tile-current":""),"",()=>{
  slide(i);
  if(inFullscreen){closePanes();}else{stage.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});}
 });
 card.setAttribute("aria-label",(i===8?"Word Treasure":"Scene "+(i+1))+", "+sceneNames[i]+(done?", practiced":"")+(flag?", red flag":"")+(active?", current":""));
 const picture=el("img","journey-picture");picture.src=slides[i].image;picture.alt="";picture.loading="lazy";
 const label=el("span","journey-label",sceneNames[i]);const index=el("span","journey-index",i===8?"🎁 9":String(i+1));
 const markers=el("span","journey-markers",(done?"⭐ ":"")+(flag?"🚩 ":"")+(active?"✨":""));
 const caption=el("span","journey-caption",i===8?"Review four words":done?"Well done!":flag?"Review later":"Let's explore!");
 card.append(picture,index,markers,label,caption);return card;
}
function renderMap(){
 for(const [parent,isFull] of [[mapGrid,false],[zoomMap,true]]){
  const fragment=document.createDocumentFragment();
  slides.forEach((_,i)=>fragment.append(mapTile(i,isFull)));
  parent.replaceChildren(fragment);
 }
}
function challengesComplete(){return [1,3,5,7].every(i=>state.challenges[i]===true)}
function achievedBadges(){
 return [
  {id:"start",icon:"🌱",name:"First Step",hint:"Practice 1 scene",earned:state.done.length>=1},
  {id:"flags",icon:"🚩",name:"Brave Learner",hint:"Use a review flag",earned:state.flagEver},
  {id:"reader",icon:"⭐",name:"Star Reader",hint:"Practice all 8 scenes",earned:state.done.length>=8},
  {id:"words",icon:"🎯",name:"Word Wizard",hint:"Win all 4 scene challenges",earned:challengesComplete()},
  {id:"sound",icon:"🎧",name:"Sound Detective",hint:"Score 3/4 in Listening Game",earned:state.listeningBest>=3},
  {id:"champion",icon:"🏆",name:"Story Champion",hint:"Finish the story, challenges and listening",earned:state.done.length>=8&&challengesComplete()&&state.listeningBest>=3}
 ];
}
function renderBadges(){
 const badges=achievedBadges();const count=badges.filter(b=>b.earned).length;
 badgeCount.textContent="🏅 "+count+" / "+badges.length+" Badges";
 const fragment=document.createDocumentFragment();
 badges.forEach(b=>{
  const card=el("div","extra-badge"+(b.earned?" badge-earned":" badge-locked"));
  card.append(el("span","extra-badge-icon",b.earned?b.icon:"🔒"),el("strong","",b.name),el("small","",b.hint),el("span","extra-badge-state",b.earned?"Earned!":"Keep going"));
  fragment.append(card);
 });
 badgeGrid.replaceChildren(fragment);
}
function syncExtras(){
 renderMap();renderBadges();
 if(!Array.isArray(state.badgesSeen)){state.badgesSeen=achievedBadges().filter(b=>b.earned).map(b=>b.id);save();return;}
 const earned=achievedBadges().filter(b=>b.earned&&!state.badgesSeen.includes(b.id));
 if(earned.length){
  state.badgesSeen.push(...earned.map(b=>b.id));save();
  if(document.getElementById("zoom-dialog").classList.contains("show"))magicBurst("🏅");
  status("🏅 New badge: "+earned.map(b=>b.name).join(", ")+"!");
 }
}
const oldSync=magicSync;
magicSync=function(){oldSync();syncExtras()};
["magic-quick","main-quick","magic-review","main-review"].forEach(id=>{
 const b=document.getElementById(id);b.addEventListener("click",closePanes,{capture:true});
});
["magic-flag","main-flag"].forEach(id=>{
 document.getElementById(id).addEventListener("click",()=>{
  if(state.flags.length){state.flagEver=true;save();syncExtras()}
 });
});
document.getElementById("close-zoom").addEventListener("click",closePanes);
document.addEventListener("keydown",event=>{
 if(event.key==="Escape"&&activePane){
  event.preventDefault();event.stopImmediatePropagation();closePanes();
 }
},true);
function shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startListening(){
 if(listenTimer){clearTimeout(listenTimer);listenTimer=null;}
 listenOrder=shuffle(keys);listenAt=0;listenScore=0;listenWrong=false;listenCompleted=false;
 listenResult.hidden=true;listenPlay.hidden=false;listenOptions.hidden=false;listenPrompt.hidden=false;listenFeedback.textContent="";
 renderListenQuestion();
}
function playListening(){
 if(listenCompleted)return;
 listenFeedback.textContent="🎧 Listen carefully and choose!";
 play("word-"+listenOrder[listenAt]); 
}
function renderListenQuestion(){
 if(listenAt>=listenOrder.length){finishListening();return;}
 listenProgress.textContent="🎧 Question "+(listenAt+1)+" of 4 · "+listenScore+" correct on first try";
 listenPrompt.textContent="Which word do you hear?";
 listenWrong=false;listenFeedback.textContent="";
 listenPlay.textContent="🔊 Listen ("+state.voice.charAt(0).toUpperCase()+state.voice.slice(1)+")";
 const fragment=document.createDocumentFragment();
 shuffle(keys).forEach(word=>{
  const b=button("extra-listen-option",word,()=>{
   if(listenCompleted||listenTimer)return;
   if(word===listenOrder[listenAt]){
    b.classList.add("correct");
    if(!listenWrong)listenScore++;
    listenFeedback.textContent="✅ Great listening! "+word.toUpperCase()+" ⭐";
    [...listenOptions.querySelectorAll("button")].forEach(x=>x.disabled=true);
    magicBurst("⭐");
    listenTimer=setTimeout(()=>{listenTimer=null;listenAt++;renderListenQuestion();},950);
   }else{
    listenWrong=true;b.classList.add("wrong");
    listenFeedback.textContent="💡 Not yet! Listen again and try another word.";
   }
  });
  fragment.append(b);
 });
 listenOptions.replaceChildren(fragment);
}
function finishListening(){
 listenCompleted=true;listenPlay.hidden=true;listenOptions.hidden=true;listenPrompt.hidden=true;
 listenProgress.textContent="🏁 Game complete!";
 listenFeedback.textContent="";
 const improved=listenScore>state.listeningBest;
 state.listeningBest=Math.max(state.listeningBest,listenScore);save();
 listenResult.hidden=false;listenResult.replaceChildren();
 listenResult.append(el("div","extra-result-icon",listenScore>=3?"🏆🎧":"🌟"),el("h3","",listenScore+" / 4 — "+(listenScore===4?"Perfect!":listenScore>=3?"Well done!":"Let's practice!")),
   el("p","",listenScore>=3?"You've earned your Sound Detective badge!":"Listen again to improve your score."),
   button("btn green","🔁 Play Again",startListening),
   button("btn secondary","🏅 My Badges",()=>openPane("badges")));
 if(listenScore>=3){magicBurst("🏅");if(!state.muteCelebration)magicChime();}
 if(improved)syncExtras();
}
syncExtras();
})();