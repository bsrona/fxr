#!/usr/bin/env node

// This is a workaround for pkg's issues with ESM dynamic imports
// We'll inline the module loading logic

const fs = require('node:fs');
const path = require('node:path');

// Read the ESM module as text and evaluate it in a way pkg can handle
const esmPath = path.join(__dirname, '../dist/esm/fxr.js');
const esmCode = fs.readFileSync(esmPath, 'utf8');

// Create a module wrapper
const moduleExports = {};
const moduleWrapper = new Function('exports', 'require', 'module', '__filename', '__dirname', esmCode + '\nreturn exports;');

try {
  const exports = moduleWrapper(moduleExports, require, { exports: moduleExports }, __filename, __dirname);
  
  // Now we have access to FXR and Game
  const { FXR, Game } = exports;
  
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
        await fs.promises.writeFile(outputPath, jsonString, 'utf8');
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
} catch (error) {
  console.error('Failed to load FXR module:', error.message);
  process.exit(1);
}
