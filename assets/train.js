"use strict";
const C = window.CURRICULUM;
const KEY = "practiceroom.train.v1";
const $ = s => document.querySelector(s);

let store = {log:{}, day:1};
try{ const r = localStorage.getItem(KEY); if(r) store = Object.assign(store, JSON.parse(r)); }catch(e){}
const persist = () => { try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} };

let focus = null;
try{ const f = localStorage.getItem("practiceroom.focus"); if(f) focus = JSON.parse(f); }catch(e){}
const TRAIT_NAMES = {clarity:"Clarity", presence:"Presence", initiation:"Initiation", flow:"Flow", recovery:"Recovery"};

/* ============================= ANALYSIS ============================= */
const FILLERS = ["you know what i mean","you know","i mean","sort of","kind of","kinda","sorta","um","umm","uh","uhh","er","erm","ah","like","basically","literally","obviously","honestly","anyway","right","yeah","okay so"];
const HEDGES  = ["i think","i guess","i suppose","i feel like","i would say","maybe","perhaps","probably","possibly","hopefully","might","just want","just wanted","just thinking","just wondering","just trying","just checking","just saying","a bit","a little","fairly","somewhat","pretty much","more or less","or something","if that makes sense","kind of like"];
const STOP = new Set("the a an and or but so if then than that this these those i you he she it we they me my your his her its our their am is are was were be been being have has had do does did will would can could should of to in on at for with from as by about into over after not no yes".split(" "));

