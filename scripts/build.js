import React from "react";
import path from "path";
import fs from "fs";
import glob from "glob";
import { renderToStaticMarkup } from "react-dom/server";
import { spawnSync } from "child_process";

const cwd = path.resolve(__dirname, "..");

// We glob all the files under "pages" directory
const reactFiles = glob.sync("pages/**/*.jsx", { cwd });

reactFiles.forEach((reactFile) => {
  const fileName = path.basename(reactFile).replace(".jsx", "");

  // Page components are from "default" export
  const Component = require(path.resolve(__dirname, "../", reactFile)).default;
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
</head>
<body>
  ${staticMarkup}
</body>
</html>`,
    "utf8"
  );
});
