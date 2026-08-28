/* The Practice Room — shared design system */

:root{
  --ground:#ECF0F0; --surface:#FFFFFF; --surface-2:#DFE6E6; --inset:#F4F7F7;
  --ink:#0E1A1B; --ink-2:#40595B; --ink-3:#71898B;
  --line:#CBD7D7;
  --accent:#0C6E75; --accent-soft:#D6EBEC; --on-accent:#FFFFFF;
  --good:#2C7A4B; --warn:#9C6B12; --bad:#A83C25;
  --good-bg:#DDEFE3; --warn-bg:#F5E9CF; --bad-bg:#F6DED8;
  --shadow:0 1px 2px rgba(14,26,27,.05), 0 10px 28px -14px rgba(14,26,27,.22);
  --serif:"Instrument Serif", Georgia, "Times New Roman", serif;
  --sans:"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --mono:"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --maxw:1080px;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#0B1314; --surface:#141F20; --surface-2:#1E2C2D; --inset:#101A1B;
    --ink:#E6EFEF; --ink-2:#A8BFC0; --ink-3:#7A9294;
    --line:#26383A;
    --accent:#48C2CB; --accent-soft:#12363A; --on-accent:#06181A;
    --good:#5FC98A; --warn:#E0B252; --bad:#EE8468;
    --good-bg:#12301F; --warn-bg:#33280E; --bad-bg:#361C15;
    --shadow:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -14px rgba(0,0,0,.8);
  }
}
:root[data-theme="dark"]{
  --ground:#0B1314; --surface:#141F20; --surface-2:#1E2C2D; --inset:#101A1B;
  --ink:#E6EFEF; --ink-2:#A8BFC0; --ink-3:#7A9294;
  --line:#26383A;
  --accent:#48C2CB; --accent-soft:#12363A; --on-accent:#06181A;
  --good:#5FC98A; --warn:#E0B252; --bad:#EE8468;
  --good-bg:#12301F; --warn-bg:#33280E; --bad-bg:#361C15;
  --shadow:0 1px 2px rgba(0,0,0,.5), 0 10px 28px -14px rgba(0,0,0,.8);
}

*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:var(--sans); font-size:16px; line-height:1.6;
  -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
h1,h2,h3,h4{margin:0; font-weight:400; text-wrap:balance}
p{margin:0}
a{color:var(--accent); text-underline-offset:3px}
button,select,input,textarea{font:inherit; color:inherit}
button{border:none; background:none; cursor:pointer}
:focus-visible{outline:2.5px solid var(--accent); outline-offset:3px; border-radius:5px}
@media (prefers-reduced-motion: reduce){*{animation:none !important; transition:none !important; scroll-behavior:auto !important}}

.serif{font-family:var(--serif)}
.mono{font-family:var(--mono); font-size:.68rem; font-weight:600; letter-spacing:.11em; text-transform:uppercase}
.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap}

/* ---------- top bar ---------- */
.bar{position:sticky; top:0; z-index:30; background:var(--ground); border-bottom:1px solid var(--line)}
.bar-in{max-width:var(--maxw); margin:0 auto; padding:12px 20px; display:flex; align-items:center; gap:16px}
.mark{font-family:var(--serif); font-size:1.3rem; line-height:1; white-space:nowrap; color:var(--ink); text-decoration:none}
.mark em{font-style:italic; color:var(--accent)}
.bar-sp{flex:1}
.bar-nav{display:flex; gap:4px; align-items:center}
.bar-nav a{
  font-size:.86rem; color:var(--ink-2); text-decoration:none; padding:6px 11px;
  border-radius:7px; white-space:nowrap; transition:background .14s, color .14s;
}
.bar-nav a:hover{background:var(--surface-2); color:var(--ink)}
.bar-nav a[aria-current="page"]{color:var(--accent); font-weight:600; background:var(--accent-soft)}
.bar-note{font-family:var(--mono); font-size:.68rem; font-weight:600; letter-spacing:.09em; color:var(--ink-3); font-variant-numeric:tabular-nums; white-space:nowrap}
.bar-in > *{min-width:0}
.bar-nav{flex:none}
.mark{flex:none}
@media(max-width:760px){
  /* Four nav items no longer fit beside the wordmark — give them their own row. */
  .bar-in{flex-wrap:wrap; gap:6px 10px; padding:9px 14px}
  .mark{font-size:1.1rem}
  .bar-nav{order:3; width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch;
           margin:0 -4px; padding:0 4px 1px; scrollbar-width:none}
  .bar-nav::-webkit-scrollbar{display:none}
  .bar-nav a{padding:5px 9px; font-size:.8rem; flex:none}
  .bar-nav a[href="./"]{display:none}   /* the wordmark is the home link */
  .bar-note{font-size:.64rem; letter-spacing:.06em}
  .meter{order:2}
}
@media(max-width:340px){ .bar-note{display:none} }

