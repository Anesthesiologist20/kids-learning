(function(){
"use strict";
const forms=(window.MIDTERM_FORMS||[]).slice().sort(function(a,b){return a.id.localeCompare(b.id);});
const sections={v:{name:"Vocabulary",ar:"Vocabulary",icon:"🎂"},f:{name:"Frequency",ar:"Adverbs of Frequency",icon:"🔁"},p:{name:"Place",ar:"Prepositions of Place",icon:"🏫"},r:{name:"Reading",ar:"Reading",icon:"📖"},w:{name:"Writing",ar:"Synonyms & Writing",icon:"✍️"}};
const avatars={a:"🧑‍🏫",b:"🧩",c:"🧠",d:"🌱"};
const KEY="aboud-midterm-three-form-exams-v1";
const app=document.getElementById("app");
let data={drafts:{},history:{}},mode="home",active=null,reviewFilter="wrong";
function escapeHtml(x){return String(x).replace(/[&<>"']/g,function(s){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]})}
function load(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&saved.drafts&&saved.history)data=saved;}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}}
function getForm(id){return forms.find(function(f){return f.id===id})}
function getSession(id){const d=data.drafts[id];const f=getForm(id);if(!d||!f||!Array.isArray(d.answers)||d.answers.length!==f.questions.length||!Array.isArray(d.optionOrders)||!Array.isArray(d.qOrder)||d.qOrder.length!==f.questions.length)return null;return d}
function shuffled(n){let a=Array.from({length:n},function(_,i){return i});for(let i=n-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));let x=a[i];a[i]=a[j];a[j]=x;}return a;}
function newSession(f){return {id:f.id,qOrder:shuffled(f.questions.length),optionOrders:f.questions.map(function(){return shuffled(4)}),answers:Array(f.questions.length).fill(null),pos:0,startedAt:Date.now()}}
function countDone(s){return s.answers.filter(function(v){return v!==null}).length}
function secs(s){return Math.max(0,Math.floor((Date.now()-s.startedAt)/1000))}
function fmtTime(n){let m=Math.floor(n/60),s=n%60;return (m<10?"0":"")+m+":"+(s<10?"0":"")+s}
function lastResult(id){return (data.history[id]||[]).slice(-1)[0]}
function bestResult(id){const a=data.history[id]||[];return a.length?a.reduce(function(x,y){return y.score>x.score?y:x}):null}
function getResults(){return forms.map(function(f){return {f:f,b:bestResult(f.id),last:lastResult(f.id)}})}
function wrap(n){return '<strong>'+escapeHtml(n)+'</strong>'}
function sourceLabel(src){return src.replace("Guide p","Study Guide p").replace("AB p","Activity Book p")}
function navigateTop(){if(typeof window.scrollTo==="function"){window.scrollTo({top:0,behavior:"auto"})}}
let readerVoiceURI="",readerRate=0.85;
function readerVoices(){return window.speechSynthesis?window.speechSynthesis.getVoices().filter(function(v){return /^en(-|$)/i.test(v.lang)}):[]}
function readerControls(f){
if(f.id!=="d")return "";
const voices=readerVoices();
return '<div class="reader-tools" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px"><button class="btn outline" data-action="readQuestion" type="button">🔊 Read question</button><label class="small">Voice <select data-reader-voice style="padding:8px;border-radius:8px;max-width:220px"><option value="">Automatic English voice</option>'+voices.map(function(v){return '<option value="'+escapeHtml(v.voiceURI)+'" '+(readerVoiceURI===v.voiceURI?'selected':'')+'>'+escapeHtml(v.name)+' · '+escapeHtml(v.lang)+'</option>'}).join("")+'</select></label><label class="small">Speed <select data-reader-rate style="padding:8px;border-radius:8px"><option value="0.7" '+(readerRate===0.7?'selected':'')+'>Slow</option><option value="0.85" '+(readerRate===0.85?'selected':'')+'>Normal</option><option value="1" '+(readerRate===1?'selected':'')+'>Fast</option></select></label></div>';
}
function readCurrentQuestion(){
const f=getForm(active),s=getSession(active);if(!f||!s||f.id!=="d")return;if(!window.speechSynthesis||typeof SpeechSynthesisUtterance==="undefined"){alert("Text to speech is not supported on this device.");return;}
const q=f.questions[s.qOrder[s.pos]],voices=readerVoices(),utterance=new SpeechSynthesisUtterance(q.prompt);
let voice=voices.find(function(v){return v.voiceURI===readerVoiceURI});
if(!voice)voice=voices.find(function(v){return /layla|amy/i.test(v.name)})||voices.find(function(v){return /female|samantha|aria|jenny|zira|ava|susan|karen/i.test(v.name)})||voices[0];
if(voice)utterance.voice=voice;
utterance.rate=readerRate;utterance.lang=voice?voice.lang:"en-US";
window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
}

