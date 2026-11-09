"use strict";

const byId = id => document.getElementById(id);
const all = selector => Array.from(document.querySelectorAll(selector));
const storeKey = "sakinah-scifi-page61-v1";
let saved;
try { saved = JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { saved = {}; }
const preferences = { voice: saved.voice === "heart" ? "heart" : "bella", speed: "extra" };
const notes = saved.notes && typeof saved.notes === "object" ? saved.notes : {};
const answers = saved.answers && typeof saved.answers === "object" ? saved.answers : {};
const ready = new Set(Array.isArray(saved.ready) ? saved.ready : []);
const panels = { practice: byId("practice"), whole: byId("whole"), words: byId("words") };
const voiceNames = { bella: "Bella", heart: "Heart" };
const audio = new Audio();
audio.preload = "auto";
audio.setAttribute("playsinline", "");
const sectionNames = new Map();
const lineMap = new Map();
const terms = new Map();
let lines = [], sections = [], selected, view = "practice", word, matcher, media, sequence, timer;

function remember() {
  try {
    localStorage.setItem(storeKey, JSON.stringify({voice: preferences.voice, line: selected?.id, notes, answers, ready: [...ready]}));
  } catch { /* The reader also works without storage. */ }
}
function elem(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
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
function action(label, iconName, className) {
  const btn = elem("button", className);
  btn.type = "button";
  if (iconName) btn.append(icon(iconName));
  btn.append(document.createTextNode(label));
  return btn;
}
function option(label, value) {
  const el = elem("option", "", label);
  el.value = value;
  return el;
}
function urlHash(value) {
  try { history.replaceState(null, "", "#" + value); } catch { /* Embedded view. */ }
}
function isPassage(line) {
  return ["p1", "p2", "p3"].includes(line.section.id) && line.kind !== "caption";
}
function formatMeta(line) {
  if (line.kind === "caption") return "Picture label";
  const textLines = line.section.lines.filter(l => l.kind !== "caption");
  const label = isPassage(line) && line.kind !== "item" ? "Sentence" : "Line";
  return label + " " + (textLines.findIndex(l => l.id === line.id) + 1) + " of " + textLines.length;
}
function rich(text) {
  const fragment = document.createDocumentFragment();
  let start = 0;
  for (const hit of text.matchAll(matcher)) {
    fragment.append(document.createTextNode(text.slice(start, hit.index)));
    const btn = elem("button", "tap-word", hit[0]);
    btn.type = "button";
    btn.dataset.word = hit[0].toLowerCase();
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-label", "Meaning of " + hit[0]);
    fragment.append(btn);
    start = hit.index + hit[0].length;
  }
  fragment.append(document.createTextNode(text.slice(start)));
  return fragment;
}
function renderText(parent, line, partClass) {
  parent.replaceChildren();
  parent.dataset.readingId = line.id;
  if (line.letter) parent.append(elem("span", "letter", line.letter));
  if (line.kind === "item") {
    const bullet = elem("span", "letter", "•");
    bullet.setAttribute("aria-hidden", "true");
    parent.append(bullet);
  }
  line.parts.forEach((part, index) => {
    if (index) parent.append(document.createTextNode(" "));
    const span = elem("span", partClass);
    span.dataset.part = index;
    span.append(rich(part));
    parent.append(span);
  });
  applyMark(parent, line.id);
}
function applyMark(el, id) {
  el.classList.toggle("marked-main", notes[id] === "main");
  el.classList.toggle("marked-detail", notes[id] === "detail");
}
function markControl(line) {
  const label = elem("label", "mark-label", "Underline this sentence");
  const select = elem("select");
  [["No underline",""],["Main idea · red","main"],["Supporting detail · black","detail"]].forEach(([name, value]) => select.append(option(name, value)));
  select.value = notes[line.id] || "";
  select.addEventListener("change", () => {
    if (select.value) notes[line.id] = select.value;
    else delete notes[line.id];
    for (const el of all('[data-reading-id="' + line.id + '"]')) applyMark(el, line.id);
    remember();
  });
  label.append(select);
  return label;
}
function matching(line) {
  const box = elem("div", "match-box");
  const label = elem("label", "match-label", "Which paragraph?");
  const select = elem("select");
  select.dataset.match = line.id;
  select.append(option("Choose…", ""));
  for (let i=1; i<=3; i++) select.append(option("Paragraph " + i, i));
  const msg = elem("span", "match-msg");
  msg.setAttribute("role", "status");
  function refresh() {
    const answer = answers[line.id];
    select.value = [1,2,3].includes(answer) ? String(answer) : "";
    msg.textContent = select.value ? (answer === line.answer ? "Correct!" : "Try a different paragraph.") : "";
    msg.classList.toggle("wrong", Boolean(select.value) && answer !== line.answer);
  }
  select.addEventListener("sync-answer", refresh);
  select.addEventListener("change", () => {
    if (select.value) answers[line.id] = Number(select.value);
    else delete answers[line.id];
    for (const field of all('[data-match="' + line.id + '"]')) field.dispatchEvent(new Event("sync-answer"));
    remember();
  });
  refresh();
  label.append(select);
  box.append(label, msg);
  return box;
}
function pictureGallery() {
  const details = elem("details", "picture-details");
  details.append(elem("summary", "", "Look at the pictures on pages 62–65"));
  const grid = elem("div", "picture-grid");
  const descriptions = ["A robot sitting beside a window in a futuristic room.", "A girl and a robot talking.", "A woman resting while a robot stands nearby.", "Robots sharing messages."];
  descriptions.forEach((alt, index) => {
    const page = 62 + index, figure = elem("figure"), image = elem("img");
    image.src = "images/picture-" + page + ".webp";
    image.alt = alt;
    image.loading = "lazy";
    figure.append(image, elem("figcaption", "", "Page " + page));
    grid.append(figure);
  });
  details.append(grid);
  return details;
}
function syncReady() {
  byId("ready").setAttribute("aria-pressed", String(ready.has(selected.id)));
}
function showLine(line, updateHash = true) {
  selected = line;
  const section = line.section;
  byId("line-meta").textContent = formatMeta(line);
  byId("section-name").textContent = section.label;
  byId("sections-mobile").value = section.id;
  for (const btn of all("#contents button")) {
    if (btn.dataset.section === section.id) btn.setAttribute("aria-current","location");
    else btn.removeAttribute("aria-current");
  }
  byId("caption-figure").hidden = line.kind !== "caption";
  if (line.image) {
    byId("caption-image").src = "images/" + line.image + ".webp";
    byId("caption-image").alt = "The book’s picture of " + line.image + ".";
  }
  renderText(byId("current-line"), line, "focus-part");
  byId("parts-panel").hidden = line.parts.length < 2;
  const parts = byId("parts");
  parts.replaceChildren();
  if (line.parts.length > 1) line.parts.forEach((part, index) => {
    const btn = elem("button", "part-btn");
    btn.type = "button";
    btn.dataset.index = index;
    btn.append(icon("play"), elem("span", "part-n", "Part " + (index+1)), elem("span", "part-text", part));
    btn.addEventListener("click", () => playList([partClip(line, index)], {mode:"part", key:line.id + "-" + index}));
    parts.append(btn);
  });
  const exercise = byId("line-exercise"), pictures = byId("line-pictures"), mark = byId("mark-area");
  exercise.replaceChildren(); pictures.replaceChildren(); mark.replaceChildren();
  if (line.answer) exercise.append(matching(line));
  if (section.id === "questions") pictures.append(pictureGallery());
  mark.hidden = !isPassage(line);
  if (isPassage(line)) mark.append(markControl(line));
  byId("previous").disabled = line.index === 0;
  byId("next").disabled = line.index === lines.length - 1;
  syncReady();
  media.selectItem(line.id);
  if (updateHash && view === "practice") urlHash(line.id);
  remember();
}
function suspendPlayer() {
  media.suspend();
  byId("media-status").textContent = byId("replay").disabled
    ? "Listen first, then record your turn." : "Play My voice to hear your reading.";
}
function setView(next, updateHash = true) {
  if (!panels[next]) return;
  if (view !== next) {
    stopSequence();
    suspendPlayer();
    document.body.classList.remove("class-mode");
    byId("class-view").setAttribute("aria-pressed","false");
  }
  view = next;
  for (const [name, panel] of Object.entries(panels)) panel.hidden = name !== view;
  for (const btn of all("[data-view]")) btn.setAttribute("aria-pressed", String(btn.dataset.view === view));
  if (updateHash) urlHash(view === "practice" ? selected.id : view === "words" ? "unit-words" : "whole");
}
function openLine(id, bringIntoView = false) {
  stopSequence();
  setView("practice", false);
  showLine(lineMap.get(id));
  if (bringIntoView) byId("study").scrollIntoView({block:"start"});
}
function clearHighlights() {
  for (const el of all(".playing, .whole-row.current")) el.classList.remove("playing","current");
}
function markPlayback(item, follow) {
  clearHighlights();
  if (!item.line) return;
  const row = byId("whole-" + item.line.id);
  row.classList.add("current");
  if (item.index !== undefined) {
    row.querySelector('[data-part="' + item.index + '"]')?.classList.add("playing");
    if (selected.id === item.line.id) {
      byId("current-line").querySelector('[data-part="' + item.index + '"]')?.classList.add("playing");
      byId("parts").querySelector('[data-index="' + item.index + '"]')?.classList.add("playing");
    }
  }
  if (view === "whole" && follow) {
    const bounds = row.getBoundingClientRect();
    if (bounds.top < 60 || bounds.bottom > innerHeight - 24) row.scrollIntoView({block:"center"});
  }
}
function stopSequence(announcement = "") {
  sequence = undefined;
  clearTimeout(timer);
  audio.onended = audio.onerror = audio.onloadedmetadata = null;
  audio.pause();
  clearHighlights();
  byId("playbar").hidden = !announcement;
  byId("stop-sequence").hidden = Boolean(announcement);
  byId("sequence-status").textContent = announcement;
  byId("word-status").textContent = "";
  byId("hear-word").querySelector("span").textContent = "Listen to the word";
}
function partClip(line, index) {
  return {line, index, id: line.parts.length === 1 ? line.id : line.id + "-" + (index + 1)};
}
function source(item, voice) {
  if (item.unitIndex !== undefined) return "../monday-inventions/audio/" + voice + "/word-" + (item.unitIndex+1) + ".mp3";
  return "audio/" + voice + "/" + item.id + ".mp3";
}
function playList(items, options) {
  const same = sequence?.key === options.key;
  stopSequence();
  if (same || !items.length) return;
  suspendPlayer();
  sequence = {items, index:0, ...options};
  step(sequence);
}
function step(run) {
  if (sequence !== run) return;
  const index = run.index, item = run.items[index], voice = preferences.voice;
  const isWord = run.mode === "word";
  const isCurrent = () => sequence === run && run.index === index && preferences.voice === voice;
  if (run.follow && view === "practice" && item.line && selected.id !== item.line.id) showLine(item.line, false);
  markPlayback(item, run.follow && item.line?.id !== run.lastLine);
  run.lastLine = item.line?.id;
  const rate = item.unitIndex === undefined ? 0.86 : 0.70;
  function setRate() {
    audio.preservesPitch = true;
    if ("webkitPreservesPitch" in audio) audio.webkitPreservesPitch = true;
    audio.playbackRate = rate;
  }
  function failed() {
    if (!isCurrent()) return;
    const message = "The recording could not play. Tap Listen to try again.";
    stopSequence(isWord ? "" : message);
    if (isWord) byId("word-status").textContent = message;
  }
  byId("playbar").hidden = isWord;
  byId("stop-sequence").hidden = false;
  if (isWord) {
    byId("hear-word").querySelector("span").textContent = "Stop";
    byId("word-status").textContent = voiceNames[voice] + " · Extra Slow";
  } else {
    const position = item.index === undefined ? "" : " · Part " + (item.index+1) + " of " + item.line.parts.length;
    byId("sequence-status").textContent = voiceNames[voice] + " · " + item.line.section.label + position;
  }
  audio.onended = () => {
    if (!isCurrent()) return;
    if (index + 1 === run.items.length) { stopSequence(); return; }
    run.index++;
    timer = setTimeout(() => step(run), 440);
  };
  audio.onerror = failed;
  audio.onloadedmetadata = setRate;
  audio.src = source(item, voice);
  audio.defaultPlaybackRate = rate;
  setRate();
  audio.play().catch(failed);
}
function playSections(ids, key, includeCaptions = true) {
  const items = lines.filter(line => ids.includes(line.section.id) && (includeCaptions || line.kind !== "caption"))
    .flatMap(line => line.parts.map((_, i) => partClip(line, i)));
  playList(items, {mode:"reading", key, follow:true});
}
function openWord(surface) {
  const info = terms.get(surface.toLowerCase());
  if (!info) return;
  stopSequence();
  suspendPlayer();
  word = {surface, ...info};
  byId("gloss-title").textContent = surface;
  byId("gloss-source").textContent = word.unitIndex === undefined ? "Reading word · Page 61" : "Unit 3B key word · Page 60";
  const meaning = word.entry.meanings?.[surface.toLowerCase()] || word.entry;
  byId("gloss-en").textContent = meaning.en;
  byId("gloss-ar").textContent = meaning.ar;
  byId("gloss").showModal();
}
function playWord() {
  const slug = word.surface.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  playList([{id:"word-" + slug, unitIndex:word.unitIndex}], {mode:"word",key:"dictionary-" + slug});
}
function buildWordList(root, entries) {
  for (const entry of entries) {
    const btn = elem("button","word-card",entry.term);
    btn.type = "button";
    btn.dataset.word = entry.term;
    btn.setAttribute("aria-haspopup", "dialog");
    btn.append(icon("next"));
    root.append(btn);
  }
}
function buildContents() {
  for (const section of sections) {
    const btn = elem("button", "", section.label);
    btn.type = "button";
    btn.dataset.section = section.id;
    btn.addEventListener("click", () => openLine(section.lines[0].id));
    byId("contents").append(btn);
    byId("sections-mobile").append(option(section.label, section.id));
  }
  byId("sections-mobile").addEventListener("change", e => openLine(sectionNames.get(e.target.value).lines[0].id));
}
function buildWhole() {
  for (const section of sections) {
    const block = elem("section", "whole-section");
    const heading = elem("div", "whole-heading"), headingText = elem("h3","",section.label);
    const readSection = action("Listen to section","speaker","text-btn");
    readSection.addEventListener("click", () => playSections([section.id], "section-" + section.id));
    heading.append(headingText, readSection);
    block.append(heading);
    for (const base of section.lines) {
      const line = lineMap.get(base.id);
      const row = elem("div","whole-row");
      row.id = "whole-" + line.id;
      const text = elem("p","whole-line");
      renderText(text, line, "whole-part");
      if (line.kind === "caption") {
        const picture = elem("div","caption-line"), img = elem("img");
        img.src = "images/" + line.image + ".webp"; img.alt = "";
        picture.append(img, text); row.append(picture);
      } else row.append(text);
      const buttons = elem("div","entry-actions");
      const play = action("Listen","speaker","text-btn");
      play.setAttribute("aria-label", "Listen: " + line.parts.join(" "));
      play.addEventListener("click", () => playList([{line,id:line.id}], {mode:"line",key:"line-"+line.id}));
      const practice = action("Practise in parts","next","text-btn");
      practice.addEventListener("click", () => openLine(line.id,true));
      buttons.append(play, practice); row.append(buttons);
      if (line.answer) row.append(matching(line));
      block.append(row);
    }
    if (section.id === "questions") block.append(pictureGallery());
    byId("whole-text").append(block);
  }
}
function syncVoices() {
  for (const btn of all("[data-voice]")) btn.setAttribute("aria-pressed", String(btn.dataset.voice === preferences.voice));
}
function attachEvents() {
  for (const btn of all("[data-view]")) btn.addEventListener("click", () => setView(btn.dataset.view));
  for (const btn of all("[data-voice]")) btn.addEventListener("click", () => {
    const newVoice = btn.dataset.voice;
    if (preferences.voice === newVoice) return;
    preferences.voice = newVoice;
    syncVoices(); remember();
    if (sequence) { clearTimeout(timer); audio.pause(); step(sequence); }
    else media.changeVoice();
  });
  for (const id of ["listen","record","replay"]) byId(id).addEventListener("click", () => stopSequence(), true);
  byId("previous").addEventListener("click", () => openLine(lines[selected.index-1].id));
  byId("next").addEventListener("click", () => openLine(lines[selected.index+1].id));
  byId("ready").addEventListener("click", () => {
    if (ready.has(selected.id)) ready.delete(selected.id); else ready.add(selected.id);
    syncReady(); remember();
  });
  byId("class-view").addEventListener("click", () => {
    const on = document.body.classList.toggle("class-mode");
    byId("class-view").setAttribute("aria-pressed", String(on));
  });
  const playPage = () => playSections(sections.map(s => s.id), "entire-page");
  byId("read-all").addEventListener("click", playPage);
  byId("side-whole").addEventListener("click", () => {setView("whole"); playPage();});
  byId("exam-read").addEventListener("click", () => playSections(["p1","p2"], "evaluation", false));
  byId("play-section").addEventListener("click", () => playSections([selected.section.id], "section-" + selected.section.id));
  byId("stop-sequence").addEventListener("click", () => stopSequence());
  document.addEventListener("click", e => {
    const target = e.target.closest("[data-word]");
    if (target) openWord(target.textContent.trim());
  });
  const gloss = byId("gloss");
  byId("gloss-close").addEventListener("click", () => gloss.close());
  gloss.addEventListener("click", event => {
    const rect = gloss.getBoundingClientRect();
    if (event.target === gloss && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) gloss.close();
  });
  gloss.addEventListener("close", () => stopSequence());
  byId("hear-word").addEventListener("click", playWord);
  window.addEventListener("pagehide", () => stopSequence());
  document.addEventListener("visibilitychange", () => {if (document.hidden) stopSequence();});
}
async function start() {
  const response = await fetch("lesson.json");
  if (!response.ok) throw new Error("Lesson unavailable");
  const lesson = await response.json();
  sections = lesson.sections;
  for (const section of sections) {
    sectionNames.set(section.id, section);
    for (const line of section.lines) {
      const item = {...line, section, index:lines.length};
      lines.push(item); lineMap.set(item.id,item);
    }
  }
  lesson.unitWords.forEach((entry,unitIndex) => terms.set(entry.term,{entry,unitIndex}));
  for (const entry of lesson.readingWords) for (const form of [entry.term,...(entry.forms || [])]) terms.set(form,{entry});
  const forms = [...terms.keys()].sort((a,b) => b.length-a.length);
  // All dictionary forms are English words, spaces or hyphens.
  if (forms.some(form => !/^[a-z -]+$/.test(form))) throw new Error("Invalid dictionary term");
  matcher = new RegExp("\\b(" + forms.join("|") + ")\\b", "gi");
  media = createReadingPlayer(preferences, () => {}, {database:"sakinah-scifi-recordings-v1",timings:false,rates:{extra:0.86}});
  buildContents(); buildWhole();
  buildWordList(byId("unit-words"), lesson.unitWords);
  buildWordList(byId("reading-words"), lesson.readingWords);
  syncVoices(); attachEvents();
  const hash = location.hash.slice(1);
  const first = lineMap.get(hash) || lineMap.get(sectionNames.get(hash)?.lines[0].id) || lineMap.get(saved.line) || lineMap.get("p1a");
  showLine(first, false);
  byId("load-status").hidden = true;
  setView(hash === "whole" ? "whole" : hash === "unit-words" ? "words" : "practice", false);
}
start().catch(() => {
  const msg = byId("load-status");
  msg.hidden = false;
  msg.textContent = "Page 61 could not open. ";
  const retry = action("Try again",null,"text-btn");
  retry.addEventListener("click", () => location.reload());
  msg.append(retry);
});
