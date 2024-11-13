import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import Pages from 'unplugin-convention-routes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({ routeStyle: 'remix' }),
  ],
})
