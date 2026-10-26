import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // Tests Vitest : navigateur simulé (jsdom)
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
  },
})
