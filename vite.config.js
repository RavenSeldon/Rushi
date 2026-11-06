import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Where a build is published. One switch, RUSHI_SITE, sets everything that
// depends on the address: the base path, the absolute links in index.html
// (__RUSHI_URL__), sitemap.xml, robots.txt, and the CNAME file that tells
// GitHub Pages to serve the custom domain.
//   npm run deploy          → https://ravenseldon.github.io/Rushi/ (default)
//   npm run deploy:domain   → https://maitrism.com/
const SITES = {
  github: { base: '/Rushi/', url: 'https://ravenseldon.github.io/Rushi/' },
  domain: { base: '/', url: 'https://maitrism.com/', cname: 'maitrism.com' },
}
const SITE = SITES[process.env.RUSHI_SITE || 'github']
if (!SITE) throw new Error(`RUSHI_SITE must be one of: ${Object.keys(SITES).join(', ')}`)

const site = () => ({
  name: 'rushi-site',
  transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('__RUSHI_URL__', SITE.url) },
  generateBundle() {
    const day = new Date().toISOString().slice(0, 10)
    const emit = (fileName, source) => this.emitFile({ type: 'asset', fileName, source })
    emit('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Rushi navigates with #/… routes, which search engines treat as one page. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE.url}</loc>\n    <lastmod>${day}</lastmod>\n  </url>\n</urlset>\n`)
    // robots.txt only counts at the root of a host, so only the domain gets one.
    if (SITE.base === '/') emit('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}sitemap.xml\n`)
    if (SITE.cname) emit('CNAME', SITE.cname + '\n')
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), site()],
  base: SITE.base,
  build: {
    // three.js is most of the weight; keeping it in its own chunk means data
    // and interface updates don't make returning visitors re-download it.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
