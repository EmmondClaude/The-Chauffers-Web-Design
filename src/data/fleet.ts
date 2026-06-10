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

// Booking rules (owner): 2-hour minimum, waived only for arrivals to / departures
// from Las Vegas, NV.
export const BOOKING = {
  minHours: 2,
  minHoursNote: "Two-hour minimum — waived for arrivals to & departures from Las Vegas, NV.",
} as const;

// Body silhouette the 3D showroom builds for a vehicle. Maps to a placeholder
// model today; swap each to a real rigged .glb (doors as separate meshes) later.
export const VEHICLE_TYPES = ["suv", "van", "shuttle"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export interface Vehicle {
  name: string;
  type: VehicleType;
  seats: number;
  bags: number;
  price: number;
  blurb: string;
  accent: string;
  /** Paint colour used by the placeholder 3D body (hex). */
  color: string;
  year: number;
  /**
   * Filename (no extension) of the rigged model under public/models/.
   * When public/models/<model>.glb exists it is loaded; otherwise the
   * showroom falls back to placeholder geometry.
   */
  model: string;
}

export const FLEET: Vehicle[] = [
  { name: "Ford E-450 Shuttle · 16",  type: "shuttle", seats: 16, bags: 12, price: 198, year: 2015, color: "#0c0c0f", accent: "#c9a96a", model: "e450-16-black", blurb: "Sixteen seats of coach-built comfort — the group mover, in black." },
  { name: "Ford E-450 Shuttle · 20",  type: "shuttle", seats: 20, bags: 14, price: 225, year: 2015, color: "#eef0f2", accent: "#d8c08a", model: "e450-20-white", blurb: "Twenty across in pearl white — the largest of the fleet." },
  { name: "Mercedes-Benz Sprinter · 14", type: "van",  seats: 14, bags: 9,  price: 175, year: 2015, color: "#15151b", accent: "#c0c4cc", model: "sprinter", blurb: "High-roof luxury van — executive group travel in quiet comfort." },
  { name: "Cadillac Escalade",        type: "suv",     seats: 7,  bags: 5,  price: 120, year: 2015, color: "#0d0d10", accent: "#d8c08a", model: "escalade", blurb: "The icon. Unmistakable street presence." },
  { name: "Chevrolet Suburban",       type: "suv",     seats: 8,  bags: 7,  price: 95,  year: 2015, color: "#101015", accent: "#cdb583", model: "suburban", blurb: "The long-body standard for groups & gear." },
  { name: "GMC Yukon",                type: "suv",     seats: 7,  bags: 5,  price: 95,  year: 2015, color: "#0e0e12", accent: "#cdb583", model: "yukon", blurb: "Refined, understated muscle — the quiet executive choice." },
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
  { icon: "⚜", title: "Group & Family Travel", desc: "Full-size SUVs and shuttles with room for the whole party and the luggage." },
  { icon: "➤", title: "Intercity Drop-offs", desc: "Long-distance, one-way service from Las Vegas to California, Arizona & Utah." },
];

// The three services featured on the home page (the rest live on /about).
export const FEATURED_SERVICES: Service[] = [SERVICES[0], SERVICES[1], SERVICES[5]];
