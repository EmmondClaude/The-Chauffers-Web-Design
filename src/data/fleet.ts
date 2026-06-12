/* =========================================================================
   EDIT EVERYTHING HERE  —  single source of truth for the client to update
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

// The 3D brand emblem (Higgsfield render). Hotlinked for now; self-host TODO.
export const BRAND_EMBLEM = M + "hf_20260612_053130_ab025f3a-2502-40f4-9038-516b46133177.png";

export const FLEET: Vehicle[] = [
  { name: "Ford E-450 Shuttle · 16",  type: "shuttle", seats: 16, bags: 12, price: 198, year: 2015, color: "#0c0c0f", accent: "#c9a96a", model: "e450-16-black", blurb: "Sixteen seats of coach-built comfort — the group mover, in black.",
    poster: M + "hf_20260611_063738_85a95ee1-4633-4a38-bc4b-39ab12221cec_min.webp",
    video: M + "hf_20260611_064015_e47f5650-9dcf-440d-9e2a-f9a9085ad8cb.mp4" },
  { name: "Ford E-450 Shuttle · 20",  type: "shuttle", seats: 20, bags: 14, price: 225, year: 2015, color: "#eef0f2", accent: "#d8c08a", model: "e450-20-white", blurb: "Twenty across in pearl white — the largest of the fleet.",
    poster: M + "hf_20260611_063740_92241ae6-68d4-4fad-8f6f-4fe510080689_min.webp",
    video: M + "hf_20260611_064017_0d245432-ba08-4576-ab27-43b084698149.mp4" },
  { name: "Mercedes-Benz Sprinter · 14", type: "van",  seats: 14, bags: 9,  price: 175, year: 2015, color: "#15151b", accent: "#c0c4cc", model: "sprinter", blurb: "High-roof luxury van — executive group travel in quiet comfort.",
    poster: M + "hf_20260611_063743_2bef7a9b-2a5d-4c07-bcab-7029438c175b_min.webp",
    video: M + "hf_20260611_064020_9b46311c-f4ef-4e2e-820d-e1fef9177b6e.mp4" },
  { name: "Cadillac Escalade",        type: "suv",     seats: 7,  bags: 5,  price: 120, year: 2015, color: "#0d0d10", accent: "#d8c08a", model: "escalade", blurb: "The icon. Unmistakable street presence.",
    poster: M + "hf_20260611_063748_dde9417d-8ba7-4c9e-aebd-ff9295f88771_min.webp",
    video: M + "hf_20260611_064021_e4984c44-4dc0-4469-9633-37d3e00977f3.mp4" },
  { name: "Chevrolet Suburban",       type: "suv",     seats: 8,  bags: 7,  price: 95,  year: 2015, color: "#101015", accent: "#cdb583", model: "suburban", blurb: "The long-body standard for groups & gear.",
    poster: M + "hf_20260611_063749_c8bd69bd-50a8-4c25-8211-3da173c47201_min.webp",
    video: M + "hf_20260611_064024_30688bc8-6d2a-417e-891d-081120671e0b.mp4" },
  { name: "GMC Yukon",                type: "suv",     seats: 7,  bags: 5,  price: 95,  year: 2015, color: "#0e0e12", accent: "#cdb583", model: "yukon", blurb: "Refined, understated muscle — the quiet executive choice.",
    poster: M + "hf_20260611_063750_bf0c153b-65ff-4be3-876d-a9afe5d092da_min.webp",
    video: M + "hf_20260611_064025_3683f420-9767-485c-a7e6-fba13ea52926.mp4" },
];

export interface Service {
  title: string;
  desc: string;
}

export const SERVICES: Service[] = [
  { title: "Airport Arrivals & Departures", desc: "Curbside meet-and-greet with flight-aware timing, so the car is there when you land." },
  { title: "Corporate & Roadshows", desc: "Discreet, on-schedule multi-stop travel for executives and teams." },
  { title: "Weddings & Events", desc: "Red-carpet arrivals and coordinated timing for your big day." },
  { title: "Nights Out & Occasions", desc: "Dinners, concerts, and celebrations — arrive and leave in comfort." },
  { title: "Hourly / As-Directed", desc: "Keep the SUV and chauffeur on call for the hours you need." },
  { title: "Group & Family Travel", desc: "Full-size SUVs and shuttles with room for the whole party and the luggage." },
  { title: "Intercity Drop-offs", desc: "Long-distance, one-way service from Las Vegas to California, Arizona & Utah." },
];

// The three services featured on the home page (the rest live on /about).
export const FEATURED_SERVICES: Service[] = [SERVICES[0], SERVICES[1], SERVICES[5]];
