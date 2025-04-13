import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      timeout: 5000,
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    react(),
    // Removed componentTagger plugin completely
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Handle Node.js built-in modules and polyfills
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
}));