function renderHome(){
mode="home";active=null;reviewFilter="wrong";
const list=getResults();const completed=list.filter(function(x){return x.b}).sort(function(a,b){return b.b.score-a.b.score});
let cards="";
list.forEach(function(x){
 const f=x.f,d=getSession(f.id),b=x.b,attempts=(data.history[f.id]||[]).length;
 cards+='<article class="model" data-theme="'+f.theme+'"><div class="model-head"><div class="model-avatar">'+avatars[f.id]+'</div><small>MODEL '+f.id.toUpperCase()+' · 45 QUESTIONS</small></div><h3>'+escapeHtml(f.name)+'<br><small>'+escapeHtml(f.arabic)+'</small></h3><p>'+escapeHtml(f.focus)+'</p><div class="meta">'+escapeHtml(f.tagline)+'</div><small>Vocabulary (12) · Frequency (10) · Place (8) · Reading (9) · Writing (6)</small><small>'+(b?'Best: '+b.score+' / 45 · Attempts: '+attempts:"Not started yet")+(d?' · Saved: '+countDone(d)+'/45':"")+'</small><button class="btn" data-action="start" data-id="'+f.id+'">'+(d?'▶ Continue':b?'🔄 Try Again':'🚀 Start Model')+'</button>'+(x.last?'<button class="btn outline" data-action="history" data-id="'+f.id+'">📋 Review Last Result</button>':"")+'</article>';
});
let board=completed.length?completed.map(function(x,i){return '<div class="result-mini"><small>Rank '+(i+1)+' · '+escapeHtml(x.f.name)+'</small><b>'+x.b.score+' / 45</b><small>'+Math.round(x.b.score/45*100)+'% · Best attempt</small></div>'}).join(""):'<p class="small">Complete a model to see Aboud’s results here and compare all four models.</p>';
let legend=Object.keys(sections).map(function(k){const s=sections[k],c={v:12,f:10,p:8,r:9,w:6}[k];return '<div><b>'+s.icon+' '+s.ar+'</b><small>'+c+' questions / model</small></div>'}).join("");
app.innerHTML='<section class="panel"><h2>Choose a Model 🏁</h2><p class="small">Each model uses a different question style and covers the topics in the study guide and Activity Book.</p><div class="models">'+cards+'</div></section><section class="panel"><h2>📊 Scoreboard</h2><div class="board">'+board+'</div><p class="source">Compare Aboud’s scores across the four models.</p></section><section class="panel"><h2>📚 Coverage Map — 45 Questions per Model</h2><div class="legend">'+legend+'</div><p class="source"><strong>Study sources:</strong> Mid-Term Study Guide Unit 2A and Activity Book pp. 14–15 and 22–27.</p></section><section class="panel"><h2>🌱 Start Easy, Then Try a Challenge</h2><div class="subtle">Easy Model is a gentle starting point, with short questions, familiar words, and clear answers. Move to the other models when ready.</div><h2 style="margin-top:18px">📌 Test Rules</h2><ol class="rules"><li>Each question has <b>four choices</b>. Choose one answer; it is locked after selection.</li><li>Correct answers and explanations appear after you submit.</li><li>You may skip questions and submit at any time. Unanswered questions count as incorrect.</li><li>Progress and results are saved in this browser. No sign-in or payment is needed.</li></ol></section>';
}
function start(id,force){
const f=getForm(id);if(!f)return;
if(force||!getSession(id)){data.drafts[id]=newSession(f);save();}
active=id;mode="exam";renderExam();navigateTop();
}
function renderExam(){
if(mode!=="exam")return;
const f=getForm(active),s=getSession(active);if(!f||!s){renderHome();return}
const done=countDone(s),qIndex=s.qOrder[s.pos],q=f.questions[qIndex],selected=s.answers[qIndex],order=s.optionOrders[qIndex];
let options=order.map(function(n,i){return '<button class="choice'+(selected===n?" selected":"")+'" data-action="pick" data-value="'+n+'" '+(selected!==null?"disabled":"")+' aria-label="Choice '+(i+1)+'"><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHtml(q.choices[n])+'</span></button>'}).join("");
let dots=s.qOrder.map(function(qi,pos){const answer=s.answers[qi],status=answer===null?"":answer===f.questions[qi].answer?" correct":" wrong";return '<button class="dot'+(answer!==null?" done":"")+status+(pos===s.pos?" active":"")+'" data-action="jump" data-pos="'+pos+'" aria-label="Question '+(pos+1)+(answer===null?" — unanswered":answer===f.questions[qi].answer?" — correct":" — incorrect")+'">'+(pos+1)+'</button>'}).join("");
const okAll=done===f.questions.length;
const rightCount=s.answers.filter(function(answer,i){return answer!==null&&answer===f.questions[i].answer}).length,wrongCount=done-rightCount;
app.innerHTML='<section class="panel"><div class="exam-top"><div class="title-line"><span class="icon-large">'+avatars[f.id]+'</span><div><span class="label">'+escapeHtml(f.name)+'</span><h2>'+escapeHtml(f.arabic)+'</h2></div></div><div><b id="clock">⏱ '+fmtTime(secs(s))+'</b><div class="small">Answered: '+done+' / '+f.questions.length+'</div></div></div><div class="progress-wrap"><div class="progress-inner" style="width:'+Math.round(done/f.questions.length*100)+'%"></div></div><div class="exam-top"><span class="label">Question '+(s.pos+1)+' of '+f.questions.length+'</span><span class="label">'+sections[q.section].icon+' '+sections[q.section].ar+'</span></div><section class="question">'+readerControls(f)+'<h2 class="en" lang="en">'+escapeHtml(q.prompt)+'</h2><div class="choices en" lang="en">'+options+'</div></section><div class="exam-controls"><button class="btn outline" data-action="prev" '+(s.pos===0?'disabled':'')+'>← Previous</button><button class="btn outline" data-action="home">🏠 Models</button><button class="btn" data-action="next">'+(s.pos===f.questions.length-1&&!okAll?"Go to an unanswered question →":"Next →")+'</button></div><div class="actions"><button class="btn gold" data-action="finish">🏆 Submit Test & View Results</button></div><details class="question-map" open><summary>🗺️ Question Map · ✅ '+rightCount+' correct · ❌ '+wrongCount+' incorrect · ◻️ '+(f.questions.length-done)+' unanswered</summary><div class="map-legend"><span><i class="map-swatch correct"></i>Correct</span><span><i class="map-swatch wrong"></i>Incorrect</span><span><i class="map-swatch"></i>Unanswered</span></div><div class="dots">'+dots+'</div></details></section>';
}
function renderExamAtCurrentPosition(){if(window.speechSynthesis)window.speechSynthesis.cancel();const y=window.scrollY;renderExam();window.scrollTo({top:y,behavior:"auto"});}
function pick(index){
const f=getForm(active),s=getSession(active);if(!f||!s)return;
const qi=s.qOrder[s.pos];if(s.answers[qi]!==null||!Number.isInteger(index)||index<0||index>3)return;
s.answers[qi]=index;save();renderExamAtCurrentPosition();
}
function advance(delta){
const s=getSession(active);if(!s)return;
if(delta===-1)s.pos=Math.max(0,s.pos-1);
else if(s.pos<s.qOrder.length-1)s.pos++;
else {const firstMissing=s.qOrder.findIndex(function(i){return s.answers[i]===null});if(firstMissing>=0)s.pos=firstMissing;}
save();renderExamAtCurrentPosition();
}
function jump(pos){const s=getSession(active);if(!s||pos<0||pos>=s.qOrder.length)return;s.pos=pos;save();renderExamAtCurrentPosition();}
function grade(f,answers){
const correct=answers.map(function(v,i){return v===f.questions[i].answer});
const scores={},totals={};Object.keys(sections).forEach(function(k){scores[k]=0;totals[k]=0});
f.questions.forEach(function(q,i){totals[q.section]++;if(correct[i])scores[q.section]++});
return {score:correct.filter(Boolean).length,scores:scores,totals:totals};
}
function finish(){
const f=getForm(active),s=getSession(active);if(!f||!s)return;
const g=grade(f,s.answers);
const result={id:f.id,score:g.score,sections:g.scores,answers:s.answers.slice(),date:Date.now(),duration:secs(s)};
if(!data.history[f.id])data.history[f.id]=[];
data.history[f.id].push(result);data.history[f.id]=data.history[f.id].slice(-12);
delete data.drafts[f.id];save();mode="result";reviewFilter="wrong";renderResult(f.id,result);navigateTop();
}
function renderResult(id,result){
const f=getForm(id);if(!f||!result)return;
mode="result";active=id;
const g=grade(f,result.answers);
const wrong=f.questions.map(function(q,i){return {q:q,i:i}}).filter(function(x){return result.answers[x.i]!==null&&result.answers[x.i]!==x.q.answer});
const weak=Object.keys(sections).slice().sort(function(a,b){return g.scores[a]/g.totals[a]-g.scores[b]/g.totals[b]})[0];
const pct=Math.round(g.score/f.questions.length*100),unanswered=result.answers.filter(function(a){return a===null}).length;
const solved=result.answers.length-unanswered,correct=g.score;
const counts={solved:solved,correct:correct,wrong:wrong.length,unanswered:unanswered};
const message=pct>=90?"Excellent work! Review any missed questions.":pct>=75?"Good work. Review the questions you missed.":pct>=60?"A focused review of your weakest topic will help.":"Review the vocabulary and grammar, then try again.";
const rows=Object.keys(sections).map(function(k){return '<div class="sr"><div>'+sections[k].icon+'</div><strong>'+g.scores[k]+' / '+g.totals[k]+'</strong><small>'+sections[k].ar+'</small></div>'}).join("");
const filters=[{id:"solved",label:"Answered"},{id:"correct",label:"Correct"},{id:"wrong",label:"Incorrect"},{id:"unanswered",label:"Unanswered"}];
const filterButtons=filters.map(function(x){return '<button class="btn '+(reviewFilter===x.id?"gold":"outline")+'" data-action="reviewFilter" data-filter="'+x.id+'" aria-pressed="'+(reviewFilter===x.id)+'">'+x.label+' · '+counts[x.id]+'</button>'}).join("");
const items=f.questions.map(function(q,i){return {q:q,i:i}}).filter(function(x){
 const answer=result.answers[x.i],isCorrect=answer===x.q.answer;
 if(reviewFilter==="solved")return answer!==null;
 if(reviewFilter==="correct")return isCorrect;
 if(reviewFilter==="wrong")return answer!==null&&!isCorrect;
 if(reviewFilter==="unanswered")return answer===null;
 return true;
}).map(function(x){
 const q=x.q,i=x.i,chosen=result.answers[i],correct=chosen===q.answer;
 const state=chosen===null?"⏳ Unanswered":correct?"✅ Correct":"❌ Incorrect";
 const answerLine=chosen===null?"⏳ No answer selected":(correct?"✓ Your answer: ":"✗ Your answer: ")+escapeHtml(q.choices[chosen]);
 return '<article class="review-item"><div class="exam-top"><span class="label">'+sections[q.section].icon+' '+sections[q.section].ar+' · Question '+(i+1)+'</span><span class="label">'+state+'</span></div><h4 class="en">'+escapeHtml(q.prompt)+'</h4><p class="en '+(correct?"yes":"no")+'">'+answerLine+'</p>'+(!correct?'<p class="en yes">✓ Correct answer: '+escapeHtml(q.choices[q.answer])+'</p>':"")+'<p class="en" lang="en">'+escapeHtml(q.explanation)+'</p><code>'+escapeHtml(sourceLabel(q.source))+'</code></article>';
}).join("");
const empty=items?"":'<p class="subtle">There are no questions in the “'+filters.find(function(x){return x.id===reviewFilter}).label+'” category.</p>';
app.innerHTML='<section class="panel"><div class="exam-top"><span class="label">🏁 '+escapeHtml(f.name)+'</span><span class="label">⏱ '+fmtTime(result.duration)+'</span></div><div class="score-big"><div class="small">Aboud’s Final Score</div><div class="number">'+g.score+' / '+f.questions.length+'</div><div class="score-desc">'+pct+'% · '+message+'</div></div><h2>📈 Score by Topic</h2><div class="sections-result">'+rows+'</div><p class="subtle">🎯 Review first: <b>'+sections[weak].ar+'</b> ('+g.scores[weak]+' / '+g.totals[weak]+'). Aboud answered '+solved+' questions and left '+unanswered+' unanswered. Answers cannot be changed after submission.</p><div class="actions"><button class="btn gold" data-action="startfresh" data-id="'+id+'">🔄 Try This Model Again</button><button class="btn outline" data-action="home">🏠 Back to Models</button></div></section><section class="panel"><h2>🔍 Test Review</h2><p class="small">Choose a category to review. “Answered” includes both correct and incorrect answers.</p><div class="actions">'+filterButtons+'</div>'+empty+'</section>'+items;
}
function showLast(id){const r=lastResult(id);if(r){reviewFilter="wrong";renderResult(id,r);navigateTop()}}
function handleClick(e){const btn=e.target.closest("button[data-action]");if(!btn||btn.disabled)return;const action=btn.dataset.action;
if(action==="home"){if(window.speechSynthesis)window.speechSynthesis.cancel();renderHome();navigateTop();} else if(action==="readQuestion")readCurrentQuestion();
else if(action==="start")start(btn.dataset.id,false);
else if(action==="startfresh"){if(getSession(btn.dataset.id)&&!confirm("This will replace the saved progress for this model. Continue?"))return;start(btn.dataset.id,true);}
else if(action==="history")showLast(btn.dataset.id);
else if(action==="pick")pick(Number(btn.dataset.value));
else if(action==="prev")advance(-1);
else if(action==="next")advance(1);
else if(action==="jump")jump(Number(btn.dataset.pos));
else if(action==="finish")finish();
else if(action==="reviewFilter"){const filter=btn.dataset.filter;if(["solved","correct","wrong","unanswered"].indexOf(filter)>=0){reviewFilter=filter;renderResult(active,lastResult(active));}}
}
if(!app)return;
load();app.addEventListener("click",handleClick);
if(window.speechSynthesis)window.speechSynthesis.onvoiceschanged=function(){if(mode==="exam"&&active==="d")renderExamAtCurrentPosition();};
app.addEventListener("change",function(e){
if(e.target.matches("[data-reader-voice]"))readerVoiceURI=e.target.value;
else if(e.target.matches("[data-reader-rate]"))readerRate=Number(e.target.value)||0.85;
});
document.addEventListener("keydown",function(e){if(mode!=="exam"||e.altKey||e.ctrlKey||e.metaKey||e.target.closest("input,textarea"))return;const n=Number(e.key);if(n>=1&&n<=4){const s=getSession(active);if(!s)return;const qi=s.qOrder[s.pos];pick(s.optionOrders[qi][n-1]);}});
setInterval(function(){if(mode==="exam"){const s=getSession(active),clock=document.getElementById("clock");if(s&&clock)clock.textContent="⏱ "+fmtTime(secs(s));}},1000);
if(forms.length!==4||forms.some(function(f){return f.questions.length!==45;})){app.innerHTML='<section class="panel"><h2>Could not load the four question models</h2><p>Refresh the page. If the issue continues, open it from GitHub Pages.</p></section>';}
else renderHome();
})();