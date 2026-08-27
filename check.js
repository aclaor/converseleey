"use strict";

const TRAITS = {
  clarity:   {name:"Clarity",    blurb:"Turning a thought into a finished sentence, on demand"},
  presence:  {name:"Presence",   blurb:"What your voice and body do while you're speaking"},
  initiation:{name:"Initiation", blurb:"Opening a conversation nobody handed to you"},
  flow:      {name:"Flow",       blurb:"Keeping it alive past the first exchange"},
  recovery:  {name:"Recovery",   blurb:"What happens after something lands badly"}
};

/* score 3 = strongest, 0 = weakest */
const Q = [
  {t:"clarity", q:"Someone asks you a question you weren't expecting. What happens in the first three seconds?",
   a:[["I take a breath and open with a clear first sentence",3],["I start talking and find the point somewhere in the middle",2],["I fill the gap — \"um, so, like, yeah\" — while I catch up",1],["I go blank and hear myself saying something I don't mean",0]]},
  {t:"clarity", q:"When you finish explaining something, how often does the other person actually look like they got it?",
   a:[["Almost always",3],["Usually",2],["About half the time",1],["I often have to start the whole thing over",0]]},
  {t:"clarity", q:"Your sentences when you're nervous:",
   a:[["Short, and I finish them",3],["A bit longer than usual but fine",2],["They run on and loop back on themselves",1],["They trail off and I let someone else finish them",0]]},
  {t:"clarity", q:"You know exactly the word you want and it won't come out.",
   a:[["Rarely — and I just use a different word",3],["Sometimes, and I move past it",2],["Most conversations",1],["Constantly, and it derails what I was saying",0]]},

  {t:"presence", q:"While you are the one talking, where are your eyes?",
   a:[["On them, comfortably, breaking away naturally",3],["On them, though I have to remind myself",2],["Mostly past them — a shoulder, the wall, my drink",1],["Down. I look up to check if they're still listening",0]]},
  {t:"presence", q:"How often does someone ask you to repeat yourself because they didn't hear you?",
   a:[["Basically never",3],["Once in a while, in loud rooms",2],["Often enough that I've noticed",1],["Constantly — I've started pre-emptively repeating myself",0]]},
  {t:"presence", q:"Your speaking pace when the stakes go up:",
   a:[["Slows down, if anything. I use pauses on purpose",3],["Stays roughly where it always is",2],["Speeds up — I'm trying to get it over with",1],["Sprints. People tell me to slow down",0]]},
  {t:"presence", q:"What are your hands and body doing in a conversation you're anxious about?",
   a:[["Open, still, gesturing when it helps",3],["A bit stiff but nothing anyone would notice",2],["Crossed, pocketed, or holding something like a shield",1],["Fidgeting in a way I catch myself doing and can't stop",0]]},

  {t:"initiation", q:"You're at an event where you know one person and they've walked off. What do you do?",
   a:[["Pick someone standing alone and open with something about the room",3],["Wait a beat, then talk to whoever's nearest",2],["Get a drink, check my phone, hope someone opens with me",1],["Find a wall, or leave early",0]]},
  {t:"initiation", q:"A group of three is mid-conversation and you want in.",
   a:[["Stand at the edge, listen, add something when there's a gap",3],["Wait for someone to notice me and widen the circle",2],["Hover until it feels too late, then walk away",1],["I wouldn't attempt it",0]]},
  {t:"initiation", q:"Someone across the room you'd genuinely like to talk to. No one can introduce you.",
   a:[["I go over. Worst case is a short conversation",3],["I look for a natural excuse — the queue, the food table",2],["I plan an opener for twenty minutes and don't use it",1],["I don't. I think about it later",0]]},
  {t:"initiation", q:"You met someone once and it went well. Who messages first?",
   a:[["Me, within a day or two, about something specific we talked about",3],["Me, eventually, after some drafting",2],["Them, or nobody",1],["Nobody. I assume they weren't that interested",0]]},

  {t:"flow", q:"They answer your question. Then what?",
   a:[["I ask about the most interesting thing they just said",3],["I relate it to something of mine, then hand it back",2],["I move to my next prepared question",1],["I say \"oh nice\" and the conversation stops there",0]]},
  {t:"flow", q:"A silence lands in the middle of a conversation.",
   a:[["I let it sit. Silences are fine",3],["I let it sit a second, then pick a thread back up",2],["I panic-fill it with anything",1],["I take it as the signal to leave",0]]},
  {t:"flow", q:"In a good conversation with someone new, who's doing the work?",
   a:[["Roughly even, and it shifts back and forth",3],["Me, mostly, but I don't mind",2],["Them — I answer, they carry it",1],["It's an interview and I'm not sure which of us is the interviewer",0]]},
  {t:"flow", q:"You run into someone you talked to a month ago.",
   a:[["I remember what they were working on and ask about it",3],["I remember the vibe, not the details",2],["I remember their face and nothing else",1],["I hope they speak first so I can work out who they are",0]]},

  {t:"recovery", q:"You make a joke and it lands flat.",
   a:[["I acknowledge it, laugh, and move on",3],["I move on quickly and it's forgotten in a minute",2],["I over-explain the joke, which makes it worse",1],["I go quiet for the rest of the conversation",0]]},
  {t:"recovery", q:"Someone turns you down — a plan, a date, an ask.",
   a:[["Fine. It's information, not a verdict",3],["Stings for an hour, then it's gone",2],["I take it as evidence about me and it colours the week",1],["I stop initiating for a while afterwards",0]]},
  {t:"recovery", q:"After a conversation you weren't happy with, how long do you replay it?",
   a:[["I basically don't",3],["A few minutes on the way home",2],["That night, in detail, more than once",1],["Weeks. I still have some from years ago",0]]},
  {t:"recovery", q:"The day after a bad social experience, what do you do?",
   a:[["Deliberately put myself in another one, sooner rather than later",3],["Carry on as normal",2],["Keep a low profile for a few days",1],["Cancel the next thing I'd agreed to",0]]}
];

