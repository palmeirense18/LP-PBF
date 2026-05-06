"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Beam({
  position,
  rotation,
  basePhase,
  reducedMotion,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  basePhase: number;
  reducedMotion: boolean;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const mat = matRef.current;
    if (!mat) return;
    const t = state.clock.elapsedTime;
    mat.opacity = 0.06 + Math.sin(t * 0.6 + basePhase) * 0.02;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.8, 8, 32, 1, true]} />
      <meshBasicMaterial
        ref={matRef}
        color="#F5F5F5"
        transparent
        opacity={0.06}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LightBeams({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  return (
    <group>
      <Beam
        position={[-3, 4, -1]}
        rotation={[0.25, 0.18, 0.4]}
        basePhase={0}
        reducedMotion={reducedMotion}
      />
      <Beam
        position={[-2, 4.5, 1]}
        rotation={[0.18, -0.12, 0.3]}
        basePhase={1.7}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}
