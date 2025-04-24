# Fire Simulation in WebGPU

https://stablefluidsflame.vercel.app/

This is a stable-fluids based simulation of fire running on GPU through WebGPU and the miniGPU library. Based on isjackwild's stable fluid simulation. To run, you will need to use Chrome Canary and enable WebGPU in flags.

## Dependencies

- [**MiniGPU:**](https://github.com/isjackwild/mini-gpu) Takes some pain out of getting WebGPU programs up and running.
- [**glMatrix:**](https://glmatrix.net/) For performing vector and matrix operations on Float32Arrays
- [**twgl.js:**](https://twgljs.org/) A WebGL Library, just used as a convinience to create geometry vertices

## Getting Started

First, clone the repo and install dependencies, Then start the development server (using Vite)

`$ npm install`

`$ npm run dev`
