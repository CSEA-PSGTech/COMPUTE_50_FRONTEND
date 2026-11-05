import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const normalizeBase = (raw: string) => {
  const value = raw.trim() || '/'
  const withLead = value.startsWith('/') ? value : `/${value}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: normalizeBase(process.env.VITE_BASE_PATH || loadEnv(mode, process.cwd(), '').VITE_BASE_PATH || '/'),
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['subside-punch-alfalfa.ngrok-free.dev','stir-identical-cubical.ngrok-free.dev','localhost'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}))

