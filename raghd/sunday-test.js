(()=>{"use strict";
const $=id=>document.getElementById(id);
const q=[
["Letters","N n","Which is capital N?",["M","N","n","P"],1,"question-letters"],
["Letters","🪺","Which word starts with N?",["Pig","Nest","Sun","Apple"],1,"letter-sound"],
["Letters","N n","Which is small n?",["h","u","n","m"],2,"letter-name"],
["Science","🐕","Is a dog living or non-living?",["Living","Non-living"],0,"question-living"],
["Science","🪨","Is a rock living or non-living?",["Living","Non-living"],1,"question-living"],
["Science","🌳","Is a tree living or non-living?",["Non-living","Living"],1,"question-living"],
["Science","📖","Is a book living or non-living?",["Living","Non-living"],1,"question-living"],
["Science","🦋","Is a butterfly living or non-living?",["Non-living","Living"],1,"question-living"],
["Science","🚗","Is a car living or non-living?",["Living","Non-living"],1,"question-living"],
["Science","🌱","What can living things do?",["Grow","Become rocks"],0,"can-grow"],
["Science","🍎💧🏡","Which three things do living things need in our lesson?",["Food, water and home","Cars, toys and books"],0,"need-food"],
["Math","⭐","How many stars?",["1","4","2","6"],0,"question-count"],
["Math","🍓🍓","How many strawberries?",["3","2","5","1"],1,"question-count"],
["Math","🌼🌼🌼","How many flowers?",["6","1","3","5"],2,"question-count"],
["Math","🐠🐠🐠🐠","How many fish?",["2","4","5","6"],1,"question-count"],
["Math","🦄🦄🦄🦄🦄","How many unicorns?",["3","6","4","5"],3,"question-count"],
["Math","🍉🍉🍉🍉🍉🍉","How many watermelons?",["6","5","1","2"],0,"question-count"]
];
let at=0,chosen=Array(q.length).fill(null),flag=Array(q.length).fill(false);
try{const s=JSON.parse(localStorage.getItem("raghd-sunday-test")||"null");if(s&&Array.isArray(s.chosen)&&s.chosen.length===q.length){chosen=s.chosen;flag=Array.isArray(s.flag)&&s.flag.length===q.length?s.flag:flag;}}catch(e){}
function save(){try{localStorage.setItem("raghd-sunday-test",JSON.stringify({chosen,flag}))}catch(e){}}
function render(){
 const row=q[at];$("q-part").textContent=row[0];$("q-count").textContent="Question "+(at+1)+" / "+q.length;
 $("q-image").textContent=row[1];$("q-text").textContent=row[2];
 $("quiz-options").innerHTML=row[3].map((s,i)=>'<button data-answer="'+i+'" class="'+(chosen[at]===i?"selected":"")+'">'+s+'</button>').join("");
 $("quiz-tabs").innerHTML=q.map((x,i)=>'<button data-jump="'+i+'" class="'+(i===at?"current ":"")+(chosen[i]!==null?"answered ":"")+(flag[i]?"flagged":"")+'">'+(i+1)+'</button>').join("");
 $("q-back").disabled=at===0;$("q-flag").textContent=flag[at]?"🚩 Marked":"⚑ Mark";$("q-next").textContent=at===q.length-1?"First ↺":"Next →";
 document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{chosen[at]=Number(b.dataset.answer);save();render();});
 document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{at=Number(b.dataset.jump);render();});
}
$("q-back").onclick=()=>{at=Math.max(0,at-1);render();};
$("q-next").onclick=()=>{at=(at+1)%q.length;render();};
$("q-flag").onclick=()=>{flag[at]=!flag[at];save();render();};
$("q-hear").onclick=()=>window.raghdAudio(q[at][5]);
$("q-submit").onclick=()=>{
 const correct=q.filter((x,i)=>chosen[i]===x[4]).length;
 const missing=chosen.filter(x=>x===null).length,wrong=q.length-correct-missing;
 $("quiz-body").style.display="none";$("result").classList.add("show");
 $("result-title").textContent=correct>=15?"You are a STAR, Raghd! 🌟":"Keep practicing, Raghd! 💜";
 $("test-stats").innerHTML='<div class="stat"><strong>'+correct+'/'+q.length+'</strong>Correct</div><div class="stat"><strong>'+wrong+'</strong>Wrong</div><div class="stat"><strong>'+missing+'</strong>Missing</div>';
 $("review-list").innerHTML=q.map((x,i)=>{const s=chosen[i]===null?"none":chosen[i]===x[4]?"correct":"wrong";const actual=chosen[i]===null?"Not answered":x[3][chosen[i]];return '<div class="review '+s+'"><b>Question '+(i+1)+': '+x[2]+'</b><div>Your answer: '+actual+'</div><div>Correct answer: '+x[3][x[4]]+' '+(s==="correct"?"✅":"❌")+'</div></div>';}).join("");
 window.raghdAudio(correct>=13?"finish":"great");
};
function returnToTest(){$("quiz-body").style.display="block";$("result").classList.remove("show");render();}
$("q-edit").onclick=returnToTest;
$("q-restart").onclick=()=>{chosen=Array(q.length).fill(null);flag=Array(q.length).fill(false);at=0;save();returnToTest();};
render();
})();