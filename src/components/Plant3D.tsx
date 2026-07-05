import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Center, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Suppress known Three.js deprecation warnings that cause massive async stack traces in React DevTools
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('THREE.Clock') || args[0].includes('THREE.WebGLShadowMap'))) {
    return;
  }
  originalWarn(...args);
};

function StylizedPlant() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Continuous Infinite Y rotation
      groupRef.current.rotation.y += delta * 0.4;
      
      // Subtle X and Z movement to make it feel alive
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.7) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Pot */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.4, 1.0, 32]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      
      {/* Dirt */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 32]} />
        <meshStandardMaterial color="#291c14" />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.2, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>

      {/* Main Leaves Blob */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 64, 64]} />
        <MeshDistortMaterial color="#4ade80" speed={1.5} distort={0.2} roughness={0.2} />
      </mesh>

      {/* Small Leaf Blob */}
      <mesh position={[0.6, 1.0, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshDistortMaterial color="#22c55e" speed={2} distort={0.3} roughness={0.2} />
      </mesh>
      
      {/* Small Leaf Blob 2 */}
      <mesh position={[-0.5, 1.1, -0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 64, 64]} />
        <MeshDistortMaterial color="#16a34a" speed={1.8} distort={0.25} roughness={0.2} />
      </mesh>
    </group>
  );
}

export const Plant3D = () => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto">
      <Canvas 
        camera={{ position: [0, 1.5, 6.5], fov: 45 }} 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          {/* Soft ambient light */}
          <ambientLight intensity={0.5} color="#ffffff" />
          
          {/* Directional light with subtle shadows */}
          <directionalLight 
            position={[5, 8, 4]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={1024} 
            shadow-bias={-0.001}
            color="#fdfaed" 
          />
          
          {/* Fill light */}
          <directionalLight position={[-4, 3, -4]} intensity={0.6} color="#86efac" />
          
          <Float speed={2.5} rotationIntensity={0} floatIntensity={0.6} floatingRange={[-0.1, 0.1]}>
            <Center>
              <StylizedPlant />
            </Center>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};
