const fs = require("fs")
const path = require("path")

// Base URL of your website
const BASE_URL = "https://kjt.vercel.app"

// Function to get all pages
function getPages() {
  const pages = [
    { url: "/", changefreq: "weekly", priority: 1.0 },
    { url: "/projects", changefreq: "weekly", priority: 0.8 },
    { url: "/certificates", changefreq: "weekly", priority: 0.8 },
    { url: "/privacy", changefreq: "yearly", priority: 0.5 },
    { url: "/terms", changefreq: "yearly", priority: 0.5 },
  ]

  return pages
}

// Generate sitemap XML
function generateSitemap() {
  const pages = getPages()
  const currentDate = new Date().toISOString()

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  pages.forEach((page) => {
    sitemap += "  <url>\n"
    sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`
    sitemap += `    <priority>${page.priority}</priority>\n`
    sitemap += "  </url>\n"
  })

  sitemap += "</urlset>"

  return sitemap
}

// Write sitemap to file
function writeSitemap() {
  const sitemap = generateSitemap()
  const publicDir = path.join(process.cwd(), "public")

  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap)
  console.log("Sitemap generated successfully!")
}

writeSitemap()
