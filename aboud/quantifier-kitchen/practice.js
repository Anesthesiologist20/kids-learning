window.KitchenPractice = {
  pantry: [
    {
      kind: 'choice', skill: 'words',
      clue: 'Our orange tree gave us enough oranges for every class at school.',
      prompt: 'Which words tell the reader the harvest was big? “We picked ___ oranges.”',
      options: ['some', 'a lot of', 'two'], answer: 'a lot of',
      explain: 'A lot of oranges means a large number of oranges. Some leaves the number open.'
    },
    {
      kind: 'choice', skill: 'words',
      clue: 'The rice bag is empty.',
      prompt: 'Finish the cook’s message. “I can’t make rice balls. I don’t have ___ rice.”',
      options: ['any', 'one', 'a'], answer: 'any',
      explain: 'Don’t have any rice means there is no rice to use.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'You spot grapes in a bag. You cannot tell how many are inside.',
      prompt: 'Which note can you write for sure?',
      options: ['There are exactly six grapes.', 'There are some grapes.', 'There are enough grapes for the whole school.'],
      answer: 'There are some grapes.', explain: 'Some tells us grapes are there. We can say it without counting them.'
    },
    {
      kind: 'type', skill: 'words',
      prompt: 'Type some or any to ask whether even one egg is left. “Are there ___ eggs left at all?”',
      answer: 'any', explain: 'Use any when you ask whether there are eggs at all.'
    },
    {
      kind: 'build', skill: 'words',
      prompt: 'The team filled three big jugs. Build a message about all that juice. Begin with There.',
      tiles: ['There', 'is', 'a lot of', 'juice', 'for everyone.'],
      answer: 'There is a lot of juice for everyone.', explain: 'Three full jugs give the team a large amount of juice.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'Sami eats the very last spoonful of yogurt.',
      prompt: 'Which note should he leave on the empty pot?',
      options: ["There isn't a lot of yogurt, but there is still a little.", 'There is some yogurt left.', "There isn't any yogurt left."],
      answer: "There isn't any yogurt left.", explain: 'The last spoonful is gone. There is zero yogurt in the pot.'
    },
    {
      kind: 'type', skill: 'words',
      prompt: 'A word fell off the shopping list. Type the missing word. “We need a ___ of plates for the picnic.”',
      answer: 'lot', explain: 'Put a, lot and of together to describe a large amount or number.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'One tiny piece of cheese is left on a big plate.',
      prompt: 'Which pair of sentences fits?',
      options: ["There is some cheese. There isn't a lot of cheese.", "There isn't any cheese. The plate is empty.", 'There is a lot of cheese. The plate is full.'],
      answer: "There is some cheese. There isn't a lot of cheese.",
      explain: 'The tiny piece counts as some cheese. It is a small amount.'
    },
    {
      kind: 'build', skill: 'words',
      prompt: 'Tell the cook you have zero onions. Begin with We.',
      tiles: ['We', "don't", 'have', 'any', 'onions.'],
      answer: "We don't have any onions.", explain: 'Don’t have any onions tells the cook the onion basket is empty.'
    },
    {
      kind: 'choice', skill: 'words',
      prompt: 'You want your friend to add pasta. Your friend can choose how much. Which instruction gives that choice?',
      options: ['Fill the whole bowl with pasta.', 'Put exactly ten pieces of pasta in the bowl.', 'Put some pasta in the bowl.'],
      answer: 'Put some pasta in the bowl.', explain: 'Some asks for an amount of pasta and leaves the exact amount open.'
    },
    {
      kind: 'type', skill: 'words',
      prompt: 'Choose some or any. Type the word for this report about what you used. “I used ___ sugar to make these cookies.”',
      answer: 'some', explain: 'I used some sugar tells us that sugar went into the cookies.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'The cook says, “There isn’t a lot of bread left.”',
      prompt: 'True or false? A little bread could still be left.',
      options: ['True', 'False'], answer: 'True',
      explain: 'A small piece fits what the cook said. To say it is all gone, say “There isn’t any bread left.”'
    }
  ],
  photos: [
    {
      kind: 'choice', skill: 'pictures', scene: 'fridge',
      prompt: 'A friend asks for a drink. Which sentence points to one in the fridge?',
      options: ['There are some eggs.', 'There is some milk.', 'There are some green apples.'],
      answer: 'There is some milk.', explain: 'The bottle holds milk. Eggs and apples are foods you eat.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'picnic',
      prompt: 'True or false? “There isn’t any corn at this picnic.”',
      options: ['True', 'False'], answer: 'False',
      explain: 'Look for the yellow cobs. There is some corn on the blanket.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'lunchbox',
      prompt: 'Which pair could you take out of this lunchbox?',
      options: ['Some oranges and some corn.', 'Some eggs and some bread rolls.', 'Some sandwiches and some carrots.'],
      answer: 'Some sandwiches and some carrots.', explain: 'Look for the triangle sandwiches and the orange carrot sticks.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'bakery',
      prompt: 'Look inside the big bowl. Which label belongs on it?',
      options: ['There is some flour in the bowl.', 'There is some juice in the bowl.', 'There are some apples in the bowl.'],
      answer: 'There is some flour in the bowl.', explain: 'The white powder in the big bowl is flour.'
    },
    {
      kind: 'type', skill: 'pictures', scene: 'fridge',
      prompt: 'Look for carrots. Type can or can’t to finish the report. “I ___ see any carrots in this fridge.”',
      answer: "can't", accept: ['cannot', 'can not'], explain: 'You can see apples, eggs and milk. There aren’t any carrots in this fridge.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'picnic',
      prompt: 'A guest would like some red fruit. What can you offer from the blanket?',
      options: ['Some bread.', 'Some watermelon.', 'Some corn.'],
      answer: 'Some watermelon.', explain: 'The red watermelon slices are fruit. The corn is yellow and the bread is brown.'
    },
    {
      kind: 'build', skill: 'pictures', scene: 'lunchbox',
      prompt: 'Make a label for the little round blue fruit. Begin with There.',
      tiles: ['There', 'are', 'some', 'blueberries', 'in the lunchbox.'],
      answer: 'There are some blueberries in the lunchbox.', explain: 'Blueberries are fruits you can count, so the label says there are.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'bakery',
      prompt: 'True or false? Both parts of this report match the counter. “There are some eggs and there is some butter.”',
      options: ['True', 'False'], answer: 'True',
      explain: 'You can see eggs and a piece of butter on the baker’s counter.'
    },
    {
      kind: 'build', skill: 'pictures', scene: 'fridge',
      prompt: 'Your partner has the fridge photo. Build a question about the eggs. Begin with Are.',
      tiles: ['Are', 'there', 'any', 'eggs', 'in the fridge?'],
      answer: 'Are there any eggs in the fridge?', explain: 'Are there any eggs? asks whether eggs are there. This photo gives a yes answer.'
    },
    {
      kind: 'type', skill: 'pictures', scene: 'picnic',
      prompt: 'Look at the rolls. Talk about the bread itself. Type is or are. “There ___ some bread on the blanket.”',
      answer: 'is', explain: 'Say there is some bread. If you count the rolls, say there are some rolls.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'lunchbox',
      clue: 'Someone wrote, “There aren’t any carrots in the lunchbox.”',
      prompt: 'Which change makes the label true?',
      options: ["There isn't any food in the lunchbox.", 'There is some watermelon in the lunchbox.', 'There are some carrots in the lunchbox.'],
      answer: 'There are some carrots in the lunchbox.', explain: 'The orange sticks are pieces of carrot. The food is right there in the box.'
    },
    {
      kind: 'choice', skill: 'pictures', scene: 'bakery',
      prompt: 'You need apples or grapes for a fruit salad. Which report describes the baker’s counter?',
      options: ['There are some grapes on the counter.', "There isn't any fruit on the counter.", 'There are some apples on the counter.'],
      answer: "There isn't any fruit on the counter.", explain: 'Flour, eggs and butter are baking ingredients. You can’t see any fruit.'
    }
  ],
  workshop: [
    {
      kind: 'choice', skill: 'agreement',
      prompt: 'Fill the two gaps in order. “There ___ some eggs by the bowl. There ___ some flour in the bowl.”',
      options: ['is, are', 'are, is', 'are, are'], answer: 'are, is',
      explain: 'We count eggs, so eggs take are. We talk about flour as an amount, so flour takes is.'
    },
    {
      kind: 'build', skill: 'agreement',
      prompt: 'Ask if the jug has milk in it. Begin with Is.',
      tiles: ['Is', 'there', 'any', 'milk', 'in the jug?'],
      answer: 'Is there any milk in the jug?', explain: 'To ask about milk, start with Is there and use any in the question.'
    },
    {
      kind: 'type', skill: 'agreement',
      prompt: 'Type is or are. “There ___ a lot of plates on the table.”',
      answer: 'are', explain: 'Look past a lot of to plates. More than one plate takes are.'
    },
    {
      kind: 'choice', skill: 'agreement',
      clue: 'You count three little pots of yogurt in the fridge.',
      prompt: 'Which label is written correctly?',
      options: ['There is some pots of yogurt.', 'There are some yogurt.', 'There are some pots of yogurt.'],
      answer: 'There are some pots of yogurt.', explain: 'The things you counted were pots. Pots is plural, so use are.'
    },
    {
      kind: 'build', skill: 'agreement',
      prompt: 'All the ice cream has gone. Build the message for the freezer door. Begin with There.',
      tiles: ['There', "isn't", 'any', 'ice cream', 'in the freezer.'],
      answer: "There isn't any ice cream in the freezer.", explain: 'Ice cream is a food we can measure by the scoop. Use isn’t any for an empty freezer.'
    },
    {
      kind: 'type', skill: 'agreement',
      prompt: 'Type isn’t or aren’t. “There ___ any sandwiches in the empty basket.”',
      answer: "aren't", accept: ['are not'], explain: 'Sandwiches is plural. There aren’t any sandwiches means the basket holds zero sandwiches.'
    },
    {
      kind: 'choice', skill: 'agreement',
      clue: 'One card reads, “There is some rice on the table.” Now the cook wants to count the bowls.',
      prompt: 'Choose the new card.',
      options: ['There are some bowls of rice on the table.', 'There are some rice on the table.', 'There is some bowls of rice on the table.'],
      answer: 'There are some bowls of rice on the table.', explain: 'Rice takes is. Once you count the bowls, the plural word bowls takes are.'
    },
    {
      kind: 'build', skill: 'words',
      prompt: 'Change “I have some apples” to say you have zero apples. Begin with I.',
      tiles: ['I', "don't", 'have', 'any', 'apples.'],
      answer: "I don't have any apples.", explain: 'Change have to don’t have and some to any to show that you have zero apples.'
    },
    {
      kind: 'choice', skill: 'agreement',
      clue: 'A shelf has eggs. It has no milk.',
      prompt: 'Which note matches both clues and uses the right verbs?',
      options: ["There is some eggs. There isn't any milk.", "There are some eggs. There aren't any milk.", "There are some eggs. There isn't any milk."],
      answer: "There are some eggs. There isn't any milk.", explain: 'Use are with the plural word eggs. When milk is missing, use isn’t any milk.'
    },
    {
      kind: 'type', skill: 'agreement',
      prompt: 'Type has or have. “Does Sami ___ any rice in his lunchbox?”',
      answer: 'have', explain: 'Does starts the question, so the next verb stays in its plain form, have.'
    },
    {
      kind: 'build', skill: 'agreement',
      prompt: 'Your plate holds a big pile of olives. Build a sentence about it. Begin with There.',
      tiles: ['There', 'are', 'a lot of', 'olives', 'on my plate.'],
      answer: 'There are a lot of olives on my plate.', explain: 'A lot of tells how many. Olives tells you to use are.'
    },
    {
      kind: 'choice', skill: 'agreement',
      prompt: 'Read the sign. “There are some sugar by the tea.” Which one-word change fixes it?',
      options: ['Change some to any.', 'Change are to is.', 'Change tea to teas.'],
      answer: 'Change are to is.', explain: 'The corrected sign reads “There is some sugar by the tea.” Sugar takes is.'
    }
  ],
  mysteries: [
    {
      kind: 'choice', skill: 'meaning',
      clue: 'The red bag holds only apples. The blue bag holds only milk. The green bag holds both.',
      prompt: 'Where does this note belong? “There are some apples. There isn’t any milk.”',
      options: ['The green bag.', 'The red bag.', 'The blue bag.'], answer: 'The red bag.',
      explain: 'First find a bag with apples. Then rule out the bag with milk. Only the red bag fits both clues.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'Three rolls go into an empty box. Two rolls come out for lunch.',
      prompt: 'True or false? The box can now wear the label “There aren’t any rolls left.”',
      options: ['True', 'False'], answer: 'False',
      explain: 'One roll is still inside. Aren’t any rolls would mean zero rolls.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'A bottle is full of milk. You pour all the milk into an empty jug.',
      prompt: 'Which report is true after you pour?',
      options: ['Both the jug and the bottle have some milk.', "There isn't any milk in either one.", 'The jug has some milk. The bottle doesn’t have any.'],
      answer: 'The jug has some milk. The bottle doesn’t have any.', explain: 'Follow the milk. All of it moved to the jug, so the bottle is empty.'
    },
    {
      kind: 'build', skill: 'meaning',
      clue: 'A bag held six pears. The baker used every pear in a pie.',
      prompt: 'Write a label for the bag now. Begin with There.',
      tiles: ['There', "aren't", 'any', 'pears', 'left in the bag.'],
      answer: "There aren't any pears left in the bag.", explain: 'Every pear went into the pie. There are zero pears in the bag.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'A cook says, “We don’t need any eggs from the shop today.”',
      prompt: 'True or false? His words prove that there are no eggs in his kitchen.',
      options: ['True', 'False'], answer: 'False',
      explain: 'The cook could have a full box of eggs at home. His words tell us only what he needs from the shop.'
    },
    {
      kind: 'type', skill: 'meaning',
      clue: 'Both baskets held grapes. You emptied the first basket and left the second basket alone.',
      prompt: 'Type some or any. “There are still ___ grapes in the second basket.”',
      answer: 'some', explain: 'The second basket still holds grapes. Some works in this statement about what is there.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'Plate A has a tiny piece of cheese. Plate B has a big pile of cheese. Plate C is empty.',
      prompt: 'Aboud needs a lot of cheese for six pizzas. Which plate best matches his list?',
      options: ['Plate A', 'Plate B', 'Plate C'], answer: 'Plate B',
      explain: 'A lot of cheese means a large amount. Plate B has the big pile.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'The picnic began with corn, rolls and watermelon. Only the rolls ran out.',
      prompt: 'Which order can the picnic helpers still fill?',
      options: ['Some corn and some rolls.', 'Some rolls and some watermelon.', 'Some corn and some watermelon.'],
      answer: 'Some corn and some watermelon.', explain: 'Corn and watermelon are both left. Either order with rolls asks for something that is gone.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'Ali sees no milk on the top shelf. He sees a bottle of milk on the bottom shelf.',
      prompt: 'What can he say about the whole fridge?',
      options: ['There is some milk in the fridge.', "There isn't any milk in the fridge.", 'There is milk on every shelf.'],
      answer: 'There is some milk in the fridge.', explain: 'The bottom shelf is part of the fridge. One bottle there is enough to say there is some milk.'
    },
    {
      kind: 'type', skill: 'agreement',
      clue: 'You can count four bowls on the tray. All four are full of soup.',
      prompt: 'This time, describe the soup itself. Type is or are. “There ___ a lot of soup to share.”',
      answer: 'is', explain: 'Four bowls take are. The food inside them is soup, so we say there is a lot of soup.'
    },
    {
      kind: 'build', skill: 'meaning',
      clue: 'Yesterday we had no seeds. Today a friend brings us a bag of seeds.',
      prompt: 'Update yesterday’s message. Begin with Now.',
      tiles: ['Now', 'we', 'have', 'some', 'seeds.'],
      answer: 'Now we have some seeds.', explain: 'The seeds arrived today, so now some seeds are here.'
    },
    {
      kind: 'choice', skill: 'meaning',
      clue: 'The team has fifty plates, one small bread roll and an empty apple bag.',
      prompt: 'Which note gets all three supplies right?',
      options: ['We have a lot of plates, some bread and a lot of apples.', 'We have a lot of plates, some bread and no apples.', 'We have a lot of bread, some plates and no apples.'],
      answer: 'We have a lot of plates, some bread and no apples.',
      explain: 'Fifty plates is a large number. One roll gives the team some bread. The empty apple bag has zero apples.'
    }
  ]
};
