/* The two examples for "in" and "on" each have their own picture. */
const placeWords = [
  {id: "in", word: "in", meaning: "Inside a room, a container, or another enclosed space.", arabic: "في الداخل · داخل", examples: [
    {scene: "pencil-box", line: "The pencil is in the box.", description: "The lower half of a yellow pencil disappears inside an open cardboard box."},
    {scene: "boy-classroom", line: "He is in the classroom.", description: "A boy stands within the four sides of a classroom, with a board on the wall."}
  ]},
  {id: "on", word: "on", meaning: "Touching and supported by a surface.", arabic: "على سطح الشيء", examples: [
    {scene: "book-desk", line: "The book is on the desk.", description: "A green book rests flat against the top of a desk."},
    {scene: "clock-wall", line: "The clock is on the wall.", description: "A round clock hangs flat against a brick wall."}
  ]},
  {id: "under", word: "under", meaning: "Lower than something, or beneath it.", arabic: "تحت", examples: [
    {scene: "cat-table", line: "The cat is sleeping under the table.", description: "A sleeping orange cat lies between the table legs, below the tabletop."}
  ]},
  {id: "next-to", word: "next to", meaning: "Beside someone or something.", arabic: "بجانب", examples: [
    {scene: "ball-shoes", line: "The ball is next to the shoes.", description: "A football and a pair of shoes sit side by side."}
  ]},
  {id: "between", word: "between", meaning: "In the middle of two things or people.", arabic: "بين شيئين أو شخصين", examples: [
    {scene: "apple-oranges", line: "The apple is between the two oranges.", description: "An orange, a red apple, and another orange are arranged in one row."}
  ]},
  {id: "behind", word: "behind", meaning: "At the back of someone or something.", arabic: "خلف · وراء", examples: [
    {scene: "thief-door", line: "The thief is hiding behind the door.", description: "A door hides most of a masked character. Only part of his face and body peeks out from the far side."}
  ]},
  {id: "in-front-of", word: "in front of", meaning: "Farther forward than someone or something.", arabic: "أمام", examples: [
    {scene: "teacher-class", line: "The teacher stands in front of the class.", description: "From the back of the classroom, rows of seated students face a teacher standing at the front."}
  ]}
];

const placeRounds = {
  school: {
    title: "School practice", type: "practice",
    questions: [
      {id:"school-ball", stem:"The ball is ___ the desk.", scene:"ball-desk", description:"A football rests against the flat top of the desk.", options:["in","on","under"], answer:"on"},
      {id:"school-pencil", stem:"The pencil is ___ the pencil case.", scene:"pencil-case", description:"The pencil pokes out through the open zipper of its case. Most of the pencil is hidden.", options:["on","in","behind"], answer:"in"},
      {id:"school-cat", stem:"The cat is sleeping ___ the chair.", scene:"cat-chair", description:"A curled-up cat sleeps below the seat, inside the space framed by the chair legs.", options:["next to","under","in front of"], answer:"under"},
      {id:"school-eraser", stem:"The eraser is ___ the ruler and the pencil.", scene:"eraser-tools", description:"From left to right there is a ruler, a pink eraser, and a pencil.", options:["between","behind","on"], answer:"between"},
      {id:"school-girl", stem:"The girl is sitting ___ her friend.", scene:"girl-friend", description:"Two friends sit side by side, facing the same way.", options:["in front of","next to","in"], answer:"next to"}
    ]
  },
  pictures: {
    title: "Picture round", type: "competition",
    questions: [
      {id:"pic-cat", stem:"The cat is ___ the box.", scene:"cat-box", description:"The open box surrounds the cat. Its head and paws peek out over the rim.", options:["under","between","in"], answer:"in"},
      {id:"pic-pencil", stem:"The pencil is ___ the notebook.", scene:"pencil-book", description:"The pencil rests across the upper cover of the notebook.", options:["on","behind","under"], answer:"on"},
      {id:"pic-dog", stem:"The dog is ___ the bench.", scene:"dog-bench", description:"A small dog lies beneath the seat of a wooden bench.", options:["in","under","on"], answer:"under"},
      {id:"pic-apple", stem:"The apple is ___ the two books.", scene:"apple-books", description:"A book lies on either side of the red apple.", options:["in","behind","between"], answer:"between"},
      {id:"pic-bag", stem:"The backpack is ___ the chair.", scene:"bag-chair", description:"The backpack sits on the floor just to the left of the chair.", options:["next to","on","under"], answer:"next to"},
      {id:"pic-door", stem:"The cat is ___ the door.", scene:"cat-door", description:"The door hides most of the cat on its far side. Part of its face peeks out at the edge.", options:["in front of","behind","on"], answer:"behind"},
      {id:"pic-girl", stem:"The girl is ___ the door.", scene:"girl-door", description:"You can see the whole girl. Her body covers the lower middle of the door.", options:["in front of","in","behind"], answer:"in front of"},
      {id:"pic-ball", stem:"The ball is ___ the box.", scene:"ball-box", description:"The ball rests on the floor immediately to the right of a closed box.", options:["between","next to","in"], answer:"next to"},
      {id:"pic-ruler", stem:"The ruler is ___ the desk.", scene:"ruler-desk", description:"A yellow ruler lies flat across the top surface of the desk.", options:["under","in","on"], answer:"on"},
      {id:"pic-boy", stem:"The boy is ___ the two cones.", scene:"boy-cones", description:"The boy has one orange cone to his left and one to his right.", options:["between","in front of","on"], answer:"between"}
    ]
  },
  clues: {
    title: "Clue round", type: "competition",
    questions: [
      {id:"clue-lunch", clue:"Nora unzips her schoolbag and takes out her lunch.", stem:"Her lunch was ___ her schoolbag.", options:["on","in","behind"], answer:"in"},
      {id:"clue-glass", clue:"The base of a glass rests against the top of a shelf.", stem:"The glass is ___ the shelf.", options:["on","next to","under"], answer:"on"},
      {id:"clue-slipper", clue:"Lina kneels and reaches below her bed to find her slipper.", stem:"The slipper is ___ the bed.", options:["behind","in","under"], answer:"under"},
      {id:"clue-friend", clue:"Omar and his friend stand side by side and hold hands.", stem:"Omar is ___ his friend.", options:["next to","behind","in front of"], answer:"next to"},
      {id:"clue-cups", clue:"A blue cup is on the left and a yellow cup is on the right. The red cup is in the middle.", stem:"The red cup is ___ the other two cups.", options:["behind","on","between"], answer:"between"},
      {id:"clue-rabbit", clue:"We face a tree. Its trunk hides a rabbit except for the tips of its ears.", stem:"The rabbit is ___ the tree.", options:["on","behind","in front of"], answer:"behind"},
      {id:"clue-teacher", clue:"I face the whiteboard. My teacher stands closer to me and covers part of it.", stem:"My teacher is ___ the whiteboard.", options:["in front of","in","behind"], answer:"in front of"},
      {id:"clue-photo", clue:"A photo hangs flat against the wall.", stem:"The photo is ___ the wall.", options:["under","between","on"], answer:"on"},
      {id:"clue-car", clue:"Dad opens the garage door and drives the car out.", stem:"Before Dad opens the door, the car is ___ the garage.", options:["behind","in","on"], answer:"in"},
      {id:"clue-line", clue:"We are lining up for lunch. I face the counter. Ali is one place ahead of me.", stem:"Ali is ___ me.", options:["under","behind","in front of"], answer:"in front of"}
    ]
  }
};
