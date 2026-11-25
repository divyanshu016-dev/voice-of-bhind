# Voice of Bhind — भिंड की आवाज़

A React community-voting website where visitors can support ideas for Bhind, see collective results, and share the priorities with other people.

## Run locally

1. Install [Node.js 22.13 or later](https://nodejs.org/).
2. Open the extracted `voice-of-bhind` folder in VS Code.
3. Open the terminal in that folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal (usually `http://localhost:5173`).

`npm run dev` automatically creates the local D1 voting table before starting. You can rerun it safely; local votes are stored in `.wrangler/state` and are separate from votes on the public website.

If your environment blocks network-interface discovery, try `npm run dev -- --host 127.0.0.1`.

## Useful commands

```bash
npm run db:local   # Create the local voting table
npm run lint       # Check React/JavaScript rules
npx tsc --noEmit   # Check TypeScript types
npm run build      # Build the production site
```

## Project structure

- `src/App.jsx` — React page and voting controls.
- `src/IndianArt.jsx` — original SVG illustrations inspired by Warli, Gond, and Madhubani traditions.
- `src/visual.css` — typography, colors, styling, and responsive breakpoints.
- `app/api/priorities/route.ts` — shared votes API.
- `db/` and `drizzle/` — D1 database code and schema migration.
- `lib/civic-topics.ts` — suggested civic topics.
- `app/layout.tsx` — imports the active stylesheet.

This app uses a Cloudflare-compatible development server and D1 database. It is not a plain static Vite page; keep the backend files when making changes.

Voting uses an anonymous browser cookie to reduce repeat votes on the same topic. This is an informal public pulse, **not** a verified survey of Bhind residents or an official government service.
