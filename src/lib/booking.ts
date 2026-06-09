import { FLEET, type Vehicle } from "@/data/fleet";

/**
 * Hourly rate for a vehicle by name. Returns 0 for an unknown / missing
 * vehicle so the estimate degrades to 0 rather than NaN.
 */
export function rateFor(vehicleName: string | undefined, fleet: Vehicle[] = FLEET): number {
  return fleet.find((f) => f.name === vehicleName)?.price ?? 0;
}

/**
 * Live booking estimate: rate × hours. `hours` may be a string (form value)
 * or number; non-numeric/empty hours contribute 0 instead of producing NaN.
 */
export function estimateFor(
  vehicleName: string | undefined,
  hours: string | number | undefined,
  fleet: Vehicle[] = FLEET,
): number {
  const h = parseInt(String(hours), 10);
  return rateFor(vehicleName, fleet) * (Number.isNaN(h) ? 0 : h);
}

/**
 * First name for the confirmation toast. Tolerates empty strings, extra
 * whitespace, and single-word names without throwing.
 */
export function firstName(fullName: string | undefined | null): string {
  return String(fullName ?? "").trim().split(/\s+/)[0] || "";
}

export interface BookingFields {
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  hours?: string;
  vehicle?: string;
  pax?: string;
  name?: string;
  phone?: string;
}

/**
 * Booking form requires pickup, date, name and phone. Returns the precise set
 * of missing fields so callers can prompt accordingly.
 */
export function validateBooking(bk: BookingFields = {}): { valid: boolean; missing: string[] } {
  const required: (keyof BookingFields)[] = ["pickup", "date", "name", "phone"];
  const missing = required.filter((k) => !String(bk[k] ?? "").trim());
  return { valid: missing.length === 0, missing };
}

export interface LeadFields {
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
}

/**
 * Lead form requires a name and at least one way to reach them (email OR phone).
 */
export function validateLead(lead: LeadFields = {}): {
  valid: boolean;
  hasName: boolean;
  hasContact: boolean;
} {
  const hasName = !!String(lead.name ?? "").trim();
  const hasContact =
    !!String(lead.email ?? "").trim() || !!String(lead.phone ?? "").trim();
  return { valid: hasName && hasContact, hasName, hasContact };
}
