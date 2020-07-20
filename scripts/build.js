import React from "react";
import path from "path";
import fs from "fs";
import glob from "glob";
import { renderToStaticMarkup } from "react-dom/server";
import { spawnSync } from "child_process";
import webpackStats from "../.tmp/webpack-stats.json";
import { getChunkNameFromPagePath } from "./buildUtils";

require.extensions[".css"] = () => {};

const cwd = path.resolve(__dirname, "..");

// We glob all the files under "pages" directory
const reactFiles = glob.sync("pages/**/*.jsx", { cwd });

// Generate <link rel="stylesheet" href="..."> tags from Webpack's stats file
function generateStyleTags(assets) {
  function getCSSAssets() {
    if (!assets) {
      return [];
    }

    if (Array.isArray(assets)) {
      return assets.filter((asset) => asset.endsWith(".css"));
    }

    return assets.endsWith(".css") ? [assets] : [];
  }

  const cssAssets = getCSSAssets();

  return cssAssets.length > 0
    ? cssAssets
        .map((asset) => `<link rel="stylesheet" href="/assets/${asset}">`)
        .join("\n")
    : "";
}

// Generate <script type="text/javascript" src="..."> tags from Webpack's stats file
function generateScriptTags(assets) {
  function getJSAssets() {
    if (!assets) {
      return [];
    }

    if (Array.isArray(assets)) {
      return assets.filter((asset) => asset.endsWith(".js"));
    }

    return assets.endsWith(".js") ? [assets] : [];
  }

  const jsAssets = getJSAssets();

  return jsAssets.length > 0
    ? jsAssets
        .map(
          (asset) =>
            `<script type="text/javascript" src="/assets/${asset}"></script>`
        )
        .join("\n")
    : "";
}

reactFiles.forEach((reactFile) => {
  const fileName = path.basename(reactFile).replace(".jsx", "");

  // Page components are from "default" export
  const Component = require(path.resolve(__dirname, "../", reactFile)).default;
  const chunkName = getChunkNameFromPagePath(reactFile);
  const assets = webpackStats.assetsByChunkName[chunkName];
  const staticMarkup = renderToStaticMarkup(<Component />);

  // Generate HTML file name from ".jsx" files by replacing the extension with ".html"
  const htmlFile = path.resolve(
    __dirname,
    "../dist/",
    reactFile.replace(".jsx", ".html")
  );

  const dirName = path.dirname(htmlFile);

  // In case we have nested page structure, we need to create directory recursively.
  fs.mkdirSync(dirName, { recursive: true });

  fs.writeFileSync(
    htmlFile,
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${fileName}</title>
  ${generateStyleTags(assets) /* CSS files are linked here */}
</head>
<body>
  ${staticMarkup}
  ${generateScriptTags(assets) /* JS files are linked here */}
</body>
</html>`,
    "utf8"
  );
});
