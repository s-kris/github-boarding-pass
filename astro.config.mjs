import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  adapter: node({
    mode: 'standalone'
  })
});