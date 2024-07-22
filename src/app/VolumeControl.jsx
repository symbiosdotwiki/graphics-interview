import { useRef, useState, useEffect } from "react";

import { Canvas, useLoader, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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

import Knob from "./Knob";
import AudioPlayer from "./AudioPlayer";

export default function VolumeControl() {
  const audioRef = useRef();
  return (
    <>
      <AudioPlayer audioRef={audioRef} />
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Knob ctrlRef={audioRef} range={0.75} />
        {/* <OrbitControls /> */}

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
      </Canvas>
    </>
  );
}

VolumeControl.displayName = "VolumeControl";
