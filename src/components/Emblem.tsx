'use client';

/* =========================================================================
   The Chauffeurs — 3D brand emblem
   The source render has a near-black backdrop. `mix-blend-mode: lighten`
   drops that backdrop against the site's dark colorway so the gold emblem
   appears to rise out of the page rather than sit in a black box. A slow gold
   glint sweeps across it for life.
   ========================================================================= */

const STYLE = `
.tc-emblem{position:relative;display:inline-block;line-height:0;}
.tc-emblem img{display:block;width:100%;height:100%;object-fit:contain;
  mix-blend-mode:lighten;}
.tc-emblem-glint{position:absolute;top:0;left:0;width:16%;height:100%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,247,224,.32),transparent);
  transform:translateX(-220%) skewX(-14deg);mix-blend-mode:screen;opacity:0;
  animation:tcGlint 9s ease-in-out 2.4s infinite;}
@keyframes tcGlint{
  0%{transform:translateX(-220%) skewX(-14deg);opacity:0}
  2%{opacity:.85}
  9%{transform:translateX(620%) skewX(-14deg);opacity:.85}
  12%,100%{transform:translateX(620%) skewX(-14deg);opacity:0}
}
@media (prefers-reduced-motion: reduce){ .tc-emblem-glint{animation:none!important;opacity:0} }
`;

export default function Emblem({
  src,
  size = 44,
  alt = 'The Chauffeurs',
}: {
  src: string;
  size?: number | string;
  /** Kept for call-site compatibility; the emblem now blends frameless. */
  badge?: boolean;
  alt?: string;
}) {
  return (
    <span className="tc-emblem" style={{ width: size, height: size }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <span className="tc-emblem-glint" aria-hidden />
    </span>
  );
}
