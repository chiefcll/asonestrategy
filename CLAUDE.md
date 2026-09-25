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
