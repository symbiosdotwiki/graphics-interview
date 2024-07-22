"use client"

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Image from "next/image"
import styles from "../page.module.css"

import Terrain from "../Terrain.jsx"

// const WASMComponent = dynamic(() => import('./components/wasm'))


const TerrainPage = () => {
  return (
    <div className={styles.main}>
      <Terrain/>
    </div>
  )
}

export default TerrainPage