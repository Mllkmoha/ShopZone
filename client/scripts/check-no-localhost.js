const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', 'dist')
const patterns = [
  /localhost/gi,
  /127\.0\.0\.1/gi,
  /\b10\./gi,
  /192\.168\./gi,
  /172\.1[6-9]\./gi,
  /172\.2[0-9]\./gi,
  /172\.3[0-1]\./gi,
]

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name)
    const st = fs.statSync(fp)
    if (st.isDirectory()) files.push(...walk(fp))
    else files.push(fp)
  }
  return files
}

if (!fs.existsSync(root)) {
  console.log('No dist directory found, skipping check.')
  process.exit(0)
}

const files = walk(root)
const matches = []
for (const f of files) {
  const ext = path.extname(f).toLowerCase()
  if (ext === '.map' || ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.woff' || ext === '.woff2' || ext === '.ttf' || ext === '.eot') continue
  const content = fs.readFileSync(f, 'utf8')
  for (const p of patterns) {
    if (p.test(content)) {
      matches.push({ file: f, pattern: p.toString() })
    }
  }
}

if (matches.length > 0) {
  console.error('\nDisallowed host patterns found in dist:')
  matches.forEach(m => console.error(` - ${m.file} contains ${m.pattern}`))
  console.error('\nPlease ensure production build uses a proper VITE_API_URL and that no private hosts are bundled.')
  process.exit(2)
}

console.log('Dist verification passed: no private hosts found.')
process.exit(0)
