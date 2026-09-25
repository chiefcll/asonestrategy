# As One Strategy Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hugo site with a hand-written, centered, responsive static site that implements the design.
It is served from `docs/` by GitHub Pages at asonestrategy.com.

**Architecture:** Two HTML pages (`docs/index.html`, `docs/thanks.html`) styled with Tailwind CSS v3. Utilities go
inline, and the few repeated patterns become component classes in `docs/input.css`. The generated `docs/output.css`
is committed and Pages serves `docs/` directly, the same flow as `../solidtv.dev`. The contact form posts to
Web3Forms with hCaptcha and redirects to the thanks page. GA4 tracks page views, CTA clicks and leads.

**Tech Stack:** HTML, Tailwind CSS 3.4 CLI, pnpm, http-server / live-server, Web3Forms, GA4, macOS `sips` for
images.

**Spec:** `specs/2026-09-25-static-site-design.md`

**Inputs:**
- `$DESIGN`: folder holding the design canvas's files, read from https://claude.ai/artifact/4TVHjgSCUHubLDrmgyWG2d
  with the Artifact tool. In this session: `/private/tmp/claude-501/-Users-chief-Documents-Code-Lightning-asonestrategy/2f4cbc9b-f256-4e1c-9e01-c98212b39d30/scratchpad/artifact-files/1bfe2ffb-ee28-4d7d-a7c8-6ee96434fa62`.
  - `$DESIGN/eeffd6e08d750a39431e33e1c2240fa3.jpg`: logo, 1600x732
  - `$DESIGN/3125fa9bae8e730ec41c280af86bc860.jpg`: Hannah, 800x1200
  - `$DESIGN/project/Main.dc.html`: design source (copy is verbatim from here)
- `../solidtv.dev/docs/images/chris-lorenzo.jpg`: Chris, 480x480
- `$SCRATCH`: a scratch folder outside the repo, for the checker script and temp images.

All commands run from the repo root `/Users/chief/Documents/Code/Lightning/asonestrategy`, on branch `static-site`.

---

### Task 1: Remove Hugo and scaffold the tooling

**Files:**
- Delete: `hugo.toml`, `archetypes/default.md`, `layouts/index.html`, `static/css/style.css`,
  `static/images/logo.jpg`, `.github/workflows/hugo.yaml`
- Create: `package.json`, `tailwind.config.js`, `docs/input.css`, `.claude/launch.json`
- Modify: `.gitignore` (full rewrite)

- [ ] **Step 1: Remove the Hugo files**

```bash
git rm -q -r hugo.toml archetypes layouts static .github
ls
```

Expected: only `README.md` and `specs` remain (plus the ignored `.gitignore`/`.DS_Store`).

- [ ] **Step 2: Write `.gitignore`**

```
node_modules
.DS_Store
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "asonestrategy",
  "version": "1.0.0",
  "private": true,
  "description": "As One Strategy website (asonestrategy.com)",
  "scripts": {
    "start": "npx live-server ./docs --no-css-inject & npm run watch",
    "build": "tailwindcss -i ./docs/input.css -o ./docs/output.css --minify",
    "watch": "tailwindcss -i ./docs/input.css -o ./docs/output.css --watch",
    "preview": "http-server ./docs"
  },
  "author": "Chris Lorenzo",
  "license": "UNLICENSED"
}
```

- [ ] **Step 4: Install the dev dependencies**

Run: `pnpm add -D tailwindcss@^3.4.19 http-server@^14.1.1`
Expected: `package.json` gains `devDependencies` with `tailwindcss ^3.4.19` and `http-server ^14.1.1`, and
`pnpm-lock.yaml` is created.

