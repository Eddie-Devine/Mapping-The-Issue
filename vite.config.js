import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { buildContent } from './scripts/build-content.mjs';

/** Builds the content before Vite starts, and rebuilds it when a content file is saved. */
function contentPipeline() {
  return {
    name: 'content-pipeline',
    config() {
      buildContent();
    },
    configureServer(server) {
      const watched = [resolve('content'), resolve('SOURCES.md')];
      server.watcher.add(watched);
      server.watcher.on('change', (file) => {
        if (!watched.some((path) => resolve(file).startsWith(path))) return;
        try {
          buildContent();
          server.ws.send({ type: 'full-reload' });
        } catch (error) {
          // Keep the dev server alive so the mistake can be fixed and saved again.
          server.config.logger.error(error.message);
        }
      });
    },
  };
}

export default defineConfig({
  // Must match the GitHub repo name, because the site lives at /Mapping-The-Issue/.
  base: '/Mapping-The-Issue/',
  plugins: [contentPipeline()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve('index.html'),
        read: resolve('read.html'),
        worksCited: resolve('works-cited.html'),
      },
    },
  },
});
