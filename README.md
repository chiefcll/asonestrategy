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
