'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const count = 300
  const ref = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00E5FF"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function GlowingCube() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.12
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
      groupRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 1, -2]}>
      {/* Inner cube */}
      <mesh scale={1.8}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
      {/* Glow shell */}
      <mesh scale={2.3}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {/* Wireframe */}
      <mesh scale={2.5}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  )
}

function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 25, 80, 40)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      let z = 0
      z += Math.sin(x * 0.3) * Math.cos(y * 0.4) * 2.5
      z += Math.sin(x * 0.6 + 1) * Math.cos(y * 0.25 - 2) * 1.5
      const dist = Math.sqrt(x * x + y * y)
      z *= Math.min(dist / 7, 1)
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -5, -6]}>
      <meshStandardMaterial color="#0a1628" roughness={0.95} metalness={0.05} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Water() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, -4]}>
      <planeGeometry args={[50, 25]} />
      <meshStandardMaterial color="#001a2e" transparent opacity={0.4} metalness={0.95} roughness={0.05} />
    </mesh>
  )
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 1.2, 0.015)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2 + state.pointer.y * 0.4, 0.015)
    state.camera.lookAt(0, 0, -4)
  })
  return null
}

export default function Scene3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7 }}
        performance={{ min: 0.5 }}
      >
        <fog attach="fog" args={['#020818', 6, 30]} />
        <color attach="background" args={['#020818']} />
        
        <ambientLight intensity={0.12} color="#1a3a5c" />
        <directionalLight position={[5, 8, 5]} intensity={0.3} color="#4488cc" />
        <pointLight position={[0, 5, -2]} intensity={2.5} color="#00E5FF" distance={18} decay={2} />
        <pointLight position={[-6, 2, -10]} intensity={0.8} color="#0044ff" distance={25} />
        
        <Terrain />
        <Water />
        <GlowingCube />
        <ParticleField />
        <Stars radius={40} depth={40} count={1500} factor={3} saturation={0} fade speed={0.8} />
        <CameraRig />
      </Canvas>
    </div>
  )
}
