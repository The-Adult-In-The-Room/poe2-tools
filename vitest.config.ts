import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src/**/*'],
      exclude: ['**/index.ts', '**/index.tsx', 'src/types', 'src/data'],
      thresholds: {
        functions: 100,
        branches: 100,
        statements: 100,
        lines: 100,
        autoUpdate: true,
      },
    },
    // processes css modules and directly translates the class names to the test environment
    // @see https://github.com/vitest-dev/vitest/issues/1512#issuecomment-1236117355
    css: {
      include: [/.+/],
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
})
