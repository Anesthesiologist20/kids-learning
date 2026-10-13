(()=>{"use strict";
const $=id=>document.getElementById(id);
// Audio quiz-01 through quiz-26 matches the ENTIRE displayed question word for word.
const q=[
 ["Letters","N","Which one is capital N?",["n","N","M","H"],1],
 ["Letters","n","Which one is small n?",["h","m","n","u"],2],
 ["Letters","🪺","What word starts with the letter N? Look at the nest.",["Nest","Pig","Sun","Apple"],0],
 ["Letters","👃","What word starts with the letter N? Look at the nose.",["Dog","Nose","Fish","Ball"],1],
 ["Letters","🥜","Which letter does the word nut begin with?",["N","P","I","B"],0],
 ["Science","🐶","Look at the dog. Is a dog living or non-living?",["Living","Non-living"],0],
 ["Science","🚗","Look at the car. Is a car living or non-living?",["Living","Non-living"],1],
 ["Science","🌳","Look at the tree. Is a tree living or non-living?",["Non-living","Living"],1],
 ["Science","🪑","Look at the chair. Is a chair living or non-living?",["Non-living","Living"],0],
 ["Science","🦋","Look at the butterfly. Is a butterfly living or non-living?",["Living","Non-living"],0],
 ["Science","🪨","Look at the rock. Is a rock living or non-living?",["Living","Non-living"],1],
 ["Science","🚶","Living things can do something. Can they move?",["Yes, they can move.","No, they are cars."],0],
 ["Science","🌱","Living things can do something. Can they grow?",["No, they cannot.","Yes, they can grow."],1],
 ["Science","🥗","Living things need to eat and drink. What can they do?",["Eat and drink","Become a chair"],0],
 ["Science","🌬️","Living things can breathe. Which sentence is correct?",["Living things cannot breathe.","Living things can breathe."],1],
 ["Science","❤️","Living things can feel. Which sentence is correct?",["Living things can feel.","Living things are toys."],0],
 ["Science","🐣🥚","Some animals give birth or lay eggs. Which sentence is correct?",["Animals are chairs.","Animals can give birth or lay eggs."],1],
 ["Science","🍎","Which thing do living things need? Look at the food.",["Food","Video games"],0],
 ["Science","💧","Which thing do living things need? Look at the water.",["Water","Toy cars"],0],
 ["Science","🏠","Which thing do living things need? Look at the home.",["A home","A phone"],0],
 ["Math","⭐","How many stars can you count?",["1","3","6","2"],0],
 ["Math","🍎 🍎","How many apples can you count?",["3","2","4","1"],1],
 ["Math","🌼 🌼 🌼","How many flowers can you count?",["6","3","2","1"],1],
 ["Math","🐠 🐠 🐠 🐠","How many fish can you count?",["2","5","4","6"],2],
 ["Math","🦋 🦋 🦋 🦋 🦋","How many butterflies can you count?",["6","2","5","4"],2],
 ["Math","🍓 🍓 🍓 🍓 🍓 🍓","How many strawberries can you count?",["6","5","3","1"],0],
 ["Science","🌬️🍃","Look at the air. What do living things need?",["Air","Toys","Books","Cars"],0]
];
const key="raghd-sunday-quiz-v2";
let at=0,chosen=Array(q.length).fill(null),flag=Array(q.length).fill(false);
try{const saved=JSON.parse(localStorage.getItem(key)||"null");if(saved&&Array.isArray(saved.chosen)&&saved.chosen.length===q.length){chosen=saved.chosen.map((v,i)=>Number.isInteger(v)&&v>=0&&v<q[i][3].length?v:null);flag=Array.isArray(saved.flag)&&saved.flag.length===q.length?saved.flag.map(Boolean):flag;}}catch(e){}
function save(){try{localStorage.setItem(key,JSON.stringify({chosen,flag}))}catch(e){}}
function audioFor(i){return "quiz-"+String(i+1).padStart(2,"0");}
function render(){
 const row=q[at],answered=chosen.filter(v=>v!==null).length;
 $("q-part").textContent=row[0];
 $("q-count").textContent="Question "+(at+1)+" / "+q.length+" • "+answered+" answered";
 $("q-image").textContent=row[1];$("q-text").textContent=row[2];
 $("quiz-options").innerHTML=row[3].map((word,i)=>'<button type="button" data-answer="'+i+'" class="'+(chosen[at]===i?"selected":"")+'">'+word+'</button>').join("");
 $("quiz-tabs").innerHTML=q.map((v,i)=>'<button type="button" aria-label="Question '+(i+1)+(flag[i]?" marked for review":"")+'" data-jump="'+i+'" class="'+(i===at?"current ":"")+(chosen[i]!==null?"answered ":"")+(flag[i]?"flagged":"")+'">'+(i+1)+'</button>').join("");
 $("q-back").disabled=at===0;$("q-flag").textContent=flag[at]?"🚩 Marked":"⚑ Mark for review";
 $("q-next").textContent=at===q.length-1?"Review from start ↺":"Next →";
 document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{chosen[at]=Number(b.dataset.answer);save();render();});
 document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{at=Number(b.dataset.jump);render();});
}
$("q-back").onclick=()=>{at=Math.max(0,at-1);render();};
$("q-next").onclick=()=>{at=(at+1)%q.length;render();};
$("q-flag").onclick=()=>{flag[at]=!flag[at];save();render();};
$("q-hear").onclick=()=>window.raghdAudio(audioFor(at));
$("q-submit").onclick=()=>{
 const correct=q.reduce((sum,x,i)=>sum+(chosen[i]===x[4]?1:0),0);
 const missing=chosen.filter(x=>x===null).length,wrong=q.length-correct-missing;
 $("quiz-body").style.display="none";$("result").classList.add("show");
 $("result-title").textContent=correct>=24?"Raghd, you're a STAR! 🌟":"Well done for trying, Raghd! 💜";
 $("test-stats").innerHTML='<div class="stat"><strong>'+correct+'/'+q.length+'</strong>Correct ✅</div><div class="stat"><strong>'+wrong+'</strong>Wrong ❌</div><div class="stat"><strong>'+missing+'</strong>Not answered ◻️</div>';
 const group=q.reduce((tot,v,i)=>{const type=v[0];if(!tot[type])tot[type]={yes:0,total:0};tot[type].total++;if(chosen[i]===v[4])tot[type].yes++;return tot;},{});
 $("review-list").innerHTML='<h3>My subjects</h3><div class="subject-scores">'+Object.entries(group).map(([name,n])=>'<div>🌟 '+name+': <b>'+n.yes+' / '+n.total+'</b></div>').join("")+'</div><h3>Every question & answer</h3>'+
 q.map((x,i)=>{
   const status=chosen[i]===null?"none":chosen[i]===x[4]?"correct":"wrong";
   const actual=chosen[i]===null?"Not answered":x[3][chosen[i]];
   const marker=status==="correct"?"✅":status==="wrong"?"❌":"◻️";
   return '<div class="review '+status+'"><b>'+marker+' Question '+(i+1)+': '+x[2]+'</b>'+
   '<div>Your answer: '+actual+'</div><div>Correct answer: <b>'+x[3][x[4]]+'</b></div>'+
   '<button type="button" class="btn light" data-review-audio="'+i+'">🔊 Hear this question</button></div>';
 }).join("");
 window.raghdAudio(correct>=22?"finish":"great");
 $("result").scrollIntoView({behavior:"smooth",block:"start"});
};
$("review-list").addEventListener("click",e=>{const b=e.target.closest("[data-review-audio]");if(b)window.raghdAudio(audioFor(Number(b.dataset.reviewAudio)));});
function edit(){$("quiz-body").style.display="block";$("result").classList.remove("show");render();}
$("q-edit").onclick=edit;
$("q-restart").onclick=()=>{chosen=Array(q.length).fill(null);flag=Array(q.length).fill(false);at=0;save();edit();window.raghdAudio("quiz-ready");};
render();
})();
