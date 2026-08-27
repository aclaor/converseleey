# The Practice Room — website

A complete static site. Three pages, no build step, no server, no dependencies. Drag the folder onto any static host and it works.

```
index.html            landing page
check.html            the 20-question assessment
train.html            the 28-day trainer
assets/base.css       shared design system (colours, type, components)
assets/check.js       assessment questions, scoring, drill library
assets/train.js       speech capture + the analysis engine
assets/curriculum.js  all 28 days — edit this to change the scenarios
```

---

## Putting it online — pick one

All three are free and give you a public URL that works on any phone, with no login for whoever you send it to.

### Netlify Drop — easiest, about 30 seconds

1. Go to **https://app.netlify.com/drop**
2. Drag the whole `site` folder onto the page.
3. Done. You get a URL like `https://cheerful-otter-1a2b3c.netlify.app`.
4. Optional: make a free account to claim it and rename it to something like `practice-room.netlify.app`.

No account needed to get the first URL.

### Cloudflare Pages — best if you want your own domain later

1. Sign up free at **https://dash.cloudflare.com**
2. **Workers & Pages → Create → Pages → Upload assets**
3. Upload the `site` folder. You get `your-project.pages.dev`.
4. Custom domains are free here, and so is the bandwidth.

### GitHub Pages — best if you want to keep editing it

1. Create a repo at **https://github.com/new**
2. Upload the contents of `site` (not the folder itself — the files need to be at the repo root).
3. **Settings → Pages → Source: `main` branch, `/ (root)` → Save**
4. It appears at `https://yourname.github.io/reponame/` after a minute or two.

Every future edit you push goes live automatically.

---

## Using your own domain

You need to buy one — roughly $10–15/year from Namecheap, Porkbun, or Cloudflare Registrar (Cloudflare sells at cost, so it's usually cheapest).

Then, in whichever host you picked, look for **Custom domain** / **Domain management**, add your domain, and it will tell you the exact DNS records to paste into your registrar. It's two records and takes about ten minutes, most of which is waiting.

Don't buy a domain until the site is up and you're actually using it. The free URL works exactly as well for sharing with friends.

---

## Editing it

**The scenarios** live in `assets/curriculum.js`. Each day is a plain object:

```js
{d:1, w:1, cat:"work", title:"The 20-second introduction", secs:25,
 brief:"the scenario the person reads",
 target:"what they're aiming for",
 tips:["...", "...", "..."],
 model:"a written example answer"}
```

`d` is the day number, `w` is the week (1–4), `cat` is `work`, `social` or `review`, and `secs` is the target length that the Length metric is scored against. Add days, rewrite them, or replace the lot with scenarios from your own life — nothing else needs to change.

**The words people notice** — filler and hedge lists — are at the top of `assets/train.js`. Add your own verbal tics to `FILLERS` and it'll start counting them.

**The colours** are all CSS variables at the top of `assets/base.css`. Change `--accent` and the whole site follows.

---

## What works where

The mic uses the browser's built-in speech recognition. **Chrome and Edge (desktop and Android) handle it well. Safari and Firefox mostly don't** — on those, the typing fallback takes over automatically and everything else still works.

On iPhone that means Safari won't transcribe. Chrome on iOS uses Safari's engine underneath, so it won't either. Typing works fine; you just lose the spoken-transcription part. Everyone can still record and play back their own audio.

---

## Privacy

There is no backend. No analytics, no cookies, no tracking, no network calls except loading fonts from Google. Recordings are never uploaded and never written to disk — they exist in the page until it's closed. Scores and transcripts are saved in `localStorage`, which means they live on that one device in that one browser and nobody else can see them, including you on your other phone.

If you'd rather not even load Google Fonts, delete the two `<link>` tags for `fonts.googleapis.com` in each HTML file — the fallback fonts are already declared and the site degrades cleanly.

---

## The AI coach is separate

The conversational version — where Claude plays the other person in the scene and coaches you afterwards — can't live on a static host, because it needs a server holding an API key. It stays a local app you run on your own machine. That's in the other zip, with its own README.

If you ever want the AI coach public too, that means paying for everyone's conversations on your own API key, so it needs auth and rate limiting before you'd want to share the link. Worth doing only if people are actually using the free version first.
