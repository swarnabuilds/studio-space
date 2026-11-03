export type StudioCategory =
  | "photography"
  | "filmmaking"
  | "podcasting"
  | "music"
  | "workshop"
  | "dance";

export type StudioSort = "newest" | "rating" | "price-asc" | "price-desc";

export interface Studio {
  _id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  image: string;
  capacity?: number;
  areaSize?: number;
  rating?: number;
  contactEmail?: string;
  contactPhone?: string;
  amenities?: string[];
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
}

export interface StudioQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  minRating?: number;
  sort: StudioSort;
}

export type StudiosResult =
  | { ok: true; studios: Studio[] }
  | { ok: false; error: string };

export type StudioResult =
  | { ok: true; studio: Studio }
  | { ok: false; reason: "not-found" | "error"; error?: string };