const BEATS = {
  5:{eyebrow:"A quarter in", big:"Clarity is a mechanical skill, not a personality trait.",
     body:"The people who sound articulate under pressure aren't thinking faster than you. They've practised a first sentence that buys them three seconds. That's the whole trick, and it's trainable in a week."},
  10:{eyebrow:"Halfway", big:"Nobody is watching you as closely as you think.",
      body:"The pause you agonised over was, to everyone else in the room, a pause. This isn't a pep talk — it's the most common gap between how a conversation felt to you and how it actually went."},
  15:{eyebrow:"Last stretch", big:"The hard part is rarely the opening line.",
      body:"Most people who call themselves bad at conversation can open fine. What they can't do is take what someone just said and pull the next thread out of it. Five questions left."}
};

const DRILLS = {
  clarity:[
    {n:"The one-breath answer", p:"Pick a question you get asked often — what you do, how your weekend was. Answer it out loud in one breath, then stop. Ten times, cutting a word each round until it's a single clean sentence.", w:"Rambling is almost always a symptom of starting to speak before you've chosen an ending."},
    {n:"Name the shape first", p:"Before you explain anything longer than a sentence, say the shape out loud: “Two things.” “Short version first.” “There's some background, then the point.” Then deliver it.", w:"It buys you three seconds of thinking time, and the listener hears structure instead of hesitation."},
    {n:"Replace the filler with nothing", p:"For one day, every time you'd say um, so, or like, close your mouth instead. Record a two-minute voice memo describing your day and count them. Repeat tomorrow.", w:"You can't remove a habit you can't hear. Counting is most of the fix."}
  ],
  presence:[
    {n:"Finish your sentence on their face", p:"You're allowed to look away while you think. But land the last four words of every sentence looking directly at the person. Nothing else changes.", w:"Eye contact at the end reads as conviction. Eye contact throughout is exhausting and unnecessary."},
    {n:"Speak to the wall behind them", p:"Aim your volume at a point two metres past the person you're talking to. It'll feel too loud. It won't be.", w:"Quiet speech gets read as uncertainty about the content, not about the volume."},
    {n:"The deliberate pause", p:"Three times a day, put a full one-second silence in the middle of a sentence — before the important word. Count it. Nobody will mention it.", w:"Slowing down is the closest thing to a cheat code for sounding composed."}
  ],
  initiation:[
    {n:"Three openers a day, low stakes", p:"Baristas, lift rides, the person next to you in a queue. One line about the shared situation, then let it end. The goal isn't a conversation — it's the opening itself.", w:"You're not practising charm. You're wearing down the alarm that fires before you speak."},
    {n:"The three-second rule", p:"When you notice the impulse to say something to someone, you have three seconds. After that the reasons not to arrive, and they always win.", w:"The hesitation isn't gathering information. It's building a case."},
    {n:"Message first, once a day", p:"One person, once a day, first contact from you. Reference something specific they said. No “hey” with nothing after it.", w:"Initiation atrophies fastest in text, where the cost of not sending is zero."}
  ],
  flow:[
    {n:"Last word, next question", p:"Take the most specific noun in what they just said and ask about that. They said “we drove back from Penang” — you ask about the drive, not about Penang.", w:"This one habit carries a conversation twenty minutes further than any list of questions."},
    {n:"Two-sentence rule", p:"When you answer a question, give two sentences: the answer, and one detail they could grab onto. Then stop.", w:"One-word answers make the other person do all the work. Five sentences make them wait."},
    {n:"Write down one thing", p:"After meeting someone, note one fact in your phone within ten minutes. What they're working on, where they're going, what they're annoyed about.", w:"Remembering isn't a memory skill. It's a note-taking skill, and it's the highest-return thing here."}
  ],
  recovery:[
    {n:"Say the awkward thing out loud", p:"When something lands badly, name it lightly and move: “That was a terrible joke.” “That came out wrong.” Then continue the sentence you were on.", w:"Acknowledged awkwardness dissolves. Unacknowledged awkwardness sits in the room and grows."},
    {n:"The ten-minute window", p:"You get ten minutes to replay a bad conversation. Set a timer. When it goes, you're done, and you write one line: what you'd do differently.", w:"Past ten minutes, rumination stops producing information and starts producing evidence against yourself."},
    {n:"Re-enter fast", p:"After anything that went badly, put yourself in a low-stakes social situation within 24 hours. It doesn't need to go well. It needs to happen.", w:"Avoidance is what turns one bad conversation into six months of them."}
  ]
};

