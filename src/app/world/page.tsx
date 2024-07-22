"use client"

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Image from "next/image"
import styles from "../page.module.css"

import World from "../World.jsx"

// const WASMComponent = dynamic(() => import('./components/wasm'))


const Home = () => {
  return (
    <div className={styles.main}>
      <World/>
    </div>
  )
}

export default Home