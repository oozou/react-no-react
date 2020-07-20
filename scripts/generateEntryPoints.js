import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import path from "path";
import fs from "fs";
import uniq from "lodash/uniq";
import glob from "glob";
import {
  setCurrentChunkName,
  getScriptGroup,
  addScripts,
  getChunkNameFromPagePath,
} from "../scripts/buildUtils";

// Side-effects tapped into import statements for CSS files
require.extensions[".css"] = (cssModule) => {
  addScripts([cssModule.id], cssModule.parent.id);
  delete require.cache[cssModule.id];
};

const cwd = path.resolve(__dirname, "..");

const pages = glob.sync("pages/**/*.jsx", { cwd });

function main() {
  pages.forEach((pagePath) => {
    // We'll use each page's path as its own chunk name
    setCurrentChunkName(getChunkNameFromPagePath(pagePath));
    const PageComponent = require(path.resolve(cwd, pagePath)).default;
    // This is where the magic happens. It invokes React's rendering and will trigger
    // the side-effects to gather the scripts.
    renderToStaticMarkup(<PageComponent />);
  });

  const assetsImportContent = Object.entries(getScriptGroup())
    .map(([chunkName, scriptPaths]) => {
      return `  '${chunkName}': [${uniq(scriptPaths)
        .map((scriptPath) => `'${scriptPath}'`)
        .join(",\n")}]`;
    })
    .join(",\n");

  const assetsMapContent = `module.exports = {\n${assetsImportContent}\n}\n`;

  // The generated entry points are in object notation written in to a file.
  fs.writeFileSync(
    path.resolve(__dirname, "../.tmp/entries.js"),
    assetsMapContent
  );
}

main();
