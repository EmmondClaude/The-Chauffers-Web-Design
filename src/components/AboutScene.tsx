'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* =========================================================================
   ABOUT — atmospheric 3D backdrop
   A slowly rotating chauffeur (placeholder bust) against a Las Vegas skyline.
   Swap-ready: drop public/models/chauffeur.glb for the figure and feed an
   uploaded Las Vegas photo onto the skyline plane later.
   ========================================================================= */

function Chauffeur() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* shoulders / torso */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[2.0, 1.0, 0.9]} />
        <meshStandardMaterial color="#0c0c11" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* lapel accent */}
      <mesh position={[0, 1.0, 0.46]}>
        <boxGeometry args={[0.16, 0.9, 0.04]} />
        <meshStandardMaterial color="#c9a96a" metalness={0.8} roughness={0.3} emissive="#c9a96a" emissiveIntensity={0.18} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.4, 24]} />
        <meshStandardMaterial color="#0e0e13" roughness={0.6} />
      </mesh>
      {/* head */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.44, 32, 32]} />
        <meshStandardMaterial color="#14141a" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* cap */}
      <mesh position={[0, 2.34, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 0.2, 28]} />
        <meshStandardMaterial color="#0a0a0d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.27, 0.4]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.34]} />
        <meshStandardMaterial color="#0a0a0d" roughness={0.7} />
      </mesh>
      {/* cap band */}
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.475, 0.475, 0.06, 28]} />
        <meshStandardMaterial color="#c9a96a" metalness={0.8} roughness={0.3} emissive="#c9a96a" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Skyline() {
  const buildings = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const x = -19 + i * 1.5;
        const h = 2.2 + (Math.sin(i * 1.7) + 1) * 2.6 + (i % 4) * 0.9;
        const z = -7 - (i % 3) * 1.4;
        return { x, h, z, w: 1.0 + (i % 2) * 0.3 };
      }),
    [],
  );
  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial
            color="#0b0b11"
            metalness={0.5}
            roughness={0.6}
            emissive="#c9a96a"
            emissiveIntensity={0.04 + (i % 5) * 0.01}
          />
        </mesh>
      ))}
    </group>
  );
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function AboutScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !supportsWebGL()) {
    return <div className="ab-scene ab-scene-fallback" aria-hidden />;
  }

  return (
    <div className="ab-scene" aria-hidden>
      <Canvas dpr={[1, 2]} camera={{ position: [0.5, 1.8, 7.5], fov: 38 }}>
        <color attach="background" args={['#070709']} />
        <fog attach="fog" args={['#070709', 10, 34]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 6]} intensity={0.9} />
        <spotLight position={[-7, 6, 2]} intensity={0.8} color="#c9a96a" angle={0.7} penumbra={0.9} />
        <pointLight position={[0, 3, 4]} intensity={0.4} color="#e8d8a8" />
        <Chauffeur />
        <Skyline />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#050506" metalness={0.6} roughness={0.4} />
        </mesh>
      </Canvas>
    </div>
  );
}
