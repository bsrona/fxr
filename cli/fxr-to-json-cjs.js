#!/usr/bin/env node

const fs = require('node:fs/promises');
const { FXR, Game } = require('../dist/cjs/fxr.js');

async function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath) {
    console.error('Usage: fxr-to-json <input.fxr> [output.json]');
    process.exit(1);
  }

  try {
    const fxr = await FXR.read(inputPath, Game.Sekiro);
    const json = fxr.serialize({ stateAsStruct: true });
    const jsonString = JSON.stringify(json, null, 2);

    if (outputPath) {
      await fs.writeFile(outputPath, jsonString, 'utf8');
      console.log(`Successfully converted ${inputPath} to ${outputPath}`);
    } else {
      process.stdout.write(jsonString);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
