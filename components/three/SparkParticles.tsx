"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 350;
const BOX = { x: 10, y: 6, z: 6 };
const CENTER = new THREE.Vector3(0, 0, -1);

export default function SparkParticles({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const silver = new THREE.Color("#C0C5CE");
    const royal = new THREE.Color("#2B5BA6");
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOX.x + CENTER.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOX.y + CENTER.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOX.z + CENTER.z;
      const c = Math.random() < 0.7 ? silver : royal;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(() => {
    if (reducedMotion) return;
    const points = pointsRef.current;
    if (!points) return;
    const pos = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const minY = -BOX.y / 2 + CENTER.y;
    const maxY = BOX.y / 2 + CENTER.y;
    for (let i = 0; i < COUNT; i++) {
      const yi = i * 3 + 1;
      arr[yi] += 0.0015;
      if (arr[yi] > maxY) {
        arr[yi] = minY;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
