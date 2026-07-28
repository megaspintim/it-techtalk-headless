# IT-TechTalk — headless frontend

Next.js (App Router) frontend for the IT-TechTalk redesign. Content sources:

- **Resources** — real data, queried live from the Wix CMS collection via the Wix
  Headless SDK.
- **News** — real data, fetched live from RSS.app's public feed XML for each of the
  8 topics (no Wix involved for News at all — deliberately kept separate).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # already has the real Client ID filled in
npm run dev
```

Open http://localhost:3000. **The `.env.local` step is required** — without it,
Resources queries will fail (no Client ID to authenticate with).

## Project structure

```
app/
  layout.js               Root layout — header, footer, "Browse by topic" on every page
  globals.css              Full design system (tokens, every component's styles)
  page.js                  Homepage
  news/page.js              News list (filterable via ?topic=, ?sort=, ?page=)
  resources/page.js         Resources list (filterable via ?format=, ?topic=, ?sort=)
  resources/[slug]/page.js  Resource detail page
  search/page.js            Site-wide search results (Resources + News)
  robots.js                 Blocks search indexing while the site is pre-launch

components/                 Reusable UI: header, footer, cards, filters, search pill

lib/
  data.js                   ALL data access goes through here — the only file
                              that should change if a data source changes again
  rss.js                    RSS.app feed fetching/parsing for News
  wixClient.js               Wix Headless SDK client setup
  topics.js                  The 8 topics, shared by nav/mega-menu/filters/footer
```

## Known gaps / things to build next

- **Real Mautic form embed** — currently a static "Coming soon" placeholder on the
  resource detail page. Waiting on RSS.app-style access (form generation script per
  resource) — same category of blocker as the News feed was, now resolved for News.
- **Two things not yet verified against the real Wix connection** — flagged directly
  in code comments in `lib/data.js`:
  1. The exact internal key for the Image field (assumed lowercase `image`)
  2. Whether `topic` / `resourceType` come back as plain string arrays via the SDK,
     same as they did in the Velo/Wix Studio testing
  
  If resources fail to load, or load but images are broken, these are the first
  things to check — `console.log` one raw item from `wixClient.items.query('Resources').find()`
  to see the real shape.
- **RSS.app feed IDs are unverified in production** — confirmed by the team that the
  widget IDs double as feed IDs, but this hasn't been tested end-to-end yet. If a
  topic's News section comes back empty, check the terminal (`npm run dev`) or
  Vercel's function logs — failures are logged per-topic rather than crashing the page.

## Deploying

Standard Next.js on Vercel — connect the Git repo, no special build config needed.
**Add `NEXT_PUBLIC_WIX_CLIENT_ID` as a Vercel environment variable** (Project Settings
→ Environment Variables) — `.env.local` is gitignored and won't carry over
automatically, this is easy to forget and will break Resources in production if
skipped.
