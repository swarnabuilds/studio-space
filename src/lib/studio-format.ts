const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatPrice(value?: number): string {
  if (!Number.isFinite(value)) return "—";
  return currencyFormatter.format(value as number);
}

export function formatNumber(value?: number): string {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(value as number);
}

export function formatRating(value?: number): string {
  if (!Number.isFinite(value) || (value as number) <= 0) return "New";
  return (value as number).toFixed(1);
}

export function formatArea(value?: number): string {
  if (!Number.isFinite(value) || (value as number) <= 0) return "—";
  return `${numberFormatter.format(value as number)} sq ft`;
}

export function formatCapacity(value?: number): string {
  if (!Number.isFinite(value) || (value as number) <= 0) return "—";
  return `${numberFormatter.format(value as number)} people`;
}

export function formatDate(value?: string | Date): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return dateFormatter.format(date);
}