/* ---------- layout ---------- */
.page{max-width:var(--maxw); margin:0 auto; padding:0 20px 96px}
.narrow{max-width:680px}
@media(max-width:560px){ .page{padding:0 16px 72px} }

/* ---------- buttons ---------- */
.btn{
  display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:var(--on-accent);
  border-radius:10px; padding:12px 24px; font-weight:600; font-size:.95rem; text-decoration:none;
  box-shadow:var(--shadow); transition:filter .15s, transform .12s;
}
.btn:hover{filter:brightness(1.08); transform:translateY(-1px)}
.btn:active{transform:none}
.btn[disabled],.btn.off{opacity:.4; pointer-events:none}
.btn.ghost{background:none; color:var(--ink-2); box-shadow:inset 0 0 0 1px var(--line)}
.btn.ghost:hover{color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); filter:none}

/* ---------- cards ---------- */
.card{background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:22px 24px}
@media(max-width:560px){ .card{padding:18px 18px; border-radius:12px} }

/* ---------- stats ---------- */
.grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(146px,1fr)); gap:11px}
.stat{background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:15px 17px; position:relative; overflow:hidden}
.stat::before{content:""; position:absolute; left:0; top:0; bottom:0; width:3px}
.stat.good::before{background:var(--good)}
.stat.warn::before{background:var(--warn)}
.stat.bad::before{background:var(--bad)}
.stat.flat::before{background:var(--line)}
.stat .k{font-family:var(--mono); font-size:.6rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3)}
.stat .v{font-family:var(--mono); font-size:1.5rem; font-weight:500; font-variant-numeric:tabular-nums; letter-spacing:-.02em; margin:5px 0 2px; line-height:1.15}
.stat .v u{text-decoration:none; font-size:.7rem; color:var(--ink-3); font-weight:600}
.stat.good .v{color:var(--good)} .stat.warn .v{color:var(--warn)} .stat.bad .v{color:var(--bad)}
.stat .n{font-size:.82rem; color:var(--ink-3); line-height:1.45}

.chip{display:inline-block; font-family:var(--mono); font-size:.6rem; font-weight:600; letter-spacing:.09em; text-transform:uppercase; padding:3px 8px; border-radius:99px}
.chip.good{background:var(--good-bg); color:var(--good)}
.chip.warn{background:var(--warn-bg); color:var(--warn)}
.chip.bad{background:var(--bad-bg); color:var(--bad)}
.chip.work{background:var(--accent-soft); color:var(--accent)}
.chip.social{background:var(--warn-bg); color:var(--warn)}
.chip.review{background:var(--good-bg); color:var(--good)}

mark{background:var(--bad-bg); color:var(--bad); border-radius:3px; padding:1px 3px; font-weight:600}
mark.h{background:var(--warn-bg); color:var(--warn)}

/* ---------- footer ---------- */
.foot{border-top:1px solid var(--line); margin-top:64px}
.foot-in{max-width:var(--maxw); margin:0 auto; padding:30px 20px 56px; display:flex; gap:26px; flex-wrap:wrap; align-items:flex-start}
.foot-in p{font-size:.86rem; color:var(--ink-3); max-width:46ch}
.foot-in .links{display:flex; gap:16px; flex-wrap:wrap}
.foot-in .links a{font-size:.86rem; color:var(--ink-2); text-decoration:none}
.foot-in .links a:hover{color:var(--accent)}
