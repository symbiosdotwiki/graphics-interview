import { useRef, useState, useEffect } from "react";

import { useLoader, extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import * as THREE from "three";
// import { useStore } from "./store";
import { useDrag } from "react-use-gesture";

// process.env.PUBLIC_URL +
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? process.env.NEXT_PUBLIC_BASE_PATH : "";
const gltfURL = basePath + "/knob.glb";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Knob(props) {
  const { ctrlRef, range } = props;
  const iTheta = Math.PI * (1.5 + (1 - range));
  const labelWidth = 150;

  const meshRef = useRef();
  const groupRef = useRef();
  const { size, viewport, gl, camera, scene } = useThree();
  const aspect = size.width / viewport.width;

  const gltf = useGLTF(gltfURL);
  const { nodes, materials } = gltf;
  // console.log(nodes, materials);

  const roughnessMap = useLoader(TextureLoader, "/tex/rough.jpeg");
  const hdrTexture = useLoader(TextureLoader, "/tex/hdr.jpeg");

  let fPos = null;
  const handleClick = (event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      fPos = intersect.point;
    }
  };

  const bind = useDrag(
    ({
      first,
      event,
      movement: [x, y],
      pos = groupRef.current.position,
      rot = groupRef.current.rotation,
    }) => {
      if (first) {
        handleClick(event);
      }

      let diff = new THREE.Vector2(x - pos.x, y - pos.y);
      let fTheta = Math.atan2(fPos.y, fPos.x);
      let theta = Math.atan2(fPos.y - y / aspect, fPos.x + x / aspect);
      theta = (theta + 2 * Math.PI) % (2 * Math.PI);

      let knob = theta / (2 * Math.PI);
      knob -= knob > 0.75 ? 1 : 0;
      let m = -1 / range;
      let b = (1 - 0.5 * m) / 2;
      knob = m * knob + b;

      const rangeLimit = (1 - range) / 2;
      let inRange = Math.abs(knob - 0.5) < 0.5;

      if (ctrlRef.current && inRange) {
        ctrlRef.current.volume = clamp(knob, 0, 1);
        groupRef.current.rotation.set(rot.x, rot.y, theta);
      }
      return pos;
    }
  );

  useEffect(() => {
    if (hdrTexture) {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    }
  }, [hdrTexture]);

  useFrame((state, dt) => {
    const elapsedTime = 1 * state.clock.getElapsedTime();
    const rotAmt = 0.1;
    meshRef.current.rotation.y = Math.PI * rotAmt * Math.sin(elapsedTime);
    meshRef.current.rotation.x = Math.PI * rotAmt * Math.cos(elapsedTime);
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    envMap: hdrTexture,
    roughnessMap: roughnessMap,
    metalness: 1,
    roughness: 0.5,
    color: 0x3030ff,
  });
  const plasticMat = new THREE.MeshStandardMaterial({
    envMap: hdrTexture,
    roughnessMap: roughnessMap,
    metalness: 0.1,
    roughness: 0.5,
    color: 0x000000,
  });

  return (
    <group
      rotation={[0, 0, iTheta]}
      ref={groupRef}
      {...props}
      dispose={null}
      {...props}
      {...bind()}
    >
      <group ref={meshRef}>
        {Object.keys(nodes).map((key, idx) => {
          const geo = nodes[key];
          const mat = ["ARROW", "TOP"].includes(geo.name)
            ? chromeMat
            : plasticMat;
          return (
            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
              receiveShadow
              geometry={geo.geometry}
              material={mat}
              // material={geo.material}
              key={key}
            />
          );
        })}
      </group>
      <Html as="div" wrapperClass={"vol"} prepend center zIndexRange={[-1, 0]}>
        <div
          className="title"
          style={{
            top: `${-labelWidth - 70}px`,
          }}
        >
          VOLUME
        </div>
        <div className="number">
          {Array.from({ length: 11 }, (_, i) => {
            const theta =
              2 * Math.PI * (range * (i / 10) + (1 - range) / 2 + 0.25);
            const position = {
              left: `${Math.cos(theta) * labelWidth}px`,
              top: `${Math.sin(theta) * labelWidth}px`,
            };
            return (
              <div key={i} className={`vol${i}`} style={position}>
                {i}
              </div>
            );
          })}
        </div>
      </Html>
    </group>
  );
}
