/* =========================================================================
   The Chauffeurs — animated logo
   - "Headlight Sweep": a specular glint rakes across the gold on a slow idle.
   - "Opening Arc": the C swings open like a door and locks around the T.
   Pure SVG + CSS keyframes — no JS, degrades to a clean static mark.
   variant="monogram" → the TC badge (nav, favicon-ready)
   variant="wordmark" → the Didot "The Chauffeurs" lockup (intro reveal)
   ========================================================================= */

const STYLE = `
.tc-logo{display:inline-block;line-height:0;}
.tc-mono{overflow:visible;}

/* Opening Arc — the C swings shut around the T, once, on mount */
@keyframes tcArc{
  0%{transform:rotate(-64deg);opacity:0}
  55%{opacity:1}
  100%{transform:rotate(0deg);opacity:1}
}
.tc-c{transform-box:fill-box;transform-origin:50% 50%;
  animation:tcArc 1.25s cubic-bezier(.16,1,.3,1) both;}

@keyframes tcRise{0%{opacity:0;transform:translateY(7px)}100%{opacity:1;transform:none}}
.tc-t{transform-box:fill-box;animation:tcRise .9s ease .4s both;}

/* Headlight Sweep — a bright band crosses the emblem, then rests */
@keyframes tcSweep{
  0%{transform:translateX(-46px) skewX(-18deg);opacity:0}
  8%{opacity:.9}
  34%{transform:translateX(150px) skewX(-18deg);opacity:.9}
  46%,100%{transform:translateX(150px) skewX(-18deg);opacity:0}
}
.tc-sweep{animation:tcSweep 5s ease-in-out 1.1s infinite;}

/* Wordmark */
.tc-word{display:inline-flex;align-items:baseline;gap:.34em;position:relative;
  font-family:var(--serif,"Didot","Bodoni MT",Georgia,serif);letter-spacing:.06em;white-space:nowrap;}
.tc-word .the{color:#b8bcc4;opacity:0;animation:tcRise .8s ease .15s both;}
.tc-word .name{position:relative;font-weight:600;color:#c9a96a;
  background:linear-gradient(100deg,#9c7f48 0%,#c9a96a 38%,#fff6e0 50%,#c9a96a 62%,#9c7f48 100%);
  background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  opacity:0;animation:tcRise .8s ease .28s both, tcShine 5.5s ease-in-out 1s infinite;}
@keyframes tcShine{0%{background-position:120% 0}42%{background-position:-20% 0}100%{background-position:-20% 0}}
.tc-underline{position:absolute;left:0;bottom:-.16em;height:1px;width:100%;
  background:linear-gradient(90deg,transparent,#c9a96a,transparent);
  transform-origin:left center;animation:tcLine 1s cubic-bezier(.16,1,.3,1) .3s both;}
@keyframes tcLine{from{transform:scaleX(0)}to{transform:scaleX(1)}}

@media (prefers-reduced-motion: reduce){
  .tc-c,.tc-t,.tc-sweep,.tc-word .the,.tc-word .name,.tc-underline{animation:none!important;opacity:1!important;transform:none!important}
}
`;

function Style() {
  // Identical <style> tags dedupe visually; safe to render per instance and
  // SSR-stable (no cross-request module state).
  return <style dangerouslySetInnerHTML={{ __html: STYLE }} />;
}

function Monogram({ size }: { size: number }) {
  return (
    <svg className="tc-logo tc-mono" width={size} height={size} viewBox="0 0 120 120" aria-label="The Chauffeurs monogram" role="img">
      <defs>
        <linearGradient id="tcGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8d8a8" />
          <stop offset="0.5" stopColor="#c9a96a" />
          <stop offset="1" stopColor="#9c7f48" />
        </linearGradient>
        <linearGradient id="tcGlint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="tcBadge">
          <rect x="6" y="6" width="108" height="108" rx="12" />
        </clipPath>
      </defs>

      {/* badge */}
      <rect x="6" y="6" width="108" height="108" rx="12" fill="rgba(201,169,106,0.06)" stroke="url(#tcGold)" strokeWidth="2" />

      {/* C — opening arc (gap on the right), swings shut around the T */}
      <path className="tc-c" d="M76.7 44.1 A26 26 0 1 0 76.7 83.9" fill="none" stroke="url(#tcGold)" strokeWidth="9" strokeLinecap="round" />
      {/* T */}
      <path className="tc-t" d="M42 50 H78 M60 50 V88" fill="none" stroke="url(#tcGold)" strokeWidth="9" strokeLinecap="round" />

      {/* headlight sweep, clipped to the badge */}
      <g clipPath="url(#tcBadge)">
        <rect className="tc-sweep" x="0" y="-10" width="34" height="140" fill="url(#tcGlint)" />
      </g>
    </svg>
  );
}

function Wordmark({ size }: { size: number | string }) {
  return (
    <span className="tc-logo tc-word" style={{ fontSize: size }} aria-label="The Chauffeurs">
      <span className="the" style={{ fontSize: '0.62em' }}>The</span>
      <span className="name">
        Chauffeurs
        <span className="tc-underline" />
      </span>
    </span>
  );
}

export default function Logo({
  variant = 'monogram',
  size,
  hero = false,
}: {
  variant?: 'monogram' | 'wordmark';
  size?: number | string;
  hero?: boolean;
}) {
  const px = size ?? (variant === 'monogram' ? (hero ? 92 : 40) : hero ? 64 : 22);
  return (
    <>
      <Style />
      {variant === 'monogram' ? (
        <Monogram size={typeof px === 'number' ? px : 40} />
      ) : (
        <Wordmark size={px} />
      )}
    </>
  );
}