const PLANS = {
  clarity:"Recording yourself. Two minutes a day, out loud, on any topic — then listen back once.",
  presence:"Volume and pace. One conversation a day where you deliberately speak slower and louder than feels right.",
  initiation:"Reps. Three low-stakes openers a day, tracked. The number is the point, not the outcome.",
  flow:"Follow-ups. In every conversation, ask one question that comes directly out of their last sentence.",
  recovery:"The ten-minute timer, and re-entering within 24 hours of anything that stings."
};

/* ---------------- state ---------------- */
const KEY = "practiceroom.check.v1";
let answers = new Array(Q.length).fill(null);
let idx = 0;

const $ = id => document.getElementById(id);
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify({answers, idx})); }catch(e){} };
const load = () => { try{ const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; }catch(e){ return null; } };

const screens = ["s-intro","s-q","s-beat","s-res"];
function show(id){
  screens.forEach(s => $(s).classList.toggle("live", s === id));
  window.scrollTo({top:0, behavior:"instant"});
}

/* ---------------- meter ---------------- */
const meter = $("meter");
Q.forEach(() => { const d = document.createElement("div"); d.className = "seg"; meter.appendChild(d); });
function paintMeter(){
  const segs = meter.children;
  for(let i = 0; i < segs.length; i++){
    segs[i].className = "seg" + (answers[i] !== null ? " on" : (i === idx ? " cur" : ""));
  }
  $("count").textContent = answers.filter(a => a !== null).length + " / " + Q.length;
}

/* ---------------- question flow ---------------- */
function renderQ(){
  const q = Q[idx];
  $("qnum").textContent = "Question " + (idx+1) + " of " + Q.length + " · " + TRAITS[q.t].name;
  $("qtext").textContent = q.q;
  const box = $("opts");
  box.innerHTML = "";
  q.a.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "opt" + (answers[idx] === i ? " picked" : "");
    b.innerHTML = '<span class="dot"></span>';
    const s = document.createElement("span"); s.textContent = opt[0];
    b.appendChild(s);
    b.addEventListener("click", () => pick(i));
    box.appendChild(b);
  });
  $("back").style.visibility = idx === 0 ? "hidden" : "visible";
  paintMeter();
  show("s-q");
}

