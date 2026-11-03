export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioName: string;
  studioImage?: string;
  studioLocation?: string;
  studioCategory?: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  total: number;
  status: BookingStatus;
  userEmail: string;
  userName?: string;
  ownerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingInput {
  studioId: string;
  userEmail: string;
  userName?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export type BookingsResult =
  | { ok: true; bookings: Booking[] }
  | { ok: false; error: string };

export type BookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export type MutationResult =
  | { ok: true }
  | { ok: false; error: string };
