"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import styles from "./page.module.css";

import WebGL from "./WebGL.jsx";
import R3F from "./R3F.jsx";
import P5 from "./P5.jsx";

import World from "./World.jsx";
import Terrain from "./Terrain.jsx";
import VolumeControl from "./VolumeControl.jsx";
import Sudoku from "./Sudoku.jsx";

// const WASMComponent = dynamic(() => import('./components/wasm'))

const Home = () => {
  const router = useRouter();
  return (
    <div className={styles.main}>
      <div className="buttons">
        <button type="button" onClick={() => router.push("/volume")}>
          Volume
        </button>
        <button type="button" onClick={() => router.push("/world")}>
          World
        </button>
        <button type="button" onClick={() => router.push("/terrain")}>
          Terrain
        </button>
      </div>
    </div>
  );
};

export default Home;
