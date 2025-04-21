# Fire Simulations using WebGPU Stable Fluids

Based on isjackwild's WebGPU stable fluids simulator.

https://stablefluidsflame.vercel.app/

## Dependencies

- [**MiniGPU:**](https://github.com/isjackwild/mini-gpu) Takes some pain out of getting WebGPU programs up and running.
- [**glMatrix:**](https://glmatrix.net/) For performing vector and matrix operations on Float32Arrays
- [**twgl.js:**](https://twgljs.org/) A WebGL Library, just used as a convinience to create geometry vertices

At time of writing, you will need to use Chrome Canary, and enable WebGPU in flags.

First, clone the repo and install dependencies

`$ npm install`

Then start the development server (using Vite)

`$ npm run dev`

