import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial, SphereGeometry, TorusGeometry, CylinderGeometry, Group } from 'three';
import { useCursor, Text } from '@react-three/drei';

const Helmet3D = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.005 }) => {
  const helmetGroupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state) => {
    if (helmetGroupRef.current) {
      // Continuous rotation
      helmetGroupRef.current.rotation.y += rotationSpeed;
      
      // Subtle floating animation
      helmetGroupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Scale effect on hover
      helmetGroupRef.current.scale.setScalar(
        scale * (hovered ? 1.05 : 1)
      );
    }
  });

  // McLaren Papaya Orange color
  const primaryColor = '#FF5800';
  const secondaryColor = '#004BA8';
  const accentColor = '#FFFFFF';

  return (
    <group ref={helmetGroupRef} position={position} scale={scale}>
      {/* Main helmet shell */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color={primaryColor}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 0.1, 0.7]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32, 1, true, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#000000"
          transmission={0.9}
          roughness={0.05}
          thickness={0.5}
          ior={2.5}
          envMapIntensity={2}
        />
      </mesh>

      {/* Blue racing stripe */}
      <mesh position={[0, 0.3, 0.4]}>
        <cylinderGeometry args={[1.02, 1.02, 0.1, 32, 1, false, 0, Math.PI * 2]} />
        <meshPhysicalMaterial
          color={secondaryColor}
          metalness={0.9}
          roughness={0.1}
          emissive={secondaryColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Additional details */}
      <mesh position={[0.6, 0.2, 0.3]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color={accentColor}
          metalness={0.9}
          roughness={0.1}
          emissive={accentColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[-0.6, 0.2, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color={accentColor}
          metalness={0.9}
          roughness={0.1}
          emissive={accentColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glowing particles around helmet */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * 0.5, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? primaryColor : secondaryColor}
              emissive={i % 2 === 0 ? primaryColor : secondaryColor}
              emissiveIntensity={2}
              roughness={0}
              metalness={1}
            />
          </mesh>
        );
      })}

      {/* Floating text */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"
      >
        LANDON NORRIS
        <meshBasicMaterial color="#FFFFFF" />
      </Text>
    </group>
  );
};

export default Helmet3D;