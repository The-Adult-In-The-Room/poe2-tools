import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src/**/*'],
      exclude: [
        '**/index.ts',
        '**/index.tsx',
        'src/types',
        'src/data',
        'src/routes/**',
        'src/router.tsx',
        'src/routeTree.gen.ts',
        'src/styles.css',
        'src/assets/**',
      ],
      thresholds: {
        functions: 100,
        branches: 100,
        statements: 100,
        lines: 100,
        autoUpdate: true,
      },
    },
  },
})
