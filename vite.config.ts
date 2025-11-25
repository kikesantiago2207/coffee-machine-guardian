import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/coffee-machine-guardian/", // 👈 IMPORTANTE para GitHub Pages

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "copy-404",
      closeBundle() {
        // Copia index.html como 404.html
        const fs = require("fs");
        const path = require("path");
        const indexPath = path.resolve(__dirname, "dist/index.html");
        const notFoundPath = path.resolve(__dirname, "dist/404.html");
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log("✔ 404.html generado correctamente");
        }
      }
    }
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
