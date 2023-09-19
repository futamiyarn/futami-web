import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { syncToHugo } from "./extra.build.js";

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  mode: "development",
  build: {
    outDir: "../static/svelte",
    emptyOutDir: true,
    assetsDir: "",
    sourcemap: "inline", // enable for debugging
    minify: false,
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
    syncToHugo("dev"),
  ],
});
