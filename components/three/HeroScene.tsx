"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import PrecisionPart from "./PrecisionPart";
import SparkParticles from "./SparkParticles";
import LightBeams from "./LightBeams";

const REST_CAMERA = new THREE.Vector3(0, 0.3, 4.2);

function CameraOrbit({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.copy(REST_CAMERA);
  }, [camera]);

  useFrame((state) => {
    if (reducedMotion) {
      camera.position.copy(REST_CAMERA);
      camera.lookAt(0, 0.25, 0);
      return;
    }
    const t = state.clock.elapsedTime * 0.15;
    const targetX = REST_CAMERA.x + Math.sin(t) * 0.12;
    const targetY = REST_CAMERA.y + Math.cos(t * 1.1) * 0.06;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0.25, 0);
  });

  return null;
}

function TriangleProbe() {
  const { gl, scene } = useThree();
  const reportedRef = useRef(false);

  useFrame(() => {
    if (reportedRef.current) return;
    if (gl.info.render.triangles > 0) {
      const triangles = gl.info.render.triangles;
      reportedRef.current = true;
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log(`[HeroScene] triangles: ${triangles}`);
        console.assert(
          triangles < 60000,
          `[HeroScene] triangle budget exceeded: ${triangles}`
        );
      }
      void scene;
    }
  });

  return null;
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog("#0A0A0A", 6, 14);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

export default function HeroScene({ inView }: { inView: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 4.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      frameloop={inView ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <SceneFog />
      <ambientLight intensity={0.15} color="#1E3A5F" />
      <directionalLight
        position={[-4, 6, 3]}
        intensity={2.4}
        color="#F5F5F5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[3, 1, -3]}
        intensity={0.8}
        color="#2B5BA6"
      />

      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} />
        <group position={[-0.7, 0, 0]}>
          <PrecisionPart reducedMotion={reducedMotion} />
          <SparkParticles reducedMotion={reducedMotion} />
          <LightBeams reducedMotion={reducedMotion} />
        </group>
      </Suspense>

      <CameraOrbit reducedMotion={reducedMotion} />
      <TriangleProbe />
    </Canvas>
  );
}
