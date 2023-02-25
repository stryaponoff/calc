import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outputDir: './dist/types',
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'es2020',
  },
  build: {
    target: 'es2020',
    lib: {
      formats: ['es', 'cjs'],
      entry: './src/main.ts',
      fileName: (format) => {
        if (format === 'es') {
          return 'index.mjs'
        } else if (format === 'cjs') {
          return 'index.cjs'
        } else {
          return `index.${format}.js`
        }
      },
      name: 'parser',
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  test: {
    threads: true,
    coverage: {
      enabled: true,
    },
  }
})
