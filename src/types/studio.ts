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
  ownerEmail?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  minRating?: number;
  limit?: number;
  sort: StudioSort;
}

export interface StudioInput {
  name: string;
  category: string;
  price: number;
  location: string;
  image: string;
  capacity: number;
  areaSize?: number;
  rating?: number;
  contactEmail: string;
  contactPhone: string;
  amenities: string[];
  description: string;
}

export interface CreateStudioInput extends StudioInput {
  ownerEmail: string;
  ownerName: string;
}

export type StudiosResult =
  | { ok: true; studios: Studio[] }
  | { ok: false; error: string };

export type StudioResult =
  | { ok: true; studio: Studio }
  | { ok: false; reason: "not-found" | "error"; error?: string };

export type StudioMutationResult =
  | { ok: true; studio?: Studio }
  | { ok: false; error: string };
