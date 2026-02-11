import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Exclude worktrees/mirrors and build artifacts
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.claude/**',
      '**/.tmp/**',
      '**/dist/**',
    ],
    // Use threads pool for Windows compatibility (avoids spawn EPERM)
    pool: 'threads',
  },
})
