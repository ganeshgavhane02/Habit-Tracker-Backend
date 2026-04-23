import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useState, useEffect } from 'react'

const MouseLight = () => {
  const { mouse, viewport } = useThree()
  const [lightPosition, setLightPosition] = useState([0, 0, 5])

  useFrame(() => {
    // Convert mouse coordinates to 3D space
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    setLightPosition([x, y, 5])
  })

  return (
    <pointLight
      position={lightPosition}
      intensity={30}
      color="#ffffff"
      distance={20}
      decay={2}
    />
  )
}

export default MouseLight