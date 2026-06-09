# The Chauffeurs (TC) — Luxury Chauffeured SUV Platform

> Project kickoff & roadmap. A premium, interactive booking site for a private full-size luxury SUV chauffeur service.

---

## 1. Overview

**The Chauffeurs** (a.k.a. **TC**) is a luxury transportation web platform. The goal is a site that feels less like a form and more like a **showroom** — cinematic, interactive, and built to convert visitors into reservations.

**Audience:** corporate clients, airport travelers, weddings & events, nights out, and standing/recurring rides.

**Core promise:** arrive in quiet command. Full-size luxury SUVs, professionally chauffeured.

> **Note:** Brand name (**The Chauffeurs / TC**) and palette (**gold, black, silver**) are confirmed. Phone/email and the **logo file + owner photo** are still placeholders — supply real values before launch.

---

## 2. Current Status — Prototype (`luxury-transport-site.jsx`)

A single self-contained React component is already built and functional in-browser. It includes:

- **Cinematic intro reveal** — a mouse-tracking 3D chauffeur silhouette that dissolves to reveal the site. (Placeholder for a real cut-out photo of the owner.)
- **3D rotating showroom hero** — all five SUVs arranged evenly around a tilted, slowly-rotating turntable. Front car scales up/brightens; rear cars shrink, fade, and blur for depth. Tap a car, the tabs, or the arrows to spin it to the front; rotation pauses on hover.
- **Five vehicles:** Lincoln Navigator, Cadillac Escalade, Party Bus, Mercedes-Benz Sprinter, Chevrolet Suburban.
- **Price-on-hover** — rate fades in when the visitor glosses over the vehicle.
- **Booking form** with a live estimate (rate × hours) and confirmation toast.
- **Lead-capture / callback form** with confirmation.
- **Unified Services section** — every service type (airport, corporate, weddings, nights out, hourly, group travel, intercity drop-offs to CA/AZ/UT) woven into the single page.
- **Luxury theme** — black + champagne-gold, Didot-style display type, grain + vignette atmosphere.

