const longO = (() => {
  const words = [
    { id: "blow", text: "blow", alt: "A boy blowing out birthday candles" },
    { id: "road", text: "road", alt: "A straight road through the trees" },
    { id: "oboe", text: "oboe", alt: "An oboe with its reed and silver keys" }
  ];
  const sentences = [
    { id: "class-show", text: "I always play the oboe in our class show.", targets: ["oboe", "show"] },
    { id: "goal-toe", text: "I scored the final goal, but I really hurt my toe!", targets: ["goal", "toe"] },
    { id: "throw-coat", text: "“Don’t throw your coat on the floor!” my dad always says.", targets: ["throw", "coat"] },
    { id: "slow-runner", text: "I know I’m a slow runner, but I’m a fast swimmer.", targets: ["know", "slow"] },
    { id: "goat-snow", text: "That goat loves the snow!", targets: ["goat", "snow"] }
  ];
  const songs = [
    { id: "row-boat", text: "Row, row, row your boat …", targets: ["row", "boat"], alt: "Two people rowing a boat" },
    { id: "soap-goat", text: "Soap, soap, soap your goat …", targets: ["soap", "goat"], alt: "Two children washing a goat" },
    { id: "throw-snow", text: "Throw, throw, throw the snow …", targets: ["throw", "snow"], alt: "A child throwing a snowball" }
  ];
  const objects = ["oboe", "soap", "coat"];
  const places = ["snow", "boat", "goal"];
  const made = objects.flatMap(object => places.map(place => ({
    id: "make-" + object + "-" + place,
    object, place, text: "Throw the " + object + " in the " + place + ".",
    targets: ["throw", object, place]
  })));
  const groups = {
    words: { title: "Listen and repeat", list: "Word list", noun: "Word", items: words },
    sentences: { title: "Read aloud", list: "Sentence list", noun: "Sentence", items: sentences },
    songs: { title: "Read the song lines", list: "Song lines", noun: "Line", items: songs },
    make: { title: "Make a silly sentence", list: "Your sentences", noun: "Sentence", items: made }
  };
  const patterns = {
    blow: "ow", road: "oa", oboe: "oe", show: "ow", goal: "oa", toe: "oe",
    throw: "ow", coat: "oa", know: "ow", slow: "ow", goat: "oa", snow: "ow",
    row: "ow", boat: "oa", soap: "oa"
  };
  return { groups, songs, patterns };
})();
