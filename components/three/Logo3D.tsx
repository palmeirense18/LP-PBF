"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, invalidate, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

// public/brand/logo-icon.png is 603x715
const LOGO_ASPECT = 603 / 715;
// Camera at z=3.2 with fov=32 sees ~1.835 world units of height;
// 1.7 leaves margin so the stack never clips while swinging.
const PLANE_H = 1.7;
const PLANE_W = PLANE_H * LOGO_ASPECT;

// Faux-volumetric extrusion: N alpha-tested copies of the same texture
// stepped along Z. At navbar size the layer gaps stay sub-pixel even at
// the widest swing angle, so the side wall reads as a continuous surface.
const LAYERS = 32;
const DEPTH = PLANE_W * 0.16;
const BACK_TINT = new THREE.Color("#1B2024");

// Motion: turntable swing keeps thickness visible — never a full spin
// (at exact profile the stack is thin and would read flat).
const SWING = (32 * Math.PI) / 180;
const SWING_PERIOD = 7.5; // seconds per back-and-forth
const TILT_X = (-6 * Math.PI) / 180; // fixed 3/4 showcase pitch
const POINTER_YAW = (10 * Math.PI) / 180;
const POINTER_PITCH = (5 * Math.PI) / 180;
const EASE = 0.08;

type PointerTarget = { x: number; y: number };

function LogoStack({
  pointerRef,
  activeRef,
  onReady,
}: {
  pointerRef: React.MutableRefObject<PointerTarget>;
  activeRef: React.MutableRefObject<boolean>;
  onReady?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/brand/logo-icon.png");

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    // Signal readiness only after the chrome has actually painted, so the
    // PNG placeholder crossfades without a blank frame.
    invalidate();
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => onReady?.());
    });
    return () => cancelAnimationFrame(raf);
  }, [texture, onReady]);

  // One geometry shared by every layer.
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(PLANE_W, PLANE_H),
    []
  );

  const materials = useMemo(() => {
    // Front face: full chrome + moving env reflections; royal "B" untinted.
    const front = new THREE.MeshPhysicalMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.5,
      metalness: 0.85,
      roughness: 0.28,
      envMapIntensity: 1.1,
    });
    // Inner layers: opaque alpha-cutouts darkening toward dark machined
    // steel so the extruded wall reads solid, not a translucent smear.
    const inner: THREE.MeshStandardMaterial[] = [];
    for (let i = 1; i < LAYERS; i++) {
      const t = Math.pow(i / (LAYERS - 1), 0.6);
      inner.push(
        new THREE.MeshStandardMaterial({
          map: texture,
          alphaTest: 0.5,
          color: new THREE.Color("#ffffff").lerp(BACK_TINT, t),
          metalness: 0.8,
          roughness: 0.45 + t * 0.2,
          envMapIntensity: 0.5 * (1 - t * 0.6),
        })
      );
    }
    return { front, inner };
  }, [texture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.front.dispose();
      materials.inner.forEach((m) => m.dispose());
      texture.dispose();
    };
  }, [geometry, materials, texture]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const active = activeRef.current;
    // Smooth ease-in/out swing via sine; pauses (and eases to rest) when
    // off-screen or the tab is hidden.
    const swing = active
      ? Math.sin((state.clock.elapsedTime * Math.PI * 2) / SWING_PERIOD) *
        SWING
      : 0;
    const targetY = swing + pointerRef.current.x * POINTER_YAW;
    const targetX = TILT_X + pointerRef.current.y * POINTER_PITCH;
    group.rotation.y += (targetY - group.rotation.y) * EASE;
    group.rotation.x += (targetX - group.rotation.x) * EASE;
    // frameloop="demand": keep frames flowing only while turning or easing.
    if (
      active ||
      Math.abs(targetY - group.rotation.y) > 0.0004 ||
      Math.abs(targetX - group.rotation.x) > 0.0004
    ) {
      state.invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geometry}
        material={materials.front}
        position={[0, 0, DEPTH / 2]}
      />
      {materials.inner.map((material, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position={[0, 0, DEPTH / 2 - ((i + 1) / (LAYERS - 1)) * DEPTH]}
        />
      ))}
    </group>
  );
}

export default function Logo3D({
  size,
  onReady,
}: {
  size: number;
  onReady?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerTarget>({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const inViewRef = useRef(true);

  // The turntable runs only while on-screen and the tab is visible.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const syncActive = () => {
      const next = inViewRef.current && !document.hidden;
      const restarted = next && !activeRef.current;
      activeRef.current = next;
      if (restarted) invalidate();
    };

    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      syncActive();
    });
    io.observe(el);

    const onVisibility = () => syncActive();
    document.addEventListener("visibilitychange", onVisibility);
    syncActive();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Cursor bias is a mouse affordance — ignore touch/pen.
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    invalidate();
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    invalidate();
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden
      style={{ width: size, height: size }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
        frameloop="demand"
        camera={{ position: [0, 0, 3.2], fov: 32 }}
        style={{ background: "transparent" }}
      >
        {/* Key light from top-left (shop-floor motif) + subtle royal rim;
            most of the metal "life" comes from the environment map. */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[-2.5, 3, 2]} intensity={1.15} />
        <directionalLight
          position={[2.5, -1.5, 1.5]}
          intensity={0.3}
          color="#2B5BA6"
        />
        <Suspense fallback={null}>
          <LogoStack
            pointerRef={pointerRef}
            activeRef={activeRef}
            onReady={onReady}
          />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}
