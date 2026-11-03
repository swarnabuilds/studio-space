import {
  Camera,
  Clapperboard,
  GraduationCap,
  Mic2,
  Music2,
  PersonStanding,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

import type { StudioCategory } from "@/types/studio";

export interface StudioCategoryMeta {
  value: StudioCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}

export const STUDIO_CATEGORIES: StudioCategoryMeta[] = [
  {
    value: "photography",
    label: "Photography Studio",
    shortLabel: "Photography",
    description: "Natural light, seamless backdrops, and strobe-ready spaces.",
    icon: Camera,
  },
  {
    value: "filmmaking",
    label: "Film & Video Stage",
    shortLabel: "Filmmaking",
    description: "Cycloramas, rigging, and room for a full crew.",
    icon: Clapperboard,
  },
  {
    value: "podcasting",
    label: "Podcast Booth",
    shortLabel: "Podcasting",
    description: "Treated rooms, mics, and a quiet place to record.",
    icon: Mic2,
  },
  {
    value: "music",
    label: "Music & Sound Studio",
    shortLabel: "Music",
    description: "Live rooms, control rooms, and mixing-ready gear.",
    icon: Music2,
  },
  {
    value: "workshop",
    label: "Workshop & Classroom",
    shortLabel: "Workshop",
    description: "Flexible layouts for classes, shoots, and team sessions.",
    icon: GraduationCap,
  },
  {
    value: "dance",
    label: "Dance & Rehearsal",
    shortLabel: "Dance",
    description: "Sprung floors, mirrors, and rehearsal sound systems.",
    icon: PersonStanding,
  },
];

const CATEGORY_BY_VALUE = new Map(
  STUDIO_CATEGORIES.map((category) => [category.value, category])
);

export const STUDIO_CATEGORY_VALUES = STUDIO_CATEGORIES.map(
  (category) => category.value
);

export function getCategoryMeta(category?: string): StudioCategoryMeta | null {
  if (!category) return null;
  return CATEGORY_BY_VALUE.get(category.toLowerCase() as StudioCategory) ?? null;
}

export function getCategoryIcon(category?: string): LucideIcon {
  return getCategoryMeta(category)?.icon ?? Sparkles;
}

/**
 * Renders the category icon without binding a component to a local variable
 * during render, which the React Compiler lint rule disallows.
 */
export function categoryIconElement(category: string | undefined, className: string) {
  return createElement(getCategoryIcon(category), {
    className,
    "aria-hidden": true,
  });
}

export function getCategoryLabel(category?: string): string {
  if (!category) return "Creative Space";
  return getCategoryMeta(category)?.label ?? titleCase(category);
}

export function getCategoryShortLabel(category?: string): string {
  if (!category) return "Studio";
  return getCategoryMeta(category)?.shortLabel ?? titleCase(category);
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
