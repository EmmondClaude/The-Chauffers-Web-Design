'use client';

/* =========================================================================
   The Chauffeurs — 3D brand emblem
   Renders the rendered TC emblem with a slow gold glint sweeping across it.
   `badge` adds a small framed treatment for the nav; default is frameless for
   the large loader centerpiece (which also gets mouse-parallax from its parent).
   ========================================================================= */

const STYLE = `
.tc-emblem{position:relative;display:inline-block;line-height:0;overflow:hidden;border-radius:10px;}
.tc-emblem img{display:block;width:100%;height:100%;object-fit:contain;}
.tc-emblem.badge{border:1px solid rgba(201,169,106,.28);box-shadow:0 6px 22px rgba(0,0,0,.45),inset 0 0 24px rgba(201,169,106,.06);}
.tc-emblem-glint{position:absolute;top:0;left:0;width:55%;height:100%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,247,224,.5),transparent);
  transform:translateX(-130%) skewX(-12deg);mix-blend-mode:screen;
  animation:tcGlint 6.5s ease-in-out 1.4s infinite;}
@keyframes tcGlint{
  0%{transform:translateX(-130%) skewX(-12deg)}
  16%{transform:translateX(230%) skewX(-12deg)}
  100%{transform:translateX(230%) skewX(-12deg)}
}
@media (prefers-reduced-motion: reduce){ .tc-emblem-glint{animation:none!important;opacity:0} }
`;

export default function Emblem({
  src,
  size = 44,
  badge = false,
  alt = 'The Chauffeurs',
}: {
  src: string;
  size?: number | string;
  badge?: boolean;
  alt?: string;
}) {
  return (
    <span className={`tc-emblem${badge ? ' badge' : ''}`} style={{ width: size, height: size }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <span className="tc-emblem-glint" aria-hidden />
    </span>
  );
}
