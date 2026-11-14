window.KitchenGuide = [
  {
    title: 'Some', word: 'some', scene: 'fridge',
    rule: 'Use some when there is an amount of food, but you do not say exactly how much or how many.',
    ar: 'نستخدم some لما يكون فيه شيء، وما نحدّد بالضبط كم عدده أو كميته. تصلح مع الحليب ومع أشياء نقدر نعدّها مثل التفاح.',
    examples: [['There is some milk in the fridge.', 'some'], ['There are some green apples on the shelf.']],
    tip: 'Some does not tell you if there is a little or a lot.',
    check: '“There is some milk.” What do you know for sure?', choices: ['There is milk.', 'There is a whole bottle of milk.'], correct: 0,
    why: 'Some tells you there is milk. It does not tell you how full the bottle is.'
  },
  {
    title: 'A lot of', word: 'a lot of', scene: 'basket',
    rule: 'Use a lot of when you want to say there is a large amount or a large number.',
    ar: 'نستخدم a lot of إذا نبغى نقول إن الكمية أو العدد كبير. وإذا قلنا not a lot of، نعرف أن الكمية مو كبيرة، وممكن يبقى منها شوي.',
    examples: [['There are a lot of carrots in the basket.', 'lots'], ['There is some juice, but there is not a lot of juice.', 'small']],
    tip: '“There isn’t a lot of juice” tells you the amount is small or zero. “There isn’t any juice” tells you it is zero.',
    check: 'Only two drops of juice are left. Which sentence is true?', choices: ['There isn’t any juice.', 'There isn’t a lot of juice.'], correct: 1,
    why: 'Two drops means some juice is left, but only a little.'
  },
  {
    title: 'Any', word: 'any', scene: 'lunchbox',
    rule: 'Use any with a negative to say there is none. Use any in a question when you want to find out if there is something.',
    ar: 'مع النفي نقول any إذا ما فيه شيء منه. ونستخدمها في السؤال لما نبي نعرف هل فيه منه أو لا. في عرض الطعام نقدر نقول: Would you like some milk?',
    examples: [['There are not any apples in the lunchbox.', 'any'], ['Is there any yogurt in the fridge?', 'question']],
    tip: 'A question does not tell you the answer. In an offer, “Would you like some milk?” is natural too.',
    check: '“Are there any eggs?” What does the speaker know?', choices: ['The eggs are all gone.', 'They still need to find out.'], correct: 1,
    why: 'The speaker is asking. There might be eggs, or there might be none.'
  },
  {
    title: 'There is or are?', word: 'is / are', scene: 'picnic',
    rule: 'Look at the food word. Use is with one thing or food you do not count one by one. Use are with more than one countable thing.',
    ar: 'شوف اسم الأكل. نقول is مع شيء واحد أو كمية مثل الخبز والدقيق. ونقول are مع الجمع مثل حبات البيض أو أرغفة الخبز. كلمة some ما تغيّر هالقاعدة.',
    examples: [['There is some bread. There are some bread rolls.', 'agreement'], ['There is a lot of flour. There are a lot of eggs.']],
    tip: 'The same rule works in questions. Is there any bread? Are there any bread rolls?',
    check: 'Which pair fits? “There ___ some flour. There ___ some eggs.”', choices: ['is / are', 'are / is'], correct: 0,
    why: 'Flour is an amount. Eggs are things you can count one by one.'
  }
];
