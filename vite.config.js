import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@context': '/src/context',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@store': '/src/store',
      '@services': '/src/services',
    },
  },
})
