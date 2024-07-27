import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@styles": resolve(__dirname, "src/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/index.scss";`,
      },
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync("src/**/*.{ts,tsx}", {
            ignore: ["src/**/*.d.ts", "src/stories/*.stories.tsx"],
          })
          .map((file) => [
            relative("lib", file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: (assetInfo) => {
          console.log(assetInfo);
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

        entryFileNames: "assets/js/[hash].js",
      },
    },
  },
});
