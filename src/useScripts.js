import { useEffect } from "react";
import { addScripts } from "../scripts/buildUtils";

export function useScripts(scriptLoaders) {
  // Accumulate imported scripts during builds
  if (process.env.BUILD) {
    const scriptPaths = scriptLoaders.map((load) => {
      const stringified = load.toString();
      // We extract the import path from the stringified load function
      const match = stringified.match(/"([^"]*)"/);
      if (!match) {
        throw new Error(
          `Error finding matching imported module under \`useScripts\` hooks\nstringified:\n${stringified}`
        );
      }

      return match[1].replace(/\?.*$/, "");
    });

    // The parent's id is required to resolve the absolute path for the script
    addScripts(scriptPaths, module.parent.id);
    // Node caches only the first parent but we need the intermediate ones
    // so we have to clear it.
    delete require.cache[__filename];
  }

  useEffect(() => {
    loadScripts(scriptLoaders);
  });
}

// Each dynamic import is asynchronous
async function loadScripts(scriptLoaders) {
  for (const load of scriptLoaders) {
    await load();
  }
}
