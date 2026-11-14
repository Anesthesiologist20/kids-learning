window.KitchenExams = {
  a: [
    {
      kind: "choice", skill: "meaning",
      clue: "Noor takes the last apple out of her picnic bag. The bag still has enough juice for twenty children.",
      prompt: "Which note tells the whole story?",
      options: [
        "There aren't any apples. There is a lot of juice.",
        "There are some apples. There is a lot of juice.",
        "There aren't any apples. There isn't any juice.",
        "There aren't any apples. There are a lot of juice."
      ],
      answer: "There aren't any apples. There is a lot of juice.",
      explain: "The last apple is gone. Juice for twenty children is a large amount. Juice goes with is."
    },
    {
      kind: "choice", skill: "pictures", scene: "fridge",
      prompt: "Which question and answer match the fridge?",
      options: [
        "Is there any milk? Yes, there is.",
        "Are there any eggs? No, there aren't.",
        "Are there any carrots? Yes, there are.",
        "Is there any milk? Yes, there are."
      ],
      answer: "Is there any milk? Yes, there is.",
      explain: "You can see milk in the bottle. A question that starts with Is there takes the answer Yes, there is."
    },
    {
      kind: "type", skill: "agreement",
      clue: "There ___ a lot of flour in these three bowls.",
      prompt: "Type is or are to finish the cook's note.",
      answer: "is",
      explain: "The note tells us about flour. Flour takes is, even when it fills three bowls."
    },
    {
      kind: "choice", skill: "words",
      clue: "The shop has oranges. You want to tell Dad that the number is large.",
      prompt: "Which sentence says exactly that?",
      options: [
        "There are a lot of oranges.",
        "There are some oranges.",
        "Are there any oranges?",
        "There aren't any oranges."
      ],
      answer: "There are a lot of oranges.",
      explain: "A lot of tells Dad the number is large. Some tells him there are oranges without saying how many."
    },
    {
      kind: "build", skill: "words",
      clue: "A class of twenty is ready to eat. Only two plates are clean.",
      prompt: "Build a note about the clean plates.",
      tiles: ["There", "aren't", "a lot of", "clean plates."],
      answer: "There aren't a lot of clean plates.",
      explain: "Two plates are left, so aren't a lot of fits. Aren't any would mean zero plates."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "Max says, “There aren't a lot of rolls on the tray.”",
      prompt: "Which new clue proves the tray still has some rolls?",
      options: [
        "Max sees two rolls under the cloth.",
        "Max finds an empty roll bag.",
        "The tray held rolls yesterday.",
        "Max plans to bake rolls tomorrow."
      ],
      answer: "Max sees two rolls under the cloth.",
      explain: "Seeing two rolls proves there are some on the tray right now."
    },
    {
      kind: "choice", skill: "pictures", scene: "picnic",
      prompt: "Which picnic note is true and uses the right verbs?",
      options: [
        "There is some corn, and there are some bread rolls.",
        "There are some corn, and there is some bread rolls.",
        "There isn't any watermelon, and there are some bread rolls.",
        "There is some corn, and there aren't any bread rolls."
      ],
      answer: "There is some corn, and there are some bread rolls.",
      explain: "The picnic has corn and bread rolls. Use is for corn and are for rolls."
    },
    {
      kind: "type", skill: "words",
      clue: "I checked both boxes. I couldn't find ___ eggs in either box.",
      prompt: "Type some or any to say you found zero eggs.",
      answer: "any",
      explain: "Couldn't find any eggs means that you found zero eggs."
    },
    {
      kind: "build", skill: "agreement",
      clue: "Your friend says there is soup in the pot. You look under the lid to check.",
      prompt: "Build a question about the soup.",
      tiles: ["Is", "there", "any soup", "in the pot?"],
      answer: "Is there any soup in the pot?",
      explain: "Soup takes is. In a question, put is before there and ask about any soup."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "Sami needs eggs and milk for his pancakes. He already has everything else.",
      prompt: "Which kitchen lets Sami start now?",
      options: [
        "There are some eggs, and there is some milk.",
        "There is a lot of milk, but there aren't any eggs.",
        "There are a lot of eggs, but there isn't any milk.",
        "There are some plates, but there aren't any eggs."
      ],
      answer: "There are some eggs, and there is some milk.",
      explain: "Sami needs both foods. Only one kitchen has eggs and milk together."
    },
    {
      kind: "type", skill: "agreement",
      clue: "Are there any carrots in this soup? Yes, there ___.",
      prompt: "Finish the short answer with one word.",
      answer: "are",
      explain: "The question asks about carrots. Answer Are there any carrots? with Yes, there are."
    },
    {
      kind: "choice", skill: "pictures", scene: "lunchbox",
      clue: "Imagine you eat every carrot stick and leave the rest of this lunch alone.",
      prompt: "Which note will be true then?",
      options: [
        "There aren't any carrot sticks. There are some sandwiches.",
        "There aren't any sandwiches. There are some carrot sticks.",
        "There aren't any blueberries. There are some sandwiches.",
        "There are some carrot sticks. There aren't any blueberries."
      ],
      answer: "There aren't any carrot sticks. There are some sandwiches.",
      explain: "Only the carrot sticks were eaten. The sandwiches and blueberries stay in the box."
    },
    {
      kind: "type", skill: "words",
      clue: "A cook writes, “There are a lot green grapes in the bowl.”",
      prompt: "Type the one missing word after lot.",
      answer: "of",
      explain: "The full phrase is a lot of. The cook should write a lot of green grapes."
    },
    {
      kind: "choice", skill: "agreement",
      clue: "You see yogurt in a bowl and four spoons next to it.",
      prompt: "Which note uses the right verb both times?",
      options: [
        "There is some yogurt. There are some spoons.",
        "There are some yogurt. There are some spoons.",
        "There is some yogurt. There is some spoons.",
        "There are some yogurt. There is some spoons."
      ],
      answer: "There is some yogurt. There are some spoons.",
      explain: "Use is for yogurt. You can count the four spoons, so use are for spoons."
    },
    {
      kind: "build", skill: "meaning",
      clue: "You opened the rice box and saw it was empty.",
      prompt: "Build the sentence you could say.",
      tiles: ["I", "didn't", "find", "any rice."],
      answer: "I didn't find any rice.",
      explain: "The empty box had zero rice. Didn't find any tells us that nothing was found."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "Nina peeks into a box. She sees berries, but the lid hides how many there are.",
      prompt: "Which note can Nina be sure about?",
      options: [
        "There are some berries.",
        "There are a lot of berries.",
        "There are only two berries.",
        "There aren't any berries."
      ],
      answer: "There are some berries.",
      explain: "Nina can see that berries are there. Some fits when she cannot tell the number."
    },
    {
      kind: "type", skill: "words",
      clue: "We used five big bags of cheese for twenty pizzas. We used ___ ___ of cheese.",
      prompt: "Type the two words that fill the gaps.",
      answer: "a lot",
      explain: "A lot of cheese means a large amount. The sentence already gives you the word of."
    },
    {
      kind: "choice", skill: "pictures", scene: "bakery",
      clue: "Look at the counter. The baker's answer is “Yes, there are.”",
      prompt: "Which question fits the photo and the answer?",
      options: [
        "Are there any eggs?",
        "Is there any flour?",
        "Are there any bananas?",
        "Is there any butter?"
      ],
      answer: "Are there any eggs?",
      explain: "The photo shows eggs. Ask Are there any eggs? and answer Yes, there are."
    },
    {
      kind: "build", skill: "agreement",
      clue: "You count a pile of twenty empty milk cartons.",
      prompt: "Build a sentence about the cartons.",
      tiles: ["There", "are", "a lot of", "empty milk cartons."],
      answer: "There are a lot of empty milk cartons.",
      explain: "You are counting cartons. There is more than one carton, so use are."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "The class needs cheese for twenty sandwiches. Only two thin slices are left. Lina says, “We don't have any cheese.” Omar says, “There isn't a lot of cheese.”",
      prompt: "Whose words fit the two slices?",
      options: ["Only Omar's.", "Only Lina's.", "Both Lina's and Omar's.", "Neither child's."],
      answer: "Only Omar's.",
      explain: "Omar's words fit a small amount. Lina's words would fit an empty cheese box."
    }
  ],
  b: [
    {
      kind: "build", skill: "meaning",
      clue: "A shopper takes the last pear. Dad asks, “Are there any pears left on the shelf?”",
      prompt: "Build the shopkeeper's answer.",
      tiles: ["No,", "there", "aren't", "any pears left."],
      answer: "No, there aren't any pears left.",
      explain: "Taking the last pear leaves zero pears on the shelf."
    },
    {
      kind: "choice", skill: "pictures", scene: "picnic",
      clue: "Imagine you carry all the corn away and leave everything else on the picnic blanket.",
      prompt: "Which question still has a yes answer?",
      options: [
        "Are there any bread rolls on the blanket?",
        "Is there any corn left on the blanket?",
        "Are there any whole pineapples on the blanket?",
        "Are there any carrots on the blanket?"
      ],
      answer: "Are there any bread rolls on the blanket?",
      explain: "The photo shows bread rolls. They stay on the blanket when you carry away the corn."
    },
    {
      kind: "type", skill: "agreement",
      clue: "There are three jugs on the table. ___ there any juice in them?",
      prompt: "Type Is or Are to ask about the juice.",
      answer: "Is",
      explain: "The question asks about juice. Juice takes is even when there are three jugs."
    },
    {
      kind: "choice", skill: "words",
      clue: "You cannot see inside a bag. You want to know if it has even one sandwich.",
      prompt: "Which question asks exactly what you want to know?",
      options: [
        "Are there any sandwiches in the bag?",
        "Are there a lot of sandwiches in the bag?",
        "Are there ten sandwiches in the bag?",
        "Are the sandwiches in the bag big?"
      ],
      answer: "Are there any sandwiches in the bag?",
      explain: "Any asks whether the bag has even one sandwich. A lot of asks whether the number is large."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "Mia has six apples in her bag. Ben's bag is empty.",
      prompt: "Which child says something false about their own bag?",
      options: [
        "Ben says, “There are some apples in my bag.”",
        "Mia says, “There are some apples in my bag.”",
        "Ben says, “There aren't any apples in my bag.”",
        "Mia says, “I can see some fruit in my bag.”"
      ],
      answer: "Ben says, “There are some apples in my bag.”",
      explain: "Ben has zero apples. His sentence with some says that his bag has apples."
    },
    {
      kind: "build", skill: "agreement",
      clue: "A cook wrote, “There are some butter in the pan.”",
      prompt: "Rebuild the sentence with the right verb.",
      tiles: ["There", "is", "some butter", "in the pan."],
      answer: "There is some butter in the pan.",
      explain: "Butter is measured as an amount, so use There is some butter."
    },
    {
      kind: "choice", skill: "pictures", scene: "bakery",
      clue: "The baker moves all the eggs in the photo to the fridge. Everything else stays on the counter.",
      prompt: "Which note will match the counter now?",
      options: [
        "There is still some flour, but there aren't any eggs.",
        "There isn't any flour, but there are still some eggs.",
        "There are still some eggs, but there isn't any butter.",
        "There isn't any flour, and there aren't any eggs."
      ],
      answer: "There is still some flour, but there aren't any eggs.",
      explain: "The baker moved only the eggs. The flour on the counter stays where it was."
    },
    {
      kind: "type", skill: "meaning",
      clue: "The red bag holds only grapes. The blue bag holds only plums. “There isn't any ___ in either bag.”",
      prompt: "Type the food that fits. Choose from grapes, rice or plums.",
      answer: "rice",
      explain: "Both bags hold fruit, and neither has rice. Isn't any rice fits both bags."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "Asha puts one egg in an empty bowl.",
      prompt: "Which sentence is false now?",
      options: [
        "There aren't any eggs in the bowl.",
        "There is an egg in the bowl.",
        "There aren't a lot of eggs in the bowl.",
        "There is some food in the bowl."
      ],
      answer: "There aren't any eggs in the bowl.",
      explain: "The bowl now has one egg. Aren't any eggs would mean that the bowl had zero eggs."
    },
    {
      kind: "build", skill: "words",
      clue: "Omar finishes all the water in his glass.",
      prompt: "Build the sentence that matches his glass now.",
      tiles: ["There", "isn't", "any water", "left in his glass."],
      answer: "There isn't any water left in his glass.",
      explain: "Water takes isn't. Isn't any water left tells us the glass is empty."
    },
    {
      kind: "type", skill: "agreement",
      clue: "There ___ two cups of milk by the door.",
      prompt: "Type is or are. Look at what you can count.",
      answer: "are",
      explain: "You can count two cups. The plural cups takes are, even with milk inside."
    },
    {
      kind: "choice", skill: "pictures", scene: "fridge",
      clue: "You need eggs, milk and carrots. Look in the fridge before you shop.",
      prompt: "Which shopping note names the missing food correctly?",
      options: [
        "Get some carrots. There aren't any carrots in the fridge.",
        "Get some eggs. There aren't any eggs in the fridge.",
        "Get some milk. There isn't any milk in the fridge.",
        "Get some carrots. There isn't any carrots in the fridge."
      ],
      answer: "Get some carrots. There aren't any carrots in the fridge.",
      explain: "The fridge has eggs and milk. The missing food is carrots, so write There aren't any carrots."
    },
    {
      kind: "choice", skill: "words",
      clue: "Dad calls from the shop. You tell him, “We have no rice.”",
      prompt: "Which sentence keeps the same meaning?",
      options: [
        "We don't have any rice.",
        "We don't have a lot of rice.",
        "Do we have any rice?",
        "We have some rice."
      ],
      answer: "We don't have any rice.",
      explain: "No rice means zero. Don't have any rice gives Dad the same information."
    },
    {
      kind: "build", skill: "agreement",
      clue: "You want to know whether the bag has a large number of apples.",
      prompt: "Build the question to ask the fruit seller.",
      tiles: ["Are", "there", "a lot of apples", "in the bag?"],
      answer: "Are there a lot of apples in the bag?",
      explain: "Start with Are there for plural apples. A lot of asks whether the number is large."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "For a picnic, we need bread, cheese and apples. We have some apples. We don't have any bread or cheese.",
      prompt: "Which shopping list fills both gaps?",
      options: [
        "Get some bread and some cheese.",
        "Get some bread and some apples.",
        "Get some cheese and some apples.",
        "Get a lot of apples."
      ],
      answer: "Get some bread and some cheese.",
      explain: "Bread and cheese are missing. We already have the apples."
    },
    {
      kind: "type", skill: "words",
      clue: "Layla checks two bowls. The first is empty. The second has rice. “I found ___ rice in the second bowl.”",
      prompt: "Type some or any for Layla's report.",
      answer: "some",
      explain: "Layla is telling us that rice was there. I found some rice fits her report."
    },
    {
      kind: "choice", skill: "pictures", scene: "lunchbox",
      prompt: "Which lunchbox note gets both the food and the verbs right?",
      options: [
        "There are some blueberries. There is some bread in the sandwiches.",
        "There is some blueberries. There are some bread in the sandwiches.",
        "There aren't any blueberries. There is some bread in the sandwiches.",
        "There are some blueberries. There isn't any bread in the sandwiches."
      ],
      answer: "There are some blueberries. There is some bread in the sandwiches.",
      explain: "You can see blueberries and sandwich bread. Blueberries takes are, and bread takes is."
    },
    {
      kind: "choice", skill: "agreement",
      clue: "A cook points to a bag of sugar and says, “Yes, there is some.”",
      prompt: "Which question could the cook be answering?",
      options: [
        "Is there any sugar left?",
        "Are there any sugar cubes left?",
        "Does the cook like sugar?",
        "Is the cook busy?"
      ],
      answer: "Is there any sugar left?",
      explain: "Is there any sugar? takes Yes, there is some. A question about cubes would take there are."
    },
    {
      kind: "type", skill: "words",
      clue: "I can't see ___ nuts. Are there ___ nuts under the bread?",
      prompt: "Type some or any. The same word must fit both gaps.",
      answer: "any",
      explain: "Can't see any nuts describes what is missing. Are there any nuts? checks whether nuts are there."
    },
    {
      kind: "choice", skill: "meaning",
      clue: "A big jar of jam and a big jar of yogurt were full. The children finished all the yogurt. They took just one spoonful of jam.",
      prompt: "Which note belongs on the table after the picnic?",
      options: [
        "There isn't any yogurt left, and there is still some jam.",
        "There isn't any jam left, and there is still some yogurt.",
        "There is still some yogurt, and there is still some jam.",
        "There isn't any yogurt left, and there isn't any jam left."
      ],
      answer: "There isn't any yogurt left, and there is still some jam.",
      explain: "All the yogurt was eaten. One spoonful from a full big jam jar leaves some jam inside."
    }
  ]
};
