"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const D = foodLesson;
  const key = "aboud-monday-food-v1";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch { /* A private session can still practise. */ }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(saved)); return true; } catch { return false; }
  }
  function choice(value, options, fallback) { return options.includes(value) ? value : fallback; }
  function index(value, count) { return Number.isInteger(value) && value >= 0 && value < count ? value : 0; }
  for (const k of ["positions","whole","ready","answers","drafts","questions","evidence"]) {
    if (!saved[k] || typeof saved[k] !== "object" || Array.isArray(saved[k])) saved[k] = {};
  }
  let tab = choice(saved.tab, ["reading","activity","speaking"], "reading");
  let reading = choice(saved.reading, ["apples","onions","words"], "apples");
  let exercise = choice(saved.exercise, ["decode","fill","match"], "decode");
  const prefs = {
    voice: choice(saved.voice, ["bella","heart"], "bella"),
    speed: choice(saved.speed, ["extra","slow","normal"], "slow")
  };
  $("voice").value = prefs.voice;
  $("speed").value = prefs.speed;
  function sampleLabel(id) {
    if (id.startsWith("slide-")) return D.slides[Number(id.slice(6))-1]?.title || "Class slide";
    return (D.audio[id] || "the model").replace(/[.]$/, "");
  }
  const media = createReadingPlayer(prefs, () => {}, {
    database: "aboud-monday-food-recordings-v1", timings: false,
    rates: { extra: 0.65, slow: 0.82, normal: 1 }, sampleLabel
  });
  const groups = {
    reading: [["apples","Apples"],["onions","Onions"],["words","7 food words"]],
    activity: [["decode","1 · Decode"],["fill","2 · Fill the gaps"],["match","2 · Number pictures"]]
  };
  const titles = {
    reading: ["Student’s Book · Pages 52–53","Read and annotate"],
    activity: ["Activity Book · Page 43","Food puzzles"],
    speaking: ["Speaking · One minute","My food talk"]
  };
  const wordInfo = Object.fromEntries(D.words.map(item => [item.word, item]));
  const passage = () => D.passages.find(item => item.id === reading);
  const group = () => tab === "reading" ? reading : tab === "activity" ? exercise : "talk";
  const count = () => tab === "speaking" ? D.talk.length : tab === "reading" && reading !== "words" ? passage().lines.length : 7;
  const position = () => index(saved.positions[group()], count());
  const whole = () => tab !== "activity" && Boolean(saved.whole[group()]);
  const readyKey = (n) => group() + "/" + n;
  const example = n => exercise === "match" ? n === 1 : n === 0;
  const solved = n => example(n) || Boolean(saved.answers[readyKey(n)]);
  let currentClip = "";
  function selectClip(id) {
    const location = [group(), position(), whole(), id].join("/");
    if (currentClip !== location) {
      currentClip = location;
      media.selectItem(id);
    }
  }
  function node(tag, cls, content) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function button(label, cls, handler) {
    const b = node("button", cls, label);
    b.type = "button";
    if (handler) b.addEventListener("click", handler);
    return b;
  }
  function hear(id, label) {
    const b = button(label || "Listen", "sample");
    b.dataset.sample = id;
    return b;
  }
  function picture(src, alt) {
    const img = node("img");
    img.src = src;
    img.alt = alt;
    img.decoding = "async";
    return img;
  }
  function foodPic(word) { return picture("images/"+word+".webp", wordInfo[word]?.alt || word); }
  function move(n) {
    saved.positions[group()] = index(n, count());
    saved.whole[group()] = false;
    save();
    render();
  }
  function setTab(value) {
    tab = saved.tab = value;
    save();
    render();
  }
  function toolsForTopic() {
    const choices = $("topic-choices");
    choices.replaceChildren();
    choices.hidden = tab === "speaking";
    for (const [id,label] of groups[tab] || []) {
      const b = button(label,"",() => {
        if (tab === "reading") reading = saved.reading = id;
        else exercise = saved.exercise = id;
        save();
        render();
      });
      b.setAttribute("aria-pressed", String(id === group()));
      choices.append(b);
    }
  }
  function listOf(lines) {
    const list = node("ol","all-lines");
    lines.forEach(line => list.append(node("li","",line)));
    return list;
  }
  function studyCard(n) {
    const body = $("reading-body");
    if (tab === "speaking") {
      $("card-label").textContent = whole() ? "My whole talk" : "Speaking practice";
      body.append(whole() ? listOf(D.talk) : node("h3","talk-line",D.talk[n]));
      return whole() ? "talk-all" : "talk-"+(n+1);
    }
    if (reading === "words") {
      $("card-label").textContent = "Key words 2 · Page 53";
      if (whole()) {
        body.append(listOf(D.words.map(w => w.word)));
        return "words-all";
      }
      const w = D.words[n], scene = node("div","scene"), copy = node("div");
      copy.append(node("h3","word-head",w.word),node("p","word-example",w.example),hear("example-"+w.word,"Hear the example"));
      scene.append(foodPic(w.word),copy);
      body.append(scene);
      return "word-"+w.word;
    }
    const p = passage();
    $("card-label").textContent = p.title+" · Page 52";
    if (whole()) {
      body.append(listOf(p.lines));
      return p.id+"-all";
    }
    const scene = node("div","scene");
    scene.append(picture("images/"+p.id+".webp",p.alt),node("h3","",p.lines[n]));
    body.append(scene);
    return p.id+"-"+(n+1);
  }
  function drawRail() {
    const n = position(), total = count(), isActivity = tab === "activity";
    const jump = $("jump-list");
    jump.className = "jumps";
    jump.replaceChildren();
    let done = 0;
    for (let i=0; i<total; i++) {
      const label = isActivity && exercise === "match" ? D.pictures[i].letter : group() === "words" ? D.words[i].word : String(i+1);
      const complete = isActivity ? solved(i) : Boolean(saved.ready[readyKey(i)]);
      if (complete && !(isActivity && example(i))) done++;
      const b = button(label, "jump"+(complete ? " done" : ""), () => move(i));
      const what = isActivity ? (exercise === "match" ? "Picture " : "Item ") : group() === "words" ? "Word " : "Line ";
      b.setAttribute("aria-label", what+label+(isActivity && example(i) ? ", book example" : complete ? ", ready" : ""));
      if (!whole() && i === n) b.setAttribute("aria-current","true");
      jump.append(b);
    }
    const target = isActivity ? total-1 : total;
    $("rail-title").textContent = isActivity ? (exercise === "match" ? "Picture map" : "Practice map") : group() === "words" ? "Word cards" : tab === "speaking" ? "Talk lines" : "Reading lines";
    $("ready-count").textContent = done+" / "+target+(isActivity ? " solved" : " ready");
    $("progress-bar").style.width = (done/target*100)+"%";
    $("ready-button").hidden = isActivity || whole();
    $("ready-button").setAttribute("aria-pressed", String(Boolean(saved.ready[readyKey(n)])));
    $("ready-button").querySelector("span").textContent = saved.ready[readyKey(n)] ? "Ready ✓" : "Mark ready";
    $("task-total").hidden = !isActivity && !whole();
    $("task-total").textContent = isActivity ? done+" of 6 solved" : "Listen or record from start to finish.";
    $("full-mode").hidden = isActivity;
    $("full-mode").textContent = whole() ? "Back to one card" : tab === "speaking" ? "Practise my whole talk" : group() === "words" ? "Review all seven words" : "Read the whole passage";
    $("prev").disabled = whole() || n === 0;
    $("next").disabled = whole() || n === total-1;
    $("timer-box").hidden = $("rail-slides").hidden = tab !== "speaking";
  }
  function renderEvidence() {
    const box = $("evidence");
    box.replaceChildren();
    box.hidden = tab !== "reading" || reading === "words";
    $("prediction").hidden = tab !== "reading";
    if (box.hidden) return;
    const p = passage(), qn = index(saved.questions[p.id],p.questions.length), q = p.questions[qn];
    const qkey = p.id+"/"+qn;
    const correct = Object.hasOwn(saved.evidence, qkey);
    box.append(node("h3","","Find the evidence"),node("p","helper",p.id === "apples" ? "When you annotate, you mark the words that answer a question. Which crayon matches the underlined answer?" : "Read the question. Tap the sentence you would underline in your book."));
    const nav = node("div","pick-group evidence-q-nav");
    p.questions.forEach((item,i) => {
      const letter = String.fromCharCode(97+i), checked = Object.hasOwn(saved.evidence,p.id+"/"+i);
      const b = button(letter+(checked ? " ✓" : ""),"",() => {
        saved.questions[p.id] = i; save(); renderEvidence();
      });
      b.setAttribute("aria-label","Question "+letter+(checked ? ", solved" : ""));
      if (i === qn) b.setAttribute("aria-current","true");
      nav.append(b);
    });
    box.append(nav,node("p","evidence-q",String.fromCharCode(97+qn)+". "+q.text),hear("ask-"+p.id+"-"+(qn+1),"Hear the question"));
    const feedback = node("p","feedback",correct ? "That’s it! "+q.reply : "");
    feedback.setAttribute("role","status");
    function check(answer) {
      const yes = p.id === "apples" ? answer === q.color : q.evidence.includes(answer);
      if (yes) { saved.evidence[qkey] = answer; save(); renderEvidence(); }
      else { feedback.className = "feedback try"; feedback.textContent = "Try again. Read the question and look for the words that answer it."; }
    }
    if (p.id === "apples") {
      const text = node("div","evidence-text");
      p.lines.forEach((line,i) => {
        const span=node("span","proof",line), color = {0:"red",1:"blue",4:"green"}[i];
        if (color) { span.dataset.color=color; span.setAttribute("aria-label",line+" Underlined in "+color+"."); }
        text.append(span);
      });
      const colors = node("div","pick-group");
      for (const c of ["red","blue","green"]) {
        const b = button(c[0].toUpperCase()+c.slice(1),"",() => check(c));
        b.prepend(node("i","swatch "+c));
        if (correct && c === q.color) b.setAttribute("aria-current","true");
        colors.append(b);
      }
      box.append(text,colors);
    } else {
      const options = node("div","sent-options");
      p.lines.forEach((line,i) => {
        const mark = p.questions.find((question,j) => saved.evidence[p.id+"/"+j] === i);
        const b=button(line,"sent-option"+(mark ? " picked" : ""),() => check(i));
        if (mark) b.dataset.color=mark.color;
        b.setAttribute("aria-pressed",String(Boolean(mark)));
        options.append(b);
      });
      box.append(options);
    }
    box.append(feedback);
  }
  function sentenceLine(s,n,answer) {
    const p = node("h3","work-sentence");
    const gap = node("span","blank", answer ? s.word : "____");
    gap.setAttribute("aria-label", answer ? s.word : "blank");
    p.append(document.createTextNode(n+". "+s.before),gap,document.createTextNode(s.after));
    return p;
  }
  function keyAndPuzzle(word) {
    const letters = node("div","color-key");
    Object.entries(D.code).forEach(([letter,color]) => {
      const chip = node("span");
      chip.append(node("i","swatch "+color),document.createTextNode(letter+" · "+color));
      letters.append(chip);
    });
    const coded = node("div","code-word");
    coded.setAttribute("role","img");
    coded.setAttribute("aria-label",Array.from(word,c => D.code[c] ? D.code[c]+" dot" : c).join(", "));
    for (const c of word) coded.append(D.code[c] ? node("i","vowel-dot "+D.code[c]) : node("span","",c));
    return [letters,coded];
  }
  function renderGuide() {
    const guide = $("sentence-guide");
    guide.hidden = tab !== "activity" || exercise !== "match";
    const list = $("guide-list");
    list.replaceChildren();
    if (guide.hidden) return;
    D.sentences.forEach((s,i) => {
      const answer = i===0 || saved.answers["fill/"+i];
      list.append(node("li","",s.before+(answer ? s.word : "_____")+s.after));
    });
  }
  function activityCard(n) {
    const body = $("reading-body"), isDone = solved(n), ex = example(n);
    const s = D.sentences[n], pic = D.pictures[n];
    const target = exercise === "decode" ? D.decode[n] : exercise === "fill" ? s.word : String(pic.number);
    const answerKey = readyKey(n);
    $("card-label").textContent = exercise === "decode" ? "Question 1 · Vowel code" : exercise === "fill" ? "Question 2 · Word bank" : "Question 2 · Picture "+pic.letter;
    const feedback = node("p","feedback");
    feedback.setAttribute("role","status");
    function evaluate(value) {
      if (value.trim().toLowerCase() === target) {
        saved.answers[answerKey] = true; delete saved.drafts[answerKey]; save(); render();
      } else {
        feedback.className = "feedback try";
        feedback.textContent = exercise === "decode" ? "Try again. Check each dot against the vowel key." : exercise === "fill" ? "Try again. "+s.hint : "Try again. Read the numbered sentences and find the one that describes this picture.";
      }
    }
    if (exercise === "decode") {
      body.append(node("h3","","Decode the word"),node("p","helper","Read the letters. Use the dot colors to fill in the missing vowels."),...keyAndPuzzle(target));
    } else if (exercise === "fill") {
      body.append(node("p","helper","Use a word from the box to complete the sentence."),sentenceLine(s,n+1,isDone));
    } else {
      const food = D.sentences[pic.number-1].word;
      const row = node("div","match-layout"), copy = node("div");
      const img = foodPic(food); img.className="match-art";
      copy.append(node("h3","","Picture "+pic.letter),node("p","helper","Which sentence describes this picture? Choose its number."));
      row.append(img,copy); body.append(row);
      if (!isDone) {
        const numbers = node("div","picture-numbers");
        for (let i=1;i<=7;i++) {
          const b = button(String(i),"",() => evaluate(String(i)));
          b.setAttribute("aria-label","Choose sentence "+i); numbers.append(b);
        }
        body.append(numbers);
      }
    }
    if (isDone) {
      const ans = exercise === "match" ? "Sentence "+pic.number+". "+D.sentences[pic.number-1].before+D.sentences[pic.number-1].word+D.sentences[pic.number-1].after : target;
      const result = node("p","answer-box",(ex ? "Book example · " : "Correct! ")+ans);
      result.setAttribute("role","status"); body.append(result);
      if (exercise === "decode") body.append(hear("decode-help","Hear the directions"));
    } else if (exercise !== "match") {
      const form = node("form","activity-form"), label = node("label","","My answer");
      const input = node("input"); input.type = "text"; input.autocomplete = "off"; input.autocapitalize = "none"; input.spellcheck = false; input.maxLength = 26;
      input.value = typeof saved.drafts[answerKey] === "string" ? saved.drafts[answerKey] : "";
      function storeDraft() { saved.drafts[answerKey] = input.value; save(); }
      input.addEventListener("input",storeDraft);
      label.append(input);
      const checkButton = button("Check","primary"); checkButton.type="submit";
      form.append(label,checkButton);
      form.addEventListener("submit",ev => { ev.preventDefault(); evaluate(input.value); });
      if (exercise === "fill") {
        const bank = node("div","word-bank");
        D.decode.forEach(word => bank.append(button(word,"",() => { input.value=word; storeDraft(); })));
        body.append(bank);
      }
      body.append(form);
    }
    if (!isDone) {
      const promptId = exercise === "decode" ? "decode-help" : exercise === "fill" ? "clue-"+(n+1) : "match-help";
      body.append(feedback,hear(promptId,exercise === "fill" ? "Hear the sentence" : "Hear the directions"));
    }
    if (exercise === "decode") return isDone ? "word-"+target : "decode-help";
    if (exercise === "fill") return (isDone ? "sentence-" : "clue-")+(n+1);
    return isDone ? "sentence-"+pic.number : "match-help";
  }
  function render() {
    const n = position();
    all("[data-tab]").forEach(b => {
      b.setAttribute("aria-selected",String(b.dataset.tab === tab));
      b.tabIndex = b.dataset.tab === tab ? 0 : -1;
    });
    $("study").setAttribute("aria-labelledby","tab-"+tab);
    $("section-kicker").textContent = titles[tab][0];
    $("section-title").textContent = titles[tab][1];
    toolsForTopic();
    $("reading-body").replaceChildren();
    $("counter").textContent = whole() ? "All "+count() : String(n+1)+" / "+count();
    const clip = tab === "activity" ? activityCard(n) : studyCard(n);
    const directionsOnly = tab === "activity" && !solved(n);
    $("listen").parentElement.hidden = directionsOnly;
    $("media-status").hidden = directionsOnly;
    drawRail(); renderEvidence(); renderGuide();
    selectClip(clip);
  }
  $("ready-button").addEventListener("click",() => {
    const k = readyKey(position()); saved.ready[k] = !saved.ready[k]; save(); drawRail();
  });
  $("prev").addEventListener("click",() => { if (position()>0) move(position()-1); });
  $("next").addEventListener("click",() => { if (position()+1<count()) move(position()+1); });
  $("full-mode").addEventListener("click",() => { saved.whole[group()] = !whole(); save(); render(); });
  all("[data-tab]").forEach((b,i,buttons) => {
    b.addEventListener("click",() => setTab(b.dataset.tab));
    b.addEventListener("keydown",e => {
      const targets = { ArrowRight:(i+1)%3, ArrowLeft:(i+2)%3, Home:0, End:2 };
      if (!Object.hasOwn(targets,e.key)) return;
      e.preventDefault(); const next=buttons[targets[e.key]]; next.focus(); next.click();
    });
  });
  $("start-reading").addEventListener("click",() => {
    setTab("reading"); $("lessons").scrollIntoView({block:"start"}); $("tab-reading").focus({preventScroll:true});
  });
  $("voice").addEventListener("change",e => { saved.voice = prefs.voice = e.target.value; save(); media.changeVoice(); });
  $("speed").addEventListener("change",e => { saved.speed = prefs.speed = e.target.value; save(); media.changeRate(); });
  document.addEventListener("click",e => {
    const b = e.target.closest("[data-sample]"); if (b && !b.disabled) media.sample(b.dataset.sample);
  });
  $("prediction-prompt").textContent = D.prediction;
  $("prediction-input").value = typeof saved.prediction === "string" ? saved.prediction : "";
  $("prediction-input").addEventListener("input",e => {
    saved.prediction=e.target.value; $("prediction-saved").textContent = save() ? "Saved on this device." : "Available while this page is open.";
  });

  let remaining=60000, deadline=0, ticking=0;
  function showClock() {
    const seconds = Math.ceil(remaining/1000);
    all("[data-time]").forEach(el => {
      el.textContent = Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0");
      el.toggleAttribute("data-finished",seconds===0);
    });
    all("[data-clock]").forEach(b => { b.textContent = deadline ? "Pause timer" : remaining === 0 ? "Start again" : remaining === 60000 ? "Start timer" : "Resume"; });
  }
  function tick() {
    if (deadline) {
      remaining = Math.max(0,deadline-Date.now());
      if (!remaining) {
        clearInterval(ticking); deadline=0; $("clock-status").textContent="One minute is up.";
      }
    }
    showClock();
  }
  all("[data-clock]").forEach(b => b.addEventListener("click",() => {
    if (deadline) {
      remaining=Math.max(0,deadline-Date.now()); clearInterval(ticking); deadline=0;
    } else {
      if (!remaining) remaining=60000;
      deadline=Date.now()+remaining; $("clock-status").textContent="Timer running."; ticking=setInterval(tick,200);
    }
    tick();
  }));
  all("[data-reset]").forEach(b => b.addEventListener("click",() => {
    clearInterval(ticking); deadline=0; remaining=60000; $("clock-status").textContent="Timer reset."; showClock();
  }));
  document.addEventListener("visibilitychange",() => { if (!document.hidden) tick(); });
  const dialog = $("presentation");
  let slide=0, notes=false, opener;
  function drawSlide() {
    const s=D.slides[slide], art=$("slide-art");
    $("slide-title").textContent=s.title; $("slide-cue").textContent=s.cue;
    $("slide-no").textContent=(slide+1)+" / "+D.slides.length;
    $("previous-slide").disabled=slide===0; $("next-slide").disabled=slide===D.slides.length-1;
    const lines=$("slide-notes"); lines.replaceChildren(...D.talk.slice(s.first,s.last+1).map(x=>node("p","",x)));
    lines.hidden=!notes; $("notes-toggle").textContent=notes ? "Hide notes" : "Show notes";
    $("notes-toggle").setAttribute("aria-pressed",String(notes));
    $("slide-listen").dataset.sample="slide-"+(slide+1); $("slide-listen").setAttribute("aria-pressed","false");
    art.className=s.foods ? "food-grid" : slide===0 ? "" : "cue-art";
    if (s.foods) art.replaceChildren(...s.foods.map(foodPic));
    else if (slide === 0) art.replaceChildren(picture(s.image,s.alt));
    else {
      const crop=node("div","cue-crop"); crop.append(picture(s.image,s.alt)); art.replaceChildren(crop);
    }
  }
  function changeSlide(delta) {
    const next=slide+delta;
    if (next<0 || next>=D.slides.length) return;
    media.suspend(); slide=next; drawSlide();
  }
  all("[data-slides]").forEach(b=>b.addEventListener("click",() => {
    opener=b; media.suspend(); slide=0; notes=false; drawSlide(); dialog.showModal(); document.body.classList.add("showing-slides");
  }));
  $("close-slides").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("close",()=>{ media.suspend(); currentClip=""; render(); document.body.classList.remove("showing-slides"); opener?.focus({preventScroll:true}); });
  $("previous-slide").addEventListener("click",()=>changeSlide(-1)); $("next-slide").addEventListener("click",()=>changeSlide(1));
  $("notes-toggle").addEventListener("click",()=>{ notes=!notes; $("slide-notes").hidden=!notes; $("notes-toggle").textContent=notes ? "Hide notes" : "Show notes"; $("notes-toggle").setAttribute("aria-pressed",String(notes)); });
  dialog.addEventListener("keydown",e=>{ if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); changeSlide(e.key === "ArrowRight" ? 1 : -1); } });
  render();
})();
