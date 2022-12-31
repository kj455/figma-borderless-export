import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
  root: './ui/src',
  plugins: [viteSingleFile(), solidPlugin()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../../dist',
    rollupOptions: {
      inlineDynamicImports: true,
    },
  },
});
