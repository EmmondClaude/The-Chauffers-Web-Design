'use client';

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Vehicle, VehicleType } from '@/data/fleet';

/* =========================================================================
   3D SHOWROOM
   - Drag to orbit and see every side.
   - Click the vehicle to open / close its doors.
   - Drop a rigged model at public/models/<vehicle.model>.glb and add its key
     to READY_MODELS below; it then replaces the placeholder automatically.
   ========================================================================= */

// Keys (vehicle.model) that have a committed public/models/<key>.glb.
// Add a key here the moment you commit its file — that's the only switch.
const READY_MODELS = new Set<string>([]);

const OPEN_ANGLE = 0.95; // radians a placeholder door swings open

interface Dims {
  len: number;
  wid: number;
  bodyH: number;
  cabH: number;
  cabInset: number;
  wheelR: number;
}

function dimsFor(type: VehicleType): Dims {
  if (type === 'van') return { len: 5.4, wid: 2.0, bodyH: 1.0, cabH: 1.15, cabInset: 0.5, wheelR: 0.5 };
  if (type === 'shuttle') return { len: 6.6, wid: 2.2, bodyH: 1.25, cabH: 1.45, cabInset: 0.35, wheelR: 0.55 };
  return { len: 4.9, wid: 2.0, bodyH: 1.05, cabH: 0.72, cabInset: 0.8, wheelR: 0.5 }; // suv
}

interface DoorDef {
  hinge: [number, number, number];
  panel: [number, number, number];
  openSign: number;
}

/* --------------------- placeholder vehicle (boxes) --------------------- */
function PlaceholderVehicle({ vehicle, open }: { vehicle: Vehicle; open: boolean }) {
  const d = dimsFor(vehicle.type);
  const doorRefs = useRef<(THREE.Group | null)[]>([]);

  const halfW = d.wid / 2;
  const wheelY = d.wheelR;
  const bodyY = wheelY + d.bodyH / 2;
  const cabY = wheelY + d.bodyH + d.cabH / 2 - 0.02;
  const doorLen = Math.min(1.2, (d.len - 2) / 2);
  const doorH = d.bodyH * 0.8;
  const doorY = wheelY + d.bodyH / 2;

  const doors: DoorDef[] = useMemo(() => {
    const frontX = d.len / 2 - 1.1;
    const list: DoorDef[] = [];
    for (const sideSign of [1, -1]) {
      // sideSign +1 = left (z+), -1 = right (z-)
      list.push({ hinge: [frontX, doorY, sideSign * halfW], panel: [doorLen, doorH, 0.06], openSign: sideSign });
      list.push({ hinge: [frontX - doorLen - 0.12, doorY, sideSign * halfW], panel: [doorLen, doorH, 0.06], openSign: sideSign });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.type]);

  useFrame((_state, delta) => {
    const k = 1 - Math.pow(0.0008, delta); // frame-rate independent damping
    for (const g of doorRefs.current) {
      if (!g) continue;
      const target = open ? g.userData.openSign * OPEN_ANGLE : 0;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target, k);
    }
  });

  const wheelPositions: [number, number, number][] = [
    [d.len / 2 - 1, wheelY, halfW],
    [d.len / 2 - 1, wheelY, -halfW],
    [-d.len / 2 + 1, wheelY, halfW],
    [-d.len / 2 + 1, wheelY, -halfW],
  ];

  return (
    <group>
      {/* body */}
      <mesh position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[d.len, d.bodyH, d.wid]} />
        <meshStandardMaterial color={vehicle.color} metalness={0.55} roughness={0.32} />
      </mesh>
      {/* cabin / greenhouse */}
      <mesh position={[-d.cabInset * 0.15, cabY, 0]} castShadow>
        <boxGeometry args={[d.len - d.cabInset * 2, d.cabH, d.wid - 0.18]} />
        <meshStandardMaterial color="#0c0f14" metalness={0.2} roughness={0.1} />
      </mesh>
      {/* accent beltline */}
      <mesh position={[0, wheelY + d.bodyH - 0.04, 0]}>
        <boxGeometry args={[d.len + 0.01, 0.05, d.wid + 0.01]} />
        <meshStandardMaterial color={vehicle.accent} metalness={0.8} roughness={0.3} emissive={vehicle.accent} emissiveIntensity={0.15} />
      </mesh>
      {/* wheels */}
      {wheelPositions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[d.wheelR, d.wheelR, 0.32, 28]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {/* doors */}
      {doors.map((door, i) => (
        <group
          key={i}
          position={door.hinge}
          ref={(el) => {
            doorRefs.current[i] = el;
            if (el) el.userData.openSign = door.openSign;
          }}
        >
          <mesh position={[-door.panel[0] / 2, 0, 0]} castShadow>
            <boxGeometry args={door.panel} />
            <meshStandardMaterial color={vehicle.color} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* --------------------- real model (.glb) ------------------------------ */
function GltfVehicle({ url, open }: { url: string; open: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const doors = useMemo(() => {
    const found: THREE.Object3D[] = [];
    cloned.traverse((o) => {
      if (o.name.toLowerCase().includes('door')) found.push(o);
    });
    found.forEach((o) => {
      if (o.userData.baseRotY === undefined) o.userData.baseRotY = o.rotation.y;
    });
    return found;
  }, [cloned]);

  useFrame((_state, delta) => {
    const k = 1 - Math.pow(0.0008, delta);
    doors.forEach((o, i) => {
      const sign = i % 2 === 0 ? 1 : -1;
      const target = (o.userData.baseRotY as number) + (open ? sign * OPEN_ANGLE : 0);
      o.rotation.y = THREE.MathUtils.lerp(o.rotation.y, target, k);
    });
  });

  return <primitive object={cloned} />;
}

/* --------------------- error boundary → placeholder ------------------- */
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Vehicle3D({ vehicle, open }: { vehicle: Vehicle; open: boolean }) {
  const placeholder = <PlaceholderVehicle vehicle={vehicle} open={open} />;
  if (!READY_MODELS.has(vehicle.model)) return placeholder;
  return (
    <ModelBoundary fallback={placeholder}>
      <Suspense fallback={placeholder}>
        <GltfVehicle url={`/models/${vehicle.model}.glb`} open={open} />
      </Suspense>
    </ModelBoundary>
  );
}

/* --------------------- webgl / mount guard ---------------------------- */
function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function Showroom3D({ vehicle }: { vehicle: Vehicle }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  // Reset doors to closed when the featured vehicle changes.
  useEffect(() => setOpen(false), [vehicle.name]);

  if (!mounted || !supportsWebGL()) {
    return (
      <div className="nz-stage3d nz-stage3d-fallback">
        <div className="nz-stage3d-name">{vehicle.name}</div>
        <div className="nz-stage3d-hint">Interactive 3D loads in your browser</div>
      </div>
    );
  }

  return (
    <div className="nz-stage3d">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [6.4, 2.6, 7.2], fov: 34 }}>
        <color attach="background" args={['#08080b']} />
        <fog attach="fog" args={['#08080b', 14, 30]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 9, 5]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <spotLight position={[-8, 6, -4]} intensity={0.5} color="#c9a96a" angle={0.6} penumbra={0.8} />
        <group
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <Vehicle3D vehicle={vehicle} open={open} />
        </group>
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={18} blur={2.4} far={8} color="#000000" />
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={6}
          maxDistance={13}
          target={[0, 1, 0]}
        />
      </Canvas>
      <div className="nz-stage3d-hint">Drag to explore · click the vehicle to open the doors</div>
    </div>
  );
}
