'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { CONFIG, FLEET, SERVICES, type VehicleType, type Vehicle } from '@/data/fleet';
import { estimateFor, firstName, validateBooking, validateLead } from '@/lib/booking';
import { stepFor, nearestSpinAngle, frontIndex, wrapIndex } from '@/lib/showroom';

/* Content lives in @/data/fleet — the single source of truth the client edits.
   Pure booking + showroom logic lives in @/lib and is unit-tested. */

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
.nz-main.show .rv{animation:fadeUp .9s cubic-bezier(.16,1,.3,1) both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}

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
  padding:120px 20px 60px;position:relative;}
.nz-kicker{font-size:11px;letter-spacing:.5em;color:var(--gold);text-transform:uppercase;margin-bottom:18px;}
.nz-h1{font-family:var(--serif);font-size:clamp(34px,7vw,72px);line-height:1.02;text-align:center;max-width:14ch;}
.nz-h1 em{font-style:italic;color:var(--gold-2);}
.nz-lead{margin-top:18px;color:var(--silver);font-size:14px;letter-spacing:.06em;text-align:center;max-width:46ch;line-height:1.7;}

.nz-stage3{position:relative;width:min(680px,94vw);height:380px;margin:14px auto 2px;perspective:1100px;}
.nz-axis{position:absolute;left:50%;top:24%;width:2px;height:42%;transform:translateX(-50%);
  background:linear-gradient(180deg,transparent,rgba(201,169,106,.45),transparent);pointer-events:none;}
.nz-disc{position:absolute;left:50%;top:60%;width:540px;max-width:88%;height:150px;
  transform:translate(-50%,-50%) rotateX(66deg);border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(201,169,106,.16),rgba(201,169,106,.04) 55%,transparent 70%);
  border:1px solid rgba(201,169,106,.20);box-shadow:inset 0 0 70px rgba(201,169,106,.12);}
.nz-disc::before{content:"";position:absolute;inset:-1px;border-radius:50%;
  background:conic-gradient(from 0deg,transparent,rgba(201,169,106,.28),transparent 22%,transparent 50%,rgba(201,169,106,.24),transparent 72%);
  animation:spin 16s linear infinite;mask:radial-gradient(circle,transparent 58%,#000 59%);-webkit-mask:radial-gradient(circle,transparent 58%,#000 59%);}
@keyframes spin{to{transform:rotate(360deg)}}
.nz-orbit{position:absolute;left:50%;top:50%;width:210px;will-change:transform;cursor:pointer;transition:filter .25s ease;}
.nz-orbit svg{width:100%;height:auto;display:block;filter:drop-shadow(0 22px 22px rgba(0,0,0,.6));}
.nz-cshadow{position:absolute;left:50%;bottom:2px;width:64%;height:16px;transform:translateX(-50%);
  background:radial-gradient(ellipse at center,rgba(0,0,0,.55),transparent 70%);filter:blur(3px);pointer-events:none;}
.nz-ptag{position:absolute;left:50%;top:-30px;transform:translateX(-50%);white-space:nowrap;text-align:center;z-index:9;
  background:rgba(8,8,11,.9);border:1px solid var(--gold);border-radius:4px;padding:5px 14px;
  font-family:var(--serif);font-size:20px;color:var(--gold-2);line-height:1.1;
  box-shadow:0 10px 24px rgba(0,0,0,.5);animation:fadeUp .3s ease both;}
.nz-ptag small{display:block;font-family:var(--sans);font-size:8.5px;letter-spacing:.22em;
  color:var(--silver);text-transform:uppercase;margin-top:2px;}

.nz-model{font-family:var(--serif);font-size:clamp(24px,4vw,34px);margin-top:6px;text-align:center;}
.nz-modelblurb{color:var(--silver);font-size:12.5px;letter-spacing:.08em;margin-top:6px;text-align:center;}
.nz-specs{display:flex;gap:26px;justify-content:center;margin-top:12px;color:var(--cream);}
.nz-specs span{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--silver);}
.nz-specs b{font-family:var(--serif);font-size:18px;color:var(--gold-2);margin-right:6px;}

.nz-tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:26px;max-width:760px;}
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
.nz-sec{padding:90px clamp(18px,5vw,56px);max-width:1080px;margin:0 auto;}
.nz-eyebrow{font-size:11px;letter-spacing:.5em;color:var(--gold);text-transform:uppercase;text-align:center;}
.nz-sectitle{font-family:var(--serif);font-size:clamp(28px,5vw,48px);text-align:center;margin-top:12px;}
.nz-rule{width:60px;height:1px;background:var(--gold);margin:22px auto 0;}
.nz-services{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:42px;}
@media(max-width:820px){.nz-services{grid-template-columns:1fr 1fr;}}
@media(max-width:520px){.nz-services{grid-template-columns:1fr;}}
.nz-scard{background:linear-gradient(180deg,var(--char),var(--char2));border:1px solid rgba(201,169,106,.16);
  border-radius:6px;padding:26px 22px;cursor:pointer;transition:.35s;}
