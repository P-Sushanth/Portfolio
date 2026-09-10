import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/Portfolio/', // Base path matches the GitHub repository name
  resolve: {
    alias: {
      '@bklitui/ui/charts': path.resolve(__dirname, './src/components/bklitui/charts.jsx'),
    },
  },
});

