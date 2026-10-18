(function(){
"use strict";
const forms=(window.MIDTERM_FORMS||[]).slice().sort(function(a,b){return a.id.localeCompare(b.id);});
const sections={v:{name:"Vocabulary",ar:"المفردات",icon:"🎂"},f:{name:"Frequency",ar:"ظروف التكرار",icon:"🔁"},p:{name:"Place",ar:"حروف المكان",icon:"🏫"},r:{name:"Reading",ar:"فهم المقروء",icon:"📖"},w:{name:"Writing",ar:"مرادفات وكتابة",icon:"✍️"}};
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
function renderHome(){
mode="home";active=null;reviewFilter="wrong";
const list=getResults();const completed=list.filter(function(x){return x.b}).sort(function(a,b){return b.b.score-a.b.score});
let cards="";
list.forEach(function(x){
 const f=x.f,d=getSession(f.id),b=x.b,attempts=(data.history[f.id]||[]).length;
 cards+='<article class="model" data-theme="'+f.theme+'"><div class="model-head"><div class="model-avatar">'+avatars[f.id]+'</div><small>MODEL '+f.id.toUpperCase()+' · 45 MCQs</small></div><h3>'+escapeHtml(f.name)+'<br><small>'+escapeHtml(f.arabic)+'</small></h3><p>'+escapeHtml(f.focus)+'</p><div class="meta">'+escapeHtml(f.tagline)+'</div><small>✓ كلمات (12) · تكرار (10) · مكان (8) · قراءة (9) · كتابة (6)</small><small>'+(b?'أفضل نتيجة: '+b.score+' / 45 · عدد المحاولات '+attempts:"لم يُجرّب النموذج بعد")+(d?' · محفوظ '+countDone(d)+'/45':"")+'</small><button class="btn" data-action="start" data-id="'+f.id+'">'+(d?'▶ أكمل الاختبار':b?'🔄 محاولة جديدة':'🚀 ابدأ النموذج')+'</button>'+(x.last?'<button class="btn outline" data-action="history" data-id="'+f.id+'">📋 مراجعة آخر نتيجة</button>':"")+'</article>';
});
let board=completed.length?completed.map(function(x,i){return '<div class="result-mini"><small>المركز '+(i+1)+' · '+escapeHtml(x.f.name)+'</small><b>'+x.b.score+' / 45</b><small>'+Math.round(x.b.score/45*100)+'% · أفضل محاولة</small></div>'}).join(""):'<p class="small">ابدأ نموذجًا أولًا لتظهر نتائج عبود هنا، ثم قارن أداءه في النماذج الثلاثة.</p>';
let legend=Object.keys(sections).map(function(k){const s=sections[k],c={v:12,f:10,p:8,r:9,w:6}[k];return '<div><b>'+s.icon+' '+s.ar+'</b><small>'+c+' أسئلة / نموذج</small></div>'}).join("");
app.innerHTML='<section class="panel"><h2>اختر المعلّم الذي سيتحداك 🏁</h2><p class="small">كل نموذج مختلف في الأسئلة والأسلوب، ويغطي جميع المحاور المحددة في دليل الاختبار وصور كتاب النشاط.</p><div class="models">'+cards+'</div></section><section class="panel"><h2>📊 لوحة المنافسة</h2><div class="board">'+board+'</div><p class="source">المقارنة تعرض <strong>نتائج الطالب في النماذج</strong>، وليست حكمًا آليًا على جودة الوكلاء.</p></section><section class="panel"><h2>📚 خريطة التغطية — 45 سؤالًا في كل نموذج</h2><div class="legend">'+legend+'</div><p class="source"><strong>المراجع:</strong> Mid-Term Study Guide Unit 2A (Vocabulary, Adverbs of Frequency, Synonyms, sentence structure) وActivity Book الصفحات 14–15 و22–27 (place, celebrations, compare/contrast, reading).</p></section><section class="panel"><h2>🌱 ابدأ بسهولة ثم جرّب التحديات</h2><div class="subtle">النموذج الرابع هو نقطة بداية سهلة: أسئلة قصيرة ومباشرة، وكلمات مألوفة، وإجابة واضحة. بعده يقدر عبود ينتقل إلى النماذج الأخرى ويتدرج في مستوى التحدي.</div><h2 style="margin-top:18px">📌 قوانين الاختبار الحقيقي</h2><ol class="rules"><li>لكل سؤال <b>أربع إجابات</b>، اختر واحدة فقط. تُقفل الإجابة مباشرة ولا يمكن تغييرها.</li><li>لا تُعرض الإجابات الصحيحة إلا بعد تسليم الاختبار.</li><li>يمكن تخطي أي سؤال وإنهاء الاختبار في أي وقت؛ الأسئلة المتروكة تُحسب ضمن الإجابات الخاطئة.</li><li>يُحفظ التقدم والنتائج في <b>متصفح الجهاز الحالي</b>. لا حاجة لتسجيل الدخول أو دفع رسوم.</li></ol></section>';
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
let options=order.map(function(n,i){return '<button class="choice'+(selected===n?" selected":"")+'" data-action="pick" data-value="'+n+'" '+(selected!==null?"disabled":"")+' aria-label="الخيار '+(i+1)+'"><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+escapeHtml(q.choices[n])+'</span></button>'}).join("");
let dots=s.qOrder.map(function(qi,pos){const answer=s.answers[qi],status=answer===null?"":answer===f.questions[qi].answer?" correct":" wrong";return '<button class="dot'+(answer!==null?" done":"")+status+(pos===s.pos?" active":"")+'" data-action="jump" data-pos="'+pos+'" aria-label="سؤال '+(pos+1)+(answer===null?" غير محلول":answer===f.questions[qi].answer?" صحيح":" خطأ")+'">'+(pos+1)+'</button>'}).join("");
const okAll=done===f.questions.length;
const rightCount=s.answers.filter(function(answer,i){return answer!==null&&answer===f.questions[i].answer}).length,wrongCount=done-rightCount;
app.innerHTML='<section class="panel"><div class="exam-top"><div class="title-line"><span class="icon-large">'+avatars[f.id]+'</span><div><span class="label">'+escapeHtml(f.name)+'</span><h2>'+escapeHtml(f.arabic)+'</h2></div></div><div><b id="clock">⏱ '+fmtTime(secs(s))+'</b><div class="small">الأسئلة المجابة: '+done+' / '+f.questions.length+'</div></div></div><div class="progress-wrap"><div class="progress-inner" style="width:'+Math.round(done/f.questions.length*100)+'%"></div></div><div class="exam-top"><span class="label">السؤال '+(s.pos+1)+' من '+f.questions.length+'</span><span class="label">'+sections[q.section].icon+' '+sections[q.section].ar+'</span></div><section class="question"><h2 class="en" lang="en">'+escapeHtml(q.prompt)+'</h2><div class="choices en" lang="en">'+options+'</div><div class="answer-status" role="status">'+(selected===null?"اختر الإجابة مرة واحدة فقط، ولن يظهر التصحيح حتى نهاية الاختبار.":"🔒 تم تسجيل إجابتك. لا يمكن تغييرها. يمكنك الانتقال للسؤال التالي.")+'</div></section><div class="exam-controls"><button class="btn outline" data-action="prev" '+(s.pos===0?'disabled':'')+'>→ السابق</button><button class="btn outline" data-action="home">🏠 النماذج</button><button class="btn" data-action="next">'+(s.pos===f.questions.length-1&&!okAll?"اذهب إلى سؤال ناقص ←":"التالي ←")+'</button></div><div class="actions"><button class="btn gold" data-action="finish">🏆 إنهاء الاختبار وعرض النتيجة</button></div><details class="question-map" open><summary>🗺️ خريطة الأسئلة · ✅ '+rightCount+' صحيح · ❌ '+wrongCount+' خطأ · ◻️ '+(f.questions.length-done)+' غير محلول</summary><div class="map-legend"><span><i class="map-swatch correct"></i>صحيح</span><span><i class="map-swatch wrong"></i>خطأ</span><span><i class="map-swatch"></i>غير محلول</span></div><div class="dots">'+dots+'</div></details><p class="source">لون الرقم يوضح صحة الإجابة مباشرة: الأخضر صحيح، والأحمر خطأ. بعد الإنهاء يظهر شرح الإجابات والمصادر.</p></section>';
}
function renderExamAtCurrentPosition(){const y=window.scrollY;renderExam();window.scrollTo({top:y,behavior:"auto"});}
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
const message=pct>=90?"ممتاز! أتقنت أغلب المهارات. راجع فقط أخطاءك.":pct>=75?"مستوى جيد. ركّز على الأسئلة التي فاتتك.":pct>=60?"مراجعة مركّزة للمحور الأضعف ستساعدك.":"ابدأ بمراجعة الكلمات والقاعدة ثم أعد النموذج.";
const rows=Object.keys(sections).map(function(k){return '<div class="sr"><div>'+sections[k].icon+'</div><strong>'+g.scores[k]+' / '+g.totals[k]+'</strong><small>'+sections[k].ar+'</small></div>'}).join("");
const filters=[{id:"solved",label:"محلول"},{id:"correct",label:"صحيح"},{id:"wrong",label:"خطأ"},{id:"unanswered",label:"غير محلول"}];
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
 const state=chosen===null?"⏳ غير محلول":correct?"✅ صحيح":"❌ خطأ";
 const answerLine=chosen===null?"⏳ لم يُجب عن السؤال":(correct?"✓ Your answer: ":"✗ Your answer: ")+escapeHtml(q.choices[chosen]);
 return '<article class="review-item"><div class="exam-top"><span class="label">'+sections[q.section].icon+' '+sections[q.section].ar+' · سؤال '+(i+1)+'</span><span class="label">'+state+'</span></div><h4 class="en">'+escapeHtml(q.prompt)+'</h4><p class="en '+(correct?"yes":"no")+'">'+answerLine+'</p>'+(!correct?'<p class="en yes">✓ Correct answer: '+escapeHtml(q.choices[q.answer])+'</p>':"")+'<p class="en" lang="en">'+escapeHtml(q.explanation)+'</p><code>'+escapeHtml(sourceLabel(q.source))+'</code></article>';
}).join("");
const empty=items?"":'<p class="subtle">لا توجد أسئلة في فئة «'+filters.find(function(x){return x.id===reviewFilter}).label+'».</p>';
app.innerHTML='<section class="panel"><div class="exam-top"><span class="label">🏁 '+escapeHtml(f.name)+'</span><span class="label">⏱ '+fmtTime(result.duration)+'</span></div><div class="score-big"><div class="small">النتيجة النهائية لعبود</div><div class="number">'+g.score+' / '+f.questions.length+'</div><div class="score-desc">'+pct+'% · '+message+'</div></div><h2>📈 مستوى الإتقان حسب المحور</h2><div class="sections-result">'+rows+'</div><p class="subtle">🎯 الأولوية للمراجعة: <b>'+sections[weak].ar+'</b> ('+g.scores[weak]+' من '+g.totals[weak]+'). أجاب عبود عن '+solved+' سؤالًا، وترك '+unanswered+' دون حل. لا يمكن تغيير الإجابات بعد التسليم.</p><div class="actions"><button class="btn gold" data-action="startfresh" data-id="'+id+'">🔄 تحدٍ جديد بالنموذج نفسه</button><button class="btn outline" data-action="home">🏠 العودة للمنافسة</button></div></section><section class="panel"><h2>🔍 مراجعة الاختبار</h2><p class="small">اختر فئة لمراجعة أسئلتها. «محلول» يشمل الإجابات الصحيحة والخاطئة.</p><div class="actions">'+filterButtons+'</div>'+empty+'</section>'+items;
}
function showLast(id){const r=lastResult(id);if(r){reviewFilter="wrong";renderResult(id,r);navigateTop()}}
function handleClick(e){const btn=e.target.closest("button[data-action]");if(!btn||btn.disabled)return;const action=btn.dataset.action;
if(action==="home"){renderHome();navigateTop();}
else if(action==="start")start(btn.dataset.id,false);
else if(action==="startfresh"){if(getSession(btn.dataset.id)&&!confirm("سيُستبدل التقدم المحفوظ في هذا النموذج. هل تريد المتابعة؟"))return;start(btn.dataset.id,true);}
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
document.addEventListener("keydown",function(e){if(mode!=="exam"||e.altKey||e.ctrlKey||e.metaKey||e.target.closest("input,textarea"))return;const n=Number(e.key);if(n>=1&&n<=4){const s=getSession(active);if(!s)return;const qi=s.qOrder[s.pos];pick(s.optionOrders[qi][n-1]);}});
setInterval(function(){if(mode==="exam"){const s=getSession(active),clock=document.getElementById("clock");if(s&&clock)clock.textContent="⏱ "+fmtTime(secs(s));}},1000);
if(forms.length!==4||forms.some(function(f){return f.questions.length!==45;})){app.innerHTML='<section class="panel"><h2>تعذر تحميل نماذج الأسئلة الأربعة</h2><p>حدّث الصفحة بعد قليل. إن استمرت المشكلة، افتح الصفحة من رابط GitHub Pages مباشرة.</p></section>';}
else renderHome();
})();