(()=>{"use strict";
const slides=[
 {kind:"School topic",picture:"🦒 🐻 🦁 🦓",sentence:"Living and non living things",audio:"slide-01",hint:"What is the title of our science lesson?",color:"cream"},
 {kind:"Property 1 • MOVE",picture:"👧🏻 🐇 🐦",sentence:"Living things can move",audio:"slide-02",hint:"Look! A child runs, a rabbit hops, and a bird flies. What can living things do?",color:"blue"},
 {kind:"Property 2 • GROW",picture:"🐶 ➜ 🐕  🌱 ➜ 🌷",sentence:"Living things can grow",audio:"slide-03",hint:"The puppy gets bigger and a plant becomes a flower. What can living things do?",color:"green"},
 {kind:"Property 3 • EAT & DRINK",picture:"👧🏻 🥤 🐱 🥣 👦🏻 🍎",sentence:"Living things can eat and drink",audio:"slide-04",hint:"Look at the food and the water. What can living things do?",color:"pink"},
 {kind:"Property 4 • BREATHE",picture:"👦🏻 🌬️ 🌱 🐶",sentence:"Living things can breathe",audio:"slide-05",hint:"Look at the air, the boy, the plant and the dog. What can living things do?",color:"blue"},
 {kind:"Property 5 • REPRODUCE",picture:"🐈 🐈‍⬛  🦆 🥚 🐣",sentence:"Living things can give birth or lay eggs",audio:"slide-06",hint:"The cat has kittens. The duck lays eggs. What can living things do?",color:"pink"},
 {kind:"Property 6 • FEEL",picture:"😢 😮 😄 🐰",sentence:"Living things can feel",audio:"slide-07",hint:"Look at the happy, sad and surprised children. What can living things do?",color:"peach"},
 {kind:"Need 1 • FOOD",picture:"🐑 🌿 🐦 🌾 👧🏻 🥪",sentence:"Living things need food",audio:"slide-08",hint:"She eats a sandwich. Animals eat food. What do living things need?",color:"green"},
 {kind:"Need 2 • AIR",picture:"👧🏻 💨 🫁 🍃",sentence:"Living things need air",audio:"slide-09",hint:"Look at the girl breathing air. What do living things need?",color:"blue"},
 {kind:"Need 3 • HOME",picture:"🐦 🪺 🐰 🕳️ 🐕 🏠",sentence:"Living things need home",audio:"slide-10",hint:"The bird has a nest and the dog has a home. What do living things need?",color:"peach"}
];
const el=id=>document.getElementById(id);
if(!el("schooldeck-count"))return;
let index=0,revealed=false;
let mastered=new Set();
try{const a=JSON.parse(localStorage.getItem("raghd-school-slides-v1")||"[]");if(Array.isArray(a))mastered=new Set(a.filter(n=>Number.isInteger(n)&&n>=0&&n<slides.length));}catch(e){}
function draw(){
 const s=slides[index];el("schooldeck-count").textContent="Slide "+(index+1)+" / "+slides.length;
 el("schooldeck-stars").textContent="⭐ "+mastered.size+" / "+slides.length;
 el("schooldeck-progress").style.width=(100*(index+1)/slides.length)+"%";
 el("schoolslide-category").textContent=s.kind.toUpperCase();
 el("schoolslide-emojis").textContent=s.picture;
 el("schoolslide-instruction").textContent=s.hint;
 el("schoolslide-answer").textContent=s.sentence;
 el("schoolslide-answer").classList.toggle("schoolslide-hidden",!revealed);
 el("slide-reveal").textContent=revealed?"🔊 Say it again":"👀 Reveal the full sentence";
 el("slide-master").textContent=mastered.has(index)?"✅ I know this!":"⭐ I said it myself!";
 el("slide-next").textContent=index===slides.length-1?"Back to start ↺":"Next →";
 el("slide-prev").disabled=index===0;
 const card=document.querySelector(".schoolslide");
 for(const shade of ["cream","blue","green","peach","pink"])card.classList.toggle("tone-"+shade,s.color===shade);
}
function say(){window.raghdAudio(slides[index].audio);}
el("slide-listen").onclick=()=>{revealed=true;draw();say();};
el("slide-reveal").onclick=()=>{revealed=true;draw();say();};
el("slide-next").onclick=()=>{index=(index+1)%slides.length;revealed=false;draw();};
el("slide-prev").onclick=()=>{index=Math.max(0,index-1);revealed=false;draw();};
el("slide-restart").onclick=()=>{index=0;revealed=false;draw();};
el("slide-master").onclick=()=>{
 mastered.add(index);
 try{localStorage.setItem("raghd-school-slides-v1",JSON.stringify([...mastered]))}catch(e){}
 draw();window.raghdAudio(mastered.size===slides.length?"finish":"great");
};
draw();
})();
