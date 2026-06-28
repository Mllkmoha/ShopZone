import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // In production we require VITE_API_URL to be set. Fail the build otherwise.
  const isProd = mode === 'production'
  const apiUrl = process.env.VITE_API_URL || ''
  if (isProd && (!apiUrl || apiUrl.trim() === '')) {
    throw new Error('Missing VITE_API_URL')
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})