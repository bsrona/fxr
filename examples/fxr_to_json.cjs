#!/usr/bin/env node

const fs = require('node:fs/promises')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

async function main() {
  const modulePath = path.join(process.cwd(), 'dist/esm/fxr.js')
  const { FXR, Game } = await import(pathToFileURL(modulePath).href)
  const [, , inputPath, outputPath] = process.argv

  if (!inputPath) {
    console.error('Usage: fxr-to-json <input.fxr> [output.json]')
    process.exit(1)
  }

  const fxr = await FXR.read(inputPath, Game.Sekiro)
  const json = fxr.toJSON()
  const jsonString = JSON.stringify(json, null, 2)

  if (outputPath) {
    await fs.writeFile(outputPath, jsonString, 'utf8')
  } else {
    process.stdout.write(jsonString)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

