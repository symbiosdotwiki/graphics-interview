"use client"

import React, { useRef, useState, useEffect } from 'react'

import Image from "next/image"
import styles from "./page.module.css"

import * as twgl from 'twgl.js'

import dynamic from 'next/dynamic'


// const WASMComponent = dynamic(() => import('./components/wasm'))


const WebGL: React.FC = () => {
  const [result, setResult] = useState<number>(0)

  const basicVertShader = require('./shaders/default.vs').default
  const basicFragShader = require('./shaders/default.fs').default
  // const basicFragShader = require('./shaders/raymarch.fs').default

  const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  }

  let gl: WebGLRenderingContext | null = null
  let programInfo: {name: string, program: twgl.ProgramInfo} | null = null
  let bufferInfo: {buffer: twgl.BufferInfo} | null = null
  let texture: WebGLTexture | null = null

  const CANVAS_REF = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log('HEREEE')
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

    console.log('HERE')

    if (!programInfo) {
      console.error('Error creating program info')
      return
    }
    requestAnimationFrame(render)
  }, [])

  const render = (time: number) => {
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    console.log([gl.canvas.width, gl.canvas.height])

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
      <canvas ref={CANVAS_REF} className={styles.canvas}/>
  )
}

export default WebGL