function analyse(text, secs, target){
  const clean = text.trim().replace(/\s+/g," ");
  const lower = " " + clean.toLowerCase().replace(/[^a-z0-9'\s]/g," ").replace(/\s+/g," ") + " ";
  const words = clean ? clean.split(/\s+/).length : 0;
  const wpm = secs > 0 ? Math.round(words / (secs/60)) : 0;

  const countPhr = list => {
    let n = 0; const hits = [];
    for(const p of list){
      const m = lower.match(new RegExp("(?<=\\s)" + p.replace(/ /g,"\\s+") + "(?=\\s)","g"));
      if(m){ n += m.length; hits.push([p, m.length]); }
    }
    return {n, hits: hits.sort((a,b)=>b[1]-a[1])};
  };
  const F = countPhr(FILLERS), H = countPhr(HEDGES);
  const per100 = c => words ? +(c / words * 100).toFixed(1) : 0;

  const marks = (clean.match(/[.!?]/g) || []).length;
  let sentAvg = null, longest = null;
  if(marks >= 2){
    const ss = clean.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.split(/\s+/).length > 1);
    if(ss.length){
      const lens = ss.map(s=>s.split(/\s+/).length);
      sentAvg = Math.round(lens.reduce((a,b)=>a+b,0) / lens.length);
      longest = Math.max.apply(null, lens);
    }
  }
  const chains = (lower.match(/\s(and|but|so|because|then|which)\s/g) || []).length;
  const chainRate = per100(chains);

  const firstWords = lower.trim().split(" ").slice(0,4).join(" ");
  const weakOpen = FILLERS.concat(HEDGES).some(p => firstWords.startsWith(p + " ") || firstWords === p);

  const freq = {};
  lower.trim().split(" ").forEach(w => { if(w.length > 3 && !STOP.has(w)) freq[w] = (freq[w]||0)+1; });
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0] || null;

  const overrun = target ? Math.round((secs - target) / target * 100) : 0;
  const band = (v, ok, mid) => v <= ok ? "good" : v <= mid ? "warn" : "bad";
  const M = [];

  M.push({k:"Filler rate", v:per100(F.n), u:"per 100 words", b:band(per100(F.n), 2, 5),
    n: F.n === 0 ? "Clean. Nothing to strip out."
     : `${F.n} total${F.hits.length ? " — mostly “" + F.hits[0][0] + "”" : ""}. ${per100(F.n) <= 2 ? "Below the level anyone notices." : per100(F.n) <= 5 ? "Audible, and the first thing to work on." : "This is the dominant texture of the answer."}`});

  M.push({k:"Pace", v:wpm, u:"words / min", b: wpm === 0 ? "flat" : wpm < 110 ? "warn" : wpm <= 155 ? "good" : wpm <= 180 ? "warn" : "bad",
    n: wpm === 0 ? "No timing captured." : wpm < 110 ? "Slow enough that attention drifts. Some of this is thinking-out-loud time."
      : wpm <= 155 ? "In the range that reads as composed." : wpm <= 180 ? "Fast. Fine in a burst, tiring over a minute." : "You're sprinting. The loudest signal of nerves there is."});

  M.push({k:"Hedging", v:per100(H.n), u:"per 100 words", b:band(per100(H.n), 2, 4.5),
    n: H.n === 0 ? "You stated things. Good." : `${H.n} qualifier${H.n===1?"":"s"}${H.hits.length ? " — “" + H.hits[0][0] + "” most" : ""}. ${per100(H.n) <= 2 ? "Normal." : "Each one quietly withdraws the sentence it's in."}`});

  M.push({k:"Length", v:Math.round(secs), u:`sec · target ${target}`, b: !target ? "flat" : Math.abs(overrun) <= 25 ? "good" : Math.abs(overrun) <= 60 ? "warn" : "bad",
    n: !target ? "" : overrun > 25 ? `${overrun}% over. Something in here can go.` : overrun < -25 ? `${Math.abs(overrun)}% under — you stopped before you'd finished the job.` : "Right in the window."});

  if(sentAvg !== null){
    M.push({k:"Sentence length", v:sentAvg, u:`avg · longest ${longest}`, b:band(sentAvg, 18, 26),
      n: sentAvg <= 18 ? "Short and finishable. Easy to follow." : sentAvg <= 26 ? "Getting long. Listeners lose the start of these." : "Too long to hold. Cut them in half at the conjunctions."});
  } else {
    M.push({k:"Run-on chains", v:chainRate, u:"joins / 100 words", b:band(chainRate, 6, 10),
      n: chainRate <= 6 ? "You're closing sentences rather than stringing them." : chainRate <= 10 ? "A fair bit of and-then-and-so. Try full stops." : "Almost everything is one long chain joined by and/so/but."});
  }

  M.push({k:"Words", v:words, u:"total", b:"flat",
    n: top && top[1] >= 4 ? `“${top[0]}” appears ${top[1]} times — worth a synonym.` : "No word overused."});

  const rank = {bad:0, warn:1, good:2, flat:3};
  const worst = M.filter(m => m.b === "bad" || m.b === "warn").sort((a,b) => rank[a.b] - rank[b.b])[0];
  let fixTitle, fixBody;
  if(words < 12){
    fixTitle = "Not enough here to measure.";
    fixBody = "Give it a real attempt — thirty words minimum — and the numbers start meaning something.";
  } else if(weakOpen){
    fixTitle = "Your first four words were filler.";
    fixBody = "Openings are weighted far heavier than the middle. Whatever else you change, make the first sentence land clean — decide it before you start speaking, then say it.";
  } else if(!worst){
    fixTitle = "Nothing to fix in the delivery.";
    fixBody = "Every measurable is in range. The remaining work is content: compare against the model answer below and ask whether yours would actually land on the person it's aimed at.";
  } else {
    const fixes = {
      "Filler rate":["Strip the fillers.","Close your mouth instead of saying the filler. Silence reads as thinking; “um” reads as stalling. This is the fastest-moving number here — do it first."],
      "Pace":[wpm > 155 ? "Slow down." : "Pick it up.", wpm > 155 ? "Put a full one-second silence before each important word. It'll feel theatrical to you and normal to everyone else." : "Some of this gap is you composing mid-sentence. Decide the shape before you open your mouth, then deliver it at pace."],
      "Hedging":["Cut the qualifiers.","Say it, then stop defending it. “I think maybe we should probably” and “we should” carry the same information — one of them sounds like you mean it."],
      "Length":[overrun > 0 ? "Cut it down." : "Finish the job.", overrun > 0 ? "Find the sentence you could delete without losing anything. There's always one, and it's usually the second." : "You landed short — the target isn't arbitrary, it's roughly what the situation needs to be complete."],
      "Sentence length":["Break the sentences.","Full stops where you currently have commas and conjunctions. Long sentences are where listeners lose the thread and where fillers breed."],
      "Run-on chains":["Break the sentences.","You're joining clauses with and/so/but rather than ending them. Full stop, breath, next thought."]
    };
    const f = fixes[worst.k] || ["Work on " + worst.k.toLowerCase() + ".", worst.n];
    fixTitle = f[0]; fixBody = f[1];
  }

  let marked = clean.replace(/</g,"&lt;");
  const wrapPhr = (list, cls) => {
    for(const p of list){
      marked = marked.replace(new RegExp("\\b(" + p.replace(/ /g,"\\s+") + ")\\b","gi"), m => `<mark class="${cls}">${m}</mark>`);
    }
  };
  wrapPhr(HEDGES, "h"); wrapPhr(FILLERS, "");
  marked = marked.replace(/<mark class="">(<mark[^>]*>)/g, "$1").replace(/(<\/mark>)<\/mark>/g, "$1");

  return {M, fixTitle, fixBody, marked, words, wpm, fillerRate:per100(F.n), hedgeRate:per100(H.n), secs:Math.round(secs)};
}