- [ ] **Step 5: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./docs/**/*.html'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px', // the design's desktop board width
    },
    extend: {
      colors: {
        accent: { DEFAULT: '#C8283A', hover: '#A81F30' },
        brand: { DEFAULT: '#B82435', dark: '#8E1A28' },
        ink: '#141414',
        body: '#3D3A36',
        muted: '#55514C',
        paper: '#FAF8F5',
        line: '#E6E1DA',
        rule: '#D9D3CB',
        field: '#B5ADA2',
        blush: '#F2A1A9',
        mist: '#D6D2CC',
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Write `docs/input.css`**

Font sizes use arbitrary `text-[Npx]` values on purpose. Tailwind's named sizes (`text-lg`, `text-4xl`…) also set
`line-height`, which would override the design's line heights at larger breakpoints.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Anchor links land below the sticky header (72px on phones, 104px from md up) */
  html {
    scroll-padding-top: 72px;
  }

  @media (min-width: 768px) {
    html {
      scroll-padding-top: 104px;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  body {
    @apply bg-paper font-sans text-ink antialiased;
  }

  :focus-visible {
    @apply outline outline-2 outline-offset-2 outline-accent;
  }
}

@layer components {
  /* Centered content column: 1248px of content inside the design's 96px gutters */
  .wrap {
    @apply mx-auto w-full max-w-[1440px] px-6 md:px-12 xl:px-24;
  }

  .section-y {
    @apply py-16 md:py-24 xl:py-32;
  }

  .eyebrow {
    @apply font-display text-sm font-bold uppercase tracking-[0.24em] text-brand;
  }

  .page-title {
    @apply max-w-[1040px] font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[56px] xl:text-[72px];
  }

  .lead {
    @apply max-w-[780px] text-[18px] leading-[1.55] text-body md:text-[20px] xl:text-[22px];
  }

  .section-title {
    @apply font-display text-[30px] font-extrabold leading-[1.15] tracking-[-0.01em] md:text-[36px] xl:text-[44px];
  }

  .item-title {
    @apply font-display text-[22px] font-bold leading-tight md:text-[26px];
  }

  .btn {
    @apply inline-flex h-14 items-center justify-center rounded px-8 font-display text-base font-bold transition-colors;
  }

  .btn-primary {
    @apply bg-accent text-white hover:bg-accent-hover;
  }

  .btn-outline {
    @apply border-2 border-ink text-ink hover:bg-ink hover:text-white;
  }

  .service-row {
    @apply grid grid-cols-[48px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3 py-7 lg:grid-cols-[64px_300px_minmax(0,1fr)] lg:gap-8 lg:py-9 xl:grid-cols-[96px_400px_minmax(0,1fr)];
  }

  .service-num {
    @apply font-display text-[18px] font-bold text-brand md:text-[20px];
  }

  .service-text {
    @apply col-start-2 text-[17px] leading-[1.6] text-body md:text-[19px] lg:col-start-auto;
  }

  .team-photo {
    @apply h-[192px] w-[160px] shrink-0 rounded-lg object-cover 2xl:h-[240px] 2xl:w-[200px];
  }

  .field-label {
    @apply font-display text-sm font-bold;
  }

  .field-input {
    @apply h-[52px] w-full rounded border border-field bg-white px-4 font-sans text-[17px] text-ink;
  }

  .field-select {
    @apply appearance-none bg-no-repeat pr-11;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23141414' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-position: right 16px center;
    background-size: 18px;
  }

  /* The hCaptcha widget is a fixed 303px wide; shrink it so it fits the form card on narrow phones */
  @media (max-width: 399px) {
    .h-captcha {
      transform: scale(0.89);
      transform-origin: left top;
      margin-bottom: -9px;
    }
  }

  @media (max-width: 359px) {
    .h-captcha {
      transform: scale(0.75);
      margin-bottom: -20px;
    }
  }
}
```

- [ ] **Step 7: Write `.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "asonestrategy-site",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["http-server", "./docs", "-p", "8139", "-c-1"],
      "port": 8139
    }
  ]
}
```

- [ ] **Step 8: Check that the build runs**

Run: `pnpm build`
Expected: exits 0 and writes `docs/output.css`. A "No utility classes were detected" warning is expected because
no HTML exists yet.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Replace Hugo with Tailwind + pnpm tooling"
```

(Every commit message in this plan ends with the `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
trailer.)

---

### Task 2: Site checker (the failing test)

**Files:**
- Create: `$SCRATCH/check-site.mjs`. It stays outside the repo because the spec keeps the repo free of a test
  suite, the same as solidtv.dev.

- [ ] **Step 1: Write the checker**

```js
// Static checks for the As One Strategy site. Usage: node check-site.mjs <repo-root>
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const docs = join(process.argv[2] ?? '.', 'docs');
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};
const read = (file) => (existsSync(join(docs, file)) ? readFileSync(join(docs, file), 'utf8') : '');

const index = read('index.html');
const thanks = read('thanks.html');
const css = read('output.css');

check(index, 'docs/index.html exists');
check(thanks, 'docs/thanks.html exists');

// Page structure
for (const id of ['main', 'top', 'about', 'services', 'team', 'contact']) {
  check(index.includes(`id="${id}"`), `index.html has #${id}`);
}
check(!index.includes('/_blob/'), 'index.html has no design-canvas blob URLs');

// Contact form (same Web3Forms setup as solidtv.dev)
check(index.includes('action="https://api.web3forms.com/submit" method="POST"'), 'form posts to Web3Forms');
check(/name="access_key" value="[^"]+"/.test(index), 'form has an access_key');
check(index.includes('name="subject" value="New inquiry from asonestrategy.com"'), 'form subject');
check(index.includes('name="from_name" value="asonestrategy.com"'), 'form from_name');
check(index.includes('name="redirect" value="https://asonestrategy.com/thanks.html"'), 'form redirect');
check(index.includes('name="botcheck"'), 'form honeypot');
check(index.includes('<div class="h-captcha" data-captcha="true"></div>'), 'hCaptcha widget');
check(
  index.includes('<script src="https://web3forms.com/client/script.js" async defer></script>'),
  'Web3Forms client script',
);
for (const field of ['name', 'email', 'organization', 'phone', 'interest', 'message']) {
  check(index.includes(`name="${field}"`), `form field ${field}`);
}
for (const id of ['cf-name', 'cf-email', 'cf-message']) {
  check(new RegExp(`id="${id}"[^>]*\\brequired\\b`).test(index), `${id} is required`);
}

// Analytics
for (const [name, html] of [
  ['index.html', index],
  ['thanks.html', thanks],
]) {
  check(html.includes('https://www.googletagmanager.com/gtag/js?id=G-6W5XT0VM94'), `${name} loads gtag`);
  check(html.includes("gtag('config', 'G-6W5XT0VM94');"), `${name} configures GA4`);
}
check(thanks.includes("gtag('event', 'generate_lead', { form: 'contact' })"), 'thanks.html fires generate_lead');
check(index.includes("gtag('event', 'cta_click'"), 'index.html reports cta_click');
for (const cta of [
  'nav_lets_talk',
  'hero_start_conversation',
  'hero_see_services',
  'contact_email',
  'contact_phone',
  'contact_submit',
  'footer_email',
  'footer_phone',
]) {
  check(index.includes(`data-cta="${cta}"`), `data-cta="${cta}"`);
}

// Search and sharing
check(index.includes('<link rel="canonical" href="https://asonestrategy.com/">'), 'index canonical');
check(
  index.includes('<meta property="og:image" content="https://asonestrategy.com/images/og-card.png">'),
  'og:image',
);
check(index.includes('<meta name="twitter:card" content="summary_large_image">'), 'twitter card');
check(index.includes('<script type="application/ld+json">'), 'JSON-LD');
check(thanks.includes('<meta name="robots" content="noindex, follow">'), 'thanks.html is noindex');
check(read('CNAME').trim() === 'asonestrategy.com', 'CNAME is asonestrategy.com');
check(read('robots.txt').includes('Sitemap: https://asonestrategy.com/sitemap.xml'), 'robots.txt points to sitemap');
check(read('sitemap.xml').includes('<loc>https://asonestrategy.com/</loc>'), 'sitemap lists the home page');

// Every relative src/href resolves to a file; no root-relative URLs
for (const [name, html] of [
  ['index.html', index],
  ['thanks.html', thanks],
]) {
  for (const [, ref] of html.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
    if (/^(?:[a-z]+:|#|\.\/#|\.\/$)/i.test(ref)) continue; // absolute, mailto/tel, in-page or home links
    if (ref.startsWith('/')) {
      failures.push(`${name}: root-relative URL ${ref}`);
      continue;
    }
    check(existsSync(join(docs, ref)), `${name}: ${ref} exists`);
  }
}

// Generated CSS contains the design tokens and responsive classes
check(css.length > 0, 'docs/output.css exists');
check(/#c8283a|200 40 58/i.test(css), 'output.css has the accent color');
check(css.includes('Source Sans 3'), 'output.css has the body font');
check(css.includes('.page-title'), 'output.css has the component classes');
check(css.includes('.md\\:h-\\[104px\\]'), 'output.css has the responsive header height');
check(css.includes('.h-captcha'), 'output.css has the hCaptcha sizing rules');

if (index.includes('WEB3FORMS_ACCESS_KEY_PLACEHOLDER')) {
  console.warn('WARN: the Web3Forms access_key is still the placeholder (replace it before merging).');
}

if (failures.length) {
  console.log(`FAIL (${failures.length})`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('PASS: all site checks');
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node $SCRATCH/check-site.mjs .`
Expected: `FAIL (…)` listing `docs/index.html exists`, `docs/thanks.html exists` and every check after them.

---

### Task 3: Images

**Files:**
- Create: `docs/images/logo.jpg`, `docs/images/hannah-lorenzo.jpg`, `docs/images/chris-lorenzo.jpg`,
  `docs/images/og-card.png`, `docs/images/favicon-96x96.png`, `docs/images/apple-touch-icon.png`

- [ ] **Step 1: Logo and team photos**

```bash
mkdir -p docs/images
sips --resampleWidth 640 -s formatOptions normal "$DESIGN/eeffd6e08d750a39431e33e1c2240fa3.jpg" --out docs/images/logo.jpg
sips --resampleWidth 400 -s formatOptions high "$DESIGN/3125fa9bae8e730ec41c280af86bc860.jpg" --out docs/images/hannah-lorenzo.jpg
cp ../solidtv.dev/docs/images/chris-lorenzo.jpg docs/images/chris-lorenzo.jpg
```

- [ ] **Step 2: Social share card (logo centered on white, 1200x630 PNG)**

```bash
sips --resampleWidth 900 "$DESIGN/eeffd6e08d750a39431e33e1c2240fa3.jpg" --out "$SCRATCH/og-logo.jpg"
sips -s format png -p 630 1200 --padColor FFFFFF "$SCRATCH/og-logo.jpg" --out docs/images/og-card.png
```

- [ ] **Step 3: Favicons (bridge mark cropped from the logo, padded square on white)**

The bridge mark sits in the top 490 px of the 1600x732 logo, from x≈255 to x≈1345. The text starts at y≈520.

```bash
sips -c 490 1090 --cropOffset 0 255 "$DESIGN/eeffd6e08d750a39431e33e1c2240fa3.jpg" --out "$SCRATCH/mark.jpg"
sips -s format png -p 1090 1090 --padColor FFFFFF "$SCRATCH/mark.jpg" --out "$SCRATCH/mark-square.png"
sips -z 180 180 "$SCRATCH/mark-square.png" --out docs/images/apple-touch-icon.png
sips -z 96 96 "$SCRATCH/mark-square.png" --out docs/images/favicon-96x96.png
```

- [ ] **Step 4: Verify dimensions and look**

Run: `sips -g pixelWidth -g pixelHeight docs/images/*`
Expected: logo 640x293, hannah-lorenzo 400x600, chris-lorenzo 480x480, og-card 1200x630, apple-touch-icon
180x180, favicon-96x96 96x96.

Open `$SCRATCH/mark.jpg` and `docs/images/og-card.png` with the Read tool. The whole bridge (towers, cables, red
deck, black arc) must be visible in the mark with no letters. If it's clipped, adjust the `-c`/`--cropOffset`
numbers and rerun step 3.

- [ ] **Step 5: Commit**

```bash
git add docs/images
git commit -m "Add logo, team photos, share card and favicons"
```

---

### Task 4: The home page

**Files:**
- Create: `docs/index.html`

- [ ] **Step 1: Write `docs/index.html`**

Copy is verbatim from `$DESIGN/project/Main.dc.html`. The Web3Forms key stays `WEB3FORMS_ACCESS_KEY_PLACEHOLDER`
until the user supplies it.

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>As One Strategy | Organizational &amp; Leadership Development</title>
  <meta name="description"
    content="As One Strategy helps businesses, nonprofits and ministries build the systems that let leaders lead and teams thrive.">
  <link rel="canonical" href="https://asonestrategy.com/">
  <meta property="og:title" content="As One Strategy: Together We Thrive">
  <meta property="og:description"
    content="As One Strategy helps businesses, nonprofits and ministries build the systems that let leaders lead and teams thrive.">
  <meta property="og:url" content="https://asonestrategy.com/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="As One Strategy">
  <meta property="og:image" content="https://asonestrategy.com/images/og-card.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="As One Strategy logo: Together We Thrive">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="As One Strategy: Together We Thrive">
  <meta name="twitter:description"
    content="As One Strategy helps businesses, nonprofits and ministries build the systems that let leaders lead and teams thrive.">
  <meta name="twitter:image" content="https://asonestrategy.com/images/og-card.png">
  <link rel="icon" type="image/png" sizes="96x96" href="images/favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="output.css">
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "As One Strategy",
      "url": "https://asonestrategy.com/",
      "logo": "https://asonestrategy.com/images/logo.jpg",
      "image": "https://asonestrategy.com/images/og-card.png",
      "email": "hello@asonestrategy.com",
      "telephone": "+1-215-995-5181",
      "slogan": "Together We Thrive"
    }
  </script>
  <!-- Required for hCaptcha -->
  <script src="https://web3forms.com/client/script.js" async defer></script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6W5XT0VM94"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-6W5XT0VM94');
  </script>
</head>

<body>
  <a href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-display focus:font-semibold focus:text-ink">Skip
    to content</a>

  <header class="sticky top-0 z-40 border-b border-line bg-white">
    <div class="wrap flex h-[72px] items-center justify-between gap-6 md:h-[104px]">
      <a href="#top" aria-label="As One Strategy home" class="flex shrink-0 items-center">
        <img src="images/logo.jpg" alt="As One Strategy: Together We Thrive" width="640" height="293"
          class="h-11 w-auto md:h-16">
      </a>
      <nav aria-label="Main"
        class="flex items-center gap-10 font-display text-[15px] font-semibold leading-[1.2] tracking-[0.02em]">
        <a href="#about" class="hidden text-ink hover:text-brand md:block">About</a>
        <a href="#services" class="hidden text-ink hover:text-brand md:block">Services</a>
        <a href="#team" class="hidden text-ink hover:text-brand md:block">Team</a>
        <a href="#contact" data-cta="nav_lets_talk"
          class="rounded bg-accent px-5 py-[13px] text-white hover:bg-accent-hover md:px-6 md:py-3.5">Let's talk</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section id="top" class="overflow-hidden bg-white">
      <div class="wrap flex flex-col gap-6 pb-[72px] pt-16 md:gap-10 md:pb-[104px] md:pt-24 xl:pb-32 xl:pt-[120px]">
        <p class="eyebrow flex items-center gap-4">
          <span aria-hidden="true" class="h-[3px] w-12 shrink-0 bg-accent"></span>
          Together We Thrive
        </p>
        <h1 class="page-title">Systems that let leaders lead and teams thrive.</h1>
        <p class="lead">As One Strategy helps organizations build the systems and tools that let leaders lead and
          teams thrive. We design the structures, dashboards, training, and performance fixes that make good work
          repeatable, not dependent on one person holding it all together.</p>
        <div class="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap">
          <a href="#contact" data-cta="hero_start_conversation" class="btn btn-primary">Start a conversation</a>
          <a href="#services" data-cta="hero_see_services" class="btn btn-outline">See our services</a>
        </div>
        <svg aria-hidden="true" focusable="false" class="mt-4 block h-10 w-full overflow-visible md:mt-10 md:h-[72px]"
          viewBox="0 0 1248 72" preserveAspectRatio="none" fill="none">
          <path d="M4 36 Q624 -4 1244 36" stroke="#C8283A" stroke-width="6" stroke-linecap="round"
            vector-effect="non-scaling-stroke"></path>
          <path d="M4 66 Q624 26 1244 66" stroke="#141414" stroke-width="6" stroke-linecap="round"
            vector-effect="non-scaling-stroke"></path>
        </svg>
      </div>
    </section>

    <section id="about" class="section-y">
      <div class="wrap flex flex-col gap-12 xl:gap-16">
        <div class="grid gap-6 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div class="flex flex-col gap-6">
            <p class="eyebrow">About</p>
            <h2 class="section-title">Most organizations don't have a strategy problem. They have a systems problem.
            </h2>
          </div>
          <div class="flex flex-col gap-6 text-[18px] leading-[1.6] text-body md:text-[20px] lg:pt-10">
            <p>As One Strategy exists because good vision gets stuck when nobody wrote down how things actually work,
              or when one person is the only one who can run it. We fix that.</p>
            <p><strong class="font-semibold text-ink">Your mission is our mission.</strong> We come alongside your
              organization to help get your mission accomplished.</p>
            <p>We work across sectors, from businesses to nonprofits to ministries.</p>
          </div>
        </div>
        <div class="grid gap-5 md:grid-cols-2 md:gap-8">
          <article class="flex flex-col gap-4 rounded-lg border border-line bg-white p-6 md:p-8 xl:p-12">
            <p class="font-display text-[13px] font-bold uppercase tracking-[0.2em] text-brand">The organizational side
            </p>
            <h3 class="item-title">Hannah: structure, leadership, process</h3>
            <p class="text-[17px] leading-[1.6] text-body md:text-[18px]">Hannah leads structure, leadership
              development, and process design, built through years of organizational development and leadership work
              across a wide range of organizations. Her background also includes UX and product design work, including
              CRM system redesign, which shapes how she approaches systems, not just structure.</p>
          </article>
          <article class="flex flex-col gap-4 rounded-lg border border-line bg-white p-6 md:p-8 xl:p-12">
            <p class="font-display text-[13px] font-bold uppercase tracking-[0.2em] text-brand">The technical side</p>
            <h3 class="item-title">Chris: systems that do what they say</h3>
            <p class="text-[17px] leading-[1.6] text-body md:text-[18px]">Chris asks whether your system is doing what
              it says it's doing, whether it's doing it efficiently, and whether it could be doing it better. He finds
              the answer and fixes what's falling short.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="services" class="section-y border-y border-line bg-white">
      <div class="wrap flex flex-col gap-10 md:gap-14">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div class="flex flex-col gap-6">
            <p class="eyebrow">Services</p>
            <h2 class="section-title">What we build with you</h2>
          </div>
          <p class="max-w-[460px] text-[17px] leading-[1.6] text-body md:text-[18px]">Structure, people, training, and
            tools. Each one designed to run without depending on any one person.</p>
        </div>
        <ol role="list">
          <li class="service-row border-t-2 border-ink">
            <span aria-hidden="true" class="service-num">01</span>
            <h3 class="item-title">Organizational Development</h3>
            <p class="service-text">We assess how your organization actually runs, not just how the org chart says it
              runs. Then we build the structure, roles, and processes that let it function without depending on any
              one person.</p>
          </li>
          <li class="service-row border-t border-rule">
            <span aria-hidden="true" class="service-num">02</span>
            <h3 class="item-title">Leadership Development</h3>
            <p class="service-text">We train leaders and teams to own their part of the mission. That means clear
              expectations, real delegation, and systems that make good decisions repeatable.</p>
          </li>
          <li class="service-row border-t border-rule">
            <span aria-hidden="true" class="service-num">03</span>
            <h3 class="item-title">Curriculum and Training Design</h3>
            <p class="service-text">We build the actual training material, not just a plan for someone else to build
              it. Courses, syllabi, and structured learning paths designed to be handed off and run without you.</p>
          </li>
          <li class="service-row border-t border-rule">
            <span aria-hidden="true" class="service-num">04</span>
            <h3 class="item-title">Systems Performance Review</h3>
            <p class="service-text">Is your system actually doing what it's supposed to do? Is it doing it
              efficiently? Could it be better? We evaluate the tools and software you already have against those three
              questions, then fix what's falling short.</p>
          </li>
          <li class="service-row border-y border-rule">
            <span aria-hidden="true" class="service-num">05</span>
            <h3 class="item-title">Strategic Advisory</h3>
            <p class="service-text">Ongoing counsel for leaders navigating growth, transition, or structural change. We
              come alongside for the long haul, not just a one-time project.</p>
          </li>
        </ol>
      </div>
    </section>

    <section id="team" class="section-y">
      <div class="wrap flex flex-col gap-10 md:gap-14">
        <div class="flex flex-col gap-6">
          <p class="eyebrow">Team</p>
          <h2 class="section-title">Two sides of the same work</h2>
        </div>
        <div class="grid gap-12 xl:grid-cols-2">
          <article class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <img src="images/hannah-lorenzo.jpg" alt="Hannah Lorenzo" width="400" height="600" loading="lazy"
              class="team-photo object-[center_25%]">
            <div class="flex max-w-[640px] flex-col gap-3">
              <h3 class="font-display text-[24px] font-bold leading-tight md:text-[28px]">Hannah Lorenzo</h3>
              <p class="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand">Organizational
                Development</p>
              <p class="text-[17px] leading-[1.6] text-body md:text-[18px]">Hannah has spent years doing organizational
                development and leadership work across a wide range of organizations. She specializes in turning vision
                into structure: the roles, systems, and processes that let an organization run well without
                bottlenecking through one person. Her background also includes UX and product design work, including
                CRM system redesign.</p>
            </div>
          </article>
          <article class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <img src="images/chris-lorenzo.jpg" alt="Chris Lorenzo" width="480" height="480" loading="lazy"
              class="team-photo">
            <div class="flex max-w-[640px] flex-col gap-3">
              <h3 class="font-display text-[24px] font-bold leading-tight md:text-[28px]">Chris Lorenzo</h3>
              <p class="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand">Systems Performance
              </p>
              <p class="text-[17px] leading-[1.6] text-body md:text-[18px]">Chris evaluates system performance. He asks
                whether your tools are doing what they say they're doing, whether they're doing it efficiently, and
                whether they could be doing it better, then fixes what's falling short. He also builds custom
                applications for streaming and TV platforms.</p>
              <p class="text-[17px] leading-[1.6] text-body">More on Chris's other work: <a href="https://chiefhacker.com"
                  class="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark">chiefhacker.com</a>
                and <a href="https://solidtv.dev"
                  class="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark">solidtv.dev</a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="contact" class="section-y bg-ink text-white">
      <div class="wrap grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16 xl:gap-24">
        <div class="flex flex-col gap-6 md:gap-10">
          <p class="eyebrow flex items-center gap-4 text-blush">
            <span aria-hidden="true" class="h-[3px] w-12 shrink-0 bg-accent"></span>
            Contact
          </p>
          <h2
            class="font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] md:text-[44px] xl:text-[56px]">
            Ready to get your mission moving?</h2>
          <p class="text-[20px] leading-[1.5] text-mist md:text-[24px]">Let's talk about what's actually in the way.</p>
          <div class="flex flex-col items-start gap-4">
            <a href="mailto:hello@asonestrategy.com" data-cta="contact_email"
              class="flex min-h-[44px] items-center gap-3.5 font-display text-[18px] font-bold text-white hover:text-blush">
              <svg aria-hidden="true" focusable="false" class="shrink-0" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
              <span>hello@asonestrategy.com</span>
            </a>
            <a href="tel:+12159955181" data-cta="contact_phone"
              class="flex min-h-[44px] items-center gap-3.5 font-display text-[18px] font-bold text-white hover:text-blush">
              <svg aria-hidden="true" focusable="false" class="shrink-0" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z">
                </path>
              </svg>
              <span>215-995-5181</span>
            </a>
          </div>
        </div>
        <form action="https://api.web3forms.com/submit" method="POST" aria-label="Contact form"
          class="flex min-w-0 flex-col gap-6 rounded-lg bg-white p-5 text-ink md:p-8 xl:p-12">
          <input type="hidden" name="access_key" value="WEB3FORMS_ACCESS_KEY_PLACEHOLDER">
          <input type="hidden" name="subject" value="New inquiry from asonestrategy.com">
          <input type="hidden" name="from_name" value="asonestrategy.com">
          <input type="hidden" name="redirect" value="https://asonestrategy.com/thanks.html">
          <input type="checkbox" name="botcheck" class="hidden" style="display: none" tabindex="-1" autocomplete="off">
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label for="cf-name" class="field-label">Name</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" required class="field-input">
            </div>
            <div class="flex flex-col gap-2">
              <label for="cf-email" class="field-label">Email</label>
              <input id="cf-email" name="email" type="email" autocomplete="email" required class="field-input">
            </div>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label for="cf-org" class="field-label">Organization</label>
              <input id="cf-org" name="organization" type="text" autocomplete="organization" class="field-input">
            </div>
            <div class="flex flex-col gap-2">
              <label for="cf-phone" class="field-label">Phone <span class="font-medium text-muted">(optional)</span></label>
              <input id="cf-phone" name="phone" type="tel" autocomplete="tel" class="field-input">
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="cf-interest" class="field-label">What are you interested in?</label>
            <select id="cf-interest" name="interest" class="field-input field-select">
              <option>Not sure yet</option>
              <option>Organizational Development</option>
              <option>Leadership Development</option>
              <option>Curriculum and Training Design</option>
              <option>Systems Performance Review</option>
              <option>Strategic Advisory</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label for="cf-message" class="field-label">What's in the way?</label>
            <textarea id="cf-message" name="message" rows="5" required
              class="field-input h-auto resize-y py-3.5 leading-[1.5]"></textarea>
          </div>
          <div class="h-captcha" data-captcha="true"></div>
          <button type="submit" data-cta="contact_submit" class="btn btn-primary w-full sm:w-auto sm:self-start">Send
            message</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="border-t border-line bg-white">
    <div
      class="wrap flex flex-col items-center gap-4 py-8 text-center text-[15px] text-muted md:h-28 md:flex-row md:justify-between md:py-0 md:text-left">
      <img src="images/logo.jpg" alt="As One Strategy" width="640" height="293" loading="lazy" class="h-11 w-auto">
      <div class="flex flex-col items-center gap-1 md:flex-row md:gap-8">
        <a href="mailto:hello@asonestrategy.com" data-cta="footer_email"
          class="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:text-ink md:min-h-0">hello@asonestrategy.com</a>
        <a href="tel:+12159955181" data-cta="footer_phone"
          class="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:text-ink md:min-h-0">215-995-5181</a>
        <span>&copy; 2026 As One Strategy</span>
      </div>
    </div>
  </footer>

  <script>
    // Report CTA clicks to GA4
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-cta]') : null;
      if (el && window.gtag) gtag('event', 'cta_click', { cta_name: el.getAttribute('data-cta') });
    });
  </script>
</body>

</html>
```

- [ ] **Step 2: Build the CSS**

Run: `pnpm build`
Expected: exits 0 with no "No utility classes" warning.

- [ ] **Step 3: Run the checker**

Run: `node $SCRATCH/check-site.mjs .`
Expected: `FAIL`, but the only failures left are the thanks page (`docs/thanks.html exists`,
`thanks.html loads gtag`, `thanks.html configures GA4`, `thanks.html fires generate_lead`,
`thanks.html is noindex`) and the missing `CNAME`, `robots.txt` and `sitemap.xml`. The placeholder `WARN` line
is printed.

- [ ] **Step 4: Commit**

```bash
git add docs/index.html docs/output.css
git commit -m "Build the home page from the new design"
```

---

### Task 5: The thanks page

**Files:**
- Create: `docs/thanks.html`

- [ ] **Step 1: Write `docs/thanks.html`**

It uses the same header and footer as `index.html`, with links pointing back to `./`, and has no `data-cta`
attributes.

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Thanks | As One Strategy</title>
  <meta name="description" content="Your message to As One Strategy has been sent.">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://asonestrategy.com/thanks.html">
  <link rel="icon" type="image/png" sizes="96x96" href="images/favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="output.css">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6W5XT0VM94"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-6W5XT0VM94');
  </script>
</head>

<body class="flex min-h-screen flex-col">
  <a href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-display focus:font-semibold focus:text-ink">Skip
    to content</a>

  <header class="sticky top-0 z-40 border-b border-line bg-white">
    <div class="wrap flex h-[72px] items-center justify-between gap-6 md:h-[104px]">
      <a href="./" aria-label="As One Strategy home" class="flex shrink-0 items-center">
        <img src="images/logo.jpg" alt="As One Strategy: Together We Thrive" width="640" height="293"
          class="h-11 w-auto md:h-16">
      </a>
      <nav aria-label="Main"
        class="flex items-center gap-10 font-display text-[15px] font-semibold leading-[1.2] tracking-[0.02em]">
        <a href="./#about" class="hidden text-ink hover:text-brand md:block">About</a>
        <a href="./#services" class="hidden text-ink hover:text-brand md:block">Services</a>
        <a href="./#team" class="hidden text-ink hover:text-brand md:block">Team</a>
        <a href="./#contact"
          class="rounded bg-accent px-5 py-[13px] text-white hover:bg-accent-hover md:px-6 md:py-3.5">Let's talk</a>
      </nav>
    </div>
  </header>

  <main id="main" class="flex-1 bg-white">
    <div class="wrap flex flex-col items-start gap-6 py-24 md:gap-10 md:py-32">
      <p class="eyebrow flex items-center gap-4">
        <span aria-hidden="true" class="h-[3px] w-12 shrink-0 bg-accent"></span>
        Message sent
      </p>
      <h1 class="page-title">Thanks, we've got it.</h1>
      <p class="lead">We'll get back to you at the email address you gave us.</p>
      <a href="./" class="btn btn-primary">Back to As One Strategy</a>
    </div>
  </main>

  <footer class="border-t border-line bg-white">
    <div
      class="wrap flex flex-col items-center gap-4 py-8 text-center text-[15px] text-muted md:h-28 md:flex-row md:justify-between md:py-0 md:text-left">
      <img src="images/logo.jpg" alt="As One Strategy" width="640" height="293" loading="lazy" class="h-11 w-auto">
      <div class="flex flex-col items-center gap-1 md:flex-row md:gap-8">
        <a href="mailto:hello@asonestrategy.com"
          class="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:text-ink md:min-h-0">hello@asonestrategy.com</a>
        <a href="tel:+12159955181"
          class="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:text-ink md:min-h-0">215-995-5181</a>
        <span>&copy; 2026 As One Strategy</span>
      </div>
    </div>
  </footer>

  <script>
    // Count the form submission as a GA4 lead
    if (window.gtag) gtag('event', 'generate_lead', { form: 'contact' });
  </script>
</body>

</html>
```

- [ ] **Step 2: Rebuild and run the checker**

Run: `pnpm build && node $SCRATCH/check-site.mjs .`
Expected: `FAIL`, with only `CNAME is asonestrategy.com`, `robots.txt points to sitemap` and
`sitemap lists the home page` left.

- [ ] **Step 3: Commit**

```bash
git add docs/thanks.html docs/output.css
git commit -m "Add the contact form thank-you page"
```

---

### Task 6: Domain and crawler files

**Files:**
- Create: `docs/CNAME`, `docs/robots.txt`, `docs/sitemap.xml`

- [ ] **Step 1: Write `docs/CNAME`**

```
asonestrategy.com
```

- [ ] **Step 2: Write `docs/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://asonestrategy.com/sitemap.xml
```

- [ ] **Step 3: Write `docs/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://asonestrategy.com/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Run the checker**

Run: `node $SCRATCH/check-site.mjs .`
Expected: `PASS: all site checks`, plus the placeholder `WARN` line.

- [ ] **Step 5: Commit**

```bash
git add docs/CNAME docs/robots.txt docs/sitemap.xml
git commit -m "Add CNAME, robots.txt and sitemap"
```

---

### Task 7: Project docs

**Files:**
- Create: `CLAUDE.md`
- Modify: `README.md` (full rewrite)

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for As One Strategy (asonestrategy.com), served from the `docs/` directory by GitHub Pages
("Deploy from a branch", `main`, `/docs`; see `docs/CNAME`). There is no application code or test suite, just HTML
and Tailwind CSS. The tooling and deploy flow mirror `../solidtv.dev`.

## Commands

- `pnpm start`: runs `live-server` against `docs/` and Tailwind in `--watch` mode in parallel. Use this for local development.
- `pnpm build`: compiles `docs/input.css` to `docs/output.css` (minified).
- `pnpm watch`: Tailwind watcher only.
- `pnpm preview`: serves `docs/` with `http-server` (no rebuild).

## Architecture

- `docs/index.html`: the whole site on one page: header, hero (`#top`), About (`#about`), Services (`#services`), Team (`#team`), Contact (`#contact`) with the contact form, and the footer.
- `docs/thanks.html`: where the contact form redirects after a submission (`noindex`). It fires the GA4 `generate_lead` event.
- `docs/input.css`: Tailwind entrypoint, base rules (sticky-header scroll offset, focus outline) and the shared component classes (`.wrap`, `.section-y`, `.eyebrow`, `.page-title`, `.lead`, `.section-title`, `.item-title`, `.btn*`, `.service-*`, `.team-photo`, `.field-*`, hCaptcha sizing).
- `docs/output.css`: generated; do not edit by hand. Rebuild with `pnpm build` or `pnpm watch` after adding any class.
- `tailwind.config.js`: brand colors and fonts from the design. `screens.2xl` is 1440px, the design's board width.
- `docs/images/`: logo, team photos, `og-card.png` social card, favicons.
- `docs/CNAME`, `docs/robots.txt`, `docs/sitemap.xml`: add any new indexable page to the sitemap.

There is no templating. The `<header>`, `<footer>`, font links and GA snippet are duplicated in `index.html` and `thanks.html`, so a change to one must be applied to both. Use relative URLs (`images/...`, `./#contact`) so pages work at any path. Only the canonical and Open Graph URLs, the form redirect, the sitemap and the JSON-LD are absolute.

The contact form posts to Web3Forms. Its `access_key` hidden input is registered to hello@asonestrategy.com. Spam protection is hCaptcha (`.h-captcha` plus `web3forms.com/client/script.js`) and a `botcheck` honeypot. After a submission the visitor is redirected to `https://asonestrategy.com/thanks.html`.

Links with a `data-cta` attribute report a `cta_click` event to GA4 (`G-6W5XT0VM94`).

The `docs/` directory is the deployable artifact (GitHub Pages serves it directly), which is why generated CSS is committed. Anything written under `docs/` is published, so keep notes, specs and scratch files out of it. Design docs live in `specs/`.
```

- [ ] **Step 2: Write `README.md`**

````markdown
# As One Strategy

Website for [As One Strategy](https://asonestrategy.com): organizational development, leadership development,
curriculum and training design, systems performance review and strategic advisory.

Plain HTML and Tailwind CSS, served by GitHub Pages straight from the `docs/` folder.

## Requirements

- Node.js 18 or later
- [pnpm](https://pnpm.io/installation)

## Develop

```bash
pnpm install
pnpm start
```

`pnpm start` serves `docs/` with live reload and rebuilds the CSS when you change a class.

## Build

```bash
pnpm build
```

This compiles `docs/input.css` into `docs/output.css`. Commit `docs/output.css` together with your HTML changes,
because GitHub Pages serves the folder as-is with no build step.

## Deploy

GitHub Pages is set to **Deploy from a branch: `main`, `/docs`**. Everything merged to `main` goes live. The custom
domain comes from `docs/CNAME`.

DNS for `asonestrategy.com` (Google Workspace MX records stay as they are):

| Type  | Host  | Value |
| ----- | ----- | ----- |
| A     | `@`   | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA  | `@`   | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `chiefcll.github.io` |

## Contact form

The form in `docs/index.html` posts to [Web3Forms](https://web3forms.com). Submissions are emailed to the address
the `access_key` is registered to (hello@asonestrategy.com). Spam protection is hCaptcha plus a honeypot field, and
after sending, visitors land on `docs/thanks.html`.

## Analytics

Google Analytics 4 (`G-6W5XT0VM94`) runs on both pages. Clicks on elements with a `data-cta` attribute send a
`cta_click` event, and the thank-you page sends `generate_lead`.
````

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "Document the new site setup"
```

---

### Task 8: Browser verification

**Files:**
- Modify as needed: `docs/index.html`, `docs/thanks.html`, `docs/input.css` (fixes only)

- [ ] **Step 1: Start the preview server**

Use the browser pane's `preview_start` with name `asonestrategy-site`, which serves `http://localhost:8139`.

- [ ] **Step 2: Measure at each width**

For each width in 320, 360, 375, 768, 1024, 1280, 1440 and 1920, set the viewport with `resize_window`, reload
`http://localhost:8139/`, and run:

```js
(async () => {
  const wrap = [...document.querySelectorAll('.wrap')].map((e) => {
    const r = e.getBoundingClientRect();
    return [Math.round(r.left), Math.round(innerWidth - r.right)];
  });
  const nav = [...document.querySelectorAll('header nav a')].map((a) => [
    a.textContent.trim(),
    getComputedStyle(a).display !== 'none',
  ]);
  const images = await Promise.all(
    [...document.images].map(async (img) => [img.getAttribute('src'), (await fetch(img.src)).ok]),
  );
  const formBox = document.querySelector('form').getBoundingClientRect();
  const frame = document.querySelector('.h-captcha iframe');
  return {
    width: innerWidth,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    wrapOffsets: wrap,
    nav,
    headerHeight: document.querySelector('header').offsetHeight,
    brokenImages: images.filter(([, ok]) => !ok),
    captchaRightGap: frame ? Math.round(formBox.right - frame.getBoundingClientRect().right) : 'not rendered',
  };
})();
```

Expected at every width: `horizontalOverflow: false`, `brokenImages: []`, and each `wrapOffsets` pair has equal
left and right values.
- The `.wrap` box is at most 1440 px wide, so at 1920 each offset is (1920 − 1440) / 2 = 240. The content starts
  96 px further in, which leaves a 1248 px column.
- Below 768: `headerHeight` is 72 and only "Let's talk" is visible.
- 768 and up: `headerHeight` is 104 and all four links are visible.
- `captchaRightGap` is ≥ 0 once the widget has rendered, meaning the widget ends inside the form card. If it reads
  `'not rendered'`, scroll to the form, wait a few seconds and re-run.

- [ ] **Step 3: Visual pass**

Take a screenshot at 1440 and compare it with the design: section order, spacing, type sizes, the red and black
arcs, the dark contact band and the form card. Also screenshot 375 and 768, and confirm:
- the hero buttons are full width at 375
- About, Contact and Team stack
- service rows show the number next to the title with the text below
- Team photos sit above the bios at 375 and beside them at 768

- [ ] **Step 4: Anchor and thanks-page checks**

Click the header "Services" link at 1440. `document.querySelector('#services').getBoundingClientRect().top` must
equal 104 after scrolling. Then load `http://localhost:8139/thanks.html` at 375 and 1440 and confirm it renders
with the header, the message and the footer pinned to the bottom. Check for console errors on both pages with
`read_console_messages` (`onlyErrors: true`). Errors from blocked third-party scripts in the preview are
acceptable; anything from the site's own markup is not.

- [ ] **Step 5: Fix, rebuild, re-run**

For every failure: fix the markup or CSS, run `pnpm build`, and repeat Steps 2–4 at the affected widths. Then run
`node $SCRATCH/check-site.mjs .`
Expected: `PASS: all site checks`.

- [ ] **Step 6: Commit any fixes**

```bash
git add docs
git commit -m "Fix responsive issues found in browser checks"
```

(Skip this if there were no fixes.)

---

### Task 9: Push and open the PR

- [ ] **Step 1: Push the branch**

Run: `git push -u origin static-site`
Expected: the branch is created on GitHub. The old Hugo workflow only triggers on `main`, so nothing deploys.

- [ ] **Step 2: Write `$SCRATCH/pr-body.md`**

```markdown
Replaces the Hugo site with a hand-written static site built from the new design. It uses the same tooling and
deploy flow as solidtv.dev: HTML + Tailwind CSS v3 in `docs/`, with the generated CSS committed, served by GitHub
Pages from `main:/docs`.

## What's in it

- `docs/index.html`: the single page (hero, About, Services, Team, Contact), centered at a 1248 px content width
  and responsive down to 320 px. On phones the header shows the logo and "Let's talk" only.
- Contact form: Web3Forms + hCaptcha + honeypot, the same setup as solidtv.dev. Redirects to `docs/thanks.html`.
- GA4 (`G-6W5XT0VM94`): page views, `cta_click` on `[data-cta]` links, `generate_lead` on the thank-you page.
- Search and sharing: canonical URL, Open Graph/Twitter card with a 1200×630 image, JSON-LD, favicons,
  `robots.txt`, `sitemap.xml`, `CNAME` for asonestrategy.com.
- Removes `hugo.toml`, `layouts/`, `static/`, `archetypes/` and the Hugo Pages workflow.
- Design spec and implementation plan in `specs/`.

## Before merging

- [ ] Replace `WEB3FORMS_ACCESS_KEY_PLACEHOLDER` in `docs/index.html` with the Web3Forms key for
      hello@asonestrategy.com.

## After merging

- [ ] Switch Pages to a branch build: `main` / `/docs`, custom domain `asonestrategy.com`.
- [ ] Add DNS records: `A @` → 185.199.108.153, .109.153, .110.153, .111.153; `AAAA @` → 2606:50c0:8000::153,
      8001::153, 8002::153, 8003::153; `CNAME www` → chiefcll.github.io. MX records stay as they are.
- [ ] Once the certificate is issued, turn on Enforce HTTPS.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --base main --head static-site --title "Replace the Hugo site with the new static design" --body-file "$SCRATCH/pr-body.md"
```

Expected: prints the PR URL.
