"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

// ============================================
// COPPER MATERIAL
// ============================================

function CopperMaterial() {
  return (
    <meshStandardMaterial
      color="#C8956C"
      metalness={0.85}
      roughness={0.15}
      envMapIntensity={1.2}
    />
  );
}

function DarkMaterial() {
  return (
    <meshStandardMaterial
      color="#1A1A1A"
      metalness={0.9}
      roughness={0.1}
      envMapIntensity={0.8}
    />
  );
}

// ============================================
// FLOATING SHAPES
// ============================================

function FloatingTorus({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position} castShadow>
        <torusGeometry args={[1.2, 0.4, 32, 64]} />
        <CopperMaterial />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.12;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={position} castShadow>
        <octahedronGeometry args={[0.9, 0]} />
        <DarkMaterial />
      </mesh>
    </Float>
  );
}

function FloatingIcosahedron({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} castShadow>
        <icosahedronGeometry args={[0.7, 0]} />
        <CopperMaterial />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.7}>
      <mesh ref={ref} position={position} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <DarkMaterial />
      </mesh>
    </Float>
  );
}

// ============================================
// MOUSE-REACTIVE CAMERA
// ============================================

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Smooth mouse tracking
    const targetX = (state.pointer.x * 0.3);
    const targetY = (state.pointer.y * 0.2);
    mouse.current.x += (targetX - mouse.current.x) * 0.05;
    mouse.current.y += (targetY - mouse.current.y) * 0.05;

    camera.position.x = mouse.current.x;
    camera.position.y = mouse.current.y + 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================
// PARTICLE FIELD
// ============================================

function Particles({ count = 200 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#C8956C"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================
// SCENE COMPOSITION
// ============================================

function Scene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFF5EB" castShadow />
      <pointLight position={[-4, 3, -3]} intensity={0.5} color="#C8956C" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#4A7C6F" />

      <FloatingTorus position={[2.5, 0.5, -1]} />
      <FloatingOctahedron position={[-2, -0.5, 0.5]} />
      <FloatingIcosahedron position={[0.5, 1.5, -2]} />
      <FloatingSphere position={[-1.5, 1, -3]} />
      <FloatingSphere position={[3, -1, -2.5]} />

      <Particles count={150} />
      <Environment preset="city" environmentIntensity={0.3} />
    </>
  );
}

// ============================================
// HERO CANVAS (exported)
// ============================================

function HeroFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/5 blur-[200px]" />
      <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-[#4A7C6F]/5 blur-[150px]" />
    </div>
  );
}

export function HeroScene() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0">
        <HeroFallback />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)]/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <AdaptiveDpr pixelated />
          <Scene />
        </Canvas>
      </Suspense>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)]/60 via-transparent to-transparent" />
    </div>
  );
}
