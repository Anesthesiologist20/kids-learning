(() => {
  "use strict";

  const main = document.getElementById("main");
  const popup = document.getElementById("popup");
  const storageKey = "aboud.quantifier-kitchen.v1";
  const icons = {
    chef: '<path d="M7 14a4.5 4.5 0 0 1-1.4-8.8 5.5 5.5 0 0 1 10 0 4.5 4.5 0 1 1 1.4 8.8v5.4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z"/><path d="M7 16.5h10M10 10.5v3m4-3v3"/>',
    star: '<path d="m12 2.6 2.8 5.9 6.5 1-4.7 4.6 1.1 6.5-5.7-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-1z"/>',
    arrow: '<path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5"/>',
    back: '<path d="M19.5 12h-14m5.5-5.5L5.5 12l5.5 5.5"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    book: '<path d="M12 6c-3-2-6-2-9-1.5v14c3-.5 6-.5 9 1.5 3-2 6-2 9-1.5v-14c-3-.5-6-.5-9 1.5Zm0 0v14"/>',
    trophy:
      '<path d="M7 4h10v5c0 6-2.5 8-5 8s-5-2-5-8zM7 6H3v2a4 4 0 0 0 4 4m10-6h4v2a4 4 0 0 1-4 4M12 17v3m-4 1h8"/>',
    flag: '<path d="M5 21V4m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    check: '<path d="m4.5 12 4.5 4.5 10-10"/>',
    cross: '<path d="m6 6 12 12m0-12L6 18"/>',
    sound:
      '<path d="M4 9h4l5-4v14l-5-4H4zM16 9c2 2 2 4 0 6m2.8-8.7a9 9 0 0 1 0 11.4"/>',
    pause: '<path d="M8 5v14m8-14v14"/>',
    bulb: '<path d="M8.5 15c0-1.8-3-3.2-3-6.8a6.5 6.5 0 0 1 13 0c0 3.6-3 5-3 6.8Zm1 3h5m-4 3h3"/>',
    search: '<circle cx="10.2" cy="10.2" r="6.5"/><path d="m15 15 6 6"/>',
    medal:
      '<circle cx="12" cy="8.7" r="6.1"/><path d="m7.5 13-3 8 4.5-2 2.5 2 1-6m3.5-2 3 8-4.5-2"/>',
    basket:
      '<path d="M3 10h18l-2.3 9H5.3zM7 10l4-6m6 6-4-6m-4 9 .6 3m4.9-3-.6 3"/>',
    bowl: '<path d="M3 12h18c-.7 5-4 8-9 8s-8.3-3-9-8Zm4 9h10M15 11l4-7M5 8c-2-2 1-3 0-5m5 5c-2-2 1-3 0-5"/>',
  };
  function icon(name, extra = "") {
    return `<svg class="icon ${extra}" aria-hidden="true" viewBox="0 0 24 24">${icons[name] || ""}</svg>`;
  }
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const norm = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/['‘’`]/g, "")
      .replace(/[.,!?;:“”"]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const skills = {
    words: "Quantifier words",
    pictures: "Picture clues",
    agreement: "Is, are & sentence form",
    meaning: "Meaning & logic",
  };
  const scenes = {
    fridge: [
      "Inside the fridge",
      "An open fridge with a bottle of milk, eggs and green apples.",
    ],
    picnic: [
      "The picnic blanket",
      "Watermelon slices, yellow corn cobs and bread rolls on a red picnic blanket.",
    ],
    lunchbox: [
      "The school lunchbox",
      "An open lunchbox with triangle sandwiches, carrot sticks and blueberries.",
    ],
    bakery: [
      "The baker’s counter",
      "A bowl of flour, brown eggs, butter and a wooden spoon on a counter.",
    ],
    basket: [
      "The market basket",
      "Carrots, apples, tomatoes and a baguette in an orange market basket.",
    ],
  };
  const stations = {
    pantry: {
      title: "Pantry Picks",
      scene: "fridge",
      desc: "Choose the quantity word that fits.",
    },
    photos: {
      title: "Picture Detective",
      scene: "picnic",
      desc: "Look closely and test each food clue.",
    },
    workshop: {
      title: "Sentence Workshop",
      scene: "bakery",
      desc: "Fix the verb and build the sentence.",
    },
    mysteries: {
      title: "Lunchbox Mysteries",
      scene: "lunchbox",
      desc: "Follow two clues to solve each puzzle.",
    },
  };
  const exams = {
    a: {
      title: "The Picnic Test",
      desc: "Read the food clues and keep track of what is left.",
    },
    b: {
      title: "The Market Test",
      desc: "Check shopping lists and fix the cook’s notes.",
    },
  };
  const banks = {},
    modes = {};
  function addMode(mode, list, name, exam) {
    const ids = list.map((question, index) => {
      const id = `${mode}-${index + 1}`;
      banks[id] = question;
      return id;
    });
    modes[mode] = { ids, name, exam };
  }
  for (const [key, station] of Object.entries(stations))
    addMode(key, window.KitchenPractice[key], station.title, false);
  for (const [key, form] of Object.entries(exams))
    addMode(`exam-${key}`, window.KitchenExams[key], form.title, true);
  const guide = window.KitchenGuide;
  const defaultState = () => ({
    earned: {},
    runs: {},
    results: {},
    best: {},
    history: [],
    guideStep: 0,
    guideChecks: {},
    voice: "heart",
    speed: "1",
    timed: true,
  });
  function loadState() {
    try {
      return Object.assign(
        defaultState(),
        JSON.parse(localStorage.getItem(storageKey) || "{}"),
      );
    } catch {
      return defaultState();
    }
  }
  let state = loadState();
  let currentView = "",
    openMap = false,
    reviewFilter = "all",
    activeAudio = null,
    audioButton = null,
    pendingConfirm = null;
  function announce(message) {
    document.getElementById("notice").textContent = message;
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      announce(
        "This browser could not save your progress. Keep this page open to continue.",
      );
    }
  }
  function shuffle(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const other = Math.floor(Math.random() * (i + 1));
      [result[i], result[other]] = [result[other], result[i]];
    }
    return result;
  }
  function newRun(key) {
    const mode = modes[key];
    const ids = state.results[key] ? shuffle(mode.ids) : [...mode.ids];
    const layout = {};
    for (const id of ids) {
      const q = banks[id];
      const indexes = (q.options || q.tiles || []).map((_, i) => i);
      const order = shuffle(indexes);
      if (q.kind === "build" && order.every((n, i) => n === i))
        order.push(order.shift());
      layout[id] = order;
    }
    const now = Date.now();
    state.runs[key] = {
      ids,
      layout,
      answers: {},
      drafts: {},
      flags: {},
      index: 0,
      started: now,
      deadline: mode.exam && state.timed ? now + 25 * 60000 : 0,
    };
    openMap = false;
    save();
  }
  function correct(id, answer) {
    const q = banks[id];
    return (
      answer !== undefined &&
      [q.answer, ...(q.accept || [])].some(
        (valid) => norm(valid) === norm(answer),
      )
    );
  }
  const grade = (result) =>
    result.ids.filter((id) => correct(id, result.answers[id])).length;
  const answered = (run) => Object.keys(run.answers).length;
  function finish(key, expired = false) {
    const run = state.runs[key];
    if (!run) return;
    for (const id of run.ids)
      if (correct(id, run.answers[id])) state.earned[id] = true;
    const result = {
      ids: run.ids,
      answers: run.answers,
      flags: run.flags,
      ended: Date.now(),
      expired,
    };
    const score = grade(result);
    state.results[key] = result;
    state.best[key] = Math.max(state.best[key] || 0, score);
    state.history = [
      { key, score, total: run.ids.length, date: result.ended },
      ...state.history,
    ].slice(0, 12);
    delete state.runs[key];
    save();
  }
  function expireRuns() {
    for (const [key, run] of Object.entries(state.runs)) {
      if (run.deadline && Date.now() >= run.deadline) finish(key, true);
    }
  }
  function starTotal() {
    return Object.keys(state.earned).length;
  }
  function updateStars() {
    const total = starTotal(),
      badge = document.getElementById("total-stars");
    badge.querySelector("b").textContent = total;
    badge.setAttribute("aria-label", `${total} stars. Open rewards`);
  }
  function crumbs(tail, parent) {
    const back = parent || ["../", "Aboud’s Learning Corner"];
    return `<div class="crumb"><a href="${back[0]}">${icon("back")}${esc(back[1])}</a><span class="chevron" aria-hidden="true">/</span><span>${esc(tail)}</span></div>`;
  }
  function link(url, label, cls = "primary", symbol = "") {
    return `<a class="button ${cls}" href="${url}">${esc(label)}${symbol ? icon(symbol) : ""}</a>`;
  }
  function go(path) {
    if ((location.hash.slice(1) || "home") === path) render();
    else location.hash = path;
  }
  function photo(scene, cls = "photo-panel") {
    const [caption, alt] = scenes[scene];
    return `<figure class="${cls}"><img src="assets/${scene}.webp" alt="${esc(alt)}" width="624" height="624"><figcaption>${esc(caption)}</figcaption></figure>`;
  }
  function markNav(section) {
    document.querySelectorAll(".main-nav a").forEach((a) => {
      if (a.hash === `#${section}`) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  function stationCards() {
    return `<div class="stations">${Object.entries(stations)
      .map(([key, station]) => {
        const run = state.runs[key],
          done = state.results[key];
        const dest = done && !run ? `result/${key}` : `run/${key}`;
        const progress = run
          ? `Resume · ${answered(run)}/${run.ids.length} answered`
          : done
            ? `Review · best ${state.best[key]}/${modes[key].ids.length}`
            : `${modes[key].ids.length} questions`;
        return `<a class="station" href="#${dest}"><div class="station-photo"><img class="${station.scene}" src="assets/${station.scene}.webp" alt="" width="624" height="624">${done ? `<span class="station-finish">${icon("check")} Finished</span>` : ""}</div><div class="station-body"><h3>${station.title}</h3><p>${station.desc}</p><div class="station-foot"><span>${progress}</span><span class="round-arrow">${icon("arrow")}</span></div></div></a>`;
      })
      .join("")}</div>`;
  }
  function challengeBanner() {
    return `<aside class="challenge-banner"><div class="trophy-box">${icon("trophy")}</div><div><h2>Challenge Exam</h2><p>Two different tests. Twenty questions each. Can you earn the Golden Whisk?</p></div>${link("#exam", "Pick an exam", "secondary", "arrow")}</aside>`;
  }
  function homePage() {
    return `${crumbs("Quantifier Kitchen")}<section class="hero"><img class="hero-image" src="assets/basket.webp" alt="An orange basket full of carrots, apples and bread." width="1360" height="907" fetchpriority="high"><div class="hero-content"><p class="eyebrow">${icon("book")} Grade 2 English</p><h1 class="hero-title"><span>Quantifier</span><span>Kitchen</span></h1><p class="hero-copy">What’s in the basket? Choose between <em>some</em>, <em>any</em> and <em>a lot of</em>.</p><div class="actions">${link("#learn", "Start lesson", "primary", "arrow")}${link("#exam", "Challenge Exam", "ghost")}</div></div></section><section class="home-section"><div class="section-head"><h2>Practice stations</h2><span class="section-meta">48 questions</span></div>${stationCards()}</section>${challengeBanner()}`;
  }
  function practicePage() {
    return `${crumbs("Practice", ["#home", "Quantifier Kitchen"])}<h1 class="page-title">Practice stations</h1><p class="page-intro">Pick a station. Check each answer to see the clue and earn a star.</p><div class="section-head"><h2>Choose a station</h2><span class="section-meta">12 questions each</span></div>${stationCards()}${challengeBanner()}`;
  }
  function listenButton(audio, text) {
    return `<button class="audio-play" type="button" data-action="listen" data-id="${audio}" aria-label="Hear ${esc(text)}" aria-pressed="false">${icon("sound")}</button>`;
  }
  function markWords(text) {
    return esc(text).replace(
      /(not a lot of|a lot of|some|any|There is|There are)/gi,
      "<strong>$&</strong>",
    );
  }
  function quickResponse(step) {
    const q = guide[step],
      picked = state.guideChecks[step];
    if (picked === undefined) return "";
    return `<div class="feedback ${picked === q.correct ? "" : "wrong"}"><b>${picked === q.correct ? "You got it!" : "Look again."}</b> ${esc(q.why)}</div>`;
  }
  function learnPage(step) {
    const q = guide[step];
    return `${crumbs("Lesson", ["#home", "Quantifier Kitchen"])}<h1 class="page-title">The kitchen rulebook</h1><p class="page-intro">Look at the food, listen to the examples and try each quick check.</p><div class="guide-tabs" aria-label="Lesson topics">${guide.map((x, i) => `<button type="button" data-action="guide" data-index="${i}" aria-pressed="${i === step}">${esc(x.title)}</button>`).join("")}</div><div class="guide-grid"><article class="guide-panel"><h2 class="panel-heading">${esc(q.title)}</h2><p class="rule-copy">${esc(q.rule)}</p><div class="examples">${q.examples.map(([s, a]) => `<div class="example">${a ? listenButton(a, s) : ""}<span>${markWords(s)}</span></div>`).join("")}</div><div class="audio-panel"><label>Voice <select id="voice" aria-label="Reading voice"><option value="heart" ${state.voice === "heart" ? "selected" : ""}>Heart</option><option value="bella" ${state.voice === "bella" ? "selected" : ""}>Bella</option></select></label><label>Speed <select id="speed" aria-label="Reading speed">${[
      ["0.65", "Extra slow"],
      ["0.82", "Slow"],
      ["1", "Normal"],
    ]
      .map(
        ([n, label]) =>
          `<option value="${n}" ${state.speed === n ? "selected" : ""}>${label}</option>`,
      )
      .join(
        "",
      )}</select></label></div><p class="listen-info" id="listen-info" role="status"></p><p class="tip">${esc(q.tip)}</p><details class="arabic"><summary lang="ar" dir="rtl">شرح بالعربي</summary><p lang="ar" dir="rtl">${esc(q.ar)}</p></details><section class="quick-check"><h3>${esc(q.check)}</h3><div class="quick-options">${q.choices.map((s, i) => `<button class="small-button" data-action="quick" data-index="${i}" aria-pressed="${state.guideChecks[step] === i}">${esc(s)}</button>`).join("")}</div><div id="quick-output" class="quick-output" aria-live="polite">${quickResponse(step)}</div></section><div class="actions guide-next"><span>Rule ${step + 1} of ${guide.length}</span>${step < guide.length - 1 ? `<button class="button primary" data-action="guide" data-index="${step + 1}">Next rule ${icon("arrow")}</button>` : link("#practice", "Go to practice", "primary", "arrow")}</div></article>${photo(q.scene)}</div>`;
  }
  function examPage() {
    const cards = Object.entries(exams)
      .map(([letter, form]) => {
        const key = `exam-${letter}`,
          run = state.runs[key],
          result = state.results[key];
        return `<article class="form-card"><div class="form-index">${icon(letter === "a" ? "basket" : "bowl")} Form ${letter.toUpperCase()}</div><h2>${form.title}</h2><p>${form.desc}</p><div class="exam-terms"><span class="pill">20 questions</span>${result ? `<span class="pill gold">Best ${state.best[key]}/20</span>` : ""}${run ? `<span class="pill">${answered(run)}/20 answered</span>` : ""}</div><div class="actions"><button class="button primary" data-action="start-exam" data-key="${key}">${run ? "Resume" : result ? "Retake" : "Start"} Form ${letter.toUpperCase()} ${icon("arrow")}</button>${result ? link(`#result/${key}`, "Last result", "secondary") : ""}</div></article>`;
      })
      .join("");
    return `${crumbs("Challenge Exam", ["#home", "Quantifier Kitchen"])}<h1 class="page-title">Challenge Exam</h1><p class="page-intro">Pick a test. You’ll read clues, build sentences and type missing words. Your score and corrections appear when you turn it in.</p><div class="exam-ready"><label><input id="timed" type="checkbox" ${state.timed ? "checked" : ""}> <b>Use the 25-minute timer</b></label><p>The timer starts with a new test and keeps running if you leave. Switch it off for an untimed round.</p></div><div class="form-grid">${cards}</div>`;
  }
  function draftValue(run, id) {
    const q = banks[id],
      draft = run.drafts[id];
    if (q.kind === "build")
      return (draft || []).map((i) => q.tiles[i]).join(" ");
    return draft ?? "";
  }
  function ready(run, id) {
    const q = banks[id];
    return q.kind === "build"
      ? (run.drafts[id] || []).length === q.tiles.length
      : draftValue(run, id).trim().length > 0;
  }
  function answerControls(run, id, exam) {
    const q = banks[id],
      locked = Object.hasOwn(run.answers, id),
      chosen = locked ? run.answers[id] : draftValue(run, id);
    if (q.kind === "choice") {
      return `<div class="choices" role="group" aria-label="Answer choices">${run.layout[
        id
      ]
        .map((n, pos) => {
          const value = q.options[n],
            selected = chosen === value;
          const judge =
            locked && !exam
              ? correct(id, value)
                ? " correct"
                : selected
                  ? " incorrect"
                  : ""
              : "";
          return `<button type="button" class="choice${judge}" data-action="pick" data-index="${n}" aria-pressed="${selected}" ${locked ? "disabled" : ""}><span class="choice-label">${String.fromCharCode(65 + pos)}</span><span>${esc(value)}</span>${judge ? `<span class="state-icon">${icon(judge === " correct" ? "check" : "cross")}</span>` : ""}</button>`;
        })
        .join("")}</div>`;
    }
    if (locked)
      return `<p class="locked-line">Your answer &nbsp; ${esc(chosen)}</p>`;
    if (q.kind === "type") {
      return `<div class="answer-form"><label for="type-answer">Your answer</label><input class="type-input" id="type-answer" type="text" maxlength="180" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" value="${esc(chosen)}" placeholder="Type your answer"></div>`;
    }
    const selected = run.drafts[id] || [];
    return `<div class="answer-form"><p class="build-instruction">Tap the tiles in order. Tap a placed tile to take it back.</p><div class="tile-line" aria-label="Your sentence">${selected.length ? selected.map((n, i) => `<button class="tile" type="button" data-action="take-back" data-index="${i}" aria-label="Remove ${esc(q.tiles[n])}">${esc(q.tiles[n])}</button>`).join("") : '<span class="placeholder">Your sentence goes here</span>'}</div><div class="tile-bank" aria-label="Available words">${run.layout[
      id
    ]
      .filter((n) => !selected.includes(n))
      .map(
        (n) =>
          `<button class="tile" type="button" data-action="place" data-index="${n}">${esc(q.tiles[n])}</button>`,
      )
      .join("")}</div></div>`;
  }
  function clockText(deadline) {
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }
  function mapButtons(run, exam) {
    return run.ids
      .map((id, i) => {
        const locked = Object.hasOwn(run.answers, id),
          right = correct(id, run.answers[id]);
        const color = !locked ? "" : exam ? "done" : right ? "right" : "wrong";
        const status = !locked
          ? "unanswered"
          : exam
            ? "locked"
            : right
              ? "correct"
              : "needs practice";
        return `<button type="button" class="${color} ${run.flags[id] ? "marked" : ""}" data-action="jump" data-index="${i}" ${i === run.index ? 'aria-current="step"' : ""} aria-label="Question ${i + 1}, ${status}${run.flags[id] ? ", marked" : ""}">${i + 1}</button>`;
      })
      .join("");
  }
  function feedback(run, id, exam) {
    if (!Object.hasOwn(run.answers, id)) return "";
    if (exam)
      return `<div class="feedback neutral" role="status"><b>${icon("check")} Answer locked.</b> You’ll see the correction after the test.</div>`;
    const q = banks[id],
      right = correct(id, run.answers[id]);
    return `<div class="feedback ${right ? "" : "wrong"}" role="status"><b>${icon(right ? "star" : "bulb", right ? "star-filled" : "")} ${right ? "Correct!" : "Look at the clue."}</b>${!right ? `<p><strong>Answer:</strong> ${esc(q.answer)}</p>` : ""}<p>${esc(q.explain)}</p></div>`;
  }
  function runPage(key) {
    const mode = modes[key],
      run = state.runs[key],
      exam = mode.exam;
    const id = run.ids[run.index],
      q = banks[id],
      n = run.index,
      count = run.ids.length,
      locked = Object.hasOwn(run.answers, id);
    const endLabel = exam ? "Turn in exam" : "Finish station";
    const skip =
      n < count - 1
        ? `<button class="text-link" data-action="move" data-index="1">Skip for now</button>`
        : "";
    let forward;
    if (locked)
      forward =
        n < count - 1
          ? `<button class="button primary" data-action="move" data-index="1">Next ${icon("arrow")}</button>`
          : `<button class="button primary" data-action="finish">${endLabel} ${icon("check")}</button>`;
    else
      forward = `${skip}<button class="button primary" id="lock-answer" data-action="lock" ${ready(run, id) ? "" : "disabled"}>${exam ? "Lock answer" : "Check answer"} ${icon("check")}</button>`;
    const clock = exam
      ? `<span class="timer" id="run-clock">${icon("clock")}<span>${run.deadline ? clockText(run.deadline) : "Untimed"}</span></span>`
      : `<span class="pill">Practice</span>`;
    return `<div class="run-page">${crumbs(mode.name, exam ? ["#exam", "Challenge Exam"] : ["#practice", "Practice stations"])}<div class="run-heading"><h1>${esc(mode.name)}</h1>${clock}</div><div class="run-toolbar"><div class="run-label"><span class="counter">Question ${n + 1} of ${count}</span></div><div class="progressbar" role="progressbar" aria-label="Answers locked" aria-valuemin="0" aria-valuemax="${count}" aria-valuenow="${answered(run)}"><span style="width:${(100 * answered(run)) / count}%"></span></div><span class="counter">${answered(run)} locked</span></div><section class="quiz-card"><div class="q-grid${q.scene ? " has-photo" : ""}">${q.scene ? photo(q.scene, "question-photo") : ""}<div><div class="skill-line"><span>${skills[q.skill]}</span><button type="button" class="flag" data-action="flag" aria-pressed="${!!run.flags[id]}">${icon("flag")}${run.flags[id] ? "Marked" : "Mark"}</button></div>${q.clue ? `<p class="clue">${icon("bulb")}<span>${esc(q.clue)}</span></p>` : ""}<h2 class="question-title" tabindex="-1">${esc(q.prompt)}</h2>${answerControls(run, id, exam)}${feedback(run, id, exam)}<div class="q-actions"><button class="small-button" data-action="move" data-index="-1" ${n === 0 ? "disabled" : ""}>${icon("back")} Back</button><div>${forward}</div></div></div></div></section><details class="mapdetails" id="question-map" ${openMap ? "open" : ""}><summary>Question map · ${Object.values(run.flags).filter(Boolean).length} marked</summary><div class="map-grid">${mapButtons(run, exam)}</div></details><div class="finish-row"><button class="text-link" data-action="finish">${endLabel} ${icon("chevron")}</button></div></div>`;
  }
  const badges = [
    {
      name: "First Star",
      symbol: "star",
      desc: "Answer one question correctly.",
      test: () => starTotal() >= 1,
    },
    {
      name: "Pantry Picker",
      symbol: "basket",
      desc: "Earn 8 stars in Pantry Picks.",
      test: () => modes.pantry.ids.filter((id) => state.earned[id]).length >= 8,
    },
    {
      name: "Picture Detective",
      symbol: "search",
      desc: "Earn 8 stars in Picture Detective.",
      test: () => modes.photos.ids.filter((id) => state.earned[id]).length >= 8,
    },
    {
      name: "Sentence Chef",
      symbol: "chef",
      desc: "Earn 8 stars in Sentence Workshop.",
      test: () =>
        modes.workshop.ids.filter((id) => state.earned[id]).length >= 8,
    },
    {
      name: "Clue Catcher",
      symbol: "bulb",
      desc: "Earn 8 stars in Lunchbox Mysteries.",
      test: () =>
        modes.mysteries.ids.filter((id) => state.earned[id]).length >= 8,
    },
    {
      name: "Kitchen All-Rounder",
      symbol: "medal",
      desc: "Earn 8 stars in each practice station.",
      test: () =>
        Object.keys(stations).every(
          (key) => modes[key].ids.filter((id) => state.earned[id]).length >= 8,
        ),
    },
    {
      name: "Golden Whisk",
      symbol: "trophy",
      desc: "Score 16 out of 20 on either exam.",
      test: () =>
        Math.max(state.best["exam-a"] || 0, state.best["exam-b"] || 0) >= 16,
    },
    {
      name: "Double Champion",
      symbol: "trophy",
      desc: "Score 18 out of 20 on both exams.",
      test: () =>
        Math.min(state.best["exam-a"] || 0, state.best["exam-b"] || 0) >= 18,
    },
  ];
  function resultReview(key, result) {
    const rows = result.ids
      .map((id, i) => {
        const q = banks[id],
          picked = result.answers[id],
          right = correct(id, picked);
        if (
          (reviewFilter === "missed" && right) ||
          (reviewFilter === "marked" && !result.flags[id])
        )
          return "";
        return `<article class="review-row ${right ? "right" : "wrong"}">${q.scene ? `<img class="mini-pic" src="assets/${q.scene}.webp" width="74" height="74" alt="${esc(scenes[q.scene][1])}">` : ""}<small>Question ${i + 1} · ${right ? "Correct" : picked === undefined ? "Unanswered" : "Missed"}${result.flags[id] ? " · Marked" : ""}</small>${q.clue ? `<p>${esc(q.clue)}</p>` : ""}<h3>${esc(q.prompt)}</h3>${!right ? `<p>Your answer: <b>${picked === undefined ? "—" : esc(picked)}</b></p>` : ""}<p class="key">${right ? "Your answer" : "Correct answer"}: <b>${esc(q.answer)}</b></p><p>${esc(q.explain)}</p></article>`;
      })
      .join("");
    return (
      rows ||
      `<p class="empty-state">${reviewFilter === "marked" ? "You did not mark any questions in this round." : "You answered every question correctly!"}</p>`
    );
  }
  function breakdown(result) {
    return Object.entries(skills)
      .map(([skill, label]) => {
        const ids = result.ids.filter((id) => banks[id].skill === skill);
        if (!ids.length) return "";
        const score = ids.filter((id) =>
          correct(id, result.answers[id]),
        ).length;
        return `<div class="skill-row"><span>${label}</span><div class="progressbar"><span style="width:${(100 * score) / ids.length}%"></span></div><b>${score}/${ids.length}</b></div>`;
      })
      .join("");
  }
  function resultPage(key) {
    const result = state.results[key],
      mode = modes[key],
      total = result.ids.length,
      score = grade(result);
    const missed = total - score,
      marked = Object.values(result.flags).filter(Boolean).length;
    const parent = mode.exam
      ? ["#exam", "Challenge Exam"]
      : ["#practice", "Practice stations"];
    return `${crumbs("Results", parent)}<h1 class="page-title">${esc(mode.name)}</h1><p class="page-intro">Round results${result.expired ? " · Time is up. Your locked answers were scored." : ""}</p><section class="result-box"><div class="score-grid" style="margin-top:0"><div><span class="eyebrow">Your score</span><p class="score-big">${score}<small> / ${total}</small></p><p class="quiet">${Math.round((100 * score) / total)}% correct · Best ${state.best[key]}/${total}</p></div><div class="skill-rows">${breakdown(result)}</div></div><div class="actions" style="margin-top:19px">${state.runs[key] ? link(`#run/${key}`, "Resume current round", "primary", "arrow") : mode.exam ? link("#exam", "Choose an exam", "primary", "arrow") : `<button class="button primary" data-action="retry" data-key="${key}">Try this station again ${icon("arrow")}</button>`}${link("#rewards", "See my rewards", "secondary", "star")}</div></section><div class="section-head"><h2>Review your answers</h2></div><div class="review-tools" aria-label="Review filter">${[
      ["all", "All answers", total],
      ["missed", "Missed", missed],
      ["marked", "Marked", marked],
    ]
      .map(
        ([id, label, count]) =>
          `<button class="small-button" data-action="review-filter" data-id="${id}" aria-pressed="${reviewFilter === id}">${label} (${count})</button>`,
      )
      .join(
        "",
      )}</div><div class="review-list" id="review-list">${resultReview(key, result)}</div>`;
  }
  function rewardsPage() {
    const total = starTotal(),
      count = badges.filter((b) => b.test()).length;
    return `${crumbs("Rewards", ["#home", "Quantifier Kitchen"])}<h1 class="page-title">Your kitchen rewards</h1><p class="page-intro">Earn one star for each different question you get right. A better answer on a new round can still earn its star.</p><section class="wallet"><div class="reward-summary"><p class="score-big">${icon("star", "star-filled")}${total}<small> / ${Object.keys(banks).length} stars</small></p></div><p class="quiet">${count} of ${badges.length} badges unlocked · Saved on this browser</p></section><div class="section-head"><h2>Badge collection</h2></div><div class="badge-grid">${badges.map((b) => `<article class="badge-card ${b.test() ? "earned" : ""}"><div class="badge-symbol">${icon(b.symbol)}</div><h3>${esc(b.name)}</h3><p>${esc(b.desc)}</p><div class="badge-state">${b.test() ? "✓ Earned" : "Locked"}</div></article>`).join("")}</div><div class="section-head"><h2>Recent rounds</h2></div>${state.history.length ? `<ul class="history">${state.history.map((h) => `<li><span>${esc(modes[h.key].name)} <small>· ${esc(new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }))}</small></span><b>${h.score}/${h.total}</b></li>`).join("")}</ul>` : '<p class="empty-state">Finish a station or an exam to see your scores here.</p>'}<div class="actions" style="margin-top:16px">${link("#practice", "Open practice", "primary", "arrow")}${link("#exam", "Challenge Exam", "secondary")}</div>`;
  }
  function stopAudio() {
    if (activeAudio) {
      activeAudio.onended = null;
      activeAudio.pause();
    }
    if (audioButton) {
      audioButton.setAttribute("aria-pressed", "false");
      audioButton.innerHTML = icon("sound");
    }
    activeAudio = null;
    audioButton = null;
  }
  async function playExample(btn) {
    const alreadyPlaying = btn === audioButton;
    stopAudio();
    if (alreadyPlaying) return;
    const player = new Audio(`audio/${state.voice}/${btn.dataset.id}.mp3`);
    activeAudio = player;
    audioButton = btn;
    player.preservesPitch = true;
    player.playbackRate = Number(state.speed);
    player.onended = () => {
      if (activeAudio === player) stopAudio();
    };
    const status = document.getElementById("listen-info");
    if (status) status.textContent = "";
    btn.setAttribute("aria-pressed", "true");
    btn.innerHTML = icon("pause");
    try {
      await player.play();
    } catch {
      if (activeAudio !== player) return;
      stopAudio();
      if (status)
        status.textContent =
          "The audio could not play. Tap the speaker to try again.";
    }
  }
  function readRoute() {
    const [section, key] = (location.hash.slice(1) || "home").split("/");
    return { section, key };
  }
  function render(navigate = false) {
    expireRuns();
    const { section, key } = readRoute();
    currentView = [
      "home",
      "learn",
      "practice",
      "exam",
      "rewards",
      "run",
      "result",
    ].includes(section)
      ? section
      : "home";
    if (["run", "result"].includes(currentView) && !Object.hasOwn(modes, key))
      currentView = "home";
    if (currentView === "run" && !state.runs[key]) {
      if (state.results[key]) {
        location.replace(`#result/${key}`);
        return;
      }
      if (modes[key].exam) {
        location.replace("#exam");
        return;
      }
      newRun(key);
    }
    if (currentView === "result" && !state.results[key]) {
      location.replace(modes[key].exam ? "#exam" : "#practice");
      return;
    }
    const menu = ["run", "result"].includes(currentView)
      ? modes[key].exam
        ? "exam"
        : "practice"
      : currentView;
    markNav(menu);
    updateStars();
    switch (currentView) {
      case "learn":
        if (key !== undefined && /^[0-3]$/.test(key))
          state.guideStep = Number(key);
        main.innerHTML = learnPage(state.guideStep);
        break;
      case "practice":
        main.innerHTML = practicePage();
        break;
      case "exam":
        main.innerHTML = examPage();
        break;
      case "run":
        main.innerHTML = runPage(key);
        break;
      case "result":
        main.innerHTML = resultPage(key);
        break;
      case "rewards":
        main.innerHTML = rewardsPage();
        break;
      default:
        main.innerHTML = homePage();
    }
    if (navigate) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  }
  function confirmFinish(key) {
    const run = state.runs[key],
      exam = modes[key].exam,
      remaining = run.ids.length - answered(run);
    const end = () => {
      finish(key);
      reviewFilter = "all";
      go(`result/${key}`);
    };
    if (!remaining) {
      end();
      return;
    }
    pendingConfirm = end;
    const title = exam ? "Turn in this exam?" : "Finish this station?";
    const message = `${remaining} ${remaining === 1 ? "answer is" : "answers are"} still unlocked. Unanswered questions will score zero.`;
    document.getElementById("popup-body").innerHTML =
      `<h2 id="popup-title">${title}</h2><p>${message}</p><div class="actions"><button class="button secondary" data-dialog="cancel" autofocus>Keep going</button><button class="button primary" data-dialog="yes">${exam ? "Turn it in" : "Finish station"}</button></div>`;
    popup.showModal();
  }
  popup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dialog]");
    if (!btn) return;
    const action = pendingConfirm;
    pendingConfirm = null;
    popup.close();
    if (btn.dataset.dialog === "yes") action?.();
  });
  popup.addEventListener("close", () => {
    pendingConfirm = null;
  });
  function lockAnswer(key) {
    const run = state.runs[key];
    if (!run) return;
    const id = run.ids[run.index];
    if (Object.hasOwn(run.answers, id) || !ready(run, id)) return;
    run.answers[id] = draftValue(run, id).trim();
    delete run.drafts[id];
    if (!modes[key].exam && correct(id, run.answers[id]))
      state.earned[id] = true;
    save();
    render();
    announce(
      modes[key].exam
        ? "Answer locked."
        : correct(id, run.answers[id])
          ? "Correct answer."
          : "Check the answer and explanation.",
    );
  }
  function jump(key, index) {
    const run = state.runs[key];
    if (!Number.isInteger(index) || index < 0 || index >= run.ids.length)
      return;
    run.index = index;
    save();
    render();
    const title = main.querySelector(".question-title");
    title?.focus({ preventScroll: true });
    const top = main.querySelector(".quiz-card").getBoundingClientRect().top;
    if (top < 0)
      main.querySelector(".run-heading").scrollIntoView({ block: "start" });
  }
  main.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action,
      index = Number(btn.dataset.index),
      { key } = readRoute();
    if (action === "listen") {
      playExample(btn);
      return;
    }
    if (action === "guide") {
      stopAudio();
      state.guideStep = index;
      save();
      go(`learn/${index}`);
      return;
    }
    if (action === "quick") {
      state.guideChecks[state.guideStep] = index;
      save();
      main
        .querySelectorAll('[data-action="quick"]')
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.index) === index),
          ),
        );
      document.getElementById("quick-output").innerHTML = quickResponse(
        state.guideStep,
      );
      return;
    }
    if (action === "start-exam" || action === "retry") {
      const target = btn.dataset.key;
      if (!state.runs[target]) newRun(target);
      go(`run/${target}`);
      return;
    }
    if (action === "review-filter") {
      reviewFilter = btn.dataset.id;
      main
        .querySelectorAll('[data-action="review-filter"]')
        .forEach((b) =>
          b.setAttribute("aria-pressed", String(b.dataset.id === reviewFilter)),
        );
      document.getElementById("review-list").innerHTML = resultReview(
        key,
        state.results[key],
      );
      return;
    }
    const run = state.runs[key];
    if (!run) return;
    if (run.deadline && Date.now() >= run.deadline) {
      tick();
      return;
    }
    const id = run.ids[run.index],
      q = banks[id];
    if (action === "finish") {
      confirmFinish(key);
      return;
    }
    if (action === "move" || action === "jump") {
      jump(key, action === "move" ? run.index + index : index);
      return;
    }
    if (action === "flag") {
      run.flags[id] = !run.flags[id];
      save();
      render();
      return;
    }
    if (Object.hasOwn(run.answers, id)) return;
    if (action === "lock") {
      lockAnswer(key);
      return;
    }
    if (action === "pick") {
      run.drafts[id] = q.options[index];
      save();
      main
        .querySelectorAll('[data-action="pick"]')
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.index) === index),
          ),
        );
      document.getElementById("lock-answer").disabled = false;
      return;
    }
    if (action === "place" || action === "take-back") {
      const sequence = run.drafts[id] || [];
      if (action === "place" && !sequence.includes(index)) sequence.push(index);
      if (action === "take-back") sequence.splice(index, 1);
      run.drafts[id] = sequence;
      save();
      render();
      announce(
        sequence.length
          ? sequence.map((i) => q.tiles[i]).join(" ")
          : "Sentence cleared.",
      );
    }
  });
  main.addEventListener("input", (e) => {
    if (e.target.id !== "type-answer") return;
    const { key } = readRoute(),
      run = state.runs[key];
    if (!run) return;
    const id = run.ids[run.index];
    if (Object.hasOwn(run.answers, id)) return;
    run.drafts[id] = e.target.value;
    save();
    document.getElementById("lock-answer").disabled = !ready(run, id);
  });
  main.addEventListener("keydown", (e) => {
    if (e.target.id === "type-answer" && e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      document.getElementById("lock-answer")?.click();
    }
  });
  main.addEventListener("change", (e) => {
    if (e.target.id === "timed") state.timed = e.target.checked;
    else if (e.target.id === "voice") {
      stopAudio();
      state.voice = e.target.value;
    } else if (e.target.id === "speed") {
      state.speed = e.target.value;
      if (activeAudio) activeAudio.playbackRate = Number(state.speed);
    } else return;
    save();
  });
  main.addEventListener(
    "toggle",
    (e) => {
      if (e.target.id === "question-map" && e.target.isConnected)
        openMap = e.target.open;
    },
    true,
  );
  function tick() {
    const { key, section } = readRoute(),
      run = state.runs[key];
    if (section === "run" && run?.deadline && Date.now() >= run.deadline) {
      if (popup.open) popup.close();
      finish(key, true);
      reviewFilter = "all";
      go(`result/${key}`);
      return;
    }
    if (section === "run" && run?.deadline) {
      const clock = document.getElementById("run-clock");
      if (clock) {
        clock.querySelector("span").textContent = clockText(run.deadline);
        clock.classList.toggle("urgent", run.deadline - Date.now() < 60000);
      }
    } else if (
      Object.values(state.runs).some(
        (r) => r.deadline && Date.now() >= r.deadline,
      )
    )
      render();
  }
  document.querySelector(".skip-link").addEventListener("click", (e) => {
    e.preventDefault();
    main.focus();
  });
  window.addEventListener("hashchange", () => {
    stopAudio();
    openMap = false;
    reviewFilter = "all";
    render(true);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === storageKey) {
      state = loadState();
      render();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });
  window.setInterval(tick, 1000);
  render();
})();
