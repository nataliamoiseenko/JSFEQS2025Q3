import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        cart: resolve(__dirname, 'cart.html'),
        register: resolve(__dirname, 'register.html'),
        signin: resolve(__dirname, 'signin.html'),
      },
    },
  },
});
