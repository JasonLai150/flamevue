import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: './docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        flamewall: resolve(__dirname, 'src/simulations/flamewall/index.html'),
        lavalamp: resolve(__dirname, 'src/simulations/lavalamp/index.html')
      }
    }
  }
});
