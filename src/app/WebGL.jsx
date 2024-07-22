"use client"

import React, { useRef, useState, useEffect } from 'react'

import Image from "next/image"
import styles from "./page.module.css"

import * as twgl from 'twgl.js'

import dynamic from 'next/dynamic'


// const WASMComponent = dynamic(() => import('./components/wasm'))


const WebGL = () => {
  const [result, setResult] = useState(0)

  const basicVertShader = require('./shaders/default.vs').default
  // const basicFragShader = require('./shaders/default.fs').default
  const basicFragShader = require('./shaders/raymarch.fs').default

  const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  }

  let gl = null
  let programInfo = null
  let bufferInfo = null
  let texture = null

  const CANVAS_REF = useRef(null)

  useEffect(() => {
    gl = CANVAS_REF.current?.getContext('webgl', { depth: false, antialiasing: false })
    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser or machine may not support it.')
      return
    }
    gl.clearColor(0, 0, 0, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    programInfo = twgl.createProgramInfo(gl, [basicVertShader, basicFragShader])
    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
    texture = twgl.createTexture(gl, {
      src: '/tex/beast.jpeg',
      crossOrigin: 'anonymous',
    })

    if (!programInfo) {
      console.error('Error creating program info')
      return
    }
    requestAnimationFrame(render)
  }, [])

  const render = (time) => {
    twgl.resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const uniforms = {
        iResolution: [gl.canvas.width, gl.canvas.height],
        iTime: time / 1000,
        u_texture: texture,
    }

    gl.useProgram(programInfo.program)
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
    twgl.setUniforms(programInfo, uniforms)
    twgl.drawBufferInfo(gl, bufferInfo)

    requestAnimationFrame(render)
  }


  return (
    <div className={styles.main}>
      <canvas ref={CANVAS_REF} className={styles.canvas}/>
      {/*<span className={styles.marqueeT}>GRAPHIC DESIGN IS MY PASSION</span>
      <span className={styles.marqueeB}>GRAPHIC DESIGN IS MY PASSION</span>*/}
    </div>
  )
}

export default WebGL