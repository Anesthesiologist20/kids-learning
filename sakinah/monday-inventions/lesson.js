"use strict";
// Each example and practice question is original. The headwords follow Cambridge Primary Path 4, Unit 3B.
const words = [
  {word:"owner", meaning:"The person something belongs to.", example:"I found a blue bag and gave it back to its owner.", question:"This camera belongs to Lina. Lina is its ___.", options:["owner","memory","eyebrow"]},
  {word:"female", meaning:"A word for a girl, a woman, or an animal such as a lioness.", example:"A lioness is a female lion.", question:"A lioness is a ___ lion.", options:["puzzled","natural","female"]},
  {word:"human being", meaning:"A person, like you or me.", example:"A robot can wave, but a child is a human being.", question:"Which one is a human being?", options:["a camera","a child","a robot"], answer:"a child"},
  {word:"memory", meaning:"Something you remember from the past.", example:"Our family picnic is a happy memory for me.", question:"I still remember my first day at school. That is a ___.", options:["memory","facial expression","human being"]},
  {word:"natural", meaning:"Coming from nature or happening on its own.", example:"Sunlight is a natural kind of light.", question:"Which is a natural source of light?", options:["a phone screen","a desk lamp","the sun"], answer:"the sun"},
  {word:"eyebrow", meaning:"The line of hair above one eye.", example:"I raised one eyebrow when I heard the surprise.", question:"What grows just above each eye?", options:["an eyebrow","a memory","a smile"], answer:"an eyebrow"},
  {word:"facial expression", meaning:"The look on your face that shows how you feel.", example:"A big smile is a happy facial expression.", question:"A smile or a frown is a ___.", options:["human being","facial expression","memory"]},
  {word:"react", meaning:"To do or say something because something happened.", example:"How do you react when you hear a loud noise?", question:"When you jump at a loud noise, you ___ to the sound.", options:["own","remember","react"]},
  {word:"puzzled", meaning:"Unsure because you do not understand something.", example:"I felt puzzled when the map showed two paths home.", question:"I do not understand this clue yet. I feel ___.", options:["natural","puzzled","female"]},
  {word:"body language", meaning:"The way you use movements and gestures to show what you mean.", example:"Waving goodbye is a kind of body language.", question:"Sam waves goodbye without saying a word. What is he using?", options:["body language","an eyebrow","a memory"]}
];
const lines = [
  "Good morning, everyone!",
  "In my opinion, the camera is the best invention.",
  "It helps us remember days that make us smile.",
  "Imagine a picnic with your family.",
  "You take one photo, and later you can see everyone’s happy face again.",
  "A camera helps me learn new things, too.",
  "I can take a close-up of a leaf and see all its tiny lines.",
  "Then I can show my class what I found.",
  "For me, the best thing about a camera is that we can share what we see.",
  "Thank you for listening!"
];
const slides = [
  {title:"The camera", cue:"My opinion", image:"camera", alt:"A coral instant camera and two printed photographs", first:0, last:1},
  {title:"A happy memory", cue:"My first reason", image:"picnic", alt:"A picnic blanket and basket under a palm tree", first:2, last:4},
  {title:"A closer look", cue:"My second reason", image:"leaf", alt:"A close-up of the tiny branching lines on a green leaf", first:5, last:7},
  {title:"Share what you see", cue:"My ending", image:"camera", alt:"A camera with its photographs", first:8, last:9}
];
