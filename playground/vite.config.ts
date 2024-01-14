import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import content from "@gaiiaa/content"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), content({allowDangerousHtml: true})],
})
