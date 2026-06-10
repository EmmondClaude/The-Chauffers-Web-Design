'use client';

import { useState, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { CONFIG, FLEET, FEATURED_SERVICES, BOOKING } from '@/data/fleet';
import { estimateFor, firstName, validateBooking, validateLead } from '@/lib/booking';
import { wrapIndex } from '@/lib/showroom';
import Showroom3D from '@/components/Showroom3D';
import Logo from '@/components/Logo';

/* Content lives in @/data/fleet — the single source of truth the client edits.
   Pure booking logic lives in @/lib and is unit-tested. The 3D showroom lives
   in @/components/Showroom3D. */

/* ============================== STYLES =================================== */
const CSS = `
:root{
  --ink:#08080b; --char:#121217; --char2:#1b1b22;
  --gold:#c9a96a; --gold-2:#e8d8a8; --silver:#b8bcc4; --cream:#f4efe6;
  --serif: "Didot","Bodoni MT","Playfair Display",Georgia,"Times New Roman",serif;
  --sans: "Optima","Avenir Next","Gill Sans","Helvetica Neue",sans-serif;
}
.nz-root *{box-sizing:border-box;margin:0;padding:0}
.nz-root{background:var(--ink);color:var(--cream);font-family:var(--sans);
  min-height:100vh;overflow-x:hidden;position:relative;}
.nz-grain{pointer-events:none;position:fixed;inset:0;z-index:60;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.nz-vignette{pointer-events:none;position:fixed;inset:0;z-index:1;
  background:radial-gradient(120% 90% at 50% 0%,rgba(201,169,106,.10),transparent 55%),
             radial-gradient(140% 120% at 50% 120%,rgba(0,0,0,.7),transparent 60%);}

/* ---- intro overlay ---- */
.nz-intro{position:fixed;inset:0;z-index:80;display:flex;flex-direction:column;
  align-items:center;justify-content:center;background:radial-gradient(60% 60% at 50% 40%,#16161d,#06060a 75%);
  transition:opacity 1s ease, transform 1.1s cubic-bezier(.16,1,.3,1);}
.nz-intro.hide{opacity:0;transform:scale(1.08);pointer-events:none;}
.nz-stage{perspective:900px;}
.nz-fig{transform-style:preserve-3d;transition:transform .15s ease-out;filter:drop-shadow(0 40px 60px rgba(0,0,0,.8));}
.nz-halo{position:absolute;width:520px;height:520px;border-radius:50%;left:50%;top:46%;
  transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(201,169,106,.22),transparent 60%);
  animation:pulse 5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.07)}}
.nz-introbrand{font-family:var(--serif);font-size:13px;letter-spacing:.7em;color:var(--gold);
  margin-bottom:10px;text-indent:.7em;}
.nz-introtitle{font-family:var(--serif);font-size:clamp(40px,9vw,86px);line-height:1;letter-spacing:.02em;}
.nz-introsub{margin-top:14px;font-size:11px;letter-spacing:.45em;color:var(--silver);text-transform:uppercase;}
.nz-enter{margin-top:40px;background:none;border:1px solid rgba(201,169,106,.5);color:var(--gold-2);
  font-family:var(--sans);font-size:11px;letter-spacing:.4em;padding:16px 40px;cursor:pointer;
  text-transform:uppercase;transition:.4s;border-radius:2px;}
.nz-enter:hover{background:var(--gold);color:#0a0a0a;border-color:var(--gold);letter-spacing:.5em;}

/* ---- reveal of main ---- */
.nz-main{position:relative;z-index:2;opacity:0;}
.nz-main.show{opacity:1;}
/* scroll-reveal — elements rise + fade as they enter the viewport */
.rv{opacity:0;transform:translateY(42px);
  transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);will-change:opacity,transform;}
.rv.in-view{opacity:1;transform:none;}
@keyframes fadeUp{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.rv{opacity:1!important;transform:none!important;transition:none;}}

/* ---- nav ---- */
.nz-nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
  padding:20px clamp(18px,5vw,56px);backdrop-filter:blur(10px);background:linear-gradient(180deg,rgba(8,8,11,.85),rgba(8,8,11,0));}
.nz-logo{display:flex;align-items:center;gap:12px;font-family:var(--serif);color:var(--cream);}
.nz-mono{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:3px;
  border:1px solid var(--gold);color:var(--gold-2);font-size:16px;letter-spacing:.04em;
  background:linear-gradient(180deg,rgba(201,169,106,.14),rgba(201,169,106,.02));}
.nz-word{font-size:19px;letter-spacing:.22em;}
.nz-logo b{color:var(--gold);font-weight:400;}
.nz-navlinks{display:flex;gap:30px;align-items:center;}
.nz-navlink{background:none;border:none;color:var(--silver);font-family:var(--sans);font-size:11px;
  letter-spacing:.28em;text-transform:uppercase;cursor:pointer;transition:.3s;}
.nz-navlink:hover{color:var(--gold-2);}
.nz-callbtn{border:1px solid var(--gold);color:var(--gold-2);background:none;padding:11px 22px;border-radius:2px;
  font-size:11px;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;transition:.3s;}
.nz-callbtn:hover{background:var(--gold);color:#0a0a0a;}
@media(max-width:780px){.nz-navlinks .nz-navlink{display:none;}}

/* ---- hero / showroom ---- */
.nz-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:130px 20px 80px;position:relative;}
.nz-hero::before{content:"";position:absolute;left:50%;top:42%;width:min(1100px,120vw);height:760px;
  transform:translate(-50%,-50%);pointer-events:none;z-index:0;
  background:radial-gradient(closest-side,rgba(201,169,106,.16),rgba(201,169,106,.05) 45%,transparent 72%);
  filter:blur(8px);}
.nz-hero > *{position:relative;z-index:1;}
.nz-kicker{font-size:11px;letter-spacing:.62em;color:var(--gold-2);text-transform:uppercase;margin-bottom:20px;}
.nz-h1{font-family:var(--serif);font-size:clamp(40px,8.2vw,104px);line-height:.98;text-align:center;max-width:16ch;
  letter-spacing:-.005em;text-shadow:0 0 60px rgba(201,169,106,.14);}
.nz-h1 em{font-style:italic;color:var(--gold-2);}
.nz-lead{margin-top:22px;color:var(--silver);font-size:14.5px;letter-spacing:.06em;text-align:center;max-width:48ch;line-height:1.75;}

/* ---- 3D showroom stage ---- */
.nz-stage3d{position:relative;width:min(860px,96vw);height:460px;margin:18px auto 2px;border-radius:12px;overflow:hidden;
  border:1px solid rgba(201,169,106,.16);background:radial-gradient(120% 120% at 50% 18%,#101016,#06060a 72%);
  box-shadow:inset 0 0 90px rgba(0,0,0,.6), 0 30px 60px rgba(0,0,0,.45);}
.nz-stage3d canvas{display:block;width:100%!important;height:100%!important;touch-action:none;}
.nz-stage3d-hint{position:absolute;bottom:12px;left:0;right:0;text-align:center;font-size:10px;letter-spacing:.22em;
  text-transform:uppercase;color:var(--silver);opacity:.65;pointer-events:none;}
.nz-stage3d-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.nz-stage3d-name{font-family:var(--serif);font-size:clamp(24px,4vw,34px);color:var(--gold-2);}

.nz-model{font-family:var(--serif);font-size:clamp(24px,4vw,34px);margin-top:14px;text-align:center;}
.nz-modelblurb{color:var(--silver);font-size:12.5px;letter-spacing:.08em;margin-top:6px;text-align:center;}
.nz-specs{display:flex;gap:26px;justify-content:center;margin-top:12px;color:var(--cream);}
.nz-specs span{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--silver);}
.nz-specs b{font-family:var(--serif);font-size:18px;color:var(--gold-2);margin-right:6px;}

.nz-tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:26px;max-width:820px;}
.nz-tab{background:rgba(255,255,255,.02);border:1px solid rgba(184,188,196,.18);color:var(--silver);
  padding:10px 16px;border-radius:2px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  cursor:pointer;transition:.3s;}
.nz-tab:hover{border-color:var(--gold);color:var(--cream);}
.nz-tab.on{background:var(--gold);border-color:var(--gold);color:#0a0a0a;}
.nz-arrows{display:flex;gap:12px;margin-top:18px;}
.nz-arrow{width:44px;height:44px;border-radius:50%;border:1px solid rgba(201,169,106,.4);background:none;
  color:var(--gold-2);font-size:18px;cursor:pointer;transition:.3s;}
.nz-arrow:hover{background:var(--gold);color:#0a0a0a;}

/* ---- generic section ---- */
.nz-sec{padding:140px clamp(18px,5vw,56px);max-width:1080px;margin:0 auto;}
.nz-eyebrow{font-size:11px;letter-spacing:.62em;color:var(--gold-2);text-transform:uppercase;text-align:center;}
.nz-sectitle{font-family:var(--serif);font-size:clamp(30px,5.6vw,66px);line-height:1.02;text-align:center;margin-top:14px;
  text-shadow:0 0 50px rgba(201,169,106,.12);}
.nz-rule{width:64px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:26px auto 0;}
.nz-services{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px;}
.nz-services-3{max-width:960px;margin-left:auto;margin-right:auto;gap:22px;}
@media(max-width:820px){.nz-services{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.nz-services{grid-template-columns:1fr;}}
.nz-aboutlink{display:flex;justify-content:center;margin-top:34px;}
.nz-aboutbtn{display:inline-flex;align-items:center;gap:10px;color:var(--gold-2);text-decoration:none;
  font-size:11px;letter-spacing:.28em;text-transform:uppercase;padding:13px 26px;border:1px solid rgba(201,169,106,.4);
  border-radius:2px;transition:.35s;}
.nz-aboutbtn:hover{background:var(--gold);color:#0a0a0a;letter-spacing:.36em;}
.nz-scard{position:relative;background:linear-gradient(180deg,var(--char),var(--char2));border:1px solid rgba(201,169,106,.14);
  border-radius:3px;padding:30px 26px;cursor:pointer;overflow:hidden;
  transition:transform .45s cubic-bezier(.16,1,.3,1),border-color .45s,box-shadow .45s;}
.nz-scard::after{content:"";position:absolute;left:0;top:0;height:2px;width:100%;transform:scaleX(0);transform-origin:left;
  background:linear-gradient(90deg,var(--gold),var(--gold-2));transition:transform .5s cubic-bezier(.16,1,.3,1);}
.nz-scard:hover{border-color:rgba(201,169,106,.5);transform:translateY(-6px);box-shadow:0 30px 60px rgba(0,0,0,.55);}
.nz-scard:hover::after{transform:scaleX(1);}
.nz-sicon{font-size:24px;color:var(--gold-2);line-height:1;}
.nz-stitle{font-family:var(--serif);font-size:21px;color:var(--cream);margin-top:14px;}
.nz-sdesc{color:var(--silver);font-size:13px;letter-spacing:.04em;line-height:1.65;margin-top:9px;}

/* ---- booking ---- */
.nz-card{background:linear-gradient(180deg,var(--char),var(--char2));border:1px solid rgba(201,169,106,.16);
  border-radius:6px;padding:clamp(22px,4vw,40px);margin-top:40px;box-shadow:0 40px 80px rgba(0,0,0,.5);}
.nz-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 20px;}
@media(max-width:640px){.nz-grid{grid-template-columns:1fr;}}
.nz-field{display:flex;flex-direction:column;gap:7px;}
.nz-field.full{grid-column:1/-1;}
.nz-label{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--silver);}
.nz-input,.nz-select{background:#0c0c10;border:1px solid rgba(184,188,196,.2);border-radius:3px;color:var(--cream);
  padding:13px 14px;font-family:var(--sans);font-size:14px;letter-spacing:.03em;transition:.3s;}
.nz-input:focus,.nz-select:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,106,.12);}
.nz-input::placeholder{color:#5c5c66;}
.nz-cta{grid-column:1/-1;margin-top:6px;background:var(--gold);color:#0a0a0a;border:none;border-radius:3px;
  padding:17px;font-family:var(--sans);font-size:12px;letter-spacing:.32em;text-transform:uppercase;cursor:pointer;
  transition:.3s;font-weight:600;}
.nz-cta:hover{background:var(--gold-2);letter-spacing:.4em;}
.nz-quote{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;
  border-top:1px dashed rgba(201,169,106,.3);padding-top:18px;margin-top:4px;}
.nz-quote .ql{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--silver);}
.nz-quote .qv{font-family:var(--serif);font-size:34px;color:var(--gold-2);}
.nz-note{grid-column:1/-1;margin-top:-4px;font-size:10.5px;letter-spacing:.12em;color:var(--silver);text-align:center;opacity:.8;}

/* ---- confirmation toast ---- */
.nz-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);z-index:90;
  background:linear-gradient(180deg,#15151b,#0c0c10);border:1px solid var(--gold);color:var(--cream);
  padding:16px 26px;border-radius:4px;letter-spacing:.06em;font-size:13px;opacity:0;transition:.5s;
  box-shadow:0 20px 50px rgba(0,0,0,.6);max-width:90vw;text-align:center;}
.nz-toast.on{opacity:1;transform:translateX(-50%);}
.nz-toast b{color:var(--gold-2);}

/* ---- footer ---- */
.nz-foot{border-top:1px solid rgba(201,169,106,.14);padding:46px 20px;text-align:center;}
.nz-foot .fl{font-family:var(--serif);font-size:20px;letter-spacing:.3em;color:var(--cream);}
.nz-foot .fs{color:var(--silver);font-size:11px;letter-spacing:.2em;margin-top:14px;}
.nz-foot a{color:var(--gold-2);text-decoration:none;}
`;

/* ===================== CHAUFFEUR SILHOUETTE ============================== */
function Chauffeur() {
  return (
    <svg width="300" height="360" viewBox="0 0 300 360" aria-label="Chauffeur silhouette">
      <defs>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9a96a" stopOpacity="0.85" />
          <stop offset="0.18" stopColor="#1a1a1f" />
          <stop offset="1" stopColor="#050507" />
        </linearGradient>
      </defs>
      <path d="M40 360 C40 280 78 250 150 250 C222 250 260 280 260 360 Z" fill="url(#rim)" />
      <path d="M150 250 L120 360 L150 320 L180 360 Z" fill="#0a0a0d" />
      <path d="M150 256 L138 300 L150 312 L162 300 Z" fill="#161620" />
      <path d="M150 268 L144 312 L150 326 L156 312 Z" fill="#c9a96a" opacity="0.7" />
      <rect x="134" y="214" width="32" height="44" rx="12" fill="#0c0c11" />
      <ellipse cx="150" cy="178" rx="46" ry="52" fill="url(#rim)" />
      <path d="M104 150 Q150 116 196 150 L196 158 Q150 140 104 158 Z" fill="#0a0a0d" />
      <rect x="98" y="156" width="104" height="14" rx="6" fill="#08080b" />
      <rect x="116" y="148" width="68" height="10" rx="4" fill="#161620" />
      <rect x="138" y="150" width="24" height="7" rx="3" fill="#c9a96a" opacity="0.65" />
    </svg>
  );
}

/* ============================== APP ===================================== */
export default function LuxuryTransportSite() {
  const [revealed, setRevealed] = useState(false);
  const [front, setFront] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState('');
  const car = FLEET[front];

  // intro parallax tilt
  const onMove = useCallback((e: ReactMouseEvent) => {
    const cx = window.innerWidth / 2,
      cy = window.innerHeight / 2;
    setTilt({ x: ((e.clientY - cy) / cy) * -10, y: ((e.clientX - cx) / cx) * 14 });
  }, []);

  const pick = (i: number) => setFront(i);
  const move = (d: number) => setFront(wrapIndex(front, d, FLEET.length));

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4200);
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ---- booking form ---- */
  const [bk, setBk] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    hours: '3',
    vehicle: FLEET[0].name,
    pax: '2',
    name: '',
    phone: '',
  });
  // keep booking synced to the featured vehicle
  useEffect(() => {
    setBk((b) => ({ ...b, vehicle: FLEET[front].name }));
  }, [front]);

  // scroll-reveal: animate .rv elements in as they enter the viewport
  useEffect(() => {
    if (!revealed) return;
    const els = Array.from(document.querySelectorAll('.rv'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in-view');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [revealed]);
  const estimate = estimateFor(bk.vehicle, bk.hours);

  const submitBooking = async () => {
    if (!validateBooking(bk).valid) {
      flash('Please add pickup, date, name & phone to reserve.');
      return;
    }
    const [first, ...rest] = bk.name.trim().split(/\s+/);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLocation: bk.pickup,
          dropoffLocation: bk.dropoff || bk.pickup,
          pickupDate: bk.date,
          pickupTime: bk.time || '00:00',
          passengers: parseInt(bk.pax, 10) || 1,
          serviceType: 'standard',
          firstName: first,
          lastName: rest.join(' '),
          email: '',
          phone: bk.phone,
          specialRequests: `${bk.vehicle} · ${bk.hours} hrs · est $${estimate}`,
        }),
      });
    } catch {
      // Prototype backend: confirm to the guest regardless of transport errors.
    }
    flash(`Reservation requested — ${bk.vehicle} on ${bk.date}. We'll confirm shortly, ${firstName(bk.name)}.`);
  };

  /* ---- lead capture ---- */
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' });
  const submitLead = () => {
    if (!validateLead(lead).valid) {
      flash('Add your name and a way to reach you.');
      return;
    }
    flash(`Thank you, ${firstName(lead.name)} — your concierge will reach out.`);
    setLead({ name: '', email: '', phone: '', note: '' });
  };

  return (
    <div className="nz-root">
      <style>{CSS}</style>
      <div className="nz-vignette" />
      <div className="nz-grain" />

      {/* ===================== INTRO ===================== */}
      <div className={`nz-intro${revealed ? ' hide' : ''}`} onMouseMove={onMove}>
        <div className="nz-halo" />
        <div className="nz-stage">
          <div className="nz-fig" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <Chauffeur />
          </div>
        </div>
        <div className="nz-introbrand">{CONFIG.tagline.toUpperCase()}</div>
        <div className="nz-introtitle">
          <Logo variant="wordmark" hero size="clamp(40px,8.5vw,84px)" />
        </div>
        <div className="nz-introsub">Your Driver Awaits</div>
        <button className="nz-enter" onClick={() => setRevealed(true)}>
          Enter
        </button>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className={`nz-main${revealed ? ' show' : ''}`}>
        {/* NAV */}
        <nav className="nz-nav rv" style={{ animationDelay: '.05s' }}>
          <div className="nz-logo">
            <Logo variant="monogram" size={40} />
            <span className="nz-word">
              The <b>Chauffeurs</b>
            </span>
          </div>
          <div className="nz-navlinks">
            <button className="nz-navlink" onClick={() => scrollTo('fleet')}>
              Fleet
            </button>
            <button className="nz-navlink" onClick={() => scrollTo('services')}>
              Services
            </button>
            <Link className="nz-navlink" href="/about" style={{ textDecoration: 'none' }}>
              About
            </Link>
            <button className="nz-navlink" onClick={() => scrollTo('book')}>
              Reserve
            </button>
            <button className="nz-callbtn" onClick={() => scrollTo('book')}>
              Book a Car
            </button>
          </div>
        </nav>

        {/* HERO / 3D SHOWROOM */}
        <header className="nz-hero" id="fleet">
          <div className="nz-kicker rv" style={{ animationDelay: '.15s' }}>
            The Fleet
          </div>
          <h1 className="nz-h1 rv" style={{ animationDelay: '.25s' }}>
            Arrive in <em>quiet</em> command.
          </h1>
          <p className="nz-lead rv" style={{ animationDelay: '.35s' }}>
            Explore the fleet in 3D — drag to see every angle, click a vehicle to open its doors, then reserve.
          </p>

          <div className="rv" style={{ animationDelay: '.45s', width: '100%' }}>
            <Showroom3D vehicle={car} />
          </div>

          <div className="nz-model rv" style={{ animationDelay: '.5s' }}>
            {car.name}
          </div>
          <div className="nz-modelblurb">{car.blurb}</div>
          <div className="nz-specs">
            <span>
              <b>{car.seats}</b>Seats
            </span>
            <span>
              <b>{car.bags}</b>Bags
            </span>
            <span>
              <b>${car.price}</b>/ hr
            </span>
          </div>

          <div className="nz-tabs rv" style={{ animationDelay: '.6s' }}>
            {FLEET.map((f, i) => (
              <button key={f.name} className={`nz-tab${i === front ? ' on' : ''}`} onClick={() => pick(i)}>
                {f.name}
              </button>
            ))}
          </div>
          <div className="nz-arrows">
            <button className="nz-arrow" onClick={() => move(-1)} aria-label="Previous">
              ‹
            </button>
            <button className="nz-arrow" onClick={() => move(1)} aria-label="Next">
              ›
            </button>
          </div>
        </header>

        {/* SERVICES */}
        <section className="nz-sec" id="services">
          <div className="nz-eyebrow rv">What We Do</div>
          <h2 className="nz-sectitle rv">One Standard, Every Occasion</h2>
          <div className="nz-rule rv" />
          <p className="nz-lead rv" style={{ margin: '20px auto 0' }}>
            The same discreet, professionally chauffeured fleet — booked by the hour for whatever the day calls for.
          </p>
          <div className="nz-services nz-services-3 rv">
            {FEATURED_SERVICES.map((s) => (
              <div className="nz-scard" key={s.title} onClick={() => scrollTo('book')}>
                <div className="nz-sicon">{s.icon}</div>
                <div className="nz-stitle">{s.title}</div>
                <div className="nz-sdesc">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="nz-aboutlink rv">
            <Link href="/about" className="nz-aboutbtn">
              The full story &amp; every service <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="nz-lead rv" style={{ margin: '26px auto 0', fontSize: 12.5 }}>
            Billed hourly ($95–$225 by vehicle) plus gratuity · no initial or booking fees · {BOOKING.minHoursNote}
          </p>
        </section>

        {/* BOOKING */}
        <section className="nz-sec" id="book">
          <div className="nz-eyebrow rv">Reserve</div>
          <h2 className="nz-sectitle rv">Book Your Chauffeur</h2>
          <div className="nz-rule rv" />
          <div className="nz-card rv">
            <div className="nz-grid">
              <div className="nz-field">
                <label className="nz-label">Pickup Location</label>
                <input
                  className="nz-input"
                  placeholder="Address or airport"
                  value={bk.pickup}
                  onChange={(e) => setBk({ ...bk, pickup: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Drop-off</label>
                <input
                  className="nz-input"
                  placeholder="Destination"
                  value={bk.dropoff}
                  onChange={(e) => setBk({ ...bk, dropoff: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Date</label>
                <input
                  className="nz-input"
                  type="date"
                  value={bk.date}
                  onChange={(e) => setBk({ ...bk, date: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Time</label>
                <input
                  className="nz-input"
                  type="time"
                  value={bk.time}
                  onChange={(e) => setBk({ ...bk, time: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Vehicle</label>
                <select className="nz-select" value={bk.vehicle} onChange={(e) => setBk({ ...bk, vehicle: e.target.value })}>
                  {FLEET.map((f) => (
                    <option key={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="nz-field">
                <label className="nz-label">Hours Booked</label>
                <select className="nz-select" value={bk.hours} onChange={(e) => setBk({ ...bk, hours: e.target.value })}>
                  {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                    <option key={h} value={h}>
                      {h} hours
                    </option>
                  ))}
                </select>
              </div>
              <div className="nz-field">
                <label className="nz-label">Full Name</label>
                <input
                  className="nz-input"
                  placeholder="Your name"
                  value={bk.name}
                  onChange={(e) => setBk({ ...bk, name: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Phone</label>
                <input
                  className="nz-input"
                  placeholder={CONFIG.phone}
                  value={bk.phone}
                  onChange={(e) => setBk({ ...bk, phone: e.target.value })}
                />
              </div>

              <div className="nz-quote">
                <div className="ql">
                  Estimate · {bk.vehicle} × {bk.hours} hrs
                </div>
                <div className="qv">${estimate.toLocaleString()}</div>
              </div>
              <div className="nz-note">
                Hourly rate shown · gratuity added at service · no booking fees. {BOOKING.minHoursNote}
              </div>
              <button className="nz-cta" onClick={submitBooking}>
                Request Reservation
              </button>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE / CONCIERGE */}
        <section className="nz-sec" id="contact">
          <div className="nz-eyebrow rv">Concierge</div>
          <h2 className="nz-sectitle rv">Let Us Reach Out</h2>
          <div className="nz-rule rv" />
          <p className="nz-lead rv" style={{ margin: '20px auto 0' }}>
            Planning a wedding, corporate roadshow, or a standing weekly ride? Leave your details and your private
            concierge will design the route.
          </p>
          <div className="nz-card rv" style={{ maxWidth: 640, margin: '34px auto 0' }}>
            <div className="nz-grid">
              <div className="nz-field">
                <label className="nz-label">Name</label>
                <input
                  className="nz-input"
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                />
              </div>
              <div className="nz-field">
                <label className="nz-label">Phone</label>
                <input
                  className="nz-input"
                  placeholder="Best number"
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                />
              </div>
              <div className="nz-field full">
                <label className="nz-label">Email</label>
                <input
                  className="nz-input"
                  placeholder="you@email.com"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                />
              </div>
              <div className="nz-field full">
                <label className="nz-label">How can we serve you?</label>
                <input
                  className="nz-input"
                  placeholder="Occasion, dates, group size…"
                  value={lead.note}
                  onChange={(e) => setLead({ ...lead, note: e.target.value })}
                />
              </div>
              <button className="nz-cta" onClick={submitLead}>
                Request a Callback
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="nz-foot">
          <div className="fl">{CONFIG.brand}</div>
          <div className="fs">{CONFIG.city}</div>
          <div className="fs">
            <a href={`tel:${CONFIG.phone}`}>{CONFIG.phone}</a> &nbsp;·&nbsp;{' '}
            <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
          </div>
          <div className="fs" style={{ opacity: 0.5, marginTop: 22 }}>
            © {new Date().getFullYear()} {CONFIG.brand}. All rights reserved.
          </div>
        </footer>
      </div>

      {/* TOAST */}
      <div
        className={`nz-toast${toast ? ' on' : ''}`}
        dangerouslySetInnerHTML={{ __html: toast.replace(/—/g, '<b>—</b>') }}
      />
    </div>
  );
}
