# The Produce Gallery

A gallery of fruits, vegetables, herbs, and spices — their colors, seasons, and the quiet stories behind them. Browse a hand-curated set or stream the full catalogue live from Wikidata.

Built with **Vite + React + TypeScript + Tailwind CSS**.

## Features

- Two data sources, switchable in the header:
  - **Curated** — 16 hand-curated items with emoji art, origins, fun facts, and seasons
  - **Wikidata** — hundreds of items pulled live from the public Wikidata SPARQL endpoint, with images and descriptions
- 7-day localStorage cache for Wikidata results, with a Refresh button to invalidate
- Search across name, color, origin, description, and trivia
- Filter by **category** (fruit / vegetable / herb / spice)
- Filter by **season** (curated items have season metadata)
- Filter by **color** with color-coded chips
- Loading + error states with retry / fallback to curated
- Per-card image fallback to category emoji
- Wikipedia link on each Wikidata-sourced item
- Responsive: 1 -> 2 -> 3 -> 4 columns from mobile to desktop

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project layout

```
src/
  App.tsx                   # Page composition, source toggle, fetch lifecycle
  main.tsx                  # React root
  index.css                 # Tailwind entry + base styles
  types.ts                  # ProduceItem / Category / Source types
  data/produce.ts           # Hand-curated dataset (16 items)
  services/wikidata.ts      # SPARQL queries + localStorage cache
  components/
    ProduceCard.tsx         # Individual produce card
    FilterBar.tsx           # Search + category/season/color filters
```

## How the Wikidata source works

`src/services/wikidata.ts` runs four SPARQL queries (one per category) against
`https://query.wikidata.org/sparql`:

```sparql
SELECT DISTINCT ?item ?itemLabel ?itemDescription ?image ?article WHERE {
  ?item wdt:P279* wd:Q3314483 .          # subclasses of "edible fruit"
  ?article schema:about ?item ;
           schema:isPartOf <https://en.wikipedia.org/> .
  OPTIONAL { ?item wdt:P18 ?image }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
LIMIT 800
```

The Wikipedia-article filter limits results to notable items. Categories use these QIDs:

| Category   | QID       |
| ---------- | --------- |
| fruit      | Q3314483  |
| vegetable  | Q11004    |
| spice      | Q42527    |
| herb       | Q207123   |

Results are deduplicated by Wikidata ID, sorted alphabetically, and cached in
`localStorage` under `produce-app:wikidata:v1` for 7 days.

## Adding more curated produce

Append a new entry to `src/data/produce.ts` matching the `ProduceItem` shape. The
filter chips for **color** are derived automatically from the dataset.
