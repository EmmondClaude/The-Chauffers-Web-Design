/* =========================================================================
   EDIT EVERYTHING HERE  ▸ single source of truth for the client to update
   ========================================================================= */

export const CONFIG = {
  brand: "The Chauffeurs", // primary brand name (a.k.a. TC)
  tagline: "Private Chauffeured SUVs",
  phone: "(555) 010-2025", // ← PLACEHOLDER: real phone before launch
  email: "reserve@thechauffeurs.com", // ← PLACEHOLDER: confirm real email before launch
  city: "Based in Las Vegas · 24/7 · Drop-offs to California, Arizona & Utah",
} as const;

// The three shapes the showroom knows how to render. A FLEET entry whose
// `type` is outside this union renders nothing — the data-guard tests assert it.
export const VEHICLE_TYPES = ["suv", "van", "bus"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export interface Vehicle {
  name: string;
  type: VehicleType;
  seats: number;
  bags: number;
  price: number;
  blurb: string;
  accent: string;
}

export const FLEET: Vehicle[] = [
  { name: "Lincoln Navigator",      type: "suv", seats: 7,  bags: 5, price: 95,  blurb: "Aviator-grade quiet. The flagship arrival.",                  accent: "#c9a96a" },
  { name: "Cadillac Escalade",      type: "suv", seats: 7,  bags: 5, price: 100, blurb: "The icon. Unmistakable street presence.",                      accent: "#d8c08a" },
  { name: "Party Bus",              type: "bus", seats: 18, bags: 4, price: 100, blurb: "Lounge seating and lights — the celebration travels with you.", accent: "#d8c08a" },
  { name: "Mercedes-Benz Sprinter", type: "van", seats: 12, bags: 8, price: 95,  blurb: "High-roof luxury van — executive group travel in comfort.",     accent: "#c0c4cc" },
  { name: "Chevrolet Suburban",     type: "suv", seats: 8,  bags: 7, price: 80,  blurb: "The long-body standard for groups & gear.",                    accent: "#cdb583" },
];

export interface Service {
  icon: string;
  title: string;
  desc: string;
}

export const SERVICES: Service[] = [
  { icon: "✈", title: "Airport Arrivals & Departures", desc: "Curbside meet-and-greet with flight-aware timing, so the car is there when you land." },
  { icon: "❖", title: "Corporate & Roadshows", desc: "Discreet, on-schedule multi-stop travel for executives and teams." },
  { icon: "♛", title: "Weddings & Events", desc: "Red-carpet arrivals and coordinated timing for your big day." },
  { icon: "✦", title: "Nights Out & Occasions", desc: "Dinners, concerts, and celebrations — arrive and leave in comfort." },
  { icon: "◷", title: "Hourly / As-Directed", desc: "Keep the SUV and chauffeur on call for the hours you need." },
  { icon: "⚜", title: "Group & Family Travel", desc: "Full-size SUVs with room for the whole party and the luggage." },
  { icon: "➤", title: "Intercity Drop-offs", desc: "Long-distance, one-way service from Las Vegas to California, Arizona & Utah." },
];
