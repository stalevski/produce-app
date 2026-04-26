import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Database,
  Leaf,
  Loader2,
  RefreshCw,
  Sprout,
} from "lucide-react";
import { PRODUCE } from "./data/produce";
import { ProduceCard } from "./components/ProduceCard";
import {
  FilterBar,
  type CategoryFilter,
  type SeasonFilter,
} from "./components/FilterBar";
import type { ProduceItem, Source } from "./types";
import {
  clearCache,
  fetchAllProduce,
  loadFromCache,
  saveToCache,
} from "./services/wikidata";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [season, setSeason] = useState<SeasonFilter>("all");
  const [color, setColor] = useState<string | null>(null);
  const [source, setSource] = useState<Source>("curated");

  const [wikidataItems, setWikidataItems] = useState<ProduceItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (source !== "wikidata") return;
    if (wikidataItems) return;

    const cached = loadFromCache();
    if (cached && cached.length > 0) {
      setWikidataItems(cached);
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetchAllProduce(ctrl.signal)
      .then((items) => {
        setWikidataItems(items);
        saveToCache(items);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Failed to load Wikidata";
        setError(message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [source, wikidataItems]);

  const dataset = useMemo<ProduceItem[]>(() => {
    if (source === "wikidata" && wikidataItems) return wikidataItems;
    return PRODUCE;
  }, [source, wikidataItems]);

  const colors = useMemo(() => {
    const set = new Set<string>();
    dataset.forEach((p) => {
      if (p.color) set.add(p.color);
    });
    return Array.from(set).sort();
  }, [dataset]);

  const hasSeasons = useMemo(
    () => dataset.some((p) => p.seasons && p.seasons.length > 0),
    [dataset]
  );

  const hasColorVariety = useMemo(() => {
    const distinctCategories = new Set(dataset.map((p) => p.category)).size;
    return colors.length > distinctCategories;
  }, [dataset, colors]);

  useEffect(() => {
    if (!hasSeasons && season !== "all") setSeason("all");
  }, [hasSeasons, season]);

  useEffect(() => {
    if (!hasColorVariety && color !== null) setColor(null);
  }, [hasColorVariety, color]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataset.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (season !== "all" && p.seasons && !p.seasons.includes(season)) return false;
      if (color && p.color && p.color !== color) return false;
      if (q) {
        const hay = [p.name, p.color, p.origin, p.description, p.funFact]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [dataset, query, category, season, color]);

  const refresh = () => {
    clearCache();
    setWikidataItems(null);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSeason("all");
    setColor(null);
  };

  const showLoading = source === "wikidata" && loading && !wikidataItems;
  const showError = source === "wikidata" && error && !wikidataItems;

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-10 flex flex-col gap-6 sm:mb-14">
          <div className="flex items-center justify-between gap-4 text-ink/60">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">
                The Produce Gallery
              </span>
            </div>
            <SourceToggle source={source} onChange={setSource} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              A small library
              <br />
              of <em className="italic text-[#3f6b3a]">growing things</em>.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-ink/70">
              A catalogue of fruits, vegetables, herbs, and spices — their colors,
              seasons, and the quiet stories behind them. Curated by hand, or
              streamed live from Wikidata.
            </p>
          </div>
        </header>

        {showLoading && (
          <div className="mb-8 flex items-center gap-3 rounded-3xl bg-white/60 p-5 ring-1 ring-black/5 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-ink/60" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-ink">
                Asking Wikidata for every fruit, vegetable, herb, and spice...
              </span>
              <span className="text-xs text-ink/50">
                This usually takes 5-15 seconds. Results cache locally for a week.
              </span>
            </div>
          </div>
        )}

        {showError && (
          <div className="mb-8 flex flex-col gap-3 rounded-3xl bg-white/60 p-5 ring-1 ring-black/5 backdrop-blur-sm sm:flex-row sm:items-center">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">
                Wikidata didn't answer this time.
              </p>
              <p className="text-xs text-ink/60">{error}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-cream transition hover:opacity-90"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
              <button
                type="button"
                onClick={() => setSource("curated")}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-ink/70 ring-1 ring-black/5 transition hover:bg-ink/5"
              >
                Use curated
              </button>
            </div>
          </div>
        )}

        {!showLoading && !showError && (
          <>
            <div className="mb-8">
              <FilterBar
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
                season={season}
                onSeasonChange={setSeason}
                colors={colors}
                activeColor={color}
                onColorChange={setColor}
                resultCount={filtered.length}
                totalCount={dataset.length}
                showSeasons={hasSeasons}
                showColors={hasColorVariety}
              />
            </div>

            {filtered.length > 0 ? (
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((item) => (
                  <ProduceCard key={item.id} item={item} />
                ))}
              </section>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/60 px-6 py-20 text-center ring-1 ring-black/5 backdrop-blur-sm">
                <span className="text-4xl">{"\u{1F33F}"}</span>
                <h2 className="font-display text-2xl text-ink">Nothing in season</h2>
                <p className="max-w-sm text-sm text-ink/60">
                  No produce matches these filters. Try clearing a few — the harvest
                  shifts with patience.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                >
                  Reset filters
                </button>
              </div>
            )}

            {source === "wikidata" && wikidataItems && wikidataItems.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-ink/60 ring-1 ring-black/5 transition hover:bg-ink/5 hover:text-ink"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh from Wikidata
                </button>
              </div>
            )}
          </>
        )}

        <footer className="mt-16 flex flex-col items-center gap-1 text-center text-xs text-ink/40">
          <span>
            {source === "wikidata"
              ? "Streamed from Wikidata. Cached locally."
              : "Grown locally. Rendered on demand."}
          </span>
          <span>{new Date().getFullYear()} - The Produce Gallery</span>
        </footer>
      </div>
    </div>
  );
}

interface SourceToggleProps {
  source: Source;
  onChange: (s: Source) => void;
}

function SourceToggle({ source, onChange }: SourceToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-soft ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => onChange("curated")}
        className={
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition " +
          (source === "curated"
            ? "bg-ink text-cream"
            : "text-ink/60 hover:text-ink")
        }
      >
        <Sprout className="h-3.5 w-3.5" />
        Curated
      </button>
      <button
        type="button"
        onClick={() => onChange("wikidata")}
        className={
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition " +
          (source === "wikidata"
            ? "bg-ink text-cream"
            : "text-ink/60 hover:text-ink")
        }
      >
        <Database className="h-3.5 w-3.5" />
        Wikidata
      </button>
    </div>
  );
}