**Important limitations to resolve:**
- Forms are **in-browser only** — no submissions are sent or stored yet. The backend that will receive them (accounts + CRM) is specced in **§12**.
- Vehicles and the chauffeur are stylized SVGs (zero external assets) — swap for real imagery at launch. The current "3D" comes from the circular arrangement, perspective, and depth scaling, **not** true rotatable car models (flat art can't show its own sides as it turns). See §11 for the genuine-3D upgrade path.
- It is **one component**, not a deployable project — needs a scaffold (see §7).

---

## 3. Tech Notes

**Current**
- Single React component, default-exported `App`.
- Styling is custom CSS injected via a `<style>` tag — **Tailwind is NOT required**.
- Only dependency: React.

**Proposed stack for the real build**
- **Framework:** Vite + React — the right fit given the confirmed single-page design (no multi-page routing/SSR needed). _(Next.js only if the plan later changes to separate SEO landing pages.)_
- **Hosting:** Vercel or Netlify (auto-deploy from GitHub, free SSL).
- **Styling:** keep the existing CSS approach, or migrate to CSS Modules / Tailwind as the team prefers.
- **Forms/backend:** serverless functions (Vercel/Netlify) or a form service.

---

## 4. Feature Roadmap

### Phase 1 — Launch MVP
- [ ] Wire **booking form** to email + a CRM/spreadsheet (Formspree, Resend, or Zapier).
- [ ] Wire **lead-capture form** to the same destination.
- [x] **Pricing model confirmed** — hourly $80–$100/vehicle + gratuity, no fees, no flat transfers. _(Live in prototype; confirm exact per-vehicle rates with owner.)_
- [ ] Replace silhouette with a **real photo of the owner**; add **real vehicle imagery**.
- [ ] Responsive / mobile QA pass.
- [ ] SEO meta tags, favicon, social share (OG) image.
- [ ] Domain, SSL, and production deploy.
- [ ] Privacy Policy + Terms pages.

### Phase 2 — Conversion & Trust
- [ ] **Instant fare calculator** — distance-based quotes via Google Maps Distance Matrix.
- [ ] **Online payment / deposit** — Stripe Checkout.
- [ ] **Real-time availability calendar** — prevent double-booking the fleet.
- [ ] **Flight tracking** for airport pickups (AeroDataBox / FlightAware) — delay-aware arrivals.
- [ ] **SMS + email confirmations & reminders** (Twilio + Resend).
- [ ] **Testimonials / reviews** section (optionally pulling Google reviews).
- [ ] **Trust badges** — licensed, insured, background-checked chauffeurs.
- [x] **Unified "Services" section** — airport, corporate, weddings/events, nights out, hourly/as-directed, group travel, all on the single page. _(Built; replaces the multi-page landing-page idea per the single-page decision.)_

### Phase 3 — Premium Differentiators
- [ ] **Live driver tracking / ETA map** after a ride is confirmed.
- [ ] **"Black Card" membership** — saved preferences, priority booking, member rates.
- [ ] **Gift cards.**
- [ ] **In-ride amenities selector** — champagne, water, child seat, chargers, playlist.
- [ ] **Multi-stop itinerary builder.**
- [ ] **Recurring / standing rides** for corporate accounts.
- [ ] **Genuine 3D / rotatable vehicles** — replace the stylized-SVG showroom with real spin-around models (see §11). Interior 360° viewer per vehicle; day/night showroom toggle; subtle sound design.

### Phase 4 — Operations (Owner Side)
- [ ] **Admin dashboard** — incoming leads, booking pipeline, fleet status, calendar.
- [ ] **Driver view** — assigned trips + navigation handoff.
- [ ] **Google Calendar sync.**
- [ ] **Analytics** (GA4 or Plausible) + conversion tracking.
- [ ] **Automated invoicing & receipts.**

---

## 5. Integrations & Services to Evaluate

- **Payments:** Stripe
- **Email:** Resend / SendGrid
- **SMS:** Twilio
- **Maps & distance:** Google Maps Platform
- **Flight data:** AeroDataBox or FlightAware
- **Forms/CRM (no-code option):** Formspree, Zapier, Airtable, or HubSpot
- **Reviews:** Google Business Profile API

> Each integration needs an account + API keys, stored as environment variables — **never commit keys to the repo.**

---

## 6. Customization

All editable content lives at the top of `luxury-transport-site.jsx`:

- **`CONFIG`** — brand name, tagline, phone, email, service area.
- **`FLEET`** — array of vehicles: `name`, `seats`, `bags`, `price`, `blurb`, `accent` color.

Add or remove vehicles by editing the `FLEET` array; the showroom, tabs, and booking dropdown update automatically.

---

## 7. Getting Started (Scaffold + Deploy)

```bash
# 1. Create a Vite + React project
npm create vite@latest nocturne -- --template react
cd nocturne
npm install

# 2. Add the component
#    Copy luxury-transport-site.jsx into src/
#    In src/main.jsx, import and render it:
#      import App from "./luxury-transport-site.jsx";

# 3. Run locally
npm run dev

# 4. Push to GitHub, then connect the repo to Vercel or Netlify for auto-deploy.
```

---

## 8. Claude Code Kickoff Prompt

Paste this into Claude Code inside the repo to scaffold the project:

> Scaffold a Vite + React project around `luxury-transport-site.jsx`. Set it up so the component renders as the homepage, configure a clean folder structure, add SEO meta tags and a favicon placeholder, and prepare it for deployment to Vercel. Do not add a backend yet — just get the prototype running as a deployable site. Then summarize what I need to provide (domain, real images, API keys) for Phase 1.

---

## 9. Open Questions

1. ✅ **Pricing model — ANSWERED:** Hourly, **$80–$100/hr** depending on vehicle, **plus gratuity** (added at service), with **no initial or booking fees.** No flat airport rate. _(Fleet rates set: Suburban $80; Navigator & Sprinter $95; Escalade & Party Bus $100.)_ **⚠ Confirm:** the Party Bus and Sprinter are large group vehicles that often command rates **above the $80–$100 band** in this market — verify those two with the owner.
2. ✅ **Page structure — ANSWERED:** **Single-page** experience with **all services woven together** (no multi-page routing, no separate SEO landing pages). A unified "Services" section now lives on the one page.
3. ◐ **Brand identity — PARTIAL:** Name **The Chauffeurs (TC)** ✅; colors **gold / black / silver** ✅ (already the site palette). **Still needed:** a logo file (a TC monogram is rendered as a stand-in) and a **photo of the owner** for the intro reveal (currently a silhouette).
4. ✅ **Booking destination — ANSWERED:** A **custom backend CRM** (to be built) with **logins for drivers and customers** — reviews, favorite cars & drivers, longstanding profiles, and a rewards-points system. Full spec in **§12**.
5. ✅ **Service area & hours — ANSWERED:** Based in **Las Vegas**, **24/7** service. Offers long-distance **one-way drop-offs** from Vegas to **California, Arizona & Utah** (added as an "Intercity Drop-offs" service on the page).

> **⚠ To confirm — interstate pricing:** The hourly + gratuity model fits local Vegas work, but one-way out-of-state drop-offs (e.g. Vegas → LA is ~4+ hrs each way, plus the return deadhead) usually need their own **flat or distance-based rate**. Recommend a separate price sheet for intercity drop-offs so the live estimator stays accurate. Pending owner input.

---

## 10. File Manifest

- `luxury-transport-site.jsx` — the interactive prototype (React component).
- `luxury-transport-site.md` — markdown mirror of the component (code in a fenced block).
- `kickoff.md` — this document.

---

## 11. Genuine 3D Vehicles — Upgrade Path

The current showroom fakes depth with SVGs arranged in a circle, perspective, and scaling. Flat art can't reveal its own sides as it turns, so for true spin-around-each-vehicle 3D we have two routes. Both are Phase 3 items and depend on getting real assets first.

### Option A — Higgsfield (AI-generated assets)
Use Higgsfield to generate photoreal vehicle imagery and short turntable/orbit renders for each SUV, then drive the showroom from those frames.

- **Best for:** fast, cinematic, on-brand visuals without sourcing photographers or 3D artists.
- **Output to target:** a multi-frame "360 spin" sequence per vehicle (e.g. 24–36 frames), played/scrubbed as the car rotates — i.e. an image-sequence turntable rather than a real-time 3D model.
- **Pros:** quick to produce, highly stylized to match the black + gold aesthetic, no 3D pipeline.
- **Cons:** pre-rendered (fixed angles, not freely interactive lighting/camera); needs consistent framing across the 5 vehicles; review for brand/trademark accuracy on real car models.
- **Pipeline:** generate per-vehicle frame sets → store as optimized image sequences → swap the SVG layer for a frame-scrubbing component tied to the existing rotation logic.

### Option B — three.js + glTF models (true real-time 3D)
Render actual 3D vehicle models in the browser with `three.js` (or `react-three-fiber`).

- **Best for:** genuine, freely-rotatable 3D with real-time lighting, reflections, and camera control.
- **Assets needed:** a licensed `.glb`/`.gltf` model per SUV (purchased, commissioned, or vendor-provided). **Confirm licensing for branded vehicle models.**
- **Pros:** true interactivity (orbit, zoom, configurable paint/lighting), reusable for an interior viewer, scales to a real showroom feel.
- **Cons:** heavier build + performance/loading budget (model optimization, draco compression, lazy-loading); larger asset weight on mobile; more engineering time.
- **Library note:** the artifact prototype is pinned to an older three.js; a real project should use a current `three` + `@react-three/fiber` + `@react-three/drei` setup.

### Recommendation
Start with **Option A (Higgsfield)** for a quick, beautiful upgrade that matches the brand, then move select hero vehicles to **Option B (three.js)** if the client wants full interactivity and an interior viewer. Either way, the existing rotation/selection logic and the front-car → specs/booking wiring can stay; only the per-vehicle render layer changes.

---

## 12. Accounts, CRM & Rewards — Backend Spec

This is the major build behind the marketing site: a database, authentication, and server logic. The current prototype is **frontend-only**; everything below is new work (Phase 2–3) and supersedes/expands the earlier "Black Card membership," "reviews," and "admin dashboard" roadmap bullets.

### Roles
- **Customer** — books rides, leaves reviews, saves favorites, earns rewards.
- **Driver (chauffeur)** — logs in, sees assigned trips, views ratings received.
- **Admin / Owner** — the CRM: manages leads, customers, bookings/dispatch, reviews, and rewards.

### Authentication
- Email/password (hashed via bcrypt/argon2) and/or phone OTP. **Recommended:** a managed auth provider so we don't hand-roll security.
- Role-based access control enforced on **every** endpoint.
- HTTPS only; rate-limit login; never store secrets/keys in the repo (use env vars).

### Customer features
- **Profile** — contact info, saved pickup addresses, preferences (preferred vehicle, preferred driver, notes like child seat).
- **Ride history** — past and upcoming bookings.
- **Reviews & ratings** — rate the ride, the **driver**, and the **vehicle** (1–5 + comment). Aggregates feed driver/vehicle scores and the public testimonials section. Owner-moderated.
- **Favorites** — favorite **cars** (from the fleet) and favorite **drivers**; used to pre-fill bookings and request a preferred chauffeur.
- **Rewards** — points balance, tier, and redemption (see below).

### Driver features
- Login + profile (photo, bio, languages, assigned vehicle).
- Assigned trips / schedule with status updates (en route, arrived, completed).
- Ratings received (aggregate + recent reviews, read-only).

### Admin / Owner (the CRM)
- **Leads pipeline** — everything from the site's lead-capture form.
- **Customers** — searchable list + full profiles.
- **Bookings / dispatch board** — assign driver + vehicle, move through statuses.
- **Fleet status**, **review moderation**, **rewards management** (rules + manual adjustments), and **reporting**.

### Rewards / loyalty (proposed, tune with owner)
- **Earn:** points per completed, paid trip (e.g. points per $ spent). Reversed on refund/cancellation.
- **Tiers (on-brand):** **Silver** (default) → **Gold** (after a threshold of points/rides) with perks like priority dispatch, bonus points, complimentary upgrades.
- **Redeem:** points convert to ride credit (e.g. 1,000 pts = $10 off).
- **Anti-abuse:** points only granted on completed+paid bookings; full audit trail in a ledger.

### Core data model (entities)
- `users` — id, role, name, email, phone, auth, created_at
- `customer_profiles` — user_id, saved_addresses[], preferred_vehicle_id, preferred_driver_id, notes, points_balance, tier
- `drivers` — user_id, photo_url, bio, languages, status, assigned_vehicle_id, rating_avg, rating_count
- `vehicles` — id, name, seats, bags, hourly_rate, accent, active _(mirrors the `FLEET` array)_
- `bookings` — id, customer_id, vehicle_id, driver_id, pickup, dropoff, datetime, hours, status, estimate, gratuity, total, created_at
- `reviews` — id, booking_id, customer_id, driver_id, vehicle_id, rating, comment, approved, created_at
- `favorites` — customer_id, type (car|driver), ref_id
- `rewards_ledger` — id, customer_id, booking_id, delta, reason, created_at
- `leads` — id, name, email, phone, note, status, created_at _(from the lead form)_

### API sketch (REST)
- **Auth:** `POST /auth/register`, `/auth/login`, `/auth/logout`, `GET /auth/me`
- **Profile:** `GET/PUT /me/profile`
- **Vehicles:** `GET /vehicles`
- **Bookings:** `POST /bookings`, `GET /bookings` (scoped by role), `PATCH /bookings/:id/status`
- **Reviews:** `POST /reviews`, `GET /reviews?driver=…|vehicle=…`
- **Favorites:** `POST /favorites`, `DELETE /favorites/:id`
- **Rewards:** `GET /rewards` (balance + ledger), `POST /rewards/redeem`
- **Driver:** `GET /driver/trips`, `PATCH /driver/trips/:id`
- **Admin:** `GET /admin/{leads,customers,bookings}`, dispatch + moderation `PATCH`es

### Suggested stack
- **Fastest path — Supabase:** Postgres + built-in Auth + Row-Level Security + file storage (driver/owner photos). Minimal backend code, pairs cleanly with the Vite/React frontend.
- **Alternative — custom:** Node + NestJS/Express + PostgreSQL + Prisma, JWT auth; deploy on Render/Railway/Fly.
- **Payments:** Stripe, tied to `bookings` and rewards credit.
- **Marketing:** sync customers to Klaviyo (with consent) for email/SMS.

### Recommended build order
1. Auth + customer/driver profiles.
2. Bookings wired to the existing booking form + dispatch board (replaces email-only).
3. Reviews + favorites.
4. Rewards/tiers.
5. Full owner CRM dashboard + reporting.
