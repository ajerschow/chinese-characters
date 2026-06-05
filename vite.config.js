import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function injectCache() {
  return {
    name: "inject-cache",
    transformIndexHtml(html) {
      const cachePath = resolve(__dirname, "public/hsk1-cache.json");
      if (!existsSync(cachePath)) return html;
      const cacheJson = readFileSync(cachePath, "utf-8");
      const parsed = JSON.parse(cacheJson);
      const data = parsed.cache || parsed;
      const script = `<script>window.__EMBEDDED_CACHE__=${JSON.stringify(data)};</script>`;
      return html.replace("</head>", `${script}\n</head>`);
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    ...(command === "build" ? [injectCache()] : []),
    viteSingleFile(),
  ],
  base: "./",
}));
