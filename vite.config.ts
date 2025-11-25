import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/coffee-machine-guardian/", // 🔥 Importante para GitHub Pages

  build: {
    rollupOptions: {
      // 👇 Esto copia index.html como 404.html
      input: {
        main: "index.html",
        404: "index.html",
      }
    }
  },

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
