"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createBrushedNormalMap(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ringFreq = 1.6;
      const noise = (Math.random() - 0.5) * 0.06;
      const ring = Math.sin(dist * ringFreq) * 0.08 + noise;

      const angle = Math.atan2(dy, dx);
      const tx = -Math.sin(angle) * ring;
      const ty = Math.cos(angle) * ring;

      const i = (y * size + x) * 4;
      data[i] = Math.round((tx * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((ty * 0.5 + 0.5) * 255);
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  tex.anisotropy = 4;
  return tex;
}

const REST_TILT_X = -THREE.MathUtils.degToRad(12);

export default function PrecisionPart({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const normalMap = useMemo(() => createBrushedNormalMap(), []);

  const silverMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#C0C5CE"),
        metalness: 1.0,
        roughness: 0.32,
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        envMapIntensity: 0.9,
        normalMap,
        normalScale: new THREE.Vector2(0.35, 0.35),
      }),
    [normalMap]
  );

  const innerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1d20"),
        metalness: 0.6,
        roughness: 0.85,
      }),
    []
  );

  const boltHoleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0d0f12"),
        metalness: 0.4,
        roughness: 0.95,
      }),
    []
  );

  const boltPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const count = 6;
    const r = 0.95;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([Math.cos(angle) * r, 0.095, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.x = REST_TILT_X;
      groupRef.current.rotation.y = 0;
      return;
    }
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = REST_TILT_X + Math.sin(t * 0.4) * 0.06;
  });

  return (
    <group ref={groupRef} rotation={[REST_TILT_X, 0, 0]}>
      <mesh
        material={silverMaterial}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[1.2, 1.2, 0.18, 64]} />
      </mesh>

      <mesh
        material={silverMaterial}
        castShadow
        receiveShadow
        position={[0, 0.31, 0]}
      >
        <cylinderGeometry args={[0.75, 0.75, 0.45, 64]} />
      </mesh>

      <mesh
        material={silverMaterial}
        castShadow
        receiveShadow
        position={[0, 0.595, 0]}
      >
        <cylinderGeometry args={[0.55, 0.55, 0.12, 64]} />
      </mesh>

      <mesh material={silverMaterial} position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.015, 8, 64]} />
      </mesh>
      <mesh material={silverMaterial} position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.015, 8, 64]} />
      </mesh>

      <mesh material={innerMaterial} position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.72, 48, 1, true]} />
      </mesh>
      <mesh material={innerMaterial} position={[0, 0.66, 0]} rotation={[Math.PI, 0, 0]}>
        <ringGeometry args={[0, 0.28, 48]} />
      </mesh>

      {boltPositions.map((pos, i) => (
        <mesh key={i} material={boltHoleMaterial} position={pos}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 24]} />
        </mesh>
      ))}
    </group>
  );
}
