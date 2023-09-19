import { defineConfig, splitVendorChunkPlugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { syncToHugo } from "./extra.build.js";

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  base: "/svelte/",
  build: {
    outDir: "../static/svelte",
    emptyOutDir: true,
    assetsDir: "",
  },
  server: {
    port: 4200,
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    syncToHugo(),
  ],
});
