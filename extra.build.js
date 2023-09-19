import { mkdir, readdir, rm, writeFile } from "fs/promises";
import { existsSync } from "fs";

export function syncToHugo(mode = "") {
  return {
    closeBundle: async () => {
      const svelteBuild = "./static/svelte";
      const jsRegex = /(index)(-|\.)([a-zA-Z0-9]+)\.js/;
      const cssRegex = /(index)(-|\.)([a-zA-Z0-9]+)\.css/;

      if (existsSync(`${svelteBuild}/index.html`))
        await rm(`${svelteBuild}/index.html`);

      const assets = await readdir(svelteBuild);
      const js = assets.filter((name) => name.match(jsRegex))[0];
      const css = assets.filter((name) => name.match(cssRegex))[0];

      if (!existsSync("./data/")) await mkdir("./data");
      await writeFile(`./data/svelte.json`, JSON.stringify({ js, css }));

      if (mode === "dev") console.log(`wrote ${js} to hugo data`);
    },
  };
}
