import react from '@vitejs/plugin-react-swc';
import { glob } from 'glob';
import { fileURLToPath } from 'node:url';
import { extname, relative, resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],

    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
        },
        copyPublicDir: false,
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
            input: Object.fromEntries(
                glob
                    .sync('src/**/*.{ts,tsx}', {
                        ignore: ['src/**/*.d.ts', 'src/components/**/*.stories.tsx'],
                    })
                    .map(file => [
                        relative('lib', file.slice(0, file.length - extname(file).length)),
                        fileURLToPath(new URL(file, import.meta.url)),
                    ])
            ),
            output: {
                assetFileNames: assetInfo => {
                    if (assetInfo.name) {
                        let extType = assetInfo.name.split('.').at(1);
                        if (extType) {
                            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                                extType = 'img';
                            }
                            return `assets/${extType}/[name]-[hash][extname]`;
                        }
                    }

                    return `asserts/[extname]`;
                },

                chunkFileNames: 'assets/js/[hash].js',

                entryFileNames: 'assets/js/[hash].js',
            },
        },
    },
});
