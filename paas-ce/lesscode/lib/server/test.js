const fs = require('fs')
const path = require('path')

const targetDir = path.resolve(__dirname, 'temp/1596020229949')
const tempDir = fs.readdirSync(targetDir)

const componentDir = path.resolve(targetDir, tempDir[0])
const component = fs.readdirSync(componentDir)
console.dir(component)
