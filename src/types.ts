export type Category = "fruit" | "vegetable" | "herb" | "spice";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type Source = "curated" | "wikidata";

export interface ProduceItem {
  id: string;
  name: string;
  category: Category;
  emoji?: string;
  imageUrl?: string;
  color?: string;
  colorHex?: string;
  seasons?: Season[];
  origin?: string;
  description?: string;
  funFact?: string;
  source?: Source;
  url?: string;
}
