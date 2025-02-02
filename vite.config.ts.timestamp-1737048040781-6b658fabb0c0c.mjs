// vite.config.ts
import react from "file:///home/morkovka/rich-text-editor/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { glob } from "file:///home/morkovka/rich-text-editor/node_modules/glob/dist/esm/index.js";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "file:///home/morkovka/rich-text-editor/node_modules/vite/dist/node/index.js";
import { createSvgIconsPlugin } from "file:///home/morkovka/rich-text-editor/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import svgr from "file:///home/morkovka/rich-text-editor/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/home/morkovka/rich-text-editor";
var __vite_injected_original_import_meta_url = "file:///home/morkovka/rich-text-editor/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    svgr({ include: "**/*.svg" }),
    createSvgIconsPlugin({
      iconDirs: ["src/icons/"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"]
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob.sync("src/**/*.{ts,tsx}", {
          ignore: ["src/**/*.d.ts", "src/components/**/*.stories.tsx"]
        }).map((file) => [
          relative("lib", file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            let extType = assetInfo.name.split(".").at(1);
            if (extType) {
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                extType = "img";
              }
              return `assets/${extType}/[name]-[hash][extname]`;
            }
          }
          return `asserts/[extname]`;
        },
        chunkFileNames: "assets/js/[hash].js",
        entryFileNames: "assets/js/[hash].js"
      }
    }
  }
});
export {
  vite_config_default as default
};
