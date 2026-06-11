'use client';

import { useEffect, useRef, useState } from 'react';
import type { Vehicle } from '@/data/fleet';

/* =========================================================================
   VEHICLE SHOWCASE
   Photoreal poster of the featured vehicle. Click to play its door-opening
   "step inside" clip (Higgsfield). Returns to the poster when the clip ends.
   ========================================================================= */
export default function VehicleShowcase({ vehicle }: { vehicle: Vehicle }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset to the poster whenever the featured vehicle changes.
  useEffect(() => setPlaying(false), [vehicle.name]);

  const hasVideo = !!vehicle.video;

  const play = () => {
    if (!hasVideo) return;
    setPlaying(true);
    // Attempt to start playback on the user gesture.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
    });
  };

  return (
    <div className="nz-stage-media">
      {playing && hasVideo ? (
        <video
          ref={videoRef}
          className="nz-media"
          src={vehicle.video}
          poster={vehicle.poster}
          playsInline
          autoPlay
          controls={false}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="nz-media" src={vehicle.poster} alt={vehicle.name} />
          {hasVideo && (
            <button className="nz-playbtn" onClick={play} aria-label={`Play: step inside the ${vehicle.name}`}>
              <span className="nz-playicon" aria-hidden>
                ▶
              </span>
              <span className="nz-playlabel">Step inside</span>
            </button>
          )}
        </>
      )}
      {!hasVideo && <div className="nz-stage3d-hint">Clip rendering — poster shown</div>}
    </div>
  );
}
