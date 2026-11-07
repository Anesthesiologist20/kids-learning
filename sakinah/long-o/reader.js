(() => {
  const { groups, patterns, songs } = longO;
  const stages = Object.keys(groups);
  const id = name => document.getElementById(name);
  const storeKey = "sakinah-long-o-page57-v1";
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storeKey)); } catch { /* Use a fresh lesson. */ }
  saved = saved && typeof saved === "object" ? saved : {};
  const state = {
    stage: stages.includes(saved.stage) ? saved.stage : "words",
    position: {},
    voice: saved.voice === "heart" ? "heart" : "bella",
    speed: saved.speed === "slow" ? "slow" : "extra",
    ready: new Set(Array.isArray(saved.ready) ? saved.ready : []),
    matched: new Set(Array.isArray(saved.matched) ? saved.matched : []),
    gaps: {}
  };
  for (const stage of stages) {
    const pos = saved.position?.[stage];
    state.position[stage] = Number.isInteger(pos) && groups[stage].items[pos] ? pos : 0;
  }
  groups.sentences.items.forEach(item => {
    const old = saved.gaps?.[item.id];
    state.gaps[item.id] = item.targets.map((_, index) => ["ow", "oa", "oe"].includes(old?.[index]) ? old[index] : "");
  });
  function save() {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ ...state, ready: [...state.ready], matched: [...state.matched] }));
    } catch { /* Practice can continue in this tab. */ }
  }
  const index = () => state.position[state.stage];
  const group = () => groups[state.stage];
  const current = () => group().items[index()];
  const textLine = id("reading-line");
  let inClass = false;
  let gapsOpen = false;
  let illuminated;
  let wordSpans = [];
  function highlight(n) {
    const next = wordSpans[n];
    if (next === illuminated) return;
    illuminated?.classList.remove("speaking");
    next?.classList.add("speaking");
    illuminated = next;
  }
  const media = createReadingPlayer(state, highlight);
  function icon(name) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + name);
    svg.append(use);
    return svg;
  }
  function splitText(text, onWord) {
    const fragment = document.createDocumentFragment();
    const tokens = text.match(/[A-Za-z]+(?:[’'][A-Za-z]+)*|[^A-Za-z]+/g) || [];
    for (const token of tokens) fragment.append(/^[A-Za-z]/.test(token) ? onWord(token) : token);
    return fragment;
  }
  function markedWord(token) {
    const span = document.createElement("span");
    span.className = "spoken-word";
    const word = token.toLowerCase();
    const pattern = patterns[word];
    if (pattern) {
      const start = word.lastIndexOf(pattern);
      const mark = document.createElement("mark");
      mark.textContent = token.slice(start, start + 2);
      span.append(token.slice(0, start), mark, token.slice(start + 2));
    } else {
      span.textContent = token;
    }
    return span;
  }
  function drawLine() {
    const item = current();
    highlight(-1);
    textLine.replaceChildren(splitText(item.text, markedWord));
    wordSpans = [...textLine.querySelectorAll(".spoken-word")];
    textLine.classList.toggle("is-word", state.stage === "words");
    const picture = state.stage === "words";
    id("reading-body").classList.toggle("with-picture", picture);
    id("picture-frame").hidden = !picture;
    if (picture) {
      id("picture").src = "images/" + item.id + ".webp";
      id("picture").alt = item.alt;
    }
    id("item-counter").textContent = group().noun + " " + (index() + 1) + " of " + group().items.length;
  }
  function addGap(token) {
    const item = current();
    const word = token.toLowerCase();
    const n = item.targets.indexOf(word);
    if (n === -1) return token;
    const wrap = document.createElement("span");
    wrap.className = "gap-word";
    const start = word.lastIndexOf(patterns[word]);
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Choose letters for gap " + (n + 1));
    select.add(new Option("…", ""));
    ["oa", "ow", "oe"].forEach(pattern => select.add(new Option(pattern, pattern)));
    select.value = state.gaps[item.id][n];
    select.addEventListener("change", () => {
      state.gaps[item.id][n] = select.value;
      id("gap-message").textContent = "";
      save();
    });
    wrap.append(token.slice(0, start), select, token.slice(start + 2));
    return wrap;
  }
  function drawGaps() {
    const sentence = state.stage === "sentences";
    id("spelling-mode").hidden = !sentence;
    id("spelling-mode").textContent = gapsOpen ? "Show the sentence" : "Try the spelling";
    id("spelling-mode").setAttribute("aria-expanded", String(gapsOpen));
    id("gap-line").hidden = id("gap-actions").hidden = !gapsOpen;
    textLine.hidden = gapsOpen;
    id("gap-message").textContent = "";
    if (gapsOpen) id("gap-line").replaceChildren(splitText(current().text, addGap));
  }
  function checkGaps() {
    const item = current();
    const answers = state.gaps[item.id];
    const missing = answers.findIndex(answer => !answer);
    const wrong = answers.findIndex((answer, n) => answer !== patterns[item.targets[n]]);
    const message = id("gap-message");
    if (missing !== -1) message.textContent = "Choose letters for gap " + (missing + 1) + ".";
    else if (wrong !== -1) message.textContent = "Listen again and try gap " + (wrong + 1) + ".";
    else message.textContent = "Both spellings are correct!";
  }
  function drawMatching() {
    const show = state.stage === "songs";
    id("matching").hidden = !show;
    if (!show) return;
    const item = current();
    const correct = state.matched.has(item.id);
    const options = [songs[2], songs[0], songs[1]].map(song => {
      const button = document.createElement("button");
      button.className = "match-option";
      button.type = "button";
      button.setAttribute("aria-label", song.alt);
      const isAnswer = song.id === item.id;
      button.classList.toggle("correct", correct && isAnswer);
      button.setAttribute("aria-pressed", String(correct && isAnswer));
      const img = document.createElement("img");
      img.src = "images/" + song.id + ".webp";
      img.alt = "";
      button.append(img);
      button.addEventListener("click", () => {
        if (isAnswer) {
          state.matched.add(item.id);
          button.classList.add("correct");
          button.setAttribute("aria-pressed", "true");
          id("match-message").textContent = "You matched the picture!";
          save();
        } else {
          id("match-message").textContent = "Listen to the line again, then try another picture.";
        }
      });
      return button;
    });
    id("match-options").replaceChildren(...options);
    id("match-message").textContent = correct ? "You matched the picture!" : "";
  }
  function drawReady() {
    const ready = state.ready.has(current().id);
    const button = id("ready");
    button.setAttribute("aria-pressed", String(ready));
    button.querySelector("use").setAttribute("href", ready ? "#i-check" : "#i-flag");
    button.querySelector("span").textContent = ready ? "Class ready" : "Mark ready";
  }
  function drawList() {
    const { items, list } = group();
    id("list-title").textContent = list;
    id("list-count").textContent = items.filter(item => state.ready.has(item.id)).length + "/" + items.length + " ready";
    const rows = items.map((item, n) => {
      const button = document.createElement("button");
      const isReady = state.ready.has(item.id);
      button.className = "list-row" + (isReady ? " is-ready" : "");
      const marker = document.createElement("span");
      marker.className = "marker";
      marker.setAttribute("aria-hidden", "true");
      if (isReady) marker.append(icon("check"));
      else if (["sentences", "songs"].includes(state.stage)) marker.textContent = String.fromCharCode(97 + n);
      else marker.textContent = String(n + 1);
      let label = item.text;
      if (state.stage === "sentences" || state.stage === "songs") label = item.targets.join(" · ");
      if (state.stage === "make") label = item.object + " · " + item.place;
      button.append(marker, label);
      button.setAttribute("aria-label", group().noun + " " + (n + 1) + ", " + label + (isReady ? ", ready for class" : ""));
      if (index() === n) {
        button.setAttribute("aria-current", "step");
        button.append(icon("right"));
      }
      button.addEventListener("click", () => go(state.stage, n));
      return button;
    });
    id("item-list").replaceChildren(...rows);
  }
  function drawSamples() {
    const warmup = state.stage === "words";
    id("sound-title").textContent = warmup ? "Spelling tip" : "Practice the words";
    id("sound-tip").textContent = warmup ? "Tap a word to hear its long o." : "Tap a word to hear it on its own.";
    const targets = warmup ? ["slow", "coat", "toe"] : current().targets;
    const buttons = targets.map(word => {
      const button = document.createElement("button");
      button.className = "word-chip";
      button.dataset.sample = word;
      button.setAttribute("aria-label", "Listen to " + word);
      button.setAttribute("aria-pressed", "false");
      button.append(icon("speaker"), word);
      button.addEventListener("click", () => media.sample(word));
      return button;
    });
    id("word-bank").replaceChildren(...buttons);
  }
  function drawBuilder() {
    const show = state.stage === "make";
    id("builder").hidden = !show;
    if (show) {
      id("object-word").value = current().object;
      id("place-word").value = current().place;
    }
  }
  function drawPreferences() {
    for (const key of ["stage", "voice", "speed"]) {
      document.querySelectorAll("[data-" + key + "]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset[key] === state[key]));
      });
    }
  }
  function draw() {
    drawPreferences();
    id("section-title").textContent = group().title;
    drawLine();
    drawGaps();
    drawMatching();
    drawBuilder();
    drawReady();
    drawList();
    drawSamples();
    const stageNumber = stages.indexOf(state.stage);
    const last = index() === group().items.length - 1;
    const nextText = ["Read the sentences", "Read the song lines", "Make a sentence", "Back to words"];
    id("previous").disabled = index() === 0 && stageNumber === 0;
    id("next").querySelector("span").textContent = last ? nextText[stageNumber] : "Next " + group().noun.toLowerCase();
    media.selectItem(current().id);
  }
  function go(stage, n) {
    if (!groups[stage]?.items[n] || (state.stage === stage && index() === n)) return;
    state.stage = stage;
    state.position[stage] = n;
    gapsOpen = false;
    save();
    draw();
  }
  function move(direction) {
    const n = index() + direction;
    if (group().items[n]) return go(state.stage, n);
    const nextStage = stages[stages.indexOf(state.stage) + direction];
    if (nextStage) return go(nextStage, direction > 0 ? 0 : groups[nextStage].items.length - 1);
    if (direction > 0) go("words", 0);
  }
  document.querySelectorAll("[data-stage]").forEach(button => {
    button.addEventListener("click", () => go(button.dataset.stage, state.position[button.dataset.stage]));
  });
  document.querySelectorAll("[data-voice], [data-speed]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.voice ? "voice" : "speed";
      if (state[key] === button.dataset[key]) return;
      state[key] = button.dataset[key];
      drawPreferences();
      save();
      if (key === "voice") media.changeVoice();
      else media.changeRate();
    });
  });
  id("previous").addEventListener("click", () => move(-1));
  id("next").addEventListener("click", () => move(1));
  id("ready").addEventListener("click", () => {
    const key = current().id;
    if (state.ready.has(key)) state.ready.delete(key); else state.ready.add(key);
    save();
    drawReady();
    drawList();
  });
  id("spelling-mode").addEventListener("click", () => { gapsOpen = !gapsOpen; drawGaps(); });
  id("check-gaps").addEventListener("click", checkGaps);
  id("builder").addEventListener("change", () => {
    const n = groups.make.items.findIndex(item => item.object === id("object-word").value && item.place === id("place-word").value);
    if (n !== -1) go("make", n);
  });
  id("class-view").addEventListener("click", () => {
    inClass = !inClass;
    gapsOpen = false;
    drawGaps();
    document.body.classList.toggle("class-view", inClass);
    id("class-view").setAttribute("aria-pressed", String(inClass));
    id("class-view").querySelector("span").textContent = inClass ? "Exit class view" : "Class view";
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && inClass) { id("class-view").click(); return; }
    if (event.ctrlKey || event.altKey || event.metaKey || event.target.closest("select,input,textarea")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });
  draw();
})();
