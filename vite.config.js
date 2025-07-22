import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/rss': {
        target: '',
        bypass: async (req, res,) => {
          if (req.url) {
            const url = req.url.replace('/api/rss/', '')
            const response = await fetch(decodeURIComponent(url))
            const data = await response.text()
            res.writeHead(200, { 'Content-Type': 'application/xml' })
            res.end(data)
            return false
          }
        }
      }
    }
  }
})
