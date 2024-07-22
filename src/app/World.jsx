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
import Perlin from "perlin.js";

function Plant({ random, color = new THREE.Color(), ...props }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    // ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
    // ref.current.position.y = Math.sin(t / 1.5) / 2
    // ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 1.4 : 1, 0.1)
    ref.current.color.lerp(
      color.set(hovered ? "red" : "white"),
      hovered ? 1 : 0.1
    );
  });
  return (
    <group {...props}>
      <Instance
        ref={ref}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
      />
    </group>
  );
}

function Plants({ children, data, range, ...props }) {
  const meshRef = useRef(null);
  const geomRef = useRef(null);

  const transform = ({ position, normal, sampledMesh, dummy: object }) => {
    const p = position.clone().multiplyScalar(1.1);
    const n = Perlin.simplex3(...p.toArray());
    const rVec = normal.clone();
    object.position.copy(p).add(sampledMesh.position);
    object.lookAt(rVec.add(position));
    object.updateMatrix();
    return object;
  };
  return (
    <>
      {React.cloneElement(children, { ref: geomRef })}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, range]}
        {...props}
      >
        <coneGeometry args={[0.1, 0.3, 16]} rotation={[0, 0, -Math.PI / 2]} />
        <meshStandardMaterial />
      </instancedMesh>
      <Sampler
        transform={transform}
        mesh={geomRef}
        instances={meshRef}
        count={range}
      />
    </>
  );
}

const Land = forwardRef((props, ref) => {
  const vertexShader = require("./shaders/world.vs").default;
  const fragmentShader = require("./shaders/world.fs").default;

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
  });
  // rotation={[-Math.PI / 2, 0, 0]}
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[2, 1024, 512]} ref={geoRef} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <sphereGeometry args={[1.98, 32, 16]} />
        {/* <meshStandardMaterial color={0xff0000} /> */}
        <MeshTransmissionMaterial
          samples={32}
          resolution={1024}
          anisotropicBlur={0.1}
          ior={1.3}
          roughness={0.02}
          thickness={1}
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

const World = () => {
  const numPlants = 100;

  const randomVector = (r) => [
    r / 2 - Math.random() * r,
    r / 2 - Math.random() * r,
    r / 2 - Math.random() * r,
  ];
  const randomEuler = () => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ];
  const data = Array.from({ length: numPlants }, (r = 10) => ({
    random: Math.random(),
    position: randomVector(r),
    rotation: randomEuler(),
  }));

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

      <Bvh firstHitOnly>
        <Plants data={data} range={numPlants}>
          <Land position={[0, 0, 0]} />
        </Plants>
      </Bvh>
    </Canvas>
  );
};

World.displayName = "World";

export default World;