function pick(i){
  answers[idx] = i; save();
  const opts = $("opts").children;
  for(let k = 0; k < opts.length; k++) opts[k].classList.toggle("picked", k === i);
  paintMeter();
  setTimeout(advance, 220);
}

function advance(){
  const next = idx + 1;
  if(BEATS[next] && next < Q.length){
    const b = BEATS[next];
    $("beat-eyebrow").textContent = b.eyebrow;
    $("beat-big").textContent = b.big;
    $("beat-body").textContent = b.body;
    idx = next; save(); paintMeter(); show("s-beat"); return;
  }
  if(next >= Q.length){ idx = Q.length - 1; save(); renderResults(); return; }
  idx = next; save(); renderQ();
}

/* ---------------- scoring ---------------- */
function scores(){
  const out = {};
  for(const k in TRAITS) out[k] = {sum:0, max:0};
  Q.forEach((q, i) => {
    out[q.t].max += 3;
    if(answers[i] !== null) out[q.t].sum += q.a[answers[i]][1];
  });
  for(const k in out) out[k].pct = Math.round(out[k].sum / out[k].max * 100);
  return out;
}
const band = p => p >= 67 ? "good" : p >= 34 ? "warn" : "bad";
const bandLabel = {good:"Strength", warn:"Workable", bad:"Focus here"};
const bandNote = {
  good:"Already carrying you. Protect it — don't spend practice time here.",
  warn:"Functional but inconsistent. Holds up until the stakes rise, then it doesn't.",
  bad:"Where most of the friction is coming from. Start here."
};

