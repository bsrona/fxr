import fs from 'node:fs/promises'
import { FXR, Game } from '../dist/esm/fxr.js'

async function main() {
  const [, , inputPath, outputPath] = process.argv

  if (!inputPath) {
    console.error('Usage: node examples/fxr_to_json.mjs <input.fxr> [output.json]')
    process.exit(1)
  }

  const fxr = await FXR.read(inputPath, Game.Sekiro)
  const json = fxr.serialize({ stateAsStruct: true })
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

