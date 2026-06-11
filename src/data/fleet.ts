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
   * Filename (no extension) of the rigged model under public/models/ (legacy 3D
   * path — kept for reference).
   */
  model: string;
  /** Photoreal poster image (Higgsfield render). */
  poster: string;
  /** Door-opening "step inside" clip (Higgsfield image-to-video). */
  video?: string;
}

// Higgsfield CDN base for generated media. TODO: self-host these (commit to
// the repo / move to our own CDN) — they're hotlinked for now.
const M = "https://d8j0ntlcm91z4.cloudfront.net/user_3ECGVFZTaGiKHb6MBbVpPbvllLv/";

export const FLEET: Vehicle[] = [
  { name: "Ford E-450 Shuttle · 16",  type: "shuttle", seats: 16, bags: 12, price: 198, year: 2015, color: "#0c0c0f", accent: "#c9a96a", model: "e450-16-black", blurb: "Sixteen seats of coach-built comfort — the group mover, in black.",
    poster: M + "hf_20260611_061251_f054e09f-5c76-4506-b344-452ff51818e0.png" },
  { name: "Ford E-450 Shuttle · 20",  type: "shuttle", seats: 20, bags: 14, price: 225, year: 2015, color: "#eef0f2", accent: "#d8c08a", model: "e450-20-white", blurb: "Twenty across in pearl white — the largest of the fleet.",
    poster: M + "hf_20260611_061253_24d13ac8-8c63-4d62-8fb2-5009ef76c1b8.png",
    video: M + "hf_20260611_061548_edbc586e-dd10-492c-a3bd-481588b060b5.mp4" },
  { name: "Mercedes-Benz Sprinter · 14", type: "van",  seats: 14, bags: 9,  price: 175, year: 2015, color: "#15151b", accent: "#c0c4cc", model: "sprinter", blurb: "High-roof luxury van — executive group travel in quiet comfort.",
    poster: M + "hf_20260609_061724_ff82f225-1eca-47be-9b7b-58df2a99a104.png",
    video: M + "hf_20260611_061550_18e551a9-e8ca-4041-996b-d8be3a2df1c4.mp4" },
  { name: "Cadillac Escalade",        type: "suv",     seats: 7,  bags: 5,  price: 120, year: 2015, color: "#0d0d10", accent: "#d8c08a", model: "escalade", blurb: "The icon. Unmistakable street presence.",
    poster: M + "hf_20260609_061723_96077e6f-0c14-47e3-bf1b-99f7f96dc957.png" },
  { name: "Chevrolet Suburban",       type: "suv",     seats: 8,  bags: 7,  price: 95,  year: 2015, color: "#101015", accent: "#cdb583", model: "suburban", blurb: "The long-body standard for groups & gear.",
    poster: M + "hf_20260609_061726_49cc417f-1464-451b-8485-137f1481714d.png",
    video: M + "hf_20260611_061554_86ead3fb-96a8-4518-b05b-10635209b010.mp4" },
  { name: "GMC Yukon",                type: "suv",     seats: 7,  bags: 5,  price: 95,  year: 2015, color: "#0e0e12", accent: "#cdb583", model: "yukon", blurb: "Refined, understated muscle — the quiet executive choice.",
    poster: M + "hf_20260611_061254_13fd9890-db0e-4806-8202-f693f499fa63.png",
    video: M + "hf_20260611_061556_8027f5d4-b050-4edb-8fab-ceda042616d5.mp4" },
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