.nz-scard:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 24px 50px rgba(0,0,0,.5);}
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

/* ===================== LUXURY SUV (front 3/4) ============================ */
function SUV({ accent = '#c9a96a' }: { accent?: string }) {
  return (
    <svg width="360" height="240" viewBox="0 0 360 240" fill="none" aria-label="Luxury SUV">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a31" />
          <stop offset="0.5" stopColor="#16161b" />
          <stop offset="1" stopColor="#0b0b0f" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4750" />
          <stop offset="1" stopColor="#10161b" />
        </linearGradient>
        <radialGradient id="led" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="212" rx="150" ry="16" fill={accent} opacity="0.12" />
      <path d="M96 70 Q108 40 150 38 L210 38 Q252 40 264 70 Z" fill="url(#body)" />
      <path d="M110 70 Q120 50 150 49 L210 49 Q240 50 250 70 Z" fill="url(#glass)" />
      <line x1="180" y1="49" x2="180" y2="70" stroke="#0b0b0f" strokeWidth="3" />
      <rect x="62" y="70" width="236" height="96" rx="20" fill="url(#body)" />
      <rect x="62" y="70" width="236" height="96" rx="20" fill="none" stroke={accent} strokeOpacity="0.18" />
      <line x1="76" y1="104" x2="284" y2="104" stroke="#000" strokeOpacity="0.5" strokeWidth="2" opacity="0.5" />
      <line x1="80" y1="120" x2="280" y2="120" stroke={accent} strokeWidth="1" opacity="0.35" />
      <rect x="138" y="112" width="84" height="40" rx="5" fill="#0a0a0d" stroke={accent} strokeOpacity="0.35" />
      {[150, 162, 174, 186, 198, 210].map((x) => (
        <line key={x} x1={x} y1="116" x2={x} y2="148" stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
      ))}
      <circle cx="180" cy="132" r="9" fill="#0a0a0d" stroke={accent} strokeOpacity="0.8" />
      <circle cx="180" cy="132" r="3.4" fill={accent} />
      <rect x="80" y="112" width="46" height="9" rx="4.5" fill={accent} />
      <rect x="234" y="112" width="46" height="9" rx="4.5" fill={accent} />
      <ellipse cx="103" cy="116" rx="42" ry="22" fill="url(#led)" opacity="0.6" />
      <ellipse cx="257" cy="116" rx="42" ry="22" fill="url(#led)" opacity="0.6" />
      <rect x="70" y="156" width="220" height="22" rx="8" fill="#0c0c10" />
      <rect x="96" y="162" width="26" height="6" rx="3" fill={accent} opacity="0.55" />
      <rect x="238" y="162" width="26" height="6" rx="3" fill={accent} opacity="0.55" />
      <ellipse cx="96" cy="184" rx="26" ry="22" fill="#050507" />
      <ellipse cx="264" cy="184" rx="26" ry="22" fill="#050507" />
      <ellipse cx="96" cy="184" rx="11" ry="9" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
      <ellipse cx="264" cy="184" rx="11" ry="9" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
    </svg>
  );
}

