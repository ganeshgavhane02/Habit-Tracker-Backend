import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useHabitStore } from '../stores/habitStore';

const ParticleSystem = ({ count = 2000 }) => {
  const meshRef = useRef();
  const { size, viewport } = useThree();
  const { getTodayCompletionRate } = useHabitStore();
  
  // Generate particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 15;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  // Generate particle colors
  const colors = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Create a gradient from purple to cyan
      const color = new THREE.Color();
      const t = Math.random();
      if (t < 0.5) {
        color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      } else {
        color.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      }
      temp.push(color.r, color.g, color.b);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      // Subtle pulse based on completion rate
      const completionRate = getTodayCompletionRate();
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * (completionRate / 100);
      meshRef.current.scale.setScalar(pulse);
      
      // Mouse parallax effect
      meshRef.current.position.x = state.mouse.x * viewport.width * 0.1;
      meshRef.current.position.y = state.mouse.y * viewport.height * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;