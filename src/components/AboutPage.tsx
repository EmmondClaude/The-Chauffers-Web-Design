'use client';

import Link from 'next/link';
import AboutScene from '@/components/AboutScene';
import Logo from '@/components/Logo';
import { CONFIG } from '@/data/fleet';

const CSS = `
.ab-root{position:relative;background:#070709;color:#f4efe6;min-height:100vh;overflow-x:hidden;
  font-family:"Optima","Avenir Next","Gill Sans","Helvetica Neue",sans-serif;}
.ab-serif{font-family:"Didot","Bodoni MT","Playfair Display",Georgia,serif;}

/* 3D backdrop */
.ab-scene{position:fixed;inset:0;z-index:0;}
.ab-scene canvas{display:block;width:100%!important;height:100%!important;}
.ab-scene-fallback{background:radial-gradient(80% 60% at 50% 30%,#15151d,#070709 70%);}
.ab-veil{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(7,7,9,.55),rgba(7,7,9,.2) 30%,rgba(7,7,9,.85) 88%);}

/* nav */
.ab-nav{position:fixed;top:0;left:0;right:0;z-index:10;display:flex;align-items:center;justify-content:space-between;
  padding:20px clamp(18px,5vw,56px);backdrop-filter:blur(10px);
  background:linear-gradient(180deg,rgba(7,7,9,.8),rgba(7,7,9,0));}
.ab-back{color:#b8bcc4;font-size:11px;letter-spacing:.28em;text-transform:uppercase;text-decoration:none;transition:.3s;}
.ab-back:hover{color:#e8d8a8;}

/* content */
.ab-main{position:relative;z-index:2;}
.ab-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  padding:140px clamp(20px,7vw,120px) 80px;max-width:1100px;}
.ab-eyebrow{font-size:11px;letter-spacing:.62em;text-transform:uppercase;color:#d8c08a;margin-bottom:22px;}
.ab-title{font-size:clamp(42px,8vw,110px);line-height:.96;letter-spacing:-.01em;max-width:13ch;
  text-shadow:0 0 70px rgba(201,169,106,.18);}
.ab-title em{font-style:italic;color:#e8d8a8;}
.ab-kicker{margin-top:26px;max-width:46ch;color:#cfd2d8;font-size:16px;line-height:1.8;letter-spacing:.02em;}

.ab-story{position:relative;z-index:2;background:linear-gradient(180deg,rgba(7,7,9,.4),#070709 35%);
  padding:40px clamp(20px,7vw,120px) 120px;}
.ab-story-inner{max-width:760px;}
.ab-lede{font-size:clamp(20px,2.4vw,28px);line-height:1.6;color:#f4efe6;letter-spacing:.01em;}
.ab-lede .gold{color:#e8d8a8;}
.ab-p{margin-top:26px;color:#b8bcc4;font-size:15.5px;line-height:1.85;letter-spacing:.02em;}
.ab-rule{width:64px;height:1px;background:linear-gradient(90deg,#c9a96a,transparent);margin:40px 0;}

.ab-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:54px;
  background:rgba(201,169,106,.14);border:1px solid rgba(201,169,106,.14);}
@media(max-width:720px){.ab-pillars{grid-template-columns:1fr;}}
.ab-pill{background:#0b0b0f;padding:30px 26px;}
.ab-pill h3{font-size:20px;color:#e8d8a8;margin-bottom:10px;}
.ab-pill p{color:#9a9ea7;font-size:13.5px;line-height:1.7;}

.ab-cta{margin-top:60px;display:flex;gap:16px;flex-wrap:wrap;}
.ab-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 34px;border-radius:2px;cursor:pointer;
  font-size:11px;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;transition:.35s;}
.ab-btn-gold{background:#c9a96a;color:#0a0a0a;font-weight:600;}
.ab-btn-gold:hover{background:#e8d8a8;letter-spacing:.4em;}
.ab-btn-ghost{border:1px solid rgba(201,169,106,.5);color:#e8d8a8;}
.ab-btn-ghost:hover{background:rgba(201,169,106,.12);}

.ab-foot{position:relative;z-index:2;border-top:1px solid rgba(201,169,106,.14);
  padding:40px 20px;text-align:center;color:#8a8e97;font-size:11px;letter-spacing:.2em;background:#070709;}
`;

export default function AboutPage() {
  return (
    <div className="ab-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* rotating 3D chauffeur + Vegas skyline */}
      <AboutScene />
      <div className="ab-veil" />

      {/* nav */}
      <nav className="ab-nav">
        <Link href="/" aria-label="The Chauffeurs — home">
          <Logo variant="monogram" size={38} />
        </Link>
        <Link href="/" className="ab-back">
          ‹ Back to the fleet
        </Link>
      </nav>

      <div className="ab-main">
        {/* HERO MESSAGE */}
        <header className="ab-hero">
          <div className="ab-eyebrow">Our Standard</div>
          <h1 className="ab-serif ab-title">
            Arrive in <em>quiet</em> command.
          </h1>
          <p className="ab-kicker">
            We are a Las Vegas–born private chauffeur service built on a single belief: that the journey should feel
            as considered as the destination. Discreet, professional, and never rushed.
          </p>
        </header>

        {/* STORY */}
        <section className="ab-story">
          <div className="ab-story-inner">
            <p className="ab-serif ab-lede">
              The Chauffeurs began with a simple standard — that arrival should feel like <span className="gold">an event</span>,
              not a transaction.
            </p>
            <div className="ab-rule" />
            <p className="ab-p">
              From the Strip to the runway, our fleet of full-size SUVs and luxury shuttles moves executives, wedding
              parties, and families with the same quiet precision. Every chauffeur is licensed, insured, and trained to
              read the room — to be invisible when you want privacy, and present when you need them.
            </p>
            <p className="ab-p">
              Available 24/7 across Las Vegas, with one-way drop-offs to California, Arizona, and Utah. Whether it&rsquo;s a
              flight-aware airport pickup, a multi-stop corporate roadshow, or the whole family and the luggage — you
              reserve once, and we handle the rest.
            </p>

            <div className="ab-pillars">
              <div className="ab-pill">
                <h3 className="ab-serif">Licensed &amp; Insured</h3>
                <p>Background-checked, professionally trained chauffeurs. Fully licensed and insured for your peace of mind.</p>
              </div>
              <div className="ab-pill">
                <h3 className="ab-serif">Flight-Aware</h3>
                <p>We track your flight so the car is curbside when you land — early or late, no calls required.</p>
              </div>
              <div className="ab-pill">
                <h3 className="ab-serif">Hourly &amp; As-Directed</h3>
                <p>Keep the vehicle and chauffeur on call. Two-hour minimum, waived for Las Vegas arrivals &amp; departures.</p>
              </div>
            </div>

            <div className="ab-cta">
              <Link href="/#book" className="ab-btn ab-btn-gold">
                Reserve a Chauffeur
              </Link>
              <Link href="/#fleet" className="ab-btn ab-btn-ghost">
                Explore the Fleet
              </Link>
            </div>
          </div>
        </section>

        <footer className="ab-foot">
          © {new Date().getFullYear()} {CONFIG.brand}. {CONFIG.city}
        </footer>
      </div>
    </div>
  );
}
