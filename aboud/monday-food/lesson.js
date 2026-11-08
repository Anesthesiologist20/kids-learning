"use strict";
const foodLesson = (() => {
  const passages = [
    {
      id: "apples", title: "Apples Are Great!", short: "Apples", alt: "A red apple with a green leaf",
      lines: [
        "Apples grow on trees.",
        "There are over 7,500 different kinds of apples!",
        "That’s a lot!",
        "Apples float.",
        "They are 25% air.",
        "Amazing!"
      ],
      questions: [
        { text: "How many kinds of apples are there?", evidence: [1], color: "blue", reply: "Over 7,500 different kinds." },
        { text: "Why do apples float?", evidence: [4], color: "green", reply: "They are 25% air." },
        { text: "Where do apples grow?", evidence: [0], color: "red", reply: "They grow on trees." }
      ]
    },
    {
      id: "onions", title: "Crying Over Onions", short: "Onions", alt: "A cut onion showing its layers",
      lines: [
        "Onions are good for you.",
        "They have vitamins and nutrients.",
        "Many people don’t like onions.",
        "They are smelly and make you cry!",
        "When you cut an onion, the oil inside it comes out and turns into a gas.",
        "The gas irritates your eyes!",
        "Your eyes water up to wash away the gas."
      ],
      questions: [
        { text: "Why are onions good for you?", evidence: [1], color: "red", reply: "They have vitamins and nutrients." },
        { text: "Why don’t many people like onions?", evidence: [3], color: "blue", reply: "They are smelly and make you cry!" },
        { text: "What happens when the gas gets in your eyes?", evidence: [5, 6], color: "green", reply: "It irritates your eyes. Your eyes water up to wash it away." }
      ]
    }
  ];
  const words = [
    { word: "banana", example: "I peel a banana for breakfast.", alt: "A yellow banana on a plate" },
    { word: "tomato", example: "The tomato in my salad is red.", alt: "A red tomato with a green stem" },
    { word: "rice", example: "I eat rice with chicken.", alt: "A brown bowl of rice" },
    { word: "pasta", example: "I put cheese on my pasta.", alt: "Pasta on a plate" },
    { word: "milk", example: "I pour milk into a glass.", alt: "A glass of milk" },
    { word: "yogurt", example: "I eat yogurt with a spoon.", alt: "A cup of yogurt with a spoon" },
    { word: "sugar", example: "These small white cubes are sugar.", alt: "Several white sugar cubes" }
  ];
  const code = {a:"red", e:"blue", i:"orange", o:"green", u:"gray"};
  const decode = ["banana", "rice", "yogurt", "sugar", "pasta", "tomato", "milk"];
  const sentences = [
    { before: "There is a ", word: "banana", after: " on that plate.", hint: "Look for the yellow fruit on a plate." },
    { before: "There’s only one ", word: "tomato", after: ". It’s red.", hint: "Which food in your word bank is red?" },
    { before: "Ice cream and ", word: "yogurt", after: " have milk.", hint: "Look for the food in a little pot. You eat it with a spoon." },
    { before: "There are lots of ", word: "sugar", after: " cubes on the table.", hint: "Which food comes in little white cubes?" },
    { before: "There’s some ", word: "milk", after: " in the glass.", hint: "Which food can you drink from a glass?" },
    { before: "The ", word: "rice", after: " is in that brown bowl.", hint: "Look in the brown bowl. It is full of little grains." },
    { before: "There is some cheese on the ", word: "pasta", after: ".", hint: "Look for the plate of long noodles." }
  ];
  const pictures = [
    { letter: "a", number: 5 }, { letter: "b", number: 1 }, { letter: "c", number: 4 },
    { letter: "d", number: 3 }, { letter: "e", number: 6 }, { letter: "f", number: 2 }, { letter: "g", number: 7 }
  ];
  const prediction = "Look at the pictures on pages 53–54. What do you think the text is about?";
  const talk = [
    "Good morning, everyone!",
    "Why is food important?",
    "Food helps me grow.",
    "It gives me energy to run and play football.",
    "For breakfast, I can have a banana and some yogurt.",
    "For lunch, I can have rice, chicken, and tomatoes.",
    "A glass of milk helps keep my bones strong.",
    "After lunch, I am ready to read and write in class.",
    "That is why food is important to me.",
    "Thank you for listening!"
  ];
  const slides = [
    { title: "Why is food important?", cue: "My question", first: 0, last: 2, image: "images/lunchbox.webp", alt: "A lunchbox filled with food" },
    { title: "Energy to play", cue: "My first reason", first: 3, last: 3, image: "../../experimental/08_football.webp", alt: "A child playing football" },
    { title: "My meals", cue: "My examples", first: 4, last: 6, foods: ["banana", "yogurt", "rice", "milk"] },
    { title: "Ready to learn", cue: "My ending", first: 7, last: 9, image: "../../experimental/04_enjoy_class.webp", alt: "A child learning in class" }
  ];
  const audio = {
    "decode-help": "Look at each colored dot. Find its vowel in the key. Then spell the word.",
    "match-help": "Look at this picture. Which sentence describes it? Choose its number.",
    "prediction": "Look at the pictures on pages fifty-three and fifty-four. What do you think the text is about?"
  };
  for (const p of passages) {
    p.lines.forEach((line,i) => { audio[`${p.id}-${i+1}`] = line.replace("7,500", "seven thousand five hundred").replace("25%", "twenty-five percent"); });
    p.questions.forEach((item,i) => { audio[`ask-${p.id}-${i+1}`] = item.text; });
  }
  for (const item of words) {
    audio["word-"+item.word] = item.word;
    audio["example-"+item.word] = item.example;
  }
  sentences.forEach((item,i) => {
    audio[`clue-${i+1}`] = item.before+"blank"+item.after;
    audio[`sentence-${i+1}`] = item.before+item.word+item.after;
  });
  talk.forEach((line,i) => { audio[`talk-${i+1}`] = line; });
  return { passages, words, code, decode, sentences, pictures, prediction, talk, slides, audio };
})();
