"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PACK_IMAGE = "/bounty-pack.png";
const IMAGE_ASPECT = 814 / 1319;
const CARD_HEIGHT = 2.3;
const CARD_WIDTH = CARD_HEIGHT * IMAGE_ASPECT;

// Matches the seal-strip position from the flat 2D version (34px of a
// 363px-tall pack), so the tear still lands just below the crimped foil edge.
const TEAR_FROM_TOP = 34 / 363;
const TEAR_Y = CARD_HEIGHT / 2 - TEAR_FROM_TOP * CARD_HEIGHT;
const TEAR_AMPLITUDE = CARD_HEIGHT * 0.02;
// Deterministic, hand-picked deviations so the tear reads as irregular torn
// paper rather than a clean cut. Same shape used by the previous CSS version.
const TEAR_OFFSETS = [-2, 5, -3, 7, -4, 3, -6, 4, -2, 6, -3, 2, 0];
const HINGE = { x: -CARD_WIDTH / 2 + CARD_WIDTH * 0.12, y: TEAR_Y };

const PARTICLE_COUNT = 60;
const OPEN_DURATION = 1.1;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t * t * t;

/** A strip of quads between two per-column edges; used for both the flap and body slices. */
function buildTornStrip(
  columns: { x: number; yTop: number; yBottom: number }[],
  origin: { x: number; y: number },
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  columns.forEach(({ x, yTop, yBottom }) => {
    positions.push(x - origin.x, yTop - origin.y, 0, x - origin.x, yBottom - origin.y, 0);
    const u = (x + CARD_WIDTH / 2) / CARD_WIDTH;
    uvs.push(u, (yTop + CARD_HEIGHT / 2) / CARD_HEIGHT, u, (yBottom + CARD_HEIGHT / 2) / CARD_HEIGHT);
  });

  for (let i = 0; i < columns.length - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, c, b, b, c, d);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function buildTearColumns() {
  const n = TEAR_OFFSETS.length;
  const step = CARD_WIDTH / (n - 1);
  const maxAbs = Math.max(...TEAR_OFFSETS.map(Math.abs));
  return TEAR_OFFSETS.map((offset, i) => ({
    x: -CARD_WIDTH / 2 + i * step,
    y: TEAR_Y + (offset / maxAbs) * TEAR_AMPLITUDE,
  }));
}

function PackModel({
  texture,
  opening,
  reduceMotion,
  onOpenComplete,
}: {
  texture: THREE.Texture;
  opening: boolean;
  reduceMotion: boolean;
  onOpenComplete: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const flapRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const velocities = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const { camera } = useThree();

  const { flapGeometry, bodyGeometry, particleGeometry } = useMemo(() => {
    const columns = buildTearColumns();
    return {
      flapGeometry: buildTornStrip(
        columns.map((c) => ({ x: c.x, yTop: CARD_HEIGHT / 2, yBottom: c.y })),
        HINGE,
      ),
      bodyGeometry: buildTornStrip(
        columns.map((c) => ({ x: c.x, yTop: c.y, yBottom: -CARD_HEIGHT / 2 })),
        { x: 0, y: 0 },
      ),
      particleGeometry: new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3),
      ),
    };
  }, []);

  // react-three-fiber's render loop is built around mutating refs, geometry
  // attributes, and the camera directly every frame — that's the documented
  // pattern for animation here, not an accidental violation of immutability.
  /* eslint-disable react-hooks/immutability -- see above */
  useFrame((state, delta) => {
    if (!opening) {
      if (!reduceMotion && groupRef.current) {
        // Idle tilt toward the pointer, so the pack reads as a real object
        // sitting in space rather than a flat sticker. Clamped so a stalled
        // frame (e.g. a backgrounded tab) can't overshoot into a spin.
        const lerpAlpha = Math.min(delta * 4, 1);
        const targetY = state.pointer.x * 0.35;
        const targetX = -state.pointer.y * 0.18;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, lerpAlpha);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, lerpAlpha);
      }
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Upper hemisphere only, so debris flies out through the tear
        // instead of through the still-sealed body below it.
        const angle = Math.PI + Math.random() * Math.PI;
        const speed = 1.4 + Math.random() * 1.6;
        velocities.current[i * 3] = Math.cos(angle) * speed;
        velocities.current[i * 3 + 1] = Math.abs(Math.sin(angle)) * speed + 0.6;
        velocities.current[i * 3 + 2] = (Math.random() - 0.5) * speed;
        positions[i * 3] = (Math.random() - 0.5) * CARD_WIDTH * 0.3;
        positions[i * 3 + 1] = TEAR_Y;
        positions[i * 3 + 2] = 0;
      }
      particleGeometry.attributes.position.needsUpdate = true;
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const t = Math.min(elapsed / OPEN_DURATION, 1);

    // Flap: a quick hinge-rotated tear, then it flings up and off.
    const flapT = Math.min(elapsed / 0.5, 1);
    const flapEase = easeInCubic(flapT);
    flapRef.current.rotation.z = -flapEase * 1.6;
    flapRef.current.position.set(HINGE.x, HINGE.y + flapEase * 1.4, flapEase * 0.6);
    (flapRef.current.material as THREE.Material).opacity =
      1 - easeInCubic(Math.max(0, (flapT - 0.55) / 0.45));

    // Body: settles back and fades a beat later.
    const bodyT = Math.min(Math.max(elapsed - 0.15, 0) / 0.6, 1);
    const bodyEase = easeInCubic(bodyT);
    bodyRef.current.position.set(0, -bodyEase * 0.9, -bodyEase * 0.4);
    bodyRef.current.scale.setScalar(1 - bodyEase * 0.12);
    (bodyRef.current.material as THREE.Material).opacity = 1 - bodyEase;

    // Particles drift outward through the tear with light gravity.
    const positions = particleGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] += velocities.current[i * 3] * delta;
      positions[i * 3 + 1] += (velocities.current[i * 3 + 1] - elapsed * 1.2) * delta;
      positions[i * 3 + 2] += velocities.current[i * 3 + 2] * delta;
    }
    particleGeometry.attributes.position.needsUpdate = true;
    (particlesRef.current.material as THREE.PointsMaterial).opacity = 1 - easeInCubic(t);

    // Camera: a gentle push-in as the pack comes apart.
    camera.position.z = THREE.MathUtils.lerp(6, 4.6, easeOutCubic(t));

    if (t >= 1 && !completedRef.current) {
      completedRef.current = true;
      onOpenComplete();
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef} geometry={bodyGeometry}>
        <meshStandardMaterial map={texture} transparent roughness={0.35} metalness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={flapRef} position={[HINGE.x, HINGE.y, 0]} geometry={flapGeometry}>
        <meshStandardMaterial map={texture} transparent roughness={0.35} metalness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0}
          color="#5b8def"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function PackContent(props: { opening: boolean; reduceMotion: boolean; onOpenComplete: () => void }) {
  const texture = useLoader(THREE.TextureLoader, PACK_IMAGE);
  // three.js configures a loaded texture by mutating it in place; there's no
  // immutable equivalent for setting color space.
  // eslint-disable-next-line react-hooks/immutability
  texture.colorSpace = THREE.SRGBColorSpace;
  return <PackModel texture={texture} {...props} />;
}

export function BountyPackScene(props: { opening: boolean; reduceMotion: boolean; onOpenComplete: () => void }) {
  return (
    <Canvas camera={{ fov: 32, position: [0, 0, 6] }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <PackContent {...props} />
      </Suspense>
    </Canvas>
  );
}
