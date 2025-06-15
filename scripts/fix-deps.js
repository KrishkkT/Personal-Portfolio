const fs = require("fs")
const path = require("path")

// Remove problematic lock files
const lockFiles = ["pnpm-lock.yaml", "yarn.lock", "package-lock.json"]
lockFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
  }
})

// Remove node_modules
const nodeModulesPath = path.join(process.cwd(), "node_modules")
if (fs.existsSync(nodeModulesPath)) {
  fs.rmSync(nodeModulesPath, { recursive: true, force: true })
}
