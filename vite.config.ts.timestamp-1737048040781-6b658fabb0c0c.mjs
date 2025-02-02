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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tb3Jrb3ZrYS9yaWNoLXRleHQtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tb3Jrb3ZrYS9yaWNoLXRleHQtZWRpdG9yL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL21vcmtvdmthL3JpY2gtdGV4dC1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBleHRuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHJlYWN0KCksXG4gICAgICAgIHN2Z3IoeyBpbmNsdWRlOiAnKiovKi5zdmcnIH0pLFxuICAgICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgICAgICBpY29uRGlyczogWydzcmMvaWNvbnMvJ10sXG4gICAgICAgIH0pLFxuICAgIF0sXG5cbiAgICBidWlsZDoge1xuICAgICAgICBsaWI6IHtcbiAgICAgICAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgICB9LFxuICAgICAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgZXh0ZXJuYWw6IFsncmVhY3QnLCAncmVhY3QvanN4LXJ1bnRpbWUnXSxcbiAgICAgICAgICAgIGlucHV0OiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICAgICAgZ2xvYlxuICAgICAgICAgICAgICAgICAgICAuc3luYygnc3JjLyoqLyoue3RzLHRzeH0nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmU6IFsnc3JjLyoqLyouZC50cycsICdzcmMvY29tcG9uZW50cy8qKi8qLnN0b3JpZXMudHN4J10sXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZmlsZSA9PiBbXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZSgnbGliJywgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIGV4dG5hbWUoZmlsZSkubGVuZ3RoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoZmlsZSwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGFzc2V0SW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4dFR5cGUgPSBhc3NldEluZm8ubmFtZS5zcGxpdCgnLicpLmF0KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL3BuZ3xqcGU/Z3xzdmd8Z2lmfHRpZmZ8Ym1wfGljby9pLnRlc3QoZXh0VHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0VHlwZSA9ICdpbWcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2V4dFR5cGV9L1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBhc3NlcnRzL1tleHRuYW1lXWA7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1toYXNoXS5qcycsXG5cbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9baGFzaF0uanMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStRLE9BQU8sV0FBVztBQUNqUyxTQUFTLFlBQVk7QUFDckIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxTQUFTLFVBQVUsZUFBZTtBQUMzQyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLFVBQVU7QUFOakIsSUFBTSxtQ0FBbUM7QUFBNkgsSUFBTSwyQ0FBMkM7QUFRdk4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sS0FBSyxFQUFFLFNBQVMsV0FBVyxDQUFDO0FBQUEsSUFDNUIscUJBQXFCO0FBQUEsTUFDakIsVUFBVSxDQUFDLFlBQVk7QUFBQSxJQUMzQixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0gsS0FBSztBQUFBLE1BQ0QsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsSUFDZixlQUFlO0FBQUEsTUFDWCxVQUFVLENBQUMsU0FBUyxtQkFBbUI7QUFBQSxNQUN2QyxPQUFPLE9BQU87QUFBQSxRQUNWLEtBQ0ssS0FBSyxxQkFBcUI7QUFBQSxVQUN2QixRQUFRLENBQUMsaUJBQWlCLGlDQUFpQztBQUFBLFFBQy9ELENBQUMsRUFDQSxJQUFJLFVBQVE7QUFBQSxVQUNULFNBQVMsT0FBTyxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsUUFBUSxJQUFJLEVBQUUsTUFBTSxDQUFDO0FBQUEsVUFDakUsY0FBYyxJQUFJLElBQUksTUFBTSx3Q0FBZSxDQUFDO0FBQUEsUUFDaEQsQ0FBQztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNKLGdCQUFnQixlQUFhO0FBQ3pCLGNBQUksVUFBVSxNQUFNO0FBQ2hCLGdCQUFJLFVBQVUsVUFBVSxLQUFLLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUM1QyxnQkFBSSxTQUFTO0FBQ1Qsa0JBQUksa0NBQWtDLEtBQUssT0FBTyxHQUFHO0FBQ2pELDBCQUFVO0FBQUEsY0FDZDtBQUNBLHFCQUFPLFVBQVUsT0FBTztBQUFBLFlBQzVCO0FBQUEsVUFDSjtBQUVBLGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsUUFFaEIsZ0JBQWdCO0FBQUEsTUFDcEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
