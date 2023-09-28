#!/usr/bin/env node
// @ts-nocheck

import { rm, writeFile, readFile, unlink, rename } from "fs/promises";
import { existsSync } from "fs";
import { basename, join as pathJoin } from "path";
import { exec } from "child_process";
import { build } from "vite";
import { glob } from "glob";

import { minify } from "minify";
import { minify as miniXml } from "minify-xml";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { copy, move } from "fs-extra";

// Convert to async f*ck
function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error);

      resolve(stdout ? stdout : stderr);
    });
  });
}

// ================================================================== //

const publicPath = "./public";
const inSvelte = /\/public\/svelte(\/?)(?!.*\.\w+$)/g;

// clear command first
console.log("\x1Bc");
console.log(
  "Building " +
    chalk.bgMagenta("Vi") +
    chalk.bgBlueBright("te") +
    " + " +
    chalk.bgMagenta("H") +
    chalk.bgBlue("U") +
    chalk.bgGreen("G") +
    chalk.bgYellow("O") +
    " website\n",
);

// Check and delete file in public folder
if (existsSync(publicPath)) {
  const removeOldBuild = createSpinner("Removing old build...").start();
  await glob(`${publicPath}/**/*`).then((dir) =>
    dir.map(async (d) => {
      if (existsSync(d) && !d.match(inSvelte))
        await rm(d, { force: true, recursive: true });
    }),
  );
  removeOldBuild.success({ text: chalk.bgBlue("all file clean") });
}

// Rename dev js
const dataSvelte = "data/svelte.json";
const tempDataSvelte = "data/_svelte.json";
if (existsSync(dataSvelte)) rename(dataSvelte, tempDataSvelte);

const dirSvelte = "static/svelte";
const tempDirSvelte = "svelte";
if (existsSync(dirSvelte)) copy(dirSvelte, tempDirSvelte);

const buildSvelte = createSpinner("Build Svelte component").start();
// Build Svelte
await build({ mode: "production", logLevel: "error" });
buildSvelte.success({ text: chalk.bgBlue("all script and style builded") });

// Build Hugo
const buildHugo = createSpinner("Build Hugo Website").start();
await execAsync("hugo").catch((e) => {
  buildHugo.error({ text: chalk.bgRed("You forgot install/update hugo") });
  console.log(`\nRead ${chalk.bold("readme.md")} for instuction`);
  process.exit(1);
});
buildHugo.success({ text: chalk.bgBlue("Website are builded") });

if (existsSync(dataSvelte)) await unlink(dataSvelte);
if (existsSync(tempDataSvelte)) await rename(tempDataSvelte, dataSvelte);

if (existsSync(dirSvelte))
  await glob(`${dirSvelte}/*.*`).then((files) =>
    files.map(async (f) => await unlink(f)),
  );
if (existsSync(tempDirSvelte)) {
  await glob(`${tempDirSvelte}/*.*`).then(
    async (files) =>
      await Promise.all(
        files.map(
          async (f) =>
            await move(f, pathJoin(dirSvelte, basename(f)), {
              overwrite: true,
            }),
        ),
      ),
  );

  await rm(tempDirSvelte, { recursive: true });
}

// Find and minify html
const miniHtml = createSpinner("Minify HTML...").start();
const htmlPaths = await glob(`${publicPath}/**/*.html`);
const htmlFiles = await Promise.all(htmlPaths.map((h) => readFile(h, "utf8")));
await Promise.all(
  await htmlFiles.map(async (h, i) =>
    writeFile(htmlPaths[i], await minify.html(h)),
  ),
);
miniHtml.success({ text: chalk.bgBlue("HTML minified") });

// Find and minify xml
const minifyXml = createSpinner("Minify XML...").start();
const xmlPaths = await glob(`${publicPath}/**/*.xml`);
const xmlFiles = await Promise.all(xmlPaths.map((h) => readFile(h, "utf8")));
await Promise.all(
  await xmlFiles.map(async (h, i) => writeFile(xmlPaths[i], await miniXml(h))),
);
minifyXml.success({ text: chalk.bgBlue("XML minified") });

// minify css inside font awesome
const cssRegex = /var\s+(\w+)\s*=\s*`([^`]*[{}\-:;][^`=]*)`/;
const faJsFile = await glob(`${publicPath}/**/f*-a*.js`).then((j) => j[0]);

console.log();
console.log(chalk.bgBlue(" Website ready to deploy!! 🚀 "));
console.log();