/* ===================== MERCEDES SPRINTER VAN (front) ===================== */
function VanSVG({ accent = '#c0c4cc' }: { accent?: string }) {
  return (
    <svg width="360" height="240" viewBox="0 0 360 240" fill="none" aria-label="Mercedes-Benz Sprinter van">
      <defs>
        <linearGradient id="vbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33333b" />
          <stop offset="0.5" stopColor="#1a1a20" />
          <stop offset="1" stopColor="#0c0c11" />
        </linearGradient>
        <linearGradient id="vglass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f4c55" />
          <stop offset="1" stopColor="#121a20" />
        </linearGradient>
        <radialGradient id="vled" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="214" rx="150" ry="15" fill={accent} opacity="0.12" />
      <rect x="88" y="40" width="184" height="158" rx="18" fill="url(#vbody)" stroke={accent} strokeOpacity="0.16" />
      <rect x="100" y="34" width="160" height="16" rx="8" fill="#15151b" />
      <rect x="104" y="58" width="152" height="50" rx="9" fill="url(#vglass)" />
      <line x1="180" y1="58" x2="180" y2="108" stroke="#0b0b0f" strokeWidth="3" />
      <rect x="120" y="120" width="120" height="34" rx="6" fill="#0a0a0d" stroke={accent} strokeOpacity="0.4" />
      <line x1="124" y1="131" x2="236" y2="131" stroke={accent} strokeOpacity="0.45" strokeWidth="2" />
      <line x1="124" y1="143" x2="236" y2="143" stroke={accent} strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="180" cy="137" r="13" fill="#0a0a0d" stroke={accent} strokeOpacity="0.85" strokeWidth="1.5" />
      <g stroke={accent} strokeWidth="2.2">
        <line x1="180" y1="137" x2="180" y2="126" />
        <line x1="180" y1="137" x2="189.5" y2="142.5" />
        <line x1="180" y1="137" x2="170.5" y2="142.5" />
      </g>
      <path d="M92 116 L120 120 L120 130 L92 130 Z" fill={accent} />
      <path d="M268 116 L240 120 L240 130 L268 130 Z" fill={accent} />
      <ellipse cx="104" cy="124" rx="36" ry="18" fill="url(#vled)" opacity="0.55" />
      <ellipse cx="256" cy="124" rx="36" ry="18" fill="url(#vled)" opacity="0.55" />
      <rect x="92" y="160" width="176" height="30" rx="8" fill="#0c0c10" />
      <rect x="140" y="168" width="80" height="12" rx="4" fill="#08080b" stroke={accent} strokeOpacity="0.3" />
      <ellipse cx="116" cy="192" rx="24" ry="20" fill="#050507" />
      <ellipse cx="244" cy="192" rx="24" ry="20" fill="#050507" />
      <ellipse cx="116" cy="192" rx="10" ry="8" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
      <ellipse cx="244" cy="192" rx="10" ry="8" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
    </svg>
  );
}

/* ===================== PARTY BUS (front, neon) ========================== */
function BusSVG({ accent = '#d8c08a' }: { accent?: string }) {
  const lights = ['#e8d8a8', '#ff5fa2', '#5fd0ff', '#c08bff', '#e8d8a8', '#ff5fa2', '#5fd0ff', '#c08bff'];
  return (
    <svg width="360" height="240" viewBox="0 0 360 240" fill="none" aria-label="Luxury party bus">
      <defs>
        <linearGradient id="bbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c34" />
          <stop offset="0.5" stopColor="#17171d" />
          <stop offset="1" stopColor="#0b0b0f" />
        </linearGradient>
        <linearGradient id="bglass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3640" />
          <stop offset="1" stopColor="#0d1318" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="214" rx="120" ry="13" fill="#ff5fa2" opacity="0.18" />
      <ellipse cx="210" cy="214" rx="120" ry="13" fill="#5fd0ff" opacity="0.16" />
      <rect x="64" y="44" width="232" height="154" rx="14" fill="url(#bbody)" stroke={accent} strokeOpacity="0.18" />
      <rect x="80" y="52" width="200" height="14" rx="4" fill="#0a0a0d" stroke={accent} strokeOpacity="0.3" />
      {lights.map((c, i) => (
        <g key={i}>
          <circle cx={92 + i * 25} cy="45" r="6" fill={c} opacity="0.35" />
          <circle cx={92 + i * 25} cy="45" r="3" fill={c} />
        </g>
      ))}
      <rect x="86" y="74" width="188" height="56" rx="8" fill="url(#bglass)" />
      <line x1="180" y1="74" x2="180" y2="130" stroke="#0b0b0f" strokeWidth="3" />
      <rect x="86" y="134" width="188" height="10" rx="4" fill={accent} opacity="0.5" />
      <rect x="92" y="150" width="40" height="10" rx="5" fill={accent} />
      <rect x="228" y="150" width="40" height="10" rx="5" fill={accent} />
      <rect x="78" y="164" width="204" height="26" rx="8" fill="#0c0c10" />
      <rect x="150" y="170" width="60" height="8" rx="4" fill="#08080b" />
      <ellipse cx="104" cy="192" rx="25" ry="21" fill="#050507" />
      <ellipse cx="256" cy="192" rx="25" ry="21" fill="#050507" />
      <ellipse cx="104" cy="192" rx="10" ry="8" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
      <ellipse cx="256" cy="192" rx="10" ry="8" fill="#1c1c22" stroke={accent} strokeOpacity="0.5" />
    </svg>
  );
}

