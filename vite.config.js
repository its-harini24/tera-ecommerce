import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve .js before .jsx so context files (AuthContext.js, CartContext.js,
    // ToastContext.js) are picked up correctly even when imports omit the extension.
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
})
