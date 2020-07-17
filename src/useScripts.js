import { useEffect } from "react";

export function useScripts(scriptLoaders) {
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
