import { useRef, useState, useEffect } from 'react'

import { Canvas, useLoader, extend, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import * as THREE from 'three'

const Box = (props) => {
  const meshRef = useRef()

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  const roughnessMap = useLoader(TextureLoader, '/tex/rough.jpeg')
  const hdrTexture = useLoader(TextureLoader, '/tex/hdr.jpeg')
  // const hdrTexture = useLoader(RGBELoader, '/tex/hdr.jpeg')

  useEffect(() => {
    if (hdrTexture) {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping
    }
  }, [hdrTexture])

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
  })

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      {/*<boxGeometry args={[1, 1, 1]} />*/}
      <sphereGeometry args={[1, 8, 8]} />
      { hovered ?
        <meshStandardMaterial
          envMap={hdrTexture}
          roughnessMap={roughnessMap}
          metalness={1}
          roughness={0.5}
        /> :
        <meshStandardMaterial color='hotpink' />
      }
    </mesh>
  )
}

export default function R3F() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />

      <EffectComposer>
        {/*<DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />*/}
        <Bloom intensity={1.0} luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  )
}
