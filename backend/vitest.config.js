import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './tests/globalSetup.ts',
    testTimeout: 20000,
    hookTimeout: 60000, // memory-server download/startup can be slow on first run
    fileParallelism: false
  }
});