function renderResults(){
  const s = scores();
  const ranked = Object.keys(s).sort((a,b) => s[a].pct - s[b].pct);
  const focus = ranked.slice(0,2);
  const strength = ranked[ranked.length-1];
  const overall = Math.round(Object.keys(s).reduce((t,k) => t + s[k].pct, 0) / 5);

  try{ localStorage.setItem("practiceroom.focus", JSON.stringify(focus)); }catch(e){}

  const headline = overall >= 70 ? "You're better at this than you think — with two specific holes."
    : overall >= 45 ? "Solid foundations, two weak spots doing most of the damage."
    : "Nearly everything you're avoiding traces back to two things.";

  const rows = ranked.map(k => {
    const b = band(s[k].pct);
    return `<div class="row">
      <div class="row-top">
        <div class="row-name">${TRAITS[k].name} <span class="chip ${b}">${bandLabel[b]}</span></div>
        <div class="row-val">${s[k].pct}<span style="opacity:.5">%</span></div>
      </div>
      <div class="bar2"><div class="fill ${b}" data-w="${s[k].pct}"></div></div>
      <div class="row-note">${bandNote[b]}</div>
    </div>`;
  }).join("");

  const drillCards = focus.flatMap(k =>
    DRILLS[k].map(d => `<div class="card drill">
      <span class="for">${TRAITS[k].name}</span>
      <h3>${d.n}</h3>
      <p>${d.p}</p>
      <p class="why">${d.w}</p>
    </div>`)
  ).join("");

  const f0 = TRAITS[focus[0]].name, f1 = TRAITS[focus[1]].name;
  const weeks = [
    ["Week 1", `${f0} only`, `Run the three ${f0.toLowerCase()} drills daily, alongside Days 1–7 of the programme. Don't touch anything else — splitting attention across five areas is why most of this never sticks.`],
    ["Week 2", `${f0}, unrehearsed`, `Same drills, but in conversations you didn't plan for. Expect it to feel worse than week one. That's the point where it's actually loading.`],
    ["Week 3", `Add ${f1}`, `Keep one ${f0.toLowerCase()} drill ticking over and put the weight on ${f1.toLowerCase()}. Two at once is the maximum.`],
    ["Week 4", "Retake this", `Answer these twenty questions again without looking at today's results. Compare. If ${f0.toLowerCase()} hasn't moved, the drill was too comfortable.`]
  ].map(([n,h,p]) => `<div class="week-n">${n}</div><div class="week-b"><h4>${h}</h4><p>${p}</p></div>`).join("");

  const strongCopy = band(s[strength].pct) === "bad"
    ? `<strong>Nothing here is carrying you yet (best: ${TRAITS[strength].name}, ${s[strength].pct}%).</strong> That sounds worse than it is — a flat low profile usually means avoidance rather than five separately broken skills, and it moves faster than a lopsided one. Ignore three of these and work the bottom two.`
    : `<strong>${TRAITS[strength].name} is your strongest channel (${s[strength].pct}%).</strong> ${TRAITS[strength].blurb.charAt(0).toLowerCase() + TRAITS[strength].blurb.slice(1)} — you don't need to work on it, and you should lean on it while the other two are under construction.`;

  $("s-res").innerHTML = `
    <div class="res-head">
      <span class="mono eyebrow">Your result · ${new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"})}</span>
      <h1 class="serif">${headline}</h1>
      <p>Overall you scored <strong>${overall}%</strong>. That number matters far less than the spread below it — a flat 60 across the board is a very different problem from a 90 and a 25.</p>
    </div>

    <div class="card scorecard">${rows}</div>

    <div class="sec">
      <h2 class="serif">What this actually says</h2>
      <p class="sub">Read this before the drills.</p>
      <div class="card">
        <p>${strongCopy}</p>
        <p style="margin-top:12px; color:var(--ink-2)">Your two focus areas are <strong>${f0}</strong> (${s[focus[0]].pct}%) and <strong>${f1}</strong> (${s[focus[1]].pct}%). ${PLANS[focus[0]]}</p>
      </div>
    </div>

    <div class="sec">
      <h2 class="serif">Six drills</h2>
      <p class="sub">Only for your two weakest areas. The rest are deliberately not here.</p>
      ${drillCards}
    </div>

    <div class="sec">
      <h2 class="serif">Four weeks</h2>
      <p class="sub">In order — each week assumes the one before it happened.</p>
      <div class="week">${weeks}</div>
    </div>

    <div class="sec next">
      <div class="card">
        <span class="mono" style="color:var(--accent)">Next</span>
        <h2 class="serif" style="margin:8px 0 10px">Now go and say it out loud.</h2>
        <p style="color:var(--ink-2)">The plan above is what to work on. The 28 days is where you actually do it — one scenario a day, spoken, measured. Day 1 takes about three minutes.</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:18px">
          <a class="btn" href="train.html">Open Day 1</a>
          <button class="btn ghost" id="print">Save as PDF</button>
          <button class="btn ghost" id="again">Start over</button>
        </div>
      </div>
    </div>

    <p class="disc">This is a structured self-reflection tool, not a clinical or psychometric assessment. If social anxiety is significantly affecting your work, relationships, or daily life, a therapist will get you further than any drill list — CBT in particular has strong evidence behind it for exactly this.</p>`;

  show("s-res");
  requestAnimationFrame(() => {
    document.querySelectorAll("#s-res .fill").forEach(f => { f.style.width = f.dataset.w + "%"; });
  });
  $("print").addEventListener("click", () => window.print());
  $("again").addEventListener("click", () => { answers = new Array(Q.length).fill(null); idx = 0; save(); renderQ(); });
  paintMeter();
}

/* ---------------- boot ---------------- */
$("beat-next").addEventListener("click", renderQ);
$("back").addEventListener("click", () => { if(idx > 0){ idx--; save(); renderQ(); } });
$("begin").addEventListener("click", () => { answers = new Array(Q.length).fill(null); idx = 0; save(); renderQ(); });
$("resume").addEventListener("click", () => { answers.every(a => a !== null) ? renderResults() : renderQ(); });

(function(){
  const st = load();
  if(st && Array.isArray(st.answers) && st.answers.length === Q.length && st.answers.some(a => a !== null)){
    answers = st.answers;
    idx = Math.min(st.idx || 0, Q.length - 1);
    $("resume").style.display = "inline-flex";
    $("begin").textContent = "Start fresh";
  }
  paintMeter();
})();