/* ============================= RECORDER ============================= */
let recog=null, mediaRec=null, stream=null, chunks=[], t0=0, tick=null, finalTx="", running=false, audioCtx=null, rafId=null, blobUrl=null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let srDead = false;
const SR_ERR = {
  "no-speech":"Didn't hear anything. Check your system input is the right microphone, then try again \u2014 or just type.",
  "audio-capture":"No microphone found. Something else may be using it, or the wrong input device is selected.",
  "not-allowed":"Microphone blocked. Click the padlock in the address bar and allow the mic for this site.",
  "service-not-allowed":"Your browser refused the speech service \u2014 often a privacy setting, or a Chromium build without Google speech. Typing still works.",
  "network":"Speech-to-text needs the internet and the request failed. It runs on Google's servers, so a VPN, firewall or blocker can stop it.",
  "aborted":"Listening stopped.",
  "language-not-supported":"Your browser's language isn't supported for speech. Type instead.",
  "bad-grammar":"Speech recogniser rejected the request. Type instead."
};
const SR_FATAL = ["not-allowed","service-not-allowed","audio-capture","network","language-not-supported","bad-grammar"];

const fmt = s => Math.floor(s/60) + ":" + String(Math.floor(s%60)).padStart(2,"0");

/* ---- phone transcription ----
   Live speech recognition does not work on phones: on iOS every browser is
   WebKit underneath and the recogniser is unreliable, so the transcript box
   stays empty and there is nothing to score. We already record the audio for
   playback, so on a phone we send that same recording to Whisper instead. */
