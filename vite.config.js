import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        creatives: 'creatives.html',
        events: 'events.html',      // Add any other HTML files you have
        about: 'about.html',        // Add any other HTML files you have
        contact: 'contact.html'     // Add any other HTML files you have
      }
    }
  }
});