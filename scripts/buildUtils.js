import path from "path";

let currentChunkName;
const scriptGroup = {};

export function getScriptGroup() {
  return scriptGroup;
}

export function addScripts(scripts, parentId) {
  if (!scriptGroup[currentChunkName]) {
    scriptGroup[currentChunkName] = [];
  }
  const resolvedScripts = scripts.map((s) =>
    path.resolve(path.basename(parentId), s)
  );
  scriptGroup[currentChunkName].push(...resolvedScripts);
}

export function setCurrentChunkName(chunkName) {
  currentChunkName = chunkName;
  scriptGroup[currentChunkName] = [];
}

export function getChunkNameFromPagePath(pagePath) {
  return pagePath.replace(/\//g, "-");
}