const IS_IOS_T = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                 (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_MOBILE_T = IS_IOS_T || /Android|Mobile/i.test(navigator.userAgent);
const STT_KEY_T = "practiceroom.sttkey";

function sttKey(){
  try{
    const k = localStorage.getItem(STT_KEY_T);
    if(k) return k;
    const rp = JSON.parse(localStorage.getItem("practiceroom.llm") || "null");
    if(rp && rp.p === "groq" && rp.k) return rp.k;
  }catch(e){}
  return null;
}

/* Asking on the page beats sending someone to a different page to find a box. */
function askForKey(){
  if(document.getElementById("keyask")) return;
  const wrap = document.createElement("div");
  wrap.id = "keyask";
  wrap.style.cssText = "margin-top:14px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--inset)";
  wrap.innerHTML =
    '<p style="font-size:.93rem;margin-bottom:9px">Phones can\'t write out speech on their own, so the recording goes to Whisper to be transcribed. ' +
    'Groq hosts it free — paste a key from <strong>console.groq.com/keys</strong> and this works everywhere on the site. It stays in this browser.</p>' +
    '<input id="kf" type="password" placeholder="gsk_..." style="width:100%;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink);font:inherit;margin-bottom:8px">' +
    '<button class="btn" id="kfs">Save the key</button>';
  $("#ta").parentNode.appendChild(wrap);
  document.getElementById("kfs").addEventListener("click", () => {
    const v = document.getElementById("kf").value.trim();
    if(!v) return;
    try{ localStorage.setItem(STT_KEY_T, v); }catch(e){}
    wrap.remove();
    $("#hint").textContent = "Saved. Record again and it will be written out for you.";
  });
}

async function whisper(blob){
  const key = sttKey();
  if(!key){ askForKey(); return; }
  if(!blob || blob.size < 1200){
    $("#hint").textContent = "That recording was too short to transcribe. Try again, or type what you said.";
    return;
  }
  $("#hint").textContent = "Transcribing…";
  const fd = new FormData();
  fd.append("file", blob, blob.type.includes("mp4") ? "line.m4a" : "line.webm");
  fd.append("model", "whisper-large-v3-turbo");
  fd.append("response_format", "json");
  try{
    const r = await fetch("https://api.groq.com/openai/v1/audio/transcriptions",
      {method:"POST", headers:{Authorization:"Bearer " + key}, body: fd});
    if(!r.ok){
      $("#hint").textContent = "Transcription failed (" + r.status + "): " + (await r.text()).slice(0,140) + " — type what you said instead.";
      return;
    }
    const j = await r.json();
    const text = (j.text || "").trim();
    if(!text){ $("#hint").textContent = "Nothing was heard in that recording. Try again, or type it."; return; }
    $("#ta").value = text;
    $("#hint").textContent = "Done. Check it reads right, then score it.";
  }catch(e){
    $("#hint").textContent = "Couldn't reach the transcription service (" + (e.message||e) + "). Type what you said instead.";
  }
}

async function startRec(){
  finalTx = ""; chunks = []; t0 = Date.now(); running = true; srDead = false;
  const btn = $("#miq"); btn.classList.add("live"); btn.setAttribute("aria-label","Stop recording");
  $("#hint").textContent = (SR && !IS_MOBILE_T) ? "Listening — speak your answer, then press stop."
    : IS_MOBILE_T ? "Recording. Press stop when you're done and it will be written out for you."
    : "Recording. Your browser can't transcribe, so type the gist below as you go.";
  tick = setInterval(() => { $("#clocknum").textContent = fmt((Date.now()-t0)/1000); }, 200);

  try{
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
    mediaRec = new MediaRecorder(stream);
    mediaRec.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
    mediaRec.start();
    meterOn(stream);
  }catch(e){ $("#hint").textContent = "No mic access — type your answer instead, then press stop."; }

  if(SR && !IS_MOBILE_T){
    try{
      recog = new SR();
      recog.continuous = true; recog.interimResults = true; recog.lang = navigator.language || "en-US";
      recog.onresult = ev => {
        let interim = "";
        for(let i = ev.resultIndex; i < ev.results.length; i++){
          const r = ev.results[i];
          if(r.isFinal) finalTx += r[0].transcript + " "; else interim += r[0].transcript;
        }
        $("#ta").value = (finalTx + interim).replace(/\s+/g," ").trim();
      };
      recog.onerror = ev => {
        const code = ev.error || "unknown";
        $("#hint").textContent = SR_ERR[code] || `Speech recognition failed (${code}). Type your answer instead.`;
        if(SR_FATAL.indexOf(code) !== -1){ srDead = true; try{ recog.onend = null; recog.stop(); }catch(e){} }
      };
      recog.onend = () => { if(running && !srDead) try{ recog.start(); }catch(e){ srDead = true; } };
      recog.start();
    }catch(e){}
  }
}

function meterOn(s){
  try{
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(s), an = audioCtx.createAnalyser();
    an.fftSize = 64; src.connect(an);
    const buf = new Uint8Array(an.frequencyBinCount), bars = $("#lvl").children;
    (function loop(){
      an.getByteFrequencyData(buf);
      for(let i = 0; i < bars.length; i++) bars[i].style.height = Math.max(3, (buf[i*2]||0)/255*26) + "px";
      rafId = requestAnimationFrame(loop);
    })();
  }catch(e){}
}

function stopRec(){
  running = false;
  clearInterval(tick); cancelAnimationFrame(rafId);
  const btn = $("#miq"); btn.classList.remove("live"); btn.setAttribute("aria-label","Start recording");
  if(recog) try{ recog.stop(); }catch(e){}
  if(mediaRec && mediaRec.state !== "inactive"){
    mediaRec.onstop = () => {
      if(chunks.length){
        if(blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(new Blob(chunks, {type: mediaRec.mimeType || "audio/webm"}));
        $("#play").innerHTML = "";
        const a = document.createElement("audio"); a.controls = true; a.src = blobUrl;
        $("#play").appendChild(a);
        if(IS_MOBILE_T && !$("#ta").value.trim()) whisper(new Blob(chunks, {type: mediaRec.mimeType || "audio/webm"}));
      }
    };
    try{ mediaRec.stop(); }catch(e){}
  }
  if(stream) stream.getTracks().forEach(t => t.stop());
  if(audioCtx) try{ audioCtx.close(); }catch(e){}
  for(const b of $("#lvl").children) b.style.height = "3px";
  const secs = (Date.now()-t0)/1000;
  $("#hint").textContent = "Done. Check it reads right, then score it.";
  $("#score").disabled = false;
  $("#score").dataset.secs = secs.toFixed(1);
}

/* ============================= RENDER ============================= */
function renderRail(){
  const r = $("#rail"); r.innerHTML = "";
  const names = {1:"Week 1 · Clarity", 2:"Week 2 · Presence", 3:"Week 3 · Story", 4:"Week 4 · Pressure"};
  for(let w = 1; w <= 4; w++){
    const g = document.createElement("div"); g.className = "rail-wk";
    g.innerHTML = `<span class="mono">${names[w]}</span><div class="rail-days"></div>`;
    const box = g.querySelector(".rail-days");
    C.filter(d => d.w === w).forEach(d => {
      const b = document.createElement("button");
      b.className = "rd" + (store.log[d.d] ? " done" : "") + (d.d === store.day ? " now" : "");
      b.dataset.n = d.d;
      b.innerHTML = `<span class="pip"></span><span class="lbl">${d.d}. ${d.title}</span>`;
      b.title = "Day " + d.d + " — " + d.title;
      if(d.d === store.day) b.setAttribute("aria-current","true");
      b.addEventListener("click", () => { store.day = d.d; persist(); render(); window.scrollTo({top:0}); });
      box.appendChild(b);
    });
    r.appendChild(g);
  }
  $("#streak").textContent = Object.keys(store.log).length + " / 28 done";
}

function sparkline(){
  const days = Object.keys(store.log).map(Number).sort((a,b)=>a-b).filter(d => store.log[d].fillerRate !== undefined);
  if(days.length < 2) return "";
  const vals = days.map(d => store.log[d].fillerRate);
  const max = Math.max(6, Math.max.apply(null, vals)), W = 100, H = 40;
  const pts = vals.map((v,i) => [ i/(days.length-1)*W, H - (v/max)*H ]);
  const path = pts.map((p,i) => (i?"L":"M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length-1];
  const trend = vals[vals.length-1] - vals[0];
  return `<div class="card spark">
    <h4 class="serif">Filler rate over time</h4>
    <p class="sub">${days.length} sessions logged · ${trend < -0.3 ? "trending down, which is the whole point" : trend > 0.3 ? "trending up — check whether you're attempting harder days" : "roughly flat so far"}</p>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Filler rate across ${days.length} sessions">
      <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="var(--line)" stroke-width=".6" vector-effect="non-scaling-stroke"/>
      <path d="${path} L${W} ${H} L0 ${H} Z" fill="var(--accent-soft)"/>
      <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.4" fill="var(--accent)" vector-effect="non-scaling-stroke"/>
    </svg>
  </div>`;
}

function render(){
  const d = C.find(x => x.d === store.day);
  const prev = store.log[d.d];
  const catLabel = d.cat === "work" ? "Workplace" : d.cat === "social" ? "Social" : "Review";

  $("#main").innerHTML = `
    <div class="day">
      <div class="day-head">
        <span class="mono daynum">Day ${d.d} of 28</span>
        <span class="chip ${d.cat}">${catLabel}</span>
      </div>
      <h1 class="serif">${d.title}</h1>

      ${focus ? `<p class="focusnote">Your assessment put <strong>${focus.map(f=>TRAIT_NAMES[f]).join("</strong> and <strong>")}</strong> as your focus areas. Watch those in particular today.</p>` : ""}

      <div class="card">
        <p class="brief">${d.brief}</p>
        <div class="tgt"><span class="mono">Target</span><p>${d.target}</p></div>
        <ul class="tips">${d.tips.map(t => `<li><span>${t}</span></li>`).join("")}</ul>
      </div>

      <div class="rec">
        <div class="rec-top">
          <button class="miq" id="miq" aria-label="Start recording">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2Z"/></svg>
          </button>
          <div class="rec-meta">
            <div class="clock"><span id="clocknum">0:00</span> <small>/ ${fmt(d.secs)} target</small></div>
            <div class="rec-hint" id="hint">Press the mic and say your answer out loud. Typing works too.</div>
          </div>
          <div class="lvl" id="lvl" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
        </div>
        <label class="sr" for="ta">Your answer</label>
        <textarea class="ta" id="ta" placeholder="Your words appear here as you speak — or type them if you'd rather."></textarea>
        <div class="rec-foot">
          <button class="btn" id="score" disabled>Score it</button>
          <button class="btn ghost" id="manual">Score what I typed</button>
          <span id="play"></span>
        </div>
      </div>

      <div id="out"></div>

      <details class="model">
        <summary>Show a model answer</summary>
        <div class="mbody">
          <p>${d.model}</p>
          <p class="cap">Not a script to memorise — a shape. Notice where it starts, what it leaves out, and where it stops.</p>
        </div>
      </details>

      <div class="nav">
        <button class="btn ghost" id="prev" ${d.d === 1 ? "disabled" : ""}>← ${d.d === 1 ? "Start" : "Day " + (d.d-1)}</button>
        <button class="btn ghost" id="next" ${d.d === 28 ? "disabled" : ""}>${d.d === 28 ? "Last day" : "Day " + (d.d+1)} →</button>
      </div>

      ${sparkline()}

      <p class="disc">Everything runs in your browser. Audio is never uploaded and never saved — it exists until you leave the page. Transcripts and scores are stored on this device only.</p>
    </div>`;

  $("#miq").addEventListener("click", () => running ? stopRec() : startRec());
  $("#score").addEventListener("click", () => doScore(+$("#score").dataset.secs || 0, d));
  $("#manual").addEventListener("click", () => {
    const w = $("#ta").value.trim().split(/\s+/).filter(Boolean).length;
    doScore(w / 2.4, d);
  });
  $("#prev").addEventListener("click", () => { store.day--; persist(); render(); window.scrollTo({top:0}); });
  $("#next").addEventListener("click", () => { store.day++; persist(); render(); window.scrollTo({top:0}); });

  if(prev){
    $("#ta").value = prev.transcript || "";
    $("#hint").textContent = "You've done this day before. Beat your last filler rate of " + prev.fillerRate + ".";
  }
  renderRail();
}

function doScore(secs, d){
  const text = $("#ta").value;
  if(!text.trim()){ $("#hint").textContent = "Nothing to score yet — speak or type an answer first."; return; }
  const a = analyse(text, secs, d.secs);
  const cmp = store.log[d.d];
  store.log[d.d] = {wpm:a.wpm, fillerRate:a.fillerRate, hedgeRate:a.hedgeRate, words:a.words, secs:a.secs, transcript:text.trim(), at:Date.now()};
  persist();

  const delta = cmp ? (a.fillerRate - cmp.fillerRate) : null;
  $("#out").innerHTML = `
    <div class="grid">${a.M.map(m => `
      <div class="stat ${m.b}">
        <div class="k">${m.k}</div>
        <div class="v">${m.v}${m.u ? ` <u>${m.u}</u>` : ""}</div>
        <div class="n">${m.n}</div>
      </div>`).join("")}
    </div>
    <div class="card verdict">
      <span class="mono">The one thing to change</span>
      <h3 class="serif">${a.fixTitle}</h3>
      <p>${a.fixBody}</p>
      ${delta !== null ? `<p class="delta"><strong>Against your last attempt:</strong> filler rate ${delta < 0 ? "down" : delta > 0 ? "up" : "unchanged at"} ${Math.abs(delta).toFixed(1)}${delta === 0 ? "" : " per 100 words"}.</p>` : ""}
    </div>
    <div class="tscript"><span class="mono">Your answer · fillers in red, hedges in amber</span>${a.marked}</div>`;
  renderRail();
  $("#out").scrollIntoView({block:"start", behavior:"smooth"});
}

render();