/* ===================== VEHICLE DISPATCHER =============================== */
function VehicleArt({ type, accent }: { type: VehicleType; accent: string }) {
  if (type === 'van') return <VanSVG accent={accent} />;
  if (type === 'shuttle') return <BusSVG accent={accent} />;
  return <SUV accent={accent} />;
}

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

/* ===================== ROTATING SHOWROOM (3D turntable) ================== */
const STEP = stepFor(FLEET.length);

export interface ShowroomHandle {
  spinTo: (i: number) => void;
}

interface ShowroomProps {
  fleet: Vehicle[];
  onFront: (i: number) => void;
}

const Showroom = forwardRef<ShowroomHandle, ShowroomProps>(function Showroom({ fleet, onFront }, ref) {
  const [rot, setRot] = useState(0);
  const [hover, setHover] = useState(-1);
  const [w, setW] = useState(640);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0);
  const targetRef = useRef<number | null>(null); // non-null while easing to a chosen car
  const pausedRef = useRef(false); // paused on hover
  const frontRef = useRef(-1);
  const onFrontRef = useRef(onFront);
  useEffect(() => {
    onFrontRef.current = onFront;
  });

  // bring car i to the front of the turntable
  const spinTo = useCallback(
    (i: number) => {
      targetRef.current = nearestSpinAngle(i, rotRef.current, fleet.length);
    },
    [fleet.length],
  );
  useImperativeHandle(ref, () => ({ spinTo }), [spinTo]);

  // responsive orbit radius
  useEffect(() => {
    const measure = () => {
      if (stageRef.current) setW(stageRef.current.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // animation loop — slow continuous rotation + eased snapping
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      let r = rotRef.current;
      if (targetRef.current !== null) {
        const d = targetRef.current - r;
        if (Math.abs(d) < 0.0015) {
          r = targetRef.current;
          targetRef.current = null;
        } else r += d * 0.09;
      } else if (!pausedRef.current) {
        r += 0.0038; // slow auto-rotation
      }
      rotRef.current = r;
      setRot(r);
      const best = frontIndex(r, fleet.length);
      if (best !== frontRef.current) {
        frontRef.current = best;
        onFrontRef.current?.(best);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fleet.length]);

  const RX = Math.min(w * 0.34, 240);

  return (
    <div
      className="nz-stage3"
      ref={stageRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        setHover(-1);
      }}
    >
      <div className="nz-axis" />
      <div className="nz-disc" />
      {fleet.map((car, i) => {
        const a = i * STEP + rot;
        const cos = Math.cos(a),
          sin = Math.sin(a);
        const depth = (cos + 1) / 2; // 0 = back, 1 = front
        const scale = 0.5 + 0.58 * depth;
        const x = sin * RX;
        const y = cos * 20 + 4; // far cars ride higher/behind
        return (
          <div
            key={car.name}
            className="nz-orbit"
            onMouseEnter={() => setHover(i)}
            onClick={() => spinTo(i)}
            style={{
              transform: `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale})`,
              zIndex: Math.round(depth * 100),
              opacity: 0.32 + 0.68 * depth,
              filter: `blur(${(1 - depth) * 1.6}px)`,
            }}
          >
            {hover === i && (
              <div className="nz-ptag">
                ${car.price}
                <small>per hour + gratuity</small>
              </div>
            )}
            <VehicleArt type={car.type} accent={car.accent} />
            <div className="nz-cshadow" />
          </div>
        );
      })}
    </div>
  );
});

/* ============================== APP ===================================== */
export default function LuxuryTransportSite() {
  const [revealed, setRevealed] = useState(false);
  const [front, setFront] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState('');
  const showroomRef = useRef<ShowroomHandle>(null);
  const car = FLEET[front];

  // intro parallax tilt
  const onMove = useCallback((e: ReactMouseEvent) => {
    const cx = window.innerWidth / 2,
      cy = window.innerHeight / 2;
    setTilt({ x: ((e.clientY - cy) / cy) * -10, y: ((e.clientX - cx) / cx) * 14 });
  }, []);

  const pick = (i: number) => showroomRef.current?.spinTo(i);
  const move = (d: number) => showroomRef.current?.spinTo(wrapIndex(front, d, FLEET.length));

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
  // keep booking synced to showroom
  useEffect(() => {
    setBk((b) => ({ ...b, vehicle: FLEET[front].name }));
  }, [front]);
  const estimate = estimateFor(bk.vehicle, bk.hours);

  const submitBooking = async () => {
    if (!validateBooking(bk).valid) {
      flash('Please add pickup, date, name & phone to reserve.');
      return;
    }
    const [first, ...rest] = bk.name.trim().split(/\s+/);
    try {
      // Wire into the maximal-stack backend (logs today; CRM/email next).
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
        <div className="nz-introtitle">{CONFIG.brand}</div>
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
            <span className="nz-mono">TC</span>
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
            <button className="nz-navlink" onClick={() => scrollTo('book')}>
              Reserve
            </button>
            <button className="nz-navlink" onClick={() => scrollTo('contact')}>
              Concierge
            </button>
            <button className="nz-callbtn" onClick={() => scrollTo('book')}>
              Book a Car
            </button>
          </div>
        </nav>

        {/* HERO / SHOWROOM */}
        <header className="nz-hero" id="fleet">
          <div className="nz-kicker rv" style={{ animationDelay: '.15s' }}>
            The Fleet
          </div>
          <h1 className="nz-h1 rv" style={{ animationDelay: '.25s' }}>
            Arrive in <em>quiet</em> command.
          </h1>
          <p className="nz-lead rv" style={{ animationDelay: '.35s' }}>
            Five full-size luxury SUVs on a slow-turning showroom. Hover any vehicle to reveal its rate, tap to bring it
            front, then reserve.
          </p>

          <div className="rv" style={{ animationDelay: '.45s' }}>
            <Showroom ref={showroomRef} fleet={FLEET} onFront={setFront} />
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
                {f.name.split(' ').slice(-1)[0]}
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

        {/* SERVICES (all woven together, single page) */}
        <section className="nz-sec" id="services">
          <div className="nz-eyebrow rv">What We Do</div>
          <h2 className="nz-sectitle rv">One Standard, Every Occasion</h2>
          <div className="nz-rule rv" />
          <p className="nz-lead rv" style={{ margin: '20px auto 0' }}>
            The same discreet, professionally chauffeured SUVs — booked by the hour for whatever the day calls for.
          </p>
          <div className="nz-services rv">
            {SERVICES.map((s) => (
              <div className="nz-scard" key={s.title} onClick={() => scrollTo('book')}>
                <div className="nz-sicon">{s.icon}</div>
                <div className="nz-stitle">{s.title}</div>
                <div className="nz-sdesc">{s.desc}</div>
              </div>
            ))}
          </div>
          <p className="nz-lead rv" style={{ margin: '30px auto 0', fontSize: 12.5 }}>
            All services billed hourly ($80–$100 by vehicle) plus gratuity · no initial or booking fees.
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
                Hourly rate shown. Gratuity added at service · no initial or booking fees.
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
