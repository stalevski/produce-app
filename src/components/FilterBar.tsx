import { Search, X } from "lucide-react";
import type { Category, Season } from "../types";

export type CategoryFilter = "all" | Category;
export type SeasonFilter = "all" | Season;

interface FilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: CategoryFilter;
  onCategoryChange: (c: CategoryFilter) => void;
  season: SeasonFilter;
  onSeasonChange: (s: SeasonFilter) => void;
  colors: string[];
  activeColor: string | null;
  onColorChange: (c: string | null) => void;
  resultCount: number;
  totalCount: number;
  showSeasons?: boolean;
  showColors?: boolean;
}

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fruit", label: "Fruits" },
  { value: "vegetable", label: "Vegetables" },
  { value: "herb", label: "Herbs" },
  { value: "spice", label: "Spices" },
];

const SEASONS: { value: SeasonFilter; label: string }[] = [
  { value: "all", label: "Any season" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
];

export function FilterBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  season,
  onSeasonChange,
  colors,
  activeColor,
  onColorChange,
  resultCount,
  totalCount,
  showSeasons = true,
  showColors = true,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-white/60 p-5 ring-1 ring-black/5 backdrop-blur-sm shadow-soft">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search produce, origin, or description..."
          className="w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-10 text-sm text-ink placeholder:text-ink/40 ring-1 ring-black/5 outline-none transition focus:ring-2 focus:ring-ink/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => {
            const active = c.value === category;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onCategoryChange(c.value)}
                className={
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition " +
                  (active
                    ? "bg-ink text-cream shadow-soft"
                    : "bg-white text-ink/70 ring-1 ring-black/5 hover:bg-ink/5")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {showSeasons && (
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-wider text-ink/50">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => onSeasonChange(e.target.value as SeasonFilter)}
              className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink/80 ring-1 ring-black/5 outline-none transition focus:ring-2 focus:ring-ink/30"
            >
              {SEASONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showColors && (
          <>
            <span className="text-xs uppercase tracking-wider text-ink/50">
              Color
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onColorChange(null)}
                className={
                  "rounded-full px-3 py-1 text-xs font-medium transition " +
                  (activeColor === null
                    ? "bg-ink text-cream"
                    : "bg-white text-ink/70 ring-1 ring-black/5 hover:bg-ink/5")
                }
              >
                Any
              </button>
              {colors.map((c) => {
                const active = activeColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onColorChange(active ? null : c)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition " +
                      (active
                        ? "bg-ink text-cream"
                        : "bg-white text-ink/70 ring-1 ring-black/5 hover:bg-ink/5")
                    }
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: colorHex(c) }}
                    />
                    {c}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <span className="ml-auto text-xs text-ink/50">
          {resultCount} of {totalCount}
        </span>
      </div>
    </div>
  );
}

function colorHex(name: string): string {
  switch (name.toLowerCase()) {
    case "red":
      return "#D7263D";
    case "orange":
      return "#F08A24";
    case "yellow":
      return "#F4C430";
    case "green":
      return "#4F7F3F";
    case "blue":
      return "#3D5A80";
    case "purple":
      return "#5C2A6A";
    case "white":
      return "#E8E1CD";
    default:
      return "#999";
  }
}
