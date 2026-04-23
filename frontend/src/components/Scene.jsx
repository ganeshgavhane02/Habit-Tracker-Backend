import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  MeshPhysicalMaterial,
  IcosahedronGeometry,
  TorusKnotGeometry,
  SphereGeometry
} from 'three';
import {
  useCursor,
  Environment,
  OrbitControls
} from '@react-three/drei';
import { useHabitStore } from '../stores/habitStore';

const GlassShape = ({ geometry, position, scale, color }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      
      // Subtle parallax based on mouse (relative to viewport)
      meshRef.current.position.x = position[0] + (state.mouse.x * viewport.width * 0.1);
      meshRef.current.position.y = position[1] + (state.mouse.y * viewport.height * 0.1);
      
      // Pulse effect when habits are completed
      const { habits } = useHabitStore.getState();
      const today = new Date().toISOString().split('T')[0];
      const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 * (completedCount / habits.length);
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  const material = new MeshPhysicalMaterial({
    color: color,
    transmission: 0.95,
    roughness: 0.05,
    thickness: 1.2,
    ior: 1.8,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2,
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    />
  );
};

const EnergyCore = () => {
  const meshRef = useRef();
  const { getTodayCompletionRate } = useHabitStore();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Pulse based on completion rate
      const completionRate = getTodayCompletionRate();
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2 * (completionRate / 100);
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <icosahedronGeometry args={[1.5, 3]} />
      <meshPhysicalMaterial
        color="#7C3AED"
        emissive="#7C3AED"
        emissiveIntensity={0.5}
        transmission={0.8}
        roughness={0.1}
        thickness={2}
        ior={2}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

const Scene = () => {
  const { viewport } = useThree();
  const icosahedronGeometry = new IcosahedronGeometry(1, 3);
  const torusGeometry = new TorusKnotGeometry(0.9, 0.35, 128, 16);
  const sphereGeometry = new SphereGeometry(1, 64, 64);
  
  // Get completion rate for dynamic effects
  const { getTodayCompletionRate } = useHabitStore();
  const completionRate = getTodayCompletionRate();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        color="#7C3AED"
      />
      <pointLight position={[-5, 3, -5]} intensity={30} color="#00d4ff" />
      <pointLight position={[5, -3, 5]} intensity={25} color="#7c3aed" />
      <pointLight position={[0, 0, 10]} intensity={15} color="#ffffff" />
      
      {/* Energy Core */}
      <EnergyCore />
      
      {/* Glass Shapes */}
      <GlassShape
        geometry={icosahedronGeometry}
        position={[-viewport.width / 3, viewport.height / 4, -2]}
        scale={1.3}
        color="#00d4ff"
      />
      <GlassShape
        geometry={torusGeometry}
        position={[viewport.width / 4, -viewport.height / 4, 0]}
        scale={1.1}
        color="#7C3AED"
      />
      <GlassShape
        geometry={sphereGeometry}
        position={[0, 0, -3]}
        scale={1.8}
        color="#00ff88"
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 10, 25]} />
    </>
  );
};

export default Scene;