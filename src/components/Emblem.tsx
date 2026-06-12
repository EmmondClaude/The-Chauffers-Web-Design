'use client';

/* =========================================================================
   The Chauffeurs — 3D brand emblem
   The source render has a near-black backdrop; `mix-blend-mode: lighten`
   drops it against the site's dark colorway so the gold mark rises out of the
   page. `hero` adds a slow float + soft brightness breathe so the large loader
   emblem feels like a living object catching light.
   ========================================================================= */

const STYLE = `
.tc-emblem{position:relative;display:inline-block;line-height:0;}
.tc-emblem img{display:block;width:100%;height:100%;object-fit:contain;mix-blend-mode:lighten;}
.tc-emblem.alive{animation:tcAlive 6s ease-in-out infinite;}
@keyframes tcAlive{
  0%,100%{transform:translateY(0);filter:brightness(1)}
  50%{transform:translateY(-7px);filter:brightness(1.09)}
}
@media (prefers-reduced-motion: reduce){ .tc-emblem.alive{animation:none} }
`;

export default function Emblem({
  src,
  size = 44,
  hero = false,
  alt = 'The Chauffeurs',
}: {
  src: string;
  size?: number | string;
  /** Large loader emblem: adds the slow float + brightness breathe. */
  hero?: boolean;
  alt?: string;
}) {
  return (
    <span className={`tc-emblem${hero ? ' alive' : ''}`} style={{ width: size, height: size }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </span>
  );
}
