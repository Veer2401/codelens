import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        popup: 'popup.html'
      },
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'esprima', 'recharts']
  }
})
