function createReadingPlayer(preferences, highlight, options = {}) {
  const byId = id => document.getElementById(id);
  const listen = byId("listen");
  const record = byId("record");
  const replay = byId("replay");
  const message = byId("media-status");
  const clips = new Map();
  const checked = new Set();
  const newestTake = new Map();
  let database;
  let activeId;
  let playback;
  let take;
  let timings = {};

  if (options.timings !== false) fetch("word-starts.json").then(response => response.ok ? response.json() : {}).then(data => { timings = data; }).catch(() => {});

  function openDatabase() {
    if (!database) {
      database = new Promise((resolve, reject) => {
        const request = indexedDB.open(options.database || "sakinah-long-o-recordings-v1", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("readings");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("Recording storage unavailable"));
      });
    }
    return database;
  }
  async function useStore(id, blob) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("readings", blob ? "readwrite" : "readonly");
      const store = tx.objectStore("readings");
      const request = blob ? store.put(blob, id) : store.get(id);
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error || new Error("Storage unavailable"));
    });
  }
  function setButton(button, icon, label) {
    button.querySelector("use").setAttribute("href", "#i-" + icon);
    button.querySelector("span").textContent = label;
  }
  function syncButtons() {
    const modelPlaying = playback?.kind === "line";
    const ownPlaying = playback?.kind === "own";
    setButton(listen, modelPlaying ? "stop" : "speaker", modelPlaying ? "Stop" : "Listen");
    setButton(replay, ownPlaying ? "stop" : "play", ownPlaying ? "Stop" : "My voice");
    replay.disabled = !clips.has(activeId) || Boolean(take);
    const isRecording = take?.recorder?.state === "recording";
    let recordingLabel = clips.has(activeId) ? "Record again" : "Record";
    if (isRecording) {
      const seconds = Math.floor((performance.now() - take.started) / 1000);
      recordingLabel = "Stop · " + Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
    } else if (take) {
      recordingLabel = take.recorder ? "Saving…" : "Cancel";
    }
    setButton(record, take ? "stop" : "mic", recordingLabel);
    record.classList.toggle("recording", Boolean(isRecording));
    record.disabled = Boolean(take?.recorder && !isRecording);
    listen.disabled = Boolean(take);
    document.querySelectorAll("[data-sample]").forEach(button => {
      button.disabled = Boolean(take);
      button.setAttribute("aria-pressed", String(playback?.kind === "sample" && playback.id === button.dataset.sample));
    });
  }
  function usualHint() {
    return clips.has(activeId) ? "Play My voice to hear your reading." : "Listen first, then record your turn.";
  }
  function stopAudio() {
    const old = playback;
    playback = undefined;
    if (old) {
      cancelAnimationFrame(old.frame);
      old.audio.onended = old.audio.onerror = old.audio.onplaying = old.audio.onloadedmetadata = null;
      old.audio.pause();
      old.audio.removeAttribute("src");
      old.audio.load();
      if (old.objectURL) URL.revokeObjectURL(old.objectURL);
    }
    highlight(-1);
    syncButtons();
  }
  function changeRate() {
    if (!playback || playback.kind === "own") return;
    const audio = playback.audio;
    audio.preservesPitch = true;
    if ("webkitPreservesPitch" in audio) audio.webkitPreservesPitch = true;
    audio.playbackRate = options.rates?.[preferences.speed] ?? (preferences.speed === "extra" ? .76 : 1);
  }
  function follow(p) {
    if (playback !== p || !p.tracking) return;
    const starts = timings[p.voice]?.[p.id];
    if (starts) {
      let index = -1;
      while (index + 1 < starts.length && starts[index + 1] <= p.audio.currentTime) index++;
      highlight(index);
    }
    p.frame = requestAnimationFrame(() => follow(p));
  }
  function play(id, kind) {
    if (take) return;
    const same = playback?.id === id && playback.kind === kind;
    stopAudio();
    if (same) { message.textContent = usualHint(); return; }
    const voice = preferences.voice;
    if (kind === "own" && !clips.has(id)) return;
    const audio = new Audio();
    const p = { id, kind, voice, audio, tracking: kind === "line", frame: 0 };
    playback = p;
    if (kind === "own") p.objectURL = URL.createObjectURL(clips.get(id));
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");
    audio.src = p.objectURL || "audio/" + voice + "/" + id + ".mp3";
    changeRate();
    audio.onloadedmetadata = changeRate;
    const finish = failed => {
      if (playback !== p) return;
      stopAudio();
      message.textContent = failed ? "This recording could not play. Tap to try again." : usualHint();
    };
    audio.onended = () => finish(false);
    audio.onerror = () => finish(true);
    audio.onplaying = () => {
      if (playback !== p) return;
      cancelAnimationFrame(p.frame);
      follow(p);
    };
    message.textContent = kind === "own" ? "Playing your reading." : (voice === "bella" ? "Bella" : "Heart") + " is reading" + (kind === "sample" ? " “" + (options.sampleLabel?.(id) || id) + "”." : ".");
    syncButtons();
    audio.play().catch(() => finish(true));
  }
  function changeVoice() {
    if (!playback || playback.kind === "own") return;
    const { id, kind } = playback;
    stopAudio();
    play(id, kind);
  }
  function release(stream) { stream?.getTracks().forEach(track => track.stop()); }
  function stopTake(detach = false) {
    const t = take;
    if (!t) return;
    if (!t.recorder) {
      t.cancelled = true;
      take = undefined;
      message.textContent = usualHint();
    } else if (t.recorder.state !== "inactive") {
      t.recorder.stop();
    }
    if (detach) take = undefined;
    syncButtons();
  }
  async function saveTake(t) {
    clearInterval(t.clock);
    clearTimeout(t.limit);
    release(t.stream);
    if (take === t) take = undefined;
    const blob = new Blob(t.chunks, { type: t.recorder.mimeType || t.chunks[0]?.type });
    if (t.failed || !blob.size || newestTake.get(t.id) !== t) {
      if (t.id === activeId && !take && newestTake.get(t.id) === t) message.textContent = "No audio was captured. Try recording again.";
      syncButtons();
      return;
    }
    clips.set(t.id, blob);
    checked.add(t.id);
    if (t.id === activeId && !take) message.textContent = "Your reading is ready. Tap My voice to listen.";
    syncButtons();
    try { await useStore(t.id, blob); }
    catch {
      if (t.id === activeId && !take && newestTake.get(t.id) === t) message.textContent = "You can replay this recording while this page is open.";
    }
  }
  async function recordReading() {
    if (take) { stopTake(); return; }
    stopAudio();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      message.textContent = "Open this page in Safari or Chrome to use your microphone.";
      return;
    }
    const t = { id: activeId, chunks: [] };
    take = t;
    message.textContent = "Allow microphone access, then read the line aloud.";
    syncButtons();
    try {
      t.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (take !== t || t.cancelled) { release(t.stream); return; }
      const mimeType = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(type => MediaRecorder.isTypeSupported?.(type));
      t.recorder = new MediaRecorder(t.stream, mimeType ? { mimeType } : undefined);
      t.recorder.ondataavailable = event => { if (event.data.size) t.chunks.push(event.data); };
      t.recorder.onerror = () => {
        t.failed = true;
        if (t.recorder.state !== "inactive") t.recorder.stop();
      };
      t.recorder.onstop = () => saveTake(t);
      t.started = performance.now();
      t.recorder.start();
      newestTake.set(t.id, t);
      t.clock = setInterval(() => { if (take === t) syncButtons(); }, 500);
      t.limit = setTimeout(() => { if (take === t) stopTake(); }, 90000);
      message.textContent = "Recording. Read aloud, then tap Stop.";
      syncButtons();
    } catch (error) {
      release(t.stream);
      if (take !== t) return;
      take = undefined;
      message.textContent = error.name === "NotAllowedError"
        ? "Allow the microphone in your browser’s site settings, then tap Record again."
        : "The microphone is unavailable. Check it, then tap Record again.";
      syncButtons();
    }
  }
  async function selectItem(id) {
    stopAudio();
    stopTake(true);
    activeId = id;
    message.textContent = usualHint();
    syncButtons();
    if (checked.has(id)) return;
    try {
      const blob = await useStore(id);
      if (blob?.size && !clips.has(id)) clips.set(id, blob);
    } catch { /* Recording and replay still work in memory. */ }
    checked.add(id);
    if (id === activeId) {
      if (clips.has(id) && !take && !playback && message.textContent === "Listen first, then record your turn.") message.textContent = usualHint();
      syncButtons();
    }
  }
  listen.addEventListener("click", () => play(activeId, "line"));
  replay.addEventListener("click", () => play(activeId, "own"));
  record.addEventListener("click", recordReading);
  function suspend() { stopAudio(); stopTake(true); }
  window.addEventListener("pagehide", suspend);
  document.addEventListener("visibilitychange", () => { if (document.hidden) suspend(); });
  return { selectItem, sample: id => play(id, "sample"), changeVoice, changeRate, suspend };
}
