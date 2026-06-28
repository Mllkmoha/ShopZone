const fs = require('fs')
const path = require('path')

const pkgDir = path.resolve(__dirname, '..', 'node_modules', 'react-router')
if (!fs.existsSync(pkgDir)) {
  console.log('react-router not found in node_modules, skipping patch.')
  process.exit(0)
}

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

const files = walk(pkgDir)
let patched = 0
for (const f of files) {
  if (!f.endsWith('.js') && !f.endsWith('.mjs')) continue
  let c = fs.readFileSync(f, 'utf8')
  if (c.indexOf('http://localhost') !== -1) {
    const nc = c.replace(/http:\/\/localhost/g, 'http://example.com')
    fs.writeFileSync(f, nc, 'utf8')
    console.log('Patched', f)
    patched++
  }
}
if (patched === 0) console.log('No react-router files needed patching.')
else console.log(`Patched ${patched} files in react-router.`)
