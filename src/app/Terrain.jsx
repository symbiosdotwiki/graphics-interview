import React, { useRef, useState, useEffect, useMemo, forwardRef } from "react";

import { useControls } from "leva";
import {
  Canvas,
  useLoader,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  MeshTransmissionMaterial,
  ContactShadows,
  Environment,
  Bvh,
  Instances,
  Instance,
  Sampler,
} from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import * as THREE from "three";

const Land = forwardRef((props, ref) => {
  const vertexShader = require("./shaders/land.vs").default;
  const fragmentShader = require("./shaders/land.fs").default;

  const geoRef = useRef();

  // const materialProps = useControls({
  //   thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
  // });

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_scale: {
        value: 0.5,
      },
      u_colorB: { value: new THREE.Color("#FF11aa") },
      u_colorA: { value: new THREE.Color("#00aaFF") },
    }),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    uniforms.u_time.value = 0.2 * time;
    // geoRef.current.attributes.position.needsUpdate = true;
    // geoRef.current.computeVertexNormals();
    // ref.current.position.y = Math.sin(time);
    // console.log(ref.current);
  });
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ref}>
        <planeGeometry args={[4, 4, 512, 512]} ref={geoRef} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[4, 4, 2, 2]} />
        {/* <meshStandardMaterial color={0xff0000} /> */}
        <MeshTransmissionMaterial
          samples={32}
          resolution={1024}
          anisotropicBlur={0.1}
          ior={1.3}
          roughness={0.02}
          thickness={0.1}
          // {...materialProps}
          toneMapped={true}
        />
      </mesh>
    </group>
  );
});

function Effects() {
  return (
    <EffectComposer>
      {/*<DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />*/}
      <Bloom
        intensity={1.0}
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        height={500}
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}

const Terrain = (props) => {
  return (
    <Canvas>
      <PerspectiveCamera
        // ref={cameraRef}
        makeDefault
        position={[0, 5, 5]}
      />
      <OrbitControls />

      {/* <Effects /> */}

      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Environment background={false} preset="city" blur={1} />

      {/* <ContactShadows
        resolution={512}
        position={[0, -0.8, 0]}
        opacity={1}
        scale={10}
        blur={2}
        far={0.8}
      /> */}

      <Land position={[0, 0, 0]} />
    </Canvas>
  );
};

Terrain.displayName = "Terrain";

export default Terrain;